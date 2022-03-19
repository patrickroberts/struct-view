import type { Decorator } from './decorator';
import type { ArrayPropertyFactory, PropertyFactory } from './factories';
import type { StructConstructor } from './struct';

export interface StructType<T> extends
  StructConstructor<T>,
  Decorator<T>,
  PropertyFactory<T>,
  ArrayPropertyFactory<T[]> {}
