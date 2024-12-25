import { argv } from "node:process";
import { EncryptedFolder } from "./src/syncthing";
import { base32Decode, base32Encode } from "./src/base32";
import { open } from "node:fs/promises";

async function main() {
  if (argv.length < 4) {
    console.error("usage: decrypt <key> <filePath>");
    console.error("Where filePath is like '1.syncthing/XY/ZZ'");
    return;
  }

  const fileKey = argv[2];
  const filePath = argv[3];
  const fileKeyBytes = Buffer.from(base32Decode(fileKey));
  console.error({ fileKey, fileKeyBytes, filePath });

  const fh = await open(filePath);
  await EncryptedFolder.readFile(fh, fileKeyBytes, async (chunk, md) => {
    if (!chunk) {
      return;
    }
    await new Promise((resolve, reject) => {
      process.stdout.write(chunk, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve(null);
      });
    });
  });
}

main();
