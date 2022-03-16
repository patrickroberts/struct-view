class StructView<T> extends DataView {
  static BYTES_PER_INSTANCE = 0;

  constructor(
    buffer = new ArrayBuffer(new.target.BYTES_PER_INSTANCE),
    byteOffset = 0,
    byteLength = buffer.byteLength - byteOffset,
  ) {
    super(buffer, byteOffset, byteLength);
  }

  toJSON(this: T): T {
    return { ...this };
  }
}

export type Struct<T> = StructView<T> & {
  [P in keyof T]: T[P] extends Record<string, any> ? Struct<T[P]> : T[P];
};

export interface StructConstructor<T> extends DataViewConstructor {
  readonly prototype: Struct<T>;

  new (buffer?: ArrayBufferLike, byteOffset?: number, byteLength?: number): Struct<T>;

  readonly BYTES_PER_INSTANCE: number;
}

export interface Extension<T> {
  <U>(Base: StructConstructor<U>, byteOffset: number): StructConstructor<T & U>;
}

const accessor = <K extends string, T>(
  name: K,
  byteLength: number,
  get: (self: any, byteOffset: number) => T,
  set: (self: any, byteOffset: number, value: T) => void,
): Extension<Record<K, T>> => (Base: any, byteOffset: number): any => {
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

const named = (Constructor: any, length: number, name: string) => {
  const byteLength = length * (
    Constructor.prototype instanceof Object.getPrototypeOf(Uint8Array)
      ? Constructor.BYTES_PER_ELEMENT : 1
  );

  return accessor(
    name,
    byteLength,
    (self, byteOffset) => new Constructor(self.buffer, self.byteOffset + byteOffset, length),
    (self, byteOffset, value) => {
      const dst = new Uint8Array(self.buffer, self.byteOffset, self.byteLength);
      const src = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);

      dst.set(src, byteOffset);
    },
  );
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

export type Arithmetic = keyof typeof typedArrayMap extends `${infer T}Array` ? T : never;

type TypedArrayType<T extends Arithmetic> = InstanceType<typeof typedArrayMap[`${T}Array`]>;

export interface NamedExtension<T> {
  <K extends string>(name: K): Extension<Record<K, T>>;
}

export interface SizedExtension<T> {
  (length: number): NamedExtension<T>;
}

export interface ArithmeticExtension<T extends Arithmetic> extends
  NamedExtension<TypedArrayType<T>[number]>,
  SizedExtension<TypedArrayType<T>> {}

const type = <T extends Arithmetic>(
  arithmetic: T, littleEndian?: boolean,
): ArithmeticExtension<T> => (nameOrLength: string | number): any => {
  const ArrayConstructor = typedArrayMap[`${arithmetic}Array` as const];

  switch (typeof nameOrLength) {
    case 'string': {
      const name = nameOrLength;
      const byteLength = ArrayConstructor.BYTES_PER_ELEMENT;
      const get = `get${arithmetic}`;
      const set = `set${arithmetic}`;

      return accessor(
        name,
        byteLength,
        (self, byteOffset) => self[get](byteOffset, littleEndian),
        (self, byteOffset, value) => self[set](byteOffset, value, littleEndian),
      );
    }
    case 'number': {
      const length = nameOrLength;

      return (name: string) => named(ArrayConstructor, length, name);
    }
    default:
      throw new TypeError(`Expected name or length; got ${nameOrLength}`);
  }
};

export const float32 = type('Float32', true);
export const float32be = type('Float32', false);
export const float32le = float32;
export const float64 = type('Float64', true);
export const float64be = type('Float64', false);
export const float64le = float64;
export const int8 = type('Int8');
export const int16 = type('Int16', true);
export const int16be = type('Int16', false);
export const int16le = int16;
export const int32 = type('Int32', true);
export const int32be = type('Int32', false);
export const int32le = int32;
export const int64 = type('BigInt64', true);
export const int64be = type('BigInt64', false);
export const int64le = int64;
export const uint8 = type('Uint8');
export const uint16 = type('Uint16', true);
export const uint16be = type('Uint16', false);
export const uint16le = uint16;
export const uint32 = type('Uint32', true);
export const uint32be = type('Uint32', false);
export const uint32le = uint32;
export const uint64 = type('BigUint64', true);
export const uint64be = type('BigUint64', true);
export const uint64le = uint64;

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

export const utf8: SizedExtension<string> = (byteLength) => (name) => accessor(
  name,
  byteLength,
  (self, byteOffset) => textDecoder.decode(
    new Uint8Array(self.buffer, self.byteOffset + byteOffset, byteLength),
  ),
  (self, byteOffset, value) => textEncoder.encodeInto(
    value,
    new Uint8Array(self.buffer, self.byteOffset + byteOffset, byteLength),
  ),
);

export const char = utf8(1);

type Contravariant<T> = (x: T) => void;

type Intersect<Union> =
  (Union extends any ? Contravariant<Union> : never) extends Contravariant<infer Intersection>
    ? { [P in keyof Intersection]: Intersection[P]; }
    : never;

type Extensions = Extension<any>[];

type Indices<T extends any[]> = keyof Omit<T, keyof []>;

export interface StructType<T> extends
  StructConstructor<T>,
  Extension<T>,
  NamedExtension<T> {}

type Properties<Es extends Extensions> =
  Es extends [] ? {} : Intersect<{
    [I in Indices<Es>]: (
      Es[I] extends StructType<infer T> ? T
        : Es[I] extends Extension<infer T> ? T
          : never
    );
  }[Indices<Es>]>;

export interface Layout {
  <Es extends Extensions>(...extensions: Es): StructType<Properties<Es>>;
}

const layout = (
  reducer: (extensions: Extensions, Initial: any, byteOffset: number) => any,
): Layout => (...extensions) => {
  const Constructor = reducer(extensions, StructView, 0);

  function Extension(...args: any) {
    if (new.target) {
      return Reflect.construct(Constructor, args, new.target);
    }

    switch (args.length) {
      case 2: {
        const Base = args[0];
        const byteOffset = args[1];

        return reducer(extensions, Base, byteOffset);
      }
      case 1: {
        const name = args[0];

        return named(Constructor, Constructor.BYTES_PER_INSTANCE, name);
      }
      default:
        throw new TypeError("Class constructors cannot be invoked without 'new'");
    }
  }

  Object.setPrototypeOf(Extension.prototype, Constructor.prototype);

  return Object.setPrototypeOf(Extension, Constructor);
};

export const struct = layout(
  (extensions, Initial, byteOffset) => extensions.reduce(
    (Base, extension, index) => extension(Base, index === 0 ? byteOffset : Base.BYTES_PER_INSTANCE),
    Initial,
  ),
);

export const union = layout(
  (extensions, Initial, byteOffset) => extensions.reduce(
    (Base, extension) => extension(Base, byteOffset),
    Initial,
  ),
);
