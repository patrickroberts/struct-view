import accessor from './accessor';
import type { Decorator } from './decorator';
import type { StructConstructor } from './struct';

const array = <K extends string, T>(
  Constructor: StructConstructor<T>,
  length: number,
  name: K,
): Decorator<Record<K, T[]>> => {
  const byteLength = length * Constructor.BYTES_PER_INSTANCE;

  return accessor(
    name,
    byteLength,
    (self, byteOffset): any => {
      const value = [];

      for (let index = 0; index < length; ++index) {
        value[index] = new Constructor(
          self.buffer,
          self.byteOffset + byteOffset + index * Constructor.BYTES_PER_INSTANCE,
          Constructor.BYTES_PER_INSTANCE,
        );
      }

      return Object.freeze(value);
    },
    () => {
      throw new TypeError(`Cannot set property ${name} which has only a getter`);
    },
  );
};

export default array;
