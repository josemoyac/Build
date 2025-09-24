import { describe, expect, it } from 'vitest';
import { parseBc3, serializeBc3 } from '../src/index.js';

const SAMPLE = `H|REF001|EUR\nC|01|Capítulo 1\nD|01.01|Excavación|m3|10|12.5\nM|Zanja 1|5\nM|Zanja 2|5`;

describe('BC3 parser', () => {
  it('parses chapters and items', () => {
    const snapshot = parseBc3(SAMPLE);
    expect(snapshot.chapters).toHaveLength(1);
    expect(snapshot.chapters[0]?.items).toHaveLength(1);
    expect(snapshot.chapters[0]?.items[0]?.measurements).toHaveLength(2);
  });

  it('round-trips serialize -> parse', () => {
    const parsed = parseBc3(SAMPLE);
    const serialized = serializeBc3(parsed);
    const reparsed = parseBc3(serialized);
    expect(reparsed).toEqual(parsed);
  });
});
