import { Intersect } from './intersect';
import StructView from './struct-view';

export type Struct<T> = StructView<T> & Intersect<{
  [P in keyof T]:
  T[P] extends (infer U)[] ? Readonly<Record<P, readonly Struct<U>[]>> :
    T[P] extends Record<string, any> ? Record<P, Struct<T[P]>> :
      Record<P, T[P]>;
}[keyof T]>;

export interface StructConstructor<T> extends DataViewConstructor {
  readonly prototype: Struct<T>;

  new (buffer?: ArrayBufferLike, byteOffset?: number, byteLength?: number): Struct<T>;

  readonly BYTES_PER_INSTANCE: number;
}
