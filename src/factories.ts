import type { Decorator } from './decorator';

export interface PropertyFactory<T> {
  <K extends string>(name: K): Decorator<Record<K, T>>;
}

export interface ArrayPropertyFactory<T> {
  (length: number): PropertyFactory<T>;
}

export interface ReadonlyPropertyFactory<T> {
  <K extends string>(name: K): Decorator<Readonly<Record<K, T>>>;
}

export interface ReadonlyArrayPropertyFactory<T> {
  (length: number): ReadonlyPropertyFactory<T>;
}
