import { expect, test } from 'vitest';
import { AGENT_IDS, detect } from '../src/index.js';
test('Lingguang execution marker and boundaries', () => {
  expect(AGENT_IDS).toContain('lingguang');
  for (const env of [
    { EXEC_FROM: '1' },
    { EXEC_FROM: '0' },
    { EXEC_FROM: 'false' },
    { EXEC_FROM: ' ' },
  ])
    expect(detect({ env, processTree: false })).toBe('lingguang');
  for (const env of [{}, {}, { EXEC_FROM: '' }])
    expect(detect({ env, processTree: false })).not.toBe('lingguang');
  expect(detect({ env: { EXEC_FROM: '1', CLAUDECODE: '1' }, processTree: false })).toBe(
    'claudecode',
  );
});
