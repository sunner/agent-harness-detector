import { expect, test } from 'vitest';
import { detect } from '../src/index.js';
test('Crush execution marker and boundaries', () => {
  for (const env of [{ CRUSH: '1' }, { CRUSH: '0' }, { CRUSH: 'false' }, { CRUSH: ' ' }])
    expect(detect({ env, processTree: false })).toBe('crush');
  for (const env of [{}, {}, { CRUSH: '' }])
    expect(detect({ env, processTree: false })).not.toBe('crush');
});
