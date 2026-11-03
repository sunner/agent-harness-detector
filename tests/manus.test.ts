import { expect, test } from 'vitest';
import { AGENT_IDS, detect } from '../src/index.js';
test('Manus execution marker and boundaries', () => {
  expect(AGENT_IDS).toContain('manus');
  for (const env of [
    { MANUS_ADDON_RUNTIME_SPEC_PATH: '1' },
    { MANUS_ADDON_RUNTIME_SPEC_PATH: '0' },
    { MANUS_ADDON_RUNTIME_SPEC_PATH: 'false' },
    { MANUS_ADDON_RUNTIME_SPEC_PATH: ' ' },
    { MANUS_ADDON_RUNTIME_SPECS_REVISION: '1' },
    { MANUS_ADDON_RUNTIME_SPECS_REVISION: '0' },
    { MANUS_ADDON_RUNTIME_SPECS_REVISION: 'false' },
    { MANUS_ADDON_RUNTIME_SPECS_REVISION: ' ' },
  ])
    expect(detect({ env, processTree: false })).toBe('manus');
  for (const env of [
    {},
    {},
    { MANUS_ADDON_RUNTIME_SPEC_PATH: '' },
    {},
    { MANUS_ADDON_RUNTIME_SPECS_REVISION: '' },
  ])
    expect(detect({ env, processTree: false })).not.toBe('manus');
});
