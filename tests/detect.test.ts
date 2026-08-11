import { describe, expect, it } from 'vitest';
import { AGENT_IDS, detect, detectAll, isKnownAgent } from '../src/index.js';
import { parsePsOutput, walkProcessTree } from '../src/process.js';

/** Env-only detection: disables process-tree for deterministic unit tests. */
function d(env: Record<string, string | undefined>) {
  return detect({ env, processTree: false });
}

describe('detect (environment signals)', () => {
  it('detects workbuddy via CLIENT_INFO_*', () => {
    expect(d({ CLIENT_INFO_PLATFORM: 'WorkBuddy' })).toBe('workbuddy');
  });

  it('detects workbuddy via CODEBUDDY_HOST prefix', () => {
    expect(d({ CODEBUDDY_HOST: 'workbuddy.local' })).toBe('workbuddy');
  });

  it('detects kimiwork via KIMI_SKILLS_ROOT', () => {
    expect(d({ KIMI_SKILLS_ROOT: '/x' })).toBe('kimiwork');
  });

  it('detects kimiwork via KIMI_AGENT_GW_KEY', () => {
    expect(d({ KIMI_AGENT_GW_KEY: 'x' })).toBe('kimiwork');
  });

  it('detects kimiclaw via KIMI_PLUGIN_API_KEY', () => {
    expect(d({ KIMI_PLUGIN_API_KEY: 'x' })).toBe('kimiclaw');
  });

  it('detects kimiclaw via KIMI_CLAW_STATE_DIR', () => {
    expect(d({ KIMI_CLAW_STATE_DIR: '/state' })).toBe('kimiclaw');
  });

  it('detects hermes via presence-only signal', () => {
    expect(d({ HERMES_SESSION_ID: 'anything' })).toBe('hermes');
  });

  it('detects wukong via WUKONG_BIZ_ID', () => {
    expect(d({ WUKONG_BIZ_ID: '1' })).toBe('wukong');
  });

  it('detects arkclawcloud via ARK_MODEL_ID', () => {
    expect(d({ ARK_MODEL_ID: 'x' })).toBe('arkclawcloud');
  });

  it('detects qclaw via QCLAW_DEVICE_ID', () => {
    expect(d({ QCLAW_DEVICE_ID: 'dev' })).toBe('qclaw');
  });

  it('detects claudecode via CLAUDECODE=1', () => {
    expect(d({ CLAUDECODE: '1' })).toBe('claudecode');
  });

  it('detects claudecode via AI_AGENT substring', () => {
    expect(d({ AI_AGENT: 'claude-code' })).toBe('claudecode');
  });

  it('detects codex via AI_AGENT substring', () => {
    expect(d({ AI_AGENT: 'codex' })).toBe('codex');
  });

  it('detects qwenwork via QODER_WORK_INTEGRATION_PRODUCT', () => {
    expect(d({ QODER_WORK_INTEGRATION_PRODUCT: 'qwenworkcn' })).toBe('qwenwork');
  });

  it('detects qwenwork via bundle id', () => {
    expect(d({ __CFBundleIdentifier: 'xx.qwenwork.xx' })).toBe('qwenwork');
  });

  it('detects qoderwork via QODERCLI_INTEGRATION_MODE', () => {
    expect(d({ QODERCLI_INTEGRATION_MODE: 'qoder_work' })).toBe('qoderwork');
  });

  it('detects qodercloud via QODER_RUNNING_ENV', () => {
    expect(d({ QODER_RUNNING_ENV: 'cloud' })).toBe('qodercloud');
  });

  it('detects qoder via QODER_AGENT=true', () => {
    expect(d({ QODER_AGENT: 'true' })).toBe('qoder');
  });

  it('detects minimax via NEXT_PUBLIC_DOMAIN_URL', () => {
    expect(d({ NEXT_PUBLIC_DOMAIN_URL: 'https://minimaxi.com' })).toBe('minimax');
  });

  it('detects minimax via MAVIS_AGENT', () => {
    expect(d({ MAVIS_AGENT: 'mavis' })).toBe('minimax');
  });

  it('detects doubao via bundle id', () => {
    expect(d({ __CFBundleIdentifier: 'com.bot.pc.doubao' })).toBe('doubao');
  });

  it('detects doubaocloud via DOUBAO_OFFICE_APP_ID', () => {
    expect(d({ DOUBAO_OFFICE_APP_ID: '1' })).toBe('doubaocloud');
  });

  it('detects doubaocloud via SKILLS_DOWNLOAD_URL', () => {
    expect(d({ SKILLS_DOWNLOAD_URL: 'https://xx.doubaocdn.com/x.zip' })).toBe('doubaocloud');
  });

  it('detects easyclaw via EASYCLAW_REGION', () => {
    expect(d({ EASYCLAW_REGION: 'cn' })).toBe('easyclaw');
  });

  it('detects easyclaw via OPENCLAW_HOME suffix', () => {
    expect(d({ OPENCLAW_HOME: '/opt/easyclaw' })).toBe('easyclaw');
  });

  it('detects maxclawcloud via HOSTNAME + AGENT_TYPE', () => {
    expect(d({ HOSTNAME: 'maxclaw-1', AGENT_TYPE: 'claw' })).toBe('maxclawcloud');
  });

  it('does not match maxclawcloud when AGENT_TYPE is missing', () => {
    expect(d({ HOSTNAME: 'maxclaw-1' })).toBeNull();
  });

  it('detects openclaw via OPENCLAW_CLI=1', () => {
    expect(d({ OPENCLAW_CLI: '1' })).toBe('openclaw');
  });

  it('detects openclaw via OPENCLAW_SERVICE_MARKER', () => {
    expect(d({ OPENCLAW_SERVICE_MARKER: 'openclaw' })).toBe('openclaw');
  });

  it('detects qwencowork via QWEN_AGENT_BUN', () => {
    expect(d({ QWEN_AGENT_BUN: '/bun' })).toBe('qwencowork');
  });

  it('detects qwencowork via bundle id', () => {
    expect(d({ __CFBundleIdentifier: 'com.alibaba.tongyi.qwen' })).toBe('qwencowork');
  });

  it('detects antigravity via ANTIGRAVITY_AGENT=1', () => {
    expect(d({ ANTIGRAVITY_AGENT: '1' })).toBe('antigravity');
  });

  it('detects bolt via BOLT_SERVER_URL', () => {
    expect(d({ BOLT_SERVER_URL: 'https://x' })).toBe('bolt');
  });

  it('detects cline via CLINE_WRAPPER_PATH', () => {
    expect(d({ CLINE_WRAPPER_PATH: '/usr/local/bin' })).toBe('cline');
  });

  it('detects copilot via COPILOT_AGENT_SESSION_ID', () => {
    expect(d({ COPILOT_AGENT_SESSION_ID: 'abc' })).toBe('copilot');
  });

  it('detects copilot via COPILOT_RUN_APP=1', () => {
    expect(d({ COPILOT_RUN_APP: '1' })).toBe('copilot');
  });

  it('detects cursor via CURSOR_AGENT=1', () => {
    expect(d({ CURSOR_AGENT: '1' })).toBe('cursor');
  });

  it('detects cursor via CURSOR_CONVERSATION_ID', () => {
    expect(d({ CURSOR_CONVERSATION_ID: 'conv-1' })).toBe('cursor');
  });

  it('never detects devin via env signals', () => {
    expect(d({ DEVIN: '1' })).toBeNull();
  });

  it('detects gemini via GEMINI_CLI=1', () => {
    expect(d({ GEMINI_CLI: '1' })).toBe('gemini');
  });

  it('detects kiro via KIRO_SESSION_ID', () => {
    expect(d({ KIRO_SESSION_ID: 's' })).toBe('kiro');
  });

  it('detects kilocode via KILO_RUN_ID', () => {
    expect(d({ KILO_RUN_ID: 'run-1' })).toBe('kilocode');
  });

  it('detects opencode via OPENCODE=1', () => {
    expect(d({ OPENCODE: '1' })).toBe('opencode');
  });

  it('detects pi via PI_CODING_AGENT=true', () => {
    expect(d({ PI_CODING_AGENT: 'true' })).toBe('pi');
  });

  it('does not match pi on a different value', () => {
    expect(d({ PI_CODING_AGENT: 'false' })).toBeNull();
  });

  it('detects replit via REPLIT_SESSION', () => {
    expect(d({ REPLIT_SESSION: 'abc' })).toBe('replit');
  });

  it('detects rork via RORK_API_URL', () => {
    expect(d({ RORK_API_URL: 'https://x' })).toBe('rork');
  });

  it('prefers qoderwork over qoder when both signals present', () => {
    expect(d({ QODERCLI_INTEGRATION_MODE: 'qoder_work' })).toBe('qoderwork');
  });

  it('respects priority order: workbuddy wins even with codex env set', () => {
    expect(d({ CLIENT_INFO_PLATFORM: 'WorkBuddy', CODEX_ENV: '1' })).toBe('workbuddy');
  });

  it('returns null when nothing matches', () => {
    expect(d({ FOO: 'bar' })).toBeNull();
  });
});

describe('detectAll (multiple matches)', () => {
  it('returns an empty list when nothing matches', () => {
    expect(detectAll({ env: { FOO: 'bar' }, processTree: false })).toEqual([]);
  });

  it('returns all env matches in priority order', () => {
    expect(
      detectAll({
        env: { HERMES_SESSION_ID: '1', CODEX_ENV: '1', RORK_API_URL: 'x' },
        processTree: false,
      }),
    ).toEqual(['hermes', 'codex', 'rork']);
  });

  it('combines env and process-tree matches, deduped and priority-ordered', () => {
    // cursor (priority 25) via env, opencode (priority 30) via process tree.
    const table = parsePsOutput('  100     1 node\n  200   100 opencode\n');
    expect(detectAll({ env: { CURSOR_AGENT: '1' }, pid: 200, processTable: table })).toEqual([
      'cursor',
      'opencode',
    ]);
  });

  it('detect() returns the highest-priority match across strategies', () => {
    // env matches opencode (30), process tree matches cursor (25) → cursor wins.
    const table = parsePsOutput('  100     1 node\n  200   100 cursor\n');
    expect(detect({ env: { OPENCODE: '1' }, pid: 200, processTable: table })).toBe('cursor');
  });

  it('detects devin via process-tree pattern', () => {
    const table = parsePsOutput('  100     1 node\n  200   100 devin\n');
    expect(detect({ env: {}, pid: 200, processTable: table })).toBe('devin');
  });

  it('honors processTree:false (no process matching)', () => {
    const table = parsePsOutput('  100     1 node\n  200   100 cursor\n');
    expect(detectAll({ env: {}, pid: 200, processTable: table, processTree: false })).toEqual([]);
  });

  it('falls back to process.env and process.cwd() by default', () => {
    const result = detect();
    expect(result === null || isKnownAgent(result)).toBe(true);
  });
});

describe('process tree helpers', () => {
  const psFixture = ['  100     1 node', '  200   100 opencode', '  300   200 npm'].join('\n');

  it('parsePsOutput builds a pid map', () => {
    const table = parsePsOutput(psFixture);
    expect(table.size).toBe(3);
    expect(table.get(200)).toEqual({ pid: 200, ppid: 100, command: 'opencode' });
    expect(table.has(999)).toBe(false);
  });

  it('parsePsOutput skips header/blank/malformed lines', () => {
    const table = parsePsOutput('  PID  PPID  COMM\n\n  100   1 node\n  jnk   x\n');
    expect(table.size).toBe(1);
    expect(table.get(100)).toEqual({ pid: 100, ppid: 1, command: 'node' });
  });

  it('walkProcessTree returns child-to-root chain', () => {
    const table = parsePsOutput(psFixture);
    const chain = walkProcessTree(table, 300, 20);
    expect(chain.map((p) => p.command)).toEqual(['npm', 'opencode', 'node']);
  });

  it('walkProcessTree respects maxDepth', () => {
    const table = parsePsOutput(psFixture);
    expect(walkProcessTree(table, 300, 2).map((p) => p.command)).toEqual(['npm', 'opencode']);
  });

  it('walkProcessTree stops at init process (ppid <= 1)', () => {
    const table = parsePsOutput('  100     1 node\n');
    expect(walkProcessTree(table, 100, 20)).toHaveLength(1);
  });

  it('walkProcessTree stops on self-parenting (loop)', () => {
    const table = parsePsOutput('  100   100 node\n');
    expect(walkProcessTree(table, 100, 20)).toHaveLength(1);
  });

  it('walkProcessTree returns [] for unknown pid', () => {
    const table = parsePsOutput(psFixture);
    expect(walkProcessTree(table, 9999, 20)).toEqual([]);
  });
});

describe('helpers', () => {
  it('isKnownAgent type guard', () => {
    expect(isKnownAgent('claudecode')).toBe(true);
    expect(isKnownAgent('claude_code')).toBe(false);
  });

  it('AGENT_IDS has 33 entries and matches original order', () => {
    expect(AGENT_IDS).toHaveLength(33);
    expect(AGENT_IDS[0]).toBe('workbuddy');
    expect(AGENT_IDS[19]).toBe('qwencowork');
    expect(AGENT_IDS[20]).toBe('antigravity');
    expect(AGENT_IDS[32]).toBe('rork');
  });

  it('every AGENT_IDS entry is recognized by isKnownAgent', () => {
    for (const id of AGENT_IDS) {
      expect(isKnownAgent(id)).toBe(true);
    }
  });
});
