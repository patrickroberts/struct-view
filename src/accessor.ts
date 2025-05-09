import type { Decorator } from './decorator';

const accessor = <K extends string, T>(
  name: K,
  byteLength: number,
  getter: (self: any, byteOffset: number) => T,
  setter: (self: any, byteOffset: number, value: T) => void,
): Decorator<Record<K, T>> => (Base: any, byteOffset: number): any => {
  if (name in Base.prototype) {
    throw new TypeError(`Property '${name}' has already been defined`);
  }

  return class extends Base {
    static BYTES_PER_INSTANCE = Math.max(Base.BYTES_PER_INSTANCE, byteOffset + byteLength);

    get [name]() {
      return getter(this, byteOffset);
    }

    set [name](value: T) {
      setter(this, byteOffset, value);
    }

    toJSON() {
      const object = super.toJSON();
      const value: any = this[name];

      object[name] = value?.toJSON?.() ?? value;

      return object;
    }
  };
};

export default accessor;
