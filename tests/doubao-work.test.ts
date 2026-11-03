import { expect, test } from 'vitest';
import { AGENT_IDS, detect } from '../src/index.js';
test('Doubao Work execution marker and boundaries', () => {
  expect(AGENT_IDS).toContain('doubao-work');
  for (const env of [
    { DOUBAO_OFFICE_AGENT_NAME: '1' },
    { DOUBAO_OFFICE_AGENT_NAME: '0' },
    { DOUBAO_OFFICE_AGENT_NAME: 'false' },
    { DOUBAO_OFFICE_AGENT_NAME: ' ' },
  ])
    expect(detect({ env, processTree: false })).toBe('doubao-work');
  for (const env of [{}, {}, { DOUBAO_OFFICE_AGENT_NAME: '' }])
    expect(detect({ env, processTree: false })).not.toBe('doubao-work');
});
