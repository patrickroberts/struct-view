import type { Intersect } from './intersect';
import StructView from './struct-view';

type Properties<T> = Intersect<{
  [P in keyof T]:
  // readonly array property of readonly elements is also enforced at runtime
  T[P] extends (infer U)[] ? Readonly<Record<P, readonly Struct<U>[]>> :
    T[P] extends Record<string, any> ? Record<P, Struct<T[P]>> :
      Record<P, T[P]>;
}[keyof T]>;

export type Struct<T> = StructView<T> & Properties<T>;

export interface StructConstructor<T> {
  readonly prototype: Struct<T>;

  new (buffer?: ArrayBufferLike, byteOffset?: number, byteLength?: number): Struct<T>;

  readonly BYTES_PER_INSTANCE: number;
}
