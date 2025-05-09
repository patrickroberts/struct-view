import type { Decorator } from './decorator';
import type { Intersect } from './intersect';
import type { StructType } from './struct-type';

type Indices<T extends any[]> = keyof Omit<T, keyof []>;

// true for empty array
type AllDecorators<Decorators extends any[]> = false extends {
  [I in Indices<Decorators>]: Decorators[I] extends Decorator<any> ? true : false;
}[Indices<Decorators>] ? false : true;

// Layout parameters do not match Decorator<any>[]
declare const DECORATORS_ONLY: unique symbol;

export type Combine<Decorators extends any[]> =
  AllDecorators<Decorators> extends true
    ? StructType<Intersect<{
      [I in Indices<Decorators>]: (
        Decorators[I] extends StructType<infer T>
          ? T
          : Decorators[I] extends Decorator<infer T>
            ? T
            : never
      );
    }[Indices<Decorators>]>>
    : { [DECORATORS_ONLY]: never };
