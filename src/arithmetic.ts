import accessor from './accessor';
import type { ArrayPropertyFactory, PropertyFactory } from './factories';
import named from './named';
import type { TypedArray, Types } from './types';
import { types } from './types';

export interface ArithmeticFactory<T extends Types> extends
  PropertyFactory<TypedArray<T>[number]>,
  ArrayPropertyFactory<TypedArray<T>> {}

const nativeEndian = (() => {
  const { buffer, byteOffset, byteLength } = new Uint16Array([0x1234]);
  return new DataView(buffer, byteOffset, byteLength).getUint8(0) === 0x34;
})();

const arithmetic = <T extends Types>(
  type: T, littleEndian?: boolean,
): ArithmeticFactory<T> => (nameOrLength: string | number): any => {
  const Constructor = types[type];

  switch (typeof nameOrLength) {
    // PropertyFactory overload
    case 'string': {
      const name = nameOrLength;
      const byteLength = Constructor.BYTES_PER_ELEMENT;
      const get = `get${type}` as const;
      const set = `set${type}` as const;

      return accessor(
        name,
        byteLength,
        (self, byteOffset) => new DataView(
          self.buffer, self.byteOffset + byteOffset, byteLength,
        )[get](0, littleEndian),
        (self, byteOffset, value) => new DataView(
          self.buffer, self.byteOffset + byteOffset, byteLength,
        )[set](0, value as number & bigint, littleEndian),
      );
    }
    // ArrayPropertyFactory overload
    case 'number': {
      if (littleEndian !== nativeEndian) {
        throw new TypeError('Cannot define numeric array property type because it does not match platform endianness');
      }

      const length = nameOrLength;

      return (name: string) => named(Constructor, length, name);
    }
    default:
      throw new TypeError(`The first argument must be of type string or number. Received ${nameOrLength}`);
  }
};

export const float32 = arithmetic('Float32', true);
export const float32be = arithmetic('Float32', false);
export const float32le = float32;
export const float64 = arithmetic('Float64', true);
export const float64be = arithmetic('Float64', false);
export const float64le = float64;
export const int8 = arithmetic('Int8');
export const int16 = arithmetic('Int16', true);
export const int16be = arithmetic('Int16', false);
export const int16le = int16;
export const int32 = arithmetic('Int32', true);
export const int32be = arithmetic('Int32', false);
export const int32le = int32;
export const int64 = arithmetic('BigInt64', true);
export const int64be = arithmetic('BigInt64', false);
export const int64le = int64;
export const uint8 = arithmetic('Uint8');
export const uint16 = arithmetic('Uint16', true);
export const uint16be = arithmetic('Uint16', false);
export const uint16le = uint16;
export const uint32 = arithmetic('Uint32', true);
export const uint32be = arithmetic('Uint32', false);
export const uint32le = uint32;
export const uint64 = arithmetic('BigUint64', true);
export const uint64be = arithmetic('BigUint64', false);
export const uint64le = uint64;
