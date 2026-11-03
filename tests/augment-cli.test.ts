import { expect, test } from 'vitest';
import { AGENT_IDS, detect } from '../src/index.js';
test('Augment CLI execution marker and boundaries', () => {
  expect(AGENT_IDS).toContain('augment-cli');
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
