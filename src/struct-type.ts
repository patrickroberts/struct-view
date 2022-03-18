import { Decorator, NameDecorator, SizeDecorator } from './decorators';
import { StructConstructor } from './struct';

export interface StructType<T> extends
  StructConstructor<T>, Decorator<T>, NameDecorator<T>, SizeDecorator<T[]> {}
