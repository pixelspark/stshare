import { argv } from "node:process";
import { EncryptedFolder } from "./src/syncthing";
import { base32Encode } from "./src/base32";

async function main() {
  if (argv.length < 5) {
    console.error("usage: filekey <folderID> <folderPassword> <filePath>");
    console.error("Where filePath is like '1.syncthing/XY/ZZ'");
    return;
  }

  const folderID = argv[2];
  const folderPassword = argv[3];
  const te = new TextEncoder();
  const fileNamePlain = argv[4];

  const folder = await EncryptedFolder.create(folderID, folderPassword);
  const filePath = await folder.encodeFileName(fileNamePlain);
  const fileKey = await folder.calculateFileKey(
    Buffer.from(te.encode(fileNamePlain))
  );
  const fileKeyNeat = base32Encode(fileKey).replace(/=/g, "");
  const td = new TextDecoder();
  console.log("Original file name: " + fileNamePlain);
  console.log("Crypted file name: " + filePath);
  console.log("File key: " + fileKeyNeat);
  console.log(`URL: http://localhost:8380/${filePath}?key=${fileKeyNeat}`);
}

main();
