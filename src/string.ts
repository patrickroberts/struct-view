import accessor from './accessor';
import { SizeDecorator } from './decorators';

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

export const string: SizeDecorator<string> = (byteLength) => (name) => accessor(
  name,
  byteLength,
  (self, byteOffset) => textDecoder.decode(
    new Uint8Array(self.buffer, self.byteOffset + byteOffset, byteLength),
  ),
  (self, byteOffset, value) => textEncoder.encodeInto(
    value,
    new Uint8Array(self.buffer, self.byteOffset + byteOffset, byteLength),
  ),
);

export const char = string(1);
