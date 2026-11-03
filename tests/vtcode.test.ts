import { expect, test } from 'vitest';
import { AGENT_IDS, detect } from '../src/index.js';
test('VT Code execution marker and boundaries', () => {
  expect(AGENT_IDS).toContain('vtcode');
  for (const env of [{ VTCODE: '1' }, { VTCODE: '0' }, { VTCODE: 'false' }, { VTCODE: ' ' }])
    expect(detect({ env, processTree: false })).toBe('vtcode');
  for (const env of [{}, {}, { VTCODE: '' }])
    expect(detect({ env, processTree: false })).not.toBe('vtcode');
});
