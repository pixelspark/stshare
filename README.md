# `stshare` - Syncthing encrypted peer file server

Serves files from Syncthing peers that hold encrypted files using [untrusted device encryption](https://docs.syncthing.net/specs/untrusted.html).
This is useful when syncing files to an (untrusted) cloud server, but you still want to be able to hand out 'sharing links'
that allow incidental access to specific files. A sharing link only contains the per-file encryption key, so only the
requested file can be decrypted by anyone who is able to observe the request.

## How it works

An encrypted peer's directory looks like this (the original file paths are encrypted, and then chopped up to form paths such as those below):

```bash
./1.syncthing-enc
./1.syncthing-enc/00
./1.syncthing-enc/00/SJ5S56RGM8O1PTG8H19D9I9A8RDBC74K8I0S19LQG
./1.syncthing-enc/S8
...
```

You can start `stshare` as follows:

```bash
npm install
npm run run -- test ~/Downloads/test/
```

The first argument after the double dashes is the 'folder ID', the second is the path to the encrypted folder.

After starting the server, files can be retrieved from this folder by suppying the encrypted file name and the folder password:

```bash
curl "http://localhost:8380/1.syncthing-enc/00/SJ5S56RGM8O1PTG8H19D9I9A8RDBC74K8I0S19LQG?password=geheim\!" -vvvv
*   Trying [::1]:8380...
* Connected to localhost (::1) port 8380
> GET /1.syncthing-enc/00/SJ5S56RGM8O1PTG8H19D9I9A8RDBC74K8I0S19LQG?password=geheim! HTTP/1.1
> Host: localhost:8380
> User-Agent: curl/8.4.0
> Accept: */*
>
< HTTP/1.1 200 OK
< Content-disposition: inline; filename="CVertex.cpp"
< Date: Sat, 16 Mar 2024 14:58:13 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< Transfer-Encoding: chunked
<
Copyright (C) 2003-2004 Tommy van der Vorst

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.
```

As this service is possibly running on an untrusted peer, you may not want to send the folder password like this (this would allow
decryption of all files in the folder to anyone who is able to observe the request and folder key in it). Instead, it is
more secure to use the per-file key, which is only useful to decrypt files with a specific name:

```bash
curl "http://localhost:8380/1.syncthing-enc/S8/N0JOTUPV9CSR77AI0S14N77GPKE3AKFDO0J1AIVH0?key=0H4ACQPV3DH6M84HKDISS42Q4DTAQT52V32RBHV6EDU1N87BNI7G"
Copyright (C) 2003-2004 Tommy van der Vorst

This library is free software; you can redistribute it and/or
...
```

This is e.g. useful for sharing links to other people. Add the `&download` query parameter to make the server send headers
that suggest the browser to save the file as download, with the original file name:

```bash
curl "http://localhost:8380/1.syncthing-enc/S8/N0JOTUPV9CSR77AI0S14N77GPKE3AKFDO0J1AIVH0?key=0H4ACQPV3DH6M84HKDISS42Q4DTAQT52V32RBHV6EDU1N87BNI7G&download" -v
*   Trying [::1]:8380...
* Connected to localhost (::1) port 8380
> GET /1.syncthing-enc/S8/N0JOTUPV9CSR77AI0S14N77GPKE3AKFDO0J1AIVH0?key=0H4ACQPV3DH6M84HKDISS42Q4DTAQT52V32RBHV6EDU1N87BNI7G&download HTTP/1.1
> Host: localhost:8380
> User-Agent: curl/8.4.0
> Accept: */*
>
< HTTP/1.1 200 OK
< Content-disposition: attachment; filename="CVector.cpp"
```

The file key depends on the folder ID, folder key and (plain text) file name. To invalidate a key, change the file name.
If you change a file's contents, the modified file will remain accessible using the same URL.

You can calculate the file key and 'sharing links' from some other host that does not have the files themselves:

```bash
npm run key -- test "geheim\!" CColor.cpp
```

```
Original file name: CColor.cpp
Crypted file name: 8.syncthing-enc/G6/MRTKHL1L02KH3PJ4CERR3SVET2JV8ARIEL138U4
File key: QH5F521UUMIB49H1G4SEPSA2TO748IG2QLK8C0TPL8E0JRUN3LN0
URL: http://localhost:8380/8.syncthing-enc/G6/MRTKHL1L02KH3PJ4CERR3SVET2JV8ARIEL138U4?key=QH5F521UUMIB49H1G4SEPSA2TO748IG2QLK8C0TPL8E0JRUN3LN0
```

## Usage

```sh
npm install
npm run run
```

## Development

Re-generate protoc:

```sh
brew install protobuf
npm install
npm run protoc
```

## License

MIT, except for the following files:

- [bep.proto](./bep.proto): Mozilla Public License Version 2.0

```
Copyright 2024 Tommy van der Vorst

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
