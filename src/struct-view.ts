const bufferSym = Symbol('buffer');
const byteOffsetSym = Symbol('byteOffset');
const byteLengthSym = Symbol('byteLength');

export default class StructView<T = {}> {
  static BYTES_PER_INSTANCE = 0;

  /** @internal */
  private [bufferSym]: ArrayBuffer;

  /** @internal */
  private [byteOffsetSym]: number;

  /** @internal */
  private [byteLengthSym]: number;

  constructor(
    // @ts-expect-error 'this' cannot be referenced in constructor arguments.
    buffer = new ArrayBuffer(this.constructor.BYTES_PER_INSTANCE),
    byteOffset = 0,
    byteLength = buffer.byteLength - byteOffset,
  ) {
    this[bufferSym] = buffer;
    this[byteOffsetSym] = byteOffset;
    this[byteLengthSym] = byteLength;
  }

  get buffer(): ArrayBuffer {
    return this[bufferSym];
  }

  get byteOffset(): number {
    return this[byteOffsetSym];
  }

  get byteLength(): number {
    return this[byteLengthSym];
  }

  // eslint-disable-next-line class-methods-use-this
  toJSON(): T {
    return {} as T;
  }
}
