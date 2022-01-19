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
  BigInt64Array,
  BigUint64Array,
  Float32Array,
  Float64Array,
  Int8Array,
  Int16Array,
  Int32Array,
  Uint8Array,
  Uint16Array,
  Uint32Array,
};

type TypedArrayMap = typeof typedArrayMap;

export type Arithmetic = keyof TypedArrayMap extends `${infer T}Array` ? T : never;

type TypedArrayConstructors<T extends Arithmetic> = TypedArrayMap[`${T}Array`];

type TypedArrays<T extends Arithmetic> = InstanceType<TypedArrayConstructors<T>>;

const TypedArray: TypedArrayConstructors<Arithmetic> = Object.getPrototypeOf(Uint8Array);

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

export interface TypeFactory {
  <T extends Exclude<Arithmetic, 'Int8' | 'Uint8'>>(type: T, littleEndian?: boolean): ArithmeticFactory<T>;
  <T extends Arithmetic>(type: T): ArithmeticFactory<T>;
}

const typedef: TypeFactory = (type: Arithmetic, littleEndian?: boolean): any => {
  const ArrayConstructor = typedArrayMap[`${type}Array` as const];

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
const float64 = typedef('Float64', true);
const int8 = typedef('Int8');
const int16 = typedef('Int16', true);
const int32 = typedef('Int32', true);
const int64 = typedef('BigInt64', true);
const uint8 = typedef('Uint8');
const uint16 = typedef('Uint16', true);
const uint32 = typedef('Uint32', true);
const uint64 = typedef('BigUint64', true);

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
  float32, float64, int8, int16, int32, int64, uint8, uint16, uint32, uint64,
  typedef, struct, union,
};
