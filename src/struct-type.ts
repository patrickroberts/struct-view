import type { Decorator } from './decorator';
import type { ArrayPropertyFactory, PropertyFactory } from './factories';
import type { Struct, StructConstructor } from './struct';

export interface StructType<T> extends
  StructConstructor<T>,
  Decorator<Struct<T>>,
  PropertyFactory<Struct<T>>,
  ArrayPropertyFactory<Struct<T>[]> { }
