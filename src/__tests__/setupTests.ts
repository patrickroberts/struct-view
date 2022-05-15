import { TextDecoder, TextEncoder } from 'util';

globalThis.TextDecoder = TextDecoder as any;
globalThis.TextEncoder = TextEncoder;
