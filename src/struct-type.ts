import type { Decorator } from './decorator';
import type { ReadonlyPropertyFactory, ReadonlyArrayPropertyFactory } from './factories';
import type { Struct, StructConstructor } from './struct';

export interface StructType<T> extends
  StructConstructor<T>,
  Decorator<T>,
  ReadonlyPropertyFactory<Struct<T>>,
  ReadonlyArrayPropertyFactory<readonly Struct<T>[]> { }
