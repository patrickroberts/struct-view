import array from './array';
import type { Combine } from './combine';
import type { Decorator } from './decorator';
import named from './named';
import StructView from './struct-view';

export interface Layout {
  <Decorators extends any[]>(...decorators: Decorators): Combine<Decorators>;
}

const layout = (
  reducer: (decorators: Decorator<any>[], Initial: any, byteOffset: number) => any,
): Layout => (...extensions) => {
  const Base = reducer(extensions, StructView, 0);

  function Derived(this: any, ...args: any): any {
    // StructConstructor overload
    if (this instanceof Derived) {
      return Reflect.construct(Base, args, this.constructor);
    }

    switch (args.length) {
      // Decorator overload
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
          // PropertyFactory overload
          case 'string': {
            const name = nameOrLength;

            return named(Constructor, Constructor.BYTES_PER_INSTANCE, name);
          }
          // ArrayPropertyFactory overload
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
  (extensions, Initial, byteOffset) => {
    let Constructor = StructView;

    return extensions.reduce(
      (Base, extension) => {
        const Derived = extension(Base, byteOffset + Constructor.BYTES_PER_INSTANCE);

        Constructor = extension(Constructor, Constructor.BYTES_PER_INSTANCE);

        return Derived;
      },
      Initial,
    );
  },
);

export const union = layout(
  (extensions, Initial, byteOffset) => extensions.reduce(
    (Base, extension) => extension(Base, byteOffset),
    Initial,
  ),
);
