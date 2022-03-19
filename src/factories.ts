import type { Decorator } from './decorator';

export interface PropertyFactory<T> {
  <K extends string>(name: K): Decorator<Record<K, T>>;
}

export interface ArrayPropertyFactory<T> {
  (length: number): PropertyFactory<T>;
}
