import { EncryptedFolder } from "./src/syncthing";
import { open } from "node:fs/promises";
import { join, normalize, parse } from "node:path";
import { createServer } from "node:http";
import { base32Decode, base32Encode } from "./src/base32";
import { argv, exit } from "node:process";

if (argv.length < 4) {
  console.error("Usage: main <folderID> <path>");
  console.log(
    "Where <path> points to an encrypted folder managed by Syncthing"
  );
  exit(-1);
}

const upstream = argv[3];
const folderID = argv[2];

console.log("Upstream directory:", upstream);
console.log("folderID:", folderID);

async function main() {
  const server = createServer(async (req, res) => {
    try {
      if (!req.url) {
        res.statusCode = 400; // Bad request
        return res.end("bad_request");
      }

      const url = new URL(req.url, `http://${req.headers.host}`);
      const normalizedPath = normalize(join("/", url.pathname));
      const filePath = join(upstream, normalizedPath);
      const download = url.searchParams.has("download");
      const folderPassword = url.searchParams.get("password");
      const fileKeyEncoded = url.searchParams.get("key");
      if (!folderPassword && !fileKeyEncoded) {
        res.statusCode = 403;
        return res.end("no_password");
      }

      let folder: EncryptedFolder;
      let fileKey: Buffer;
      if (folderPassword) {
        folder = await EncryptedFolder.create(folderID, folderPassword);
        const fileNamePlain = await folder.decodeFileName(normalizedPath);
        fileKey = await folder.calculateFileKey(fileNamePlain);
        if (url.searchParams.has("fk")) {
          return res.end(base32Encode(fileKey).replace(/=/g, ""));
        }
      } else if (fileKeyEncoded) {
        folder = await EncryptedFolder.create(folderID, "");
        fileKey = Buffer.from(base32Decode(fileKeyEncoded));
      } else {
        throw new Error("no_keys");
      }

      const fileHandle = await open(filePath);
      try {
        let headersSent = false;
        await EncryptedFolder.readFile(
          fileHandle,
          fileKey,
          async (chunk, md) => {
            res.statusCode = 200;
            if (!chunk) {
              res.end();
              return;
            }

            // Send headers
            if (!headersSent) {
              headersSent = true;
              const fileNamePlain = md.name;
              const pathInfo = parse(fileNamePlain);

              const fileNameEncoded = encodeURIComponent(
                `${pathInfo.name}${pathInfo.ext}`
              );
              res.setHeader(
                "Content-disposition",
                `${
                  download ? "attachment" : "inline"
                }; filename="${fileNameEncoded}"`
              );
            }

            // Send chunk
            await new Promise<void>((resolve, reject) => {
              res.write(chunk, (err?: Error | null) => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve();
              });
            });
          }
        );
      } finally {
        await fileHandle.close();
      }
    } catch (e) {
      res.statusCode = 500;
      console.error(e);
      return res.end("error");
    }
  });

  server.listen(8380);
}
main();
