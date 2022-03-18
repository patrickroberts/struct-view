import accessor from './accessor';
import { ArithmeticDecorator } from './decorators';
import named from './named';
import { Types, types } from './types';

const arithmetic = <T extends Types>(
  type: T, littleEndian?: boolean,
): ArithmeticDecorator<T> => (nameOrLength: string | number): any => {
  const Constructor = types[`${type}Array` as const];

  switch (typeof nameOrLength) {
    case 'string': {
      const name = nameOrLength;
      const byteLength = Constructor.BYTES_PER_ELEMENT;
      const get = `get${type}`;
      const set = `set${type}`;

      return accessor(
        name,
        byteLength,
        (self, byteOffset) => self[get](byteOffset, littleEndian),
        (self, byteOffset, value) => self[set](byteOffset, value, littleEndian),
      );
    }
    case 'number': {
      const length = nameOrLength;

      return (name: string) => named(Constructor, length, name);
    }
    default:
      throw new TypeError(`Expected name or length; got ${nameOrLength}`);
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
export const uint64be = arithmetic('BigUint64', true);
export const uint64le = uint64;
