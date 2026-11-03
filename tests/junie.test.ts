import { expect, test } from 'vitest';
import { detect } from '../src/index.js';
test('Junie execution marker and boundaries', () => {
  for (const env of [
    { JUNIE_SHIM_PATH: '1' },
    { JUNIE_SHIM_PATH: '0' },
    { JUNIE_SHIM_PATH: 'false' },
    { JUNIE_SHIM_PATH: ' ' },
  ])
    expect(detect({ env, processTree: false })).toBe('junie');
  for (const env of [{}, {}, { JUNIE_SHIM_PATH: '' }, { JUNIE_DATA: 'synthetic' }])
    expect(detect({ env, processTree: false })).not.toBe('junie');
});
