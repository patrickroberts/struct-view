import { endianness } from 'os';
import type { ArithmeticFactory } from '..';
import { struct, float32, float32be, float32le, float64, float64be, float64le, int8, int16, int16be, int16le, int32, int32be, int32le, int64, int64be, int64le, uint8, uint16, uint16be, uint16le, uint32, uint32be, uint32le, uint64, uint64be, uint64le } from '..';

const nativeEndian = endianness() === 'LE';

describe('arithmetic', () => {
  it.each([
    [float32, float32be, float32le],
    [float64, float64be, float64le],
    [int16, int16be, int16le],
    [int32, int32be, int32le],
    [int64, int64be, int64le],
    [uint16, uint16be, uint16le],
    [uint32, uint32be, uint32le],
    [uint64, uint64be, uint64le],
  ])('should define little endian as the default byte ordering', (defaultType, bigEndianType, littleEndianType) => {
    expect(littleEndianType).toBe(defaultType);
    expect(bigEndianType).not.toBe(defaultType);
  });

  const cases = [
    [float32be, 'getFloat32', false, 4],
    [float64be, 'getFloat64', false, 8],
    [int8, 'getInt8', undefined, 1],
    [int16be, 'getInt16', false, 2],
    [int32be, 'getInt32', false, 4],
    [int64be, 'getBigInt64', false, 8],
    [uint8, 'getUint8', undefined, 1],
    [uint16be, 'getUint16', false, 2],
    [uint32be, 'getUint32', false, 4],
    [uint64be, 'getBigUint64', false, 8],
    [float32le, 'getFloat32', true, 4],
    [float64le, 'getFloat64', true, 8],
    [int16le, 'getInt16', true, 2],
    [int32le, 'getInt32', true, 4],
    [int64le, 'getBigInt64', true, 8],
    [uint16le, 'getUint16', true, 2],
    [uint32le, 'getUint32', true, 4],
    [uint64le, 'getBigUint64', true, 8],
  ] as const;
  const nativeCases = cases.filter((row) => row[2] === nativeEndian);
  const nonNativeCases = cases.filter((row) => row[2] !== nativeEndian);

  type Types = typeof cases[number][0] extends ArithmeticFactory<infer T> ? T : never;

  it.each(cases)('should read bytes of scalar property', (scalar: ArithmeticFactory<Types>, get, littleEndian, byteLength) => {
    const ScalarView = struct(
      scalar('value'),
    );
    const bytes = new Uint8Array([0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef]);
    const scalarView = ScalarView.from(bytes);
    const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

    expect(ScalarView.BYTES_PER_INSTANCE).toBe(byteLength);
    expect(scalarView.value).toBe(dataView[get](0, littleEndian));
  });

  it.each(cases)('should write bytes of scalar property', (scalar: ArithmeticFactory<Types>, get, littleEndian) => {
    const ScalarView = struct(
      scalar('value'),
    );
    const bytes = new Uint8Array(8);
    const scalarView = ScalarView.from(bytes);
    const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const expected = dataView[get](0, littleEndian).constructor(42);

    scalarView.value = expected;

    expect(dataView[get](0, littleEndian)).toBe(expected);
  });

  it.each(nativeCases)('should read bytes of array property', (array: ArithmeticFactory<Types>, get, _, byteLength) => {
    const ArrayView = struct(
      array(2)('value'),
    );
    const bytes = new Uint8Array([
      0x10, 0x32, 0x54, 0x76, 0x98, 0xba, 0xdc, 0xfe,
      0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef,
    ]);
    const arrayView = ArrayView.from(bytes);
    const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

    expect(ArrayView.BYTES_PER_INSTANCE).toBe(2 * byteLength);
    expect(arrayView.value[1]).toBe(dataView[get](arrayView.value.BYTES_PER_ELEMENT, nativeEndian));
  });

  it.each(nativeCases)('should write bytes of array property', (array: ArithmeticFactory<Types>, get, _, byteLength) => {
    const ArrayView = struct(
      array(2)('value'),
    );
    const bytes = new Uint8Array(16);
    const arrayView = ArrayView.from(bytes);
    const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const typedArray = arrayView.value as any;
    const TypedArray = typedArray.constructor;
    const Primitive = typedArray[0].constructor;
    const expected = Primitive(42);

    arrayView.value = new TypedArray([Primitive(0), expected]);

    expect(dataView[get](byteLength, nativeEndian)).toBe(expected);
  });

  it.each(nonNativeCases)('should throw TypeError on unsupported array endianness', (array: ArithmeticFactory<Types>) => {
    expect(() => array(2)).toThrow(TypeError);
  });

  it.each(cases)('should throw TypeError on invalid factory call', (factory: any) => {
    expect(() => factory()).toThrow(TypeError);
  });
});
