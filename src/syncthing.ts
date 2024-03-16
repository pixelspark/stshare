import { scrypt, hkdf } from "node:crypto";
import * as miscreant from "miscreant";
import { base32Encode, base32Decode } from "./base32";
import { FileInfo } from "./bep";
import { XChaCha20Poly1305 } from "@stablelib/xchacha20poly1305";
import { type FileHandle } from "node:fs/promises";

const prefix = "syncthing";
const maxEncryptedPathSegmentLength = 200;

export class EncryptedFolder {
  private constructor(private folderID: string, private key: Buffer) {}

  private async aead() {
    return await miscreant.AEAD.importKey(
      this.key,
      "AES-SIV",
      new miscreant.PolyfillCryptoProvider()
    );
  }

  toString() {
    return this.key.toString("base64");
  }

  async calculateFileKey(fileNamePlain: Buffer) {
    // fileKey = HKDF(SHA256, folderKey+filename, salt: "syncthing", info: nil)
    return new Promise<Buffer>((resolve, reject) => {
      hkdf(
        "sha256",
        Buffer.concat([new Uint8Array(this.key), fileNamePlain]),
        "syncthing",
        Buffer.from([]),
        32,
        (err, derivedKey) => {
          if (err) {
            reject(err);
          } else {
            resolve(Buffer.from(derivedKey));
          }
        }
      );
    });
  }

  async calculatePasswordToken() {
    const aead = await this.aead();
    // Generate a password token (should be the same value as in the .stfolder/syncthing-encryption_password_token file)
    return Buffer.from(
      await (aead as any)._siv.seal(
        Buffer.from(prefix + this.folderID, "utf8"),
        [new Uint8Array(0)]
      )
    );
  }

  async decodeFileName(fileNameToDecode: string) {
    const cleaned = fileNameToDecode.replace(/(\.syncthing-enc)|\//g, "");
    const fnDecoded = Buffer.from(base32Decode(cleaned));
    const aead = await this.aead();
    const res = await (aead as any)._siv.open(fnDecoded, [new Uint8Array(0)]);
    return Buffer.from(res);
  }

  async encodeFileName(fileNameDecoded: string) {
    function splitIntoChunks(s: string, chunkSize: number) {
      if (s.length < chunkSize) return [s];
      const chunks: string[] = [];
      for (let a = 0; a < Math.ceil(s.length / chunkSize); a++) {
        chunks.push(s.slice(a * chunkSize, (a + 1) * chunkSize));
      }
      return chunks;
    }

    const aead = await this.aead();
    const encodedFileNameBytes = await (aead as any)._siv.seal(
      Buffer.from(fileNameDecoded, "utf8"),
      [new Uint8Array(0)]
    );
    const encodedFnBase32 = base32Encode(encodedFileNameBytes).replace(
      /=/g,
      ""
    );
    const mangledFileName =
      encodedFnBase32[0] +
      ".syncthing-enc/" +
      encodedFnBase32.substring(1, 3) +
      "/" +
      splitIntoChunks(
        encodedFnBase32.substring(3),
        maxEncryptedPathSegmentLength
      ).join("/");
    return mangledFileName;
  }

  static async create(folderID: string, encryptionPassword: string) {
    return new Promise<EncryptedFolder>((resolve, reject) => {
      scrypt(
        encryptionPassword,
        prefix + folderID,
        32,
        { N: 32768, r: 8, p: 1, maxmem: 128 * 32768 * 8 * 2 },
        (err, folderKey) => {
          if (err) {
            reject(err);
          } else {
            resolve(new EncryptedFolder(folderID, folderKey));
          }
        }
      );
    });
  }

  async readFile(
    file: FileHandle,
    fileKey: Buffer,
    callback: (chunk: Uint8Array | null, metadata: FileInfo) => Promise<void>
  ) {
    // First obtain the length of the encrypted ('fake') file info structure
    const stats = await file.stat();
    const fileLength = stats.size;

    const lengthBuffer = Buffer.alloc(4);
    await file.read(lengthBuffer, 0, 4, fileLength - 4);
    const fakeFileInfoLength = lengthBuffer.readInt32BE(0);

    const fakeFileInfoData = Buffer.alloc(fakeFileInfoLength);
    await file.read(
      fakeFileInfoData,
      0,
      fakeFileInfoLength,
      fileLength - 4 - fakeFileInfoLength
    );
    const fakeFileInfo = FileInfo.decode(fakeFileInfoData);

    // Decrypt file info
    const cipher = new XChaCha20Poly1305(fileKey);
    const fileInfoNonce = fakeFileInfo.encrypted.subarray(0, 24)!;
    const decryptedFileInfoData = cipher.open(
      fileInfoNonce,
      fakeFileInfo.encrypted.subarray(24)
    );
    if (!decryptedFileInfoData) throw new Error("decryption failed");

    const fileInfo = FileInfo.decode(
      decryptedFileInfoData!.subarray(0, decryptedFileInfoData.length)
    );

    // Decrypt them blocks
    for (
      let blockIndex = 0;
      blockIndex < fakeFileInfo.blocks.length;
      blockIndex++
    ) {
      const block = fakeFileInfo.blocks[blockIndex];
      const blockSize = block.size;
      const blockData = Buffer.alloc(blockSize);
      await file.read(blockData, 0, blockSize, Number(block.offset));
      let blockPlainData = await this.decryptBlock(blockData, fileKey);
      const realBlockSize = fileInfo.blocks[blockIndex].size;

      // Remove any random padding
      if (realBlockSize < blockPlainData.length) {
        blockPlainData = blockPlainData.subarray(0, realBlockSize);
      }
      await callback(blockPlainData, fileInfo);
    }
    await callback(null, fileInfo);
  }

  private async decryptBlock(blockData: Buffer, fileKey: Buffer) {
    const blockNonceLength = 24;
    const blockNonceData = blockData.subarray(0, blockNonceLength);

    const blockCiphertextData = blockData.subarray(
      blockNonceLength,
      blockData.length
    );
    const cipher = new XChaCha20Poly1305(fileKey);
    const decryptedBlockData = cipher.open(blockNonceData, blockCiphertextData);
    if (!decryptedBlockData) throw new Error("decryption failed");
    return decryptedBlockData;
  }
}
