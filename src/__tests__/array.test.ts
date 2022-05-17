import { struct, uint8 } from '..';

describe('array', () => {
  const Inner = struct(
    uint8('byte'),
  );

  const Outer = struct(
    Inner(4)('array'),
  );

  const bytes = new Uint8Array([0x01, 0x23, 0x45, 0x67]);
  const outer = Outer.from(bytes);
  const { array } = outer;

  it('should define an array of structs', () => {
    expect(Outer.BYTES_PER_INSTANCE).toBe(4);
    expect(outer.byteLength).toBe(4);
    expect(array).toBeInstanceOf(Array);
    expect(array).toHaveLength(4);
    expect(array[0]).toBeInstanceOf(Inner);
  });

  it('should be frozen', () => {
    expect(Object.isFrozen(array)).toBe(true);
  });

  it('should be readonly', () => {
    expect(() => {
      (outer.array as any) = [];
    }).toThrow(new TypeError('Cannot set property array which has only a getter'));
  });

  it('should read bytes at correct offsets', () => {
    expect(array[0].byte).toBe(0x01);
    expect(array[1].byte).toBe(0x23);
    expect(array[2].byte).toBe(0x45);
    expect(array[3].byte).toBe(0x67);
  });

  it('should set bytes at correct offsets', () => {
    array[0].byte = 0x89;
    array[1].byte = 0xab;
    array[2].byte = 0xcd;
    array[3].byte = 0xef;

    expect([...bytes]).toEqual([0x89, 0xab, 0xcd, 0xef]);
  });
});
