import type { StructConstructor } from './struct';

export interface Decorator<T> {
  <U>(Base: StructConstructor<U>, byteOffset: number): StructConstructor<T & U>;
}
