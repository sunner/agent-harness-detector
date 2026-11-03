import { expect, test } from 'vitest';
import { detect } from '../src/index.js';
test('Qwen Code execution marker and boundaries', () => {
  for (const env of [
    { QWEN_CODE: '1' },
    { QWEN_CODE: '0' },
    { QWEN_CODE: 'false' },
    { QWEN_CODE: ' ' },
  ])
    expect(detect({ env, processTree: false })).toBe('qwen-code');
  for (const env of [{}, {}, { QWEN_CODE: '' }])
    expect(detect({ env, processTree: false })).not.toBe('qwen-code');
});
