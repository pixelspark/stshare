import { scrypt } from "node:crypto";
import base32Decode from "base32-decode";
import base32Encode from "base32-encode";
import * as miscreant from "miscreant";
import assert from "node:assert";

const folderID = "tommy";
const folderEncryptionPassword = "test";
const fileNameToDecode =
  "4.syncthing-enc/IS/DQJPKRK0GI2F23V1D4E32VQ8MQQNAN18RA1GU6SFEOAKB9VT93R8OALMM8";
const fileNameToEncode = "wonnx/wonnx/Cargo.lock";
const passwordTokenToDecode = "q+w5dDWKuvybKzTCQvRbgLrd2GNkaXvqW8NphqPJ";

const prefix = "syncthing";

scrypt(
  folderEncryptionPassword,
  prefix + folderID,
  32,
  { N: 32768, r: 8, p: 1, maxmem: 128 * 32768 * 8 * 2 },
  async (err, key) => {
    if (err) {
      console.error(err);
      return null;
    }
    console.log("Key", key.toString("hex"));
    assert(
      key.toString("hex") ===
        "ad69f63a34ea3244c5b326d2289568c55d61e9bc2e947fe83f39be2a8261756b"
    );

    const aead = await miscreant.AEAD.importKey(
      key,
      "AES-SIV",
      new miscreant.PolyfillCryptoProvider()
    );

    // Generate a password token (should be the same value as in the .stfolder/syncthing-encryption_password_token file)
    const passwordToken = await aead._siv.seal(
      Buffer.from(prefix + folderID, "utf8"),
      [new Uint8Array(0)]
    );
    console.log(
      "Generated password token:",
      Buffer.from(passwordToken).toString("base64")
    );

    // Encode a file name
    const encodedFileNameBytes = await aead._siv.seal(
      Buffer.from(fileNameToEncode, "utf8"),
      [new Uint8Array(0)]
    );
    const encodedFnBase32 = base32Encode(
      encodedFileNameBytes,
      "RFC4648-HEX"
    ).replace(/=/g, "");
    const mangledFileName =
      encodedFnBase32[0] +
      ".syncthing-enc/" +
      encodedFnBase32.substring(1, 3) +
      "/" +
      encodedFnBase32.substring(3); // TODO add more slashes when name gets too long
    console.log("Encoded filename: ", mangledFileName);
    assert(mangledFileName === fileNameToDecode);

    // Decode file name (A.syncthing-enc/AB/CDEF...)
    const cleaned = fileNameToDecode.replace(/(\.syncthing-enc)|\//g, "");
    const fnDecoded = Buffer.from(base32Decode(cleaned, "RFC4648-HEX"));
    const res = await aead._siv.open(fnDecoded, [new Uint8Array(0)]);
    console.log("Decrypted file name:", Buffer.from(res).toString("utf8"));
    assert(Buffer.from(res).toString("utf8") === fileNameToEncode);

    // Decrypt password token (should result in plaintext of folderID + "syncthing")
    const encrToken = Buffer.from(passwordTokenToDecode, "base64");
    const encrRes = await aead._siv.open(encrToken, [new Uint8Array(0)]);
    console.log(
      "Decrypted password token:",
      Buffer.from(encrRes).toString("utf8")
    );
    assert(Buffer.from(encrRes).toString("utf8") === prefix + folderID);
  }
);