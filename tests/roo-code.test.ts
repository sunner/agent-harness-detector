import { expect, test } from 'vitest';
import { detect } from '../src/index.js';
test('Roo Code execution marker and boundaries', () => {
  for (const env of [
    { ROO_ACTIVE: '1' },
    { ROO_ACTIVE: '0' },
    { ROO_ACTIVE: 'false' },
    { ROO_ACTIVE: ' ' },
    { ROO_CLI_RUNTIME: '1' },
    { ROO_CLI_RUNTIME: '0' },
    { ROO_CLI_RUNTIME: 'false' },
    { ROO_CLI_RUNTIME: ' ' },
  ])
    expect(detect({ env, processTree: false })).toBe('roo-code');
  for (const env of [{}, {}, { ROO_ACTIVE: '' }, {}, { ROO_CLI_RUNTIME: '' }])
    expect(detect({ env, processTree: false })).not.toBe('roo-code');
});
