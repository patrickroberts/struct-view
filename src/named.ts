import accessor from './accessor';
import type { Decorator } from './decorator';
import type { StructConstructor } from './struct';
import type { TypedArrayConstructor, Types } from './types';

const isTypedArray = (
  Constructor: new (...args: any) => any,
): Constructor is TypedArrayConstructor<Types> => (
  Constructor.prototype instanceof Object.getPrototypeOf(Uint8Array)
);

const named = <K extends string, T extends StructConstructor<any> | TypedArrayConstructor<Types>>(
  Constructor: T, length: number, name: K,
): Decorator<Record<K, InstanceType<T>>> => {
  const byteLength = length * (isTypedArray(Constructor) ? Constructor.BYTES_PER_ELEMENT : 1);

  return accessor<K, any>(
    name,
    byteLength,
    (self, byteOffset) => (
      new Constructor(self.buffer, self.byteOffset + byteOffset, length)
    ),
    (self, byteOffset, value) => {
      const dst = new Uint8Array(self.buffer, self.byteOffset + byteOffset, byteLength);
      const src = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);

      dst.set(src);
    },
  );
};

export default named;
