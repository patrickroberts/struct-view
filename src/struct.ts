import type { Intersect } from './intersect';
import type StructView from './struct-view';

export type Struct<T> = StructView<T> & Intersect<T>;

export interface StructConstructor<T> {
  readonly prototype: Struct<T>;

  new (buffer?: ArrayBufferLike, byteOffset?: number, byteLength?: number): Struct<T>;

  from(array: ArrayBufferView, byteOffset?: number, byteLength?: number): Struct<T>;

  readonly BYTES_PER_INSTANCE: number;
}
