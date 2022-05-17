import { struct, char } from '..';

describe('char', () => {
  it('should define a byte string', () => {
    const Header = struct(
      char('id'),
    );
    const bytes = Buffer.from('x');
    const header = Header.from(bytes);

    expect(Header.BYTES_PER_INSTANCE).toBe(1);
    expect(header.id).toBe('x');

    header.id = 'y';

    expect(bytes.toString()).toBe('y');
  });

  it('should define a multi-byte string', () => {
    const ChunkHeader = struct(
      char(4)('chunkId'),
    );
    const bytes = Buffer.from('RIFF');
    const chunkHeader = ChunkHeader.from(bytes);

    expect(ChunkHeader.BYTES_PER_INSTANCE).toBe(4);
    expect(chunkHeader.chunkId).toBe('RIFF');

    chunkHeader.chunkId = 'WAVE';

    expect(bytes.toString()).toBe('WAVE');
  });

  it('should throw TypeError on invalid factory call', () => {
    expect(() => (char as any)()).toThrow(TypeError);
  });
});
