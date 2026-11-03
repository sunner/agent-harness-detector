import { expect, test } from 'vitest';
import { detect } from '../src/index.js';
test('Augment CLI execution marker and boundaries', () => {
  for (const env of [
    { AUGMENT_AGENT: '1' },
    { AUGMENT_AGENT: '0' },
    { AUGMENT_AGENT: 'false' },
    { AUGMENT_AGENT: ' ' },
  ])
    expect(detect({ env, processTree: false })).toBe('augment-cli');
  for (const env of [{}, {}, { AUGMENT_AGENT: '' }])
    expect(detect({ env, processTree: false })).not.toBe('augment-cli');
});
