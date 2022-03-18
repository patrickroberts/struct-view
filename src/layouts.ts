import array from './array';
import { Decorator, Decorators } from './decorators';
import { Intersect } from './intersect';
import named from './named';
import { StructType } from './struct-type';
import StructView from './struct-view';

type Indices<T extends any[]> = keyof Omit<T, keyof []>;

type Reduce<Ds extends Decorators> =
  Ds extends [] ? {} : Intersect<{
    [I in Indices<Ds>]: (
      Ds[I] extends StructType<infer T> ? T
        : Ds[I] extends Decorator<infer T> ? T
          : never
    );
  }[Indices<Ds>]>;

export interface Layout {
  <Ds extends Decorators>(...decorators: Ds): StructType<Reduce<Ds>>;
}

const layout = (
  reducer: (decorators: Decorators, Initial: any, byteOffset: number) => any,
): Layout => (...extensions) => {
  const Base = reducer(extensions, StructView, 0);

  function Derived(...args: any): any {
    if (new.target) {
      return Reflect.construct(Base, args, new.target);
    }

    switch (args.length) {
      case 2: {
        const Constructor = args[0];
        const byteOffset = args[1];

        if (Constructor === StructView && byteOffset === 0) {
          return Derived;
        }

        return reducer(extensions, Constructor, byteOffset);
      }
      case 1: {
        const Constructor: any = Derived;
        const nameOrLength = args[0];

        switch (typeof nameOrLength) {
          case 'string': {
            const name = nameOrLength;

            return named(Constructor, Constructor.BYTES_PER_INSTANCE, name);
          }
          case 'number': {
            const length = nameOrLength;

            return (name: string) => array(Constructor, length, name);
          }
          default:
            break;
        }

        break;
      }
      default:
        break;
    }

    throw new TypeError("Class constructors cannot be invoked without 'new'");
  }

  Object.setPrototypeOf(Derived.prototype, Base.prototype);

  return Object.setPrototypeOf(Derived, Base);
};

export const struct = layout(
  (extensions, Initial, byteOffset) => extensions.reduce(
    (Base, extension, index) => extension(Base, index === 0 ? byteOffset : Base.BYTES_PER_INSTANCE),
    Initial,
  ),
);

export const union = layout(
  (extensions, Initial, byteOffset) => extensions.reduce(
    (Base, extension) => extension(Base, byteOffset),
    Initial,
  ),
);
