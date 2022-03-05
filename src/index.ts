class Struct<T> extends DataView {
  static BYTES_PER_INSTANCE = 0;

  constructor(
    buffer = new ArrayBuffer(new.target.BYTES_PER_INSTANCE),
    byteOffset = 0,
    byteLength = buffer.byteLength - byteOffset,
  ) { super(buffer, byteOffset, byteLength); }

  toJSON(this: T): T { return { ...this }; }
}

type StructType<T> = Struct<T> & {
  [P in keyof T]: T[P] extends Record<string, any> ? StructType<T[P]> : T[P];
};

export interface StructConstructor<T> extends DataViewConstructor {
  readonly prototype: StructType<T>;

  new (buffer?: ArrayBufferLike, byteOffset?: number, byteLength?: number): StructType<T>;

  readonly BYTES_PER_INSTANCE: number;
}

export interface Factory<T> {
  <U>(Base: StructConstructor<U>, byteOffset: number): StructConstructor<T & U>;
}

export interface NameFactory<T> {
  <K extends string>(name: K): Factory<Record<K, T>>;
}

export interface LengthFactory<T> {
  (length: number): NameFactory<T>;
}

const blacklist = Object.getOwnPropertyNames(Object.prototype).concat(
  Object.getOwnPropertyNames(DataView.prototype),
  Object.getOwnPropertyNames(Struct.prototype),
);

const assertAllowed = (name: string) => {
  if (blacklist.includes(name)) {
    throw new TypeError(`Property name ${name} not allowed`);
  }
};

const typedArrayMap = {
  BigInt64: BigInt64Array,
  BigUint64: BigUint64Array,
  Float32: Float32Array,
  Float64: Float64Array,
  Int8: Int8Array,
  Int16: Int16Array,
  Int32: Int32Array,
  Uint8: Uint8Array,
  Uint16: Uint16Array,
  Uint32: Uint32Array,
};

export type Arithmetic = keyof typeof typedArrayMap;

type TypedArrays<T extends Arithmetic> = InstanceType<typeof typedArrayMap[T]>;

const TypedArray = Object.getPrototypeOf(Uint8Array);

const named = (Constructor: any, length: number, name: string) => {
  assertAllowed(name);

  const byteLength = length * (
    Constructor.prototype instanceof TypedArray ? Constructor.BYTES_PER_ELEMENT : 1
  );

  return (Base: any, byteOffset: number) => class extends Base {
    static BYTES_PER_INSTANCE = Math.max(Base.BYTES_PER_INSTANCE, byteOffset + byteLength);

    get [name]() {
      return new Constructor(this.buffer, this.byteOffset + byteOffset, length);
    }

    set [name](value: any) {
      const dst = new Uint8Array(this.buffer, this.byteOffset, this.byteLength);
      const src = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);

      dst.set(src, byteOffset);
    }

    toJSON() {
      const object = super.toJSON();

      object[name] = this[name];

      return object;
    }
  };
};

export interface ArithmeticFactory<T extends Arithmetic>
  extends NameFactory<TypedArrays<T>[number]>, LengthFactory<TypedArrays<T>> {}

interface TypeFactory {
  <T extends Arithmetic>(type: T, littleEndian?: boolean): ArithmeticFactory<T>;
}

const typedef: TypeFactory = (type: Arithmetic, littleEndian?: boolean): any => {
  const ArrayConstructor = typedArrayMap[type];

  if (!ArrayConstructor) {
    throw new TypeError(`Unexpected type ${type}`);
  }

  return (nameOrLength: string | number) => {
    switch (typeof nameOrLength) {
      case 'string': {
        const byteLength = ArrayConstructor.BYTES_PER_ELEMENT;
        const getType = `get${type}`;
        const setType = `set${type}`;
        const name = nameOrLength;

        assertAllowed(name);

        return (Base: any, byteOffset: number) => class extends Base {
          static BYTES_PER_INSTANCE = Math.max(Base.BYTES_PER_INSTANCE, byteOffset + byteLength);

          get [name]() { return this[getType](byteOffset, littleEndian); }

          set [name](value: any) { this[setType](byteOffset, value, littleEndian); }

          toJSON() {
            const object = super.toJSON();

            object[name] = this[name];

            return object;
          }
        };
      }
      case 'number': {
        const length = nameOrLength;

        return (name: string) => named(ArrayConstructor, length, name);
      }
      default:
        throw new TypeError(`Expected name or length; got ${nameOrLength}`);
    }
  };
};

const float32 = typedef('Float32', true);
const float32le = float32;
const float32be = typedef('Float32', false);
const float64 = typedef('Float64', true);
const float64le = float64;
const float64be = typedef('Float64', false);
const int8 = typedef('Int8');
const int16 = typedef('Int16', true);
const int16le = int16;
const int16be = typedef('Int16', false);
const int32 = typedef('Int32', true);
const int32le = int32;
const int32be = typedef('Int32', false);
const int64 = typedef('BigInt64', true);
const int64le = int64;
const int64be = typedef('BigInt64', false);
const uint8 = typedef('Uint8');
const uint16 = typedef('Uint16', true);
const uint16le = uint16;
const uint16be = typedef('Uint16', false);
const uint32 = typedef('Uint32', true);
const uint32le = uint32;
const uint32be = typedef('Uint32', false);
const uint64 = typedef('BigUint64', true);
const uint64le = uint64;
const uint64be = typedef('BigUint64', true);

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

const utf8: LengthFactory<string> = (byteLength): any => (name: string) => {
  assertAllowed(name);

  return (Base: any, byteOffset: number) => class extends Base {
    static BYTES_PER_INSTANCE = Math.max(Base.BYTES_PER_INSTANCE, byteOffset + byteLength);

    get [name]() {
      return textDecoder.decode(
        new Uint8Array(this.buffer, this.byteOffset + byteOffset, byteLength),
      );
    }

    set [name](value: any) {
      textEncoder.encodeInto(
        value,
        new Uint8Array(this.buffer, this.byteOffset + byteOffset, byteLength),
      );
    }

    toJSON() {
      const object = super.toJSON();

      object[name] = this[name];

      return object;
    }
  };
};

export interface StructFactory<T> extends StructConstructor<T>, Factory<T>, NameFactory<T> {}

type Contravariant<T> = (x: T) => void;

type Intersect<Union> =
  (Union extends any ? Contravariant<Union> : never) extends Contravariant<infer Intersection>
    ? { [P in keyof Intersection]: Intersection[P]; }
    : never;

type Factories = Factory<any>[];

type Indices<T extends any[]> = keyof Omit<T, keyof []>;

type Properties<F extends Factories> =
  F extends [] ? {}
    : Intersect<{
      [P in Indices<F>]: F[P] extends StructFactory<infer T> ? T
        : F[P] extends Factory<infer T> ? T
          : never;
    }[Indices<F>]>;

export interface LayoutFactory {
  <F extends Factories>(...factories: F): StructFactory<Properties<F>>;
}

const layout = (reducer: any) => (...factories: any) => {
  const Constructor = reducer(factories, Struct, 0);

  function Factory(...args: any) {
    if (new.target) {
      return Reflect.construct(Constructor, args, new.target);
    }

    switch (args.length) {
      case 2:
        return reducer(factories, args[0], args[1]);
      case 1: {
        return named(Constructor, Constructor.BYTES_PER_INSTANCE, args[0]);
      }
      default:
        throw new TypeError("Class constructors cannot be invoked without 'new'");
    }
  }

  Object.setPrototypeOf(Factory.prototype, Constructor.prototype);
  return Object.setPrototypeOf(Factory, Constructor);
};

const struct: LayoutFactory = layout(
  (factories: any, Initial: any, initialByteOffset: number) => {
    let Previous = Struct;
    let byteOffset = 0;

    return factories.reduce(
      (Base: any, factory: any) => {
        const Derived = factory(Base, initialByteOffset + byteOffset);
        const Current = factory(Previous, byteOffset);
        byteOffset += Current.BYTES_PER_INSTANCE - Previous.BYTES_PER_INSTANCE;
        Previous = Current;
        return Derived;
      },
      Initial,
    );
  },
);

const union: LayoutFactory = layout(
  (factories: any, Initial: any, byteOffset: number) => factories.reduce(
    (Base: any, factory: any) => factory(Base, byteOffset),
    Initial,
  ),
);

export {
  float32, float32le, float32be, float64, float64le, float64be, int8, int16, int16le, int16be,
  int32, int32le, int32be, int64, int64le, int64be, uint8, uint16, uint16le, uint16be, uint32,
  uint32le, uint32be, uint64, uint64le, uint64be, utf8, struct, union,
};
