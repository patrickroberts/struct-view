import { Decorator } from './decorators';

const accessor = <K extends string, T>(
  name: K,
  byteLength: number,
  get: (self: any, byteOffset: number) => T,
  set: (self: any, byteOffset: number, value: T) => void,
): Decorator<Record<K, T>> => (Base: any, byteOffset: number): any => {
  if (name in Base.prototype) {
    throw new TypeError(`Property name ${name} not allowed`);
  }

  return class extends Base {
    static BYTES_PER_INSTANCE = Math.max(Base.BYTES_PER_INSTANCE, byteOffset + byteLength);

    get [name]() {
      return get(this, byteOffset);
    }

    set [name](value: T) {
      set(this, byteOffset, value);
    }

    toJSON() {
      const object = super.toJSON();

      object[name] = this[name];

      return object;
    }
  };
};

export default accessor;
