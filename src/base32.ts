// Adapted from the base32-encode package, originally MIT licensed:
//
// Copyright (c) 2016-2021 Linus Unnebäck

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
const RFC4648_HEX = "0123456789ABCDEFGHIJKLMNOPQRSTUV";

export function base32Encode(data: Buffer) {
  const alphabet = RFC4648_HEX;
  const padding = true;
  const view = new Uint8Array(data);

  let bits = 0;
  let value = 0;
  let output = "";

  for (let i = 0; i < view.length; i++) {
    value = (value << 8) | view.at(i)!;
    bits += 8;

    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31];
  }

  if (padding) {
    while (output.length % 8 !== 0) {
      output += "=";
    }
  }

  return output;
}

export function base32Decode(input: string) {
  const alphabet = RFC4648_HEX;
  input = input.replace(/=+$/, "");
  const length = input.length;

  let bits = 0;
  let value = 0;

  let index = 0;
  const output = new Uint8Array(((length * 5) / 8) | 0);

  for (var i = 0; i < length; i++) {
    const character = alphabet.indexOf(input[i]);
    if (character === -1) throw new Error(`invalid character: '${input[i]}'`);
    value = (value << 5) | character;
    bits += 5;

    if (bits >= 8) {
      output[index++] = (value >>> (bits - 8)) & 255;
      bits -= 8;
    }
  }

  return output.buffer;
}
