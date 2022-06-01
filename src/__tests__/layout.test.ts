import { struct, union, uint8 } from '..';

describe('layout', () => {
  it('should support inheritance', () => {
    const Base = struct(
      uint8('a'),
    );
    const Derived = struct(
      Base,
      uint8('b'),
    );

    const derived = new Derived();

    expect(derived).toBeInstanceOf(Base);
    expect(derived).toBeInstanceOf(Derived);
    expect(derived).toHaveProperty('a');
  });

  it('should support composition', () => {
    const Inner = struct(
      uint8('b'),
    );
    const Outer = struct(
      uint8('a'),
      Inner,
      uint8('c'),
    );

    const outer = new Outer();

    expect(outer).not.toBeInstanceOf(Inner);
    expect(outer).toBeInstanceOf(Outer);
    expect(outer).toHaveProperty('b');
  });

  it('should support union types', () => {
    const Alias = union(
      uint8('a'),
      uint8('b'),
    );

    const alias = new Alias();

    alias.a = 42;

    expect(Alias.BYTES_PER_INSTANCE).toBe(1);
    expect(alias.b).toBe(42);
  });

  it('should support overloaded constructors', () => {
    const Type = struct();
    const storage = new Uint8Array(3);

    expect(new Type()).toMatchObject({
      byteOffset: 0,
      byteLength: 0,
    });

    expect(new Type(storage.buffer)).toMatchObject({
      byteOffset: 0,
      byteLength: storage.buffer.byteLength,
    });

    expect(new Type(storage.buffer, 1)).toMatchObject({
      byteOffset: 1,
      byteLength: storage.buffer.byteLength - 1,
    });

    expect(new Type(storage.buffer, 1, 1)).toMatchObject({
      byteOffset: 1,
      byteLength: 1,
    });
  });

  it('should throw TypeError on invalid call', () => {
    const Type = struct() as any;

    expect(() => Type()).toThrow(TypeError);
    expect(() => Type(null)).toThrow(TypeError);
    expect(() => Type(1, 2, 3)).toThrow(TypeError);
  });
});
