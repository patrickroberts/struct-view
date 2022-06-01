import accessor from './accessor';
import type { ArrayPropertyFactory, PropertyFactory } from './factories';
import memoize from './memoize';

const getTextDecoder = memoize(() => new globalThis.TextDecoder());
const getTextEncoder = memoize(() => new globalThis.TextEncoder());

const string = (name: string, byteLength: number) => accessor(
  name,
  byteLength,
  (self, byteOffset) => getTextDecoder().decode(
    new Uint8Array(self.buffer, self.byteOffset + byteOffset, byteLength),
  ),
  (self, byteOffset, value) => getTextEncoder().encodeInto(
    value,
    new Uint8Array(self.buffer, self.byteOffset + byteOffset, byteLength),
  ),
);

export interface CharFactory extends
  PropertyFactory<string>,
  ArrayPropertyFactory<string> {}

export const char: CharFactory = (nameOrByteLength: string | number): any => {
  switch (typeof nameOrByteLength) {
    case 'string': {
      const name = nameOrByteLength;
      const byteLength = 1;

      return string(name, byteLength);
    }
    case 'number': {
      const byteLength = nameOrByteLength;

      return (name: string) => string(name, byteLength);
    }
    default:
      throw new TypeError(`The first argument must be of type string or number. Received ${nameOrByteLength}`);
  }
};
