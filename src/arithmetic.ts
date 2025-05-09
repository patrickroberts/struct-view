import accessor from './accessor';
import type { ArrayPropertyFactory, PropertyFactory } from './factories';
import named from './named';
import type { TypedArray, Types } from './types';
import { types } from './types';

export interface ArithmeticFactory<T extends Types> extends
  PropertyFactory<TypedArray<T>[number]>,
  ArrayPropertyFactory<TypedArray<T>> { }

const arithmetic = <T extends Types>(
  type: T, littleEndian = true,
): ArithmeticFactory<T> => (nameOrLength: string | number): any => {
  const Constructor = types[type];

  switch (typeof nameOrLength) {
    // PropertyFactory overload
    case 'string': {
      const name = nameOrLength;
      const byteLength = Constructor.BYTES_PER_ELEMENT;
      const getter = `get${type}` as const;
      const setter = `set${type}` as const;

      return accessor(
        name,
        byteLength,
        (self, byteOffset) => new DataView(
          self.buffer, self.byteOffset + byteOffset, byteLength,
        )[getter](0, littleEndian),
        (self, byteOffset, value) => new DataView(
          self.buffer, self.byteOffset + byteOffset, byteLength,
        )[setter](0, value as number & bigint, littleEndian),
      );
    }
    // ArrayPropertyFactory overload
    case 'number': {
      if (!littleEndian) {
        throw new TypeError('Cannot define numeric array property type because it does not match platform endianness');
      }

      const length = nameOrLength;

      return (name: string) => named(Constructor, length, name);
    }
    default:
      throw new TypeError(`The first argument must be of type string or number. Received ${nameOrLength}`);
  }
};

export const float32be = arithmetic('Float32', false);
export const float32le = arithmetic('Float32', true);
export const float32 = float32le;
export const float64be = arithmetic('Float64', false);
export const float64le = arithmetic('Float64', true);
export const float64 = float64le;
export const int8 = arithmetic('Int8');
export const int16be = arithmetic('Int16', false);
export const int16le = arithmetic('Int16', true);
export const int16 = int16le;
export const int32be = arithmetic('Int32', false);
export const int32le = arithmetic('Int32', true);
export const int32 = int32le;
export const int64be = arithmetic('BigInt64', false);
export const int64le = arithmetic('BigInt64', true);
export const int64 = int64le;
export const uint8 = arithmetic('Uint8');
export const uint16be = arithmetic('Uint16', false);
export const uint16le = arithmetic('Uint16', true);
export const uint16 = uint16le;
export const uint32be = arithmetic('Uint32', false);
export const uint32le = arithmetic('Uint32', true);
export const uint32 = uint32le;
export const uint64be = arithmetic('BigUint64', false);
export const uint64le = arithmetic('BigUint64', true);
export const uint64 = uint64le;
