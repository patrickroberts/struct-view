import { StructConstructor } from './struct';
import { Types, TypedArray } from './types';

export interface Decorator<T> {
  <U>(Base: StructConstructor<U>, byteOffset: number): StructConstructor<T & U>;
}

export interface NameDecorator<T> {
  <K extends string>(name: K): Decorator<Record<K, T>>;
}

export interface SizeDecorator<T> {
  (length: number): NameDecorator<T>;
}

export interface ArithmeticDecorator<T extends Types> extends
  NameDecorator<TypedArray<T>[number]>,
  SizeDecorator<TypedArray<T>> {}

export type Decorators = Decorator<any>[];
