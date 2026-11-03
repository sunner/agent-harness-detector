import { expect, test } from 'vitest';
import { detect } from '../src/index.js';
test('Kimi Code execution marker and boundaries', () => {
  for (const env of [
    { KIMI_PLUGIN_ROOT: '1' },
    { KIMI_PLUGIN_ROOT: '0' },
    { KIMI_PLUGIN_ROOT: 'false' },
    { KIMI_PLUGIN_ROOT: ' ' },
  ])
    expect(detect({ env, processTree: false })).toBe('kimi');
  for (const env of [{}, {}, { KIMI_PLUGIN_ROOT: '' }, { KIMI_CODE_HOME: 'synthetic' }])
    expect(detect({ env, processTree: false })).not.toBe('kimi');
});
