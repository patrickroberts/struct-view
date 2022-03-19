export const types = {
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

export type TypedArrayMap = typeof types;

export type Types = keyof TypedArrayMap;

export type TypedArrayConstructor<T extends Types> = TypedArrayMap[T];

export type TypedArray<T extends Types> = InstanceType<TypedArrayConstructor<T>>;
