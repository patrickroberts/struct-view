# struct-view

[![build](https://badgen.net/github/checks/patrickroberts/struct-view?icon=github&label=build)](https://github.com/patrickroberts/struct-view/actions)
[![coverage](https://badgen.net/codecov/c/github/patrickroberts/struct-view?icon=codecov&label=coverage)](https://codecov.io/gh/patrickroberts/struct-view)
[![license](https://badgen.net/github/license/patrickroberts/struct-view)](https://github.com/patrickroberts/struct-view/blob/main/LICENSE)

## Simple DSL for defining binary structures in JavaScript

### Why struct-view?

This library enables developers to define and use packed binary structures in JavaScript without any external dependencies. It is not intended for ABI-compliance or for use with foreign function interfaces.

### Example Usage

Writing a WAV header:
```ts
// wav.ts
import { char, struct, uint16, uint32, uint8, union } from 'struct-view';

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
```

Output:
```
npx ts-node examples/wav | xxd
00000000: 5249 4646 2400 0000 5741 5645 666d 7420  RIFF$...WAVEfmt 
00000010: 1000 0000 0100 0100 44ac 0000 8858 0100  ........D....X..
00000020: 0200 1000 6461 7461 0000 0000            ....data....
```

### Documentation

API Reference available on [GitHub Pages](https://patrickroberts.github.io/struct-view)

### Code Coverage

Available on [Codecov](https://codecov.io/gh/patrickroberts/struct-view)

### Todo

* Bitfield Support
