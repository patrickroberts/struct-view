import { endianness } from 'os';
import type { ArithmeticFactory } from '..';
import { struct, float32, float32be, float32le, float64, float64be, float64le, int8, int16, int16be, int16le, int32, int32be, int32le, int64, int64be, int64le, uint8, uint16, uint16be, uint16le, uint32, uint32be, uint32le, uint64, uint64be, uint64le } from '..';

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
    [float32be, 'getFloat32', false],
    [float64be, 'getFloat64', false],
    [int8, 'getInt8', undefined],
    [int16be, 'getInt16', false],
    [int32be, 'getInt32', false],
    [int64be, 'getBigInt64', false],
    [uint8, 'getUint8', undefined],
    [uint16be, 'getUint16', false],
    [uint32be, 'getUint32', false],
    [uint64be, 'getBigUint64', false],
    [float32le, 'getFloat32', true],
    [float64le, 'getFloat64', true],
    [int16le, 'getInt16', true],
    [int32le, 'getInt32', true],
    [int64le, 'getBigInt64', true],
    [uint16le, 'getUint16', true],
    [uint32le, 'getUint32', true],
    [uint64le, 'getBigUint64', true],
  ] as const;

  type Types = typeof cases[number][0] extends ArithmeticFactory<infer T> ? T : never;

  it.each(cases)('should read bytes of scalar property', (scalar: ArithmeticFactory<Types>, get, littleEndian) => {
    const ScalarView = struct(
      scalar('value'),
    );
    const bytes = new Uint8Array([0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef]);
    const scalarView = new ScalarView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

    expect(scalarView.value).toBe(dataView[get](0, littleEndian));
  });

  it.each(cases)('should write bytes of scalar property', (scalar: ArithmeticFactory<Types>, get, littleEndian) => {
    const ScalarView = struct(
      scalar('value'),
    );
    const bytes = new Uint8Array(8);
    const scalarView = new ScalarView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const expected = dataView[get](0, littleEndian).constructor(42);

    scalarView.value = expected;

    expect(dataView[get](0, littleEndian)).toBe(expected);
  });

  it.each(cases)('should read bytes of array property', (array: ArithmeticFactory<Types>, get) => {
    const ArrayView = struct(
      array(2)('value'),
    );
    const bytes = new Uint8Array([
      0x10, 0x32, 0x54, 0x76, 0x98, 0xba, 0xdc, 0xfe,
      0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef,
    ]);
    const arrayView = new ArrayView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

    expect(arrayView.value[1]).toBe(dataView[get](arrayView.value.BYTES_PER_ELEMENT, endianness() === 'LE'));
  });

  it.each(cases)('should throw TypeError on invalid factory call', (factory: any) => {
    expect(() => factory()).toThrowError(new TypeError('The first argument must be of type string or number. Received undefined'));
  });
});
