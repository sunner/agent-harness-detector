import { expect, test } from 'vitest';
import { AGENT_IDS, detect } from '../src/index.js';
test('DeepSeek shell context and boundaries', () => {
  expect(AGENT_IDS).toContain('deepseek-harness');
  for (const v of ['1', '0', 'false', ' '])
    expect(detect({ env: { DSH_SHELL: v }, processTree: false })).toBe('deepseek-harness');
  for (const env of [{}, { DSH_SHELL: '' }, { DSH_HOME: 'synthetic' }])
    expect(detect({ env, processTree: false })).toBeNull();
  expect(detect({ env: { DSH_SHELL: '1', CLAUDECODE: '1' }, processTree: false })).toBe(
    'claudecode',
  );
});
