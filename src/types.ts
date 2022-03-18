export const types = {
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

export type TypedArrayMap = typeof types;

export type Types = keyof TypedArrayMap extends `${infer T}Array` ? T : never;

export type TypedArrayConstructor<T extends Types> = TypedArrayMap[`${T}Array`];

export type TypedArray<T extends Types> = InstanceType<TypedArrayConstructor<T>>;
