import { struct, uint8 } from '..';

describe('accessor', () => {
  it.each([
    ['buffer'],
    ['byteOffset'],
    ['byteLength'],
    ['constructor'],
    ['toJSON'],
    ['__proto__'],
    ['previous'],
  ] as const)('should throw if property is already defined', (name) => {
    const property = uint8(name);

    expect(() => struct(
      uint8('previous'),
      property,
    )).toThrow(TypeError);
  });

  it('should add properties to JSON', () => {
    const Inner = struct(
      uint8('bar'),
    );
    const Outer = struct(
      Inner('foo'),
    );
    const outer = new Outer();

    expect(outer.toJSON()).toStrictEqual({ foo: { bar: 0 } });
  });
});
