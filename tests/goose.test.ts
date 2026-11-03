import { expect, test } from 'vitest';
import { detect } from '../src/index.js';
test('Goose execution marker and boundaries', () => {
  for (const env of [
    { GOOSE_TERMINAL: '1' },
    { GOOSE_TERMINAL: '0' },
    { GOOSE_TERMINAL: 'false' },
    { GOOSE_TERMINAL: ' ' },
  ])
    expect(detect({ env, processTree: false })).toBe('goose');
  for (const env of [{}, {}, { GOOSE_TERMINAL: '' }])
    expect(detect({ env, processTree: false })).not.toBe('goose');
});
