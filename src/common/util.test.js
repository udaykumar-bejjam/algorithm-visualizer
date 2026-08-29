import { describe, it, expect } from 'vitest';
import {
  chunkCommands,
  classes,
  createSeededRandom,
  extension,
  isSaved,
  refineGist,
  validateCommands,
} from './util';

describe('classes', () => {
  it('joins truthy class names', () => {
    expect(classes('a', null, 'b', undefined, false, 'c')).toBe('a b c');
  });
});

describe('extension', () => {
  it('returns the file extension', () => {
    expect(extension('code.js')).toBe('js');
    expect(extension('README.md')).toBe('md');
  });
});

describe('isSaved', () => {
  it('detects unchanged titles and file contents', () => {
    const files = [{ name: 'a.js', content: '1' }];
    expect(isSaved({
      titles: ['Scratch Paper', 'Untitled'],
      files,
      lastTitles: ['Scratch Paper', 'Untitled'],
      lastFiles: files,
    })).toBe(true);
  });

  it('detects dirty content', () => {
    expect(isSaved({
      titles: ['Scratch Paper', 'Untitled'],
      files: [{ name: 'a.js', content: '2' }],
      lastTitles: ['Scratch Paper', 'Untitled'],
      lastFiles: [{ name: 'a.js', content: '1' }],
    })).toBe(false);
  });
});

describe('refineGist', () => {
  it('strips the algorithm-visualizer marker and maps files', () => {
    const refined = refineGist({
      id: 'abc',
      description: 'My viz',
      owner: { login: 'alice', avatar_url: 'https://example.com/a.png' },
      files: {
        'algorithm-visualizer': { filename: 'algorithm-visualizer', content: 'marker' },
        'code.js': { filename: 'code.js', content: 'console.log(1)' },
      },
    });
    expect(refined).toEqual({
      login: 'alice',
      gistId: 'abc',
      title: 'My viz',
      files: [{
        name: 'code.js',
        content: 'console.log(1)',
        contributors: [{ login: 'alice', avatar_url: 'https://example.com/a.png' }],
      }],
    });
  });
});

describe('chunkCommands', () => {
  it('splits commands on delay boundaries', () => {
    const chunks = chunkCommands([
      { key: 'a', method: 'set', args: [[1]] },
      { key: null, method: 'delay', args: [10] },
      { key: 'a', method: 'select', args: [0] },
      { key: null, method: 'delay', args: [20] },
    ]);
    expect(chunks).toHaveLength(3);
    expect(chunks[0]).toEqual({
      commands: [{ key: 'a', method: 'set', args: [[1]] }],
      lineNumber: 10,
    });
    expect(chunks[1]).toEqual({
      commands: [{ key: 'a', method: 'select', args: [0] }],
      lineNumber: 20,
    });
    expect(chunks[2]).toEqual({
      commands: [],
      lineNumber: undefined,
    });
  });

  it('does not mutate the input array', () => {
    const commands = [{ key: 'a', method: 'set', args: [] }];
    chunkCommands(commands);
    expect(commands).toHaveLength(1);
  });
});

describe('createSeededRandom', () => {
  it('produces a deterministic sequence for the same seed', () => {
    const a = createSeededRandom(42);
    const b = createSeededRandom(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it('produces different sequences for different seeds', () => {
    const a = createSeededRandom(1);
    const b = createSeededRandom(2);
    expect(a()).not.toBe(b());
  });
});

describe('validateCommands', () => {
  it('accepts a valid command list', () => {
    const commands = [{ key: 'a', method: 'Array1DTracer', args: ['A'] }];
    expect(validateCommands(commands)).toBe(commands);
  });

  it('rejects non-arrays and malformed commands', () => {
    expect(() => validateCommands(null)).toThrow(/array/i);
    expect(() => validateCommands([{ method: 'set' }])).toThrow(/args/i);
  });
});
