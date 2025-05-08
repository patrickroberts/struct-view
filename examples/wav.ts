import { char, struct, uint16, uint32, uint8, union } from '..';

const ChunkHeader = struct(
  char(4)('chunkId'),
  uint32('chunkSize'),
);

const SubChunk1 = struct(
  ChunkHeader,
  uint16('audioFormat'),
  uint16('numChannels'),
  uint32('sampleRate'),
  uint32('byteRate'),
  uint16('blockAlign'),
  uint16('bitsPerSample'),
);

const WavHeader = struct(
  ChunkHeader,
  char(4)('format'),
  SubChunk1('subChunk1'),
  ChunkHeader('subChunk2'),
);

const WavBytes = uint8(WavHeader.BYTES_PER_INSTANCE);

const WavView = union(
  WavHeader('header'),
  WavBytes('bytes'),
);

const view = new WavView();
const { header, bytes } = view;
const { subChunk1, subChunk2 } = header;

header.chunkId = 'RIFF';
header.chunkSize = header.byteLength - ChunkHeader.BYTES_PER_INSTANCE;
header.format = 'WAVE';

subChunk1.chunkId = 'fmt ';
subChunk1.chunkSize = subChunk1.byteLength - ChunkHeader.BYTES_PER_INSTANCE;
subChunk1.audioFormat = 1;
subChunk1.numChannels = 1;
subChunk1.sampleRate = 44100;
subChunk1.byteRate = 88200;
subChunk1.blockAlign = 2;
subChunk1.bitsPerSample = 16;

subChunk2.chunkId = 'data';

process.stdout.write(bytes);
