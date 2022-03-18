export default class StructView<T = {}> extends DataView {
  static BYTES_PER_INSTANCE = 0;

  constructor(
    buffer = new ArrayBuffer(new.target.BYTES_PER_INSTANCE),
    byteOffset = 0,
    byteLength = buffer.byteLength - byteOffset,
  ) {
    super(buffer, byteOffset, byteLength);
  }

  // eslint-disable-next-line class-methods-use-this
  toJSON(): T {
    return {} as T;
  }
}
