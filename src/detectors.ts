import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import type { AgentId, Detector, DetectorContext } from './types.js';

/**
 * A single agent definition: the environment detector is always present;
 * `processPatterns` (optional) is used by the process-tree strategy and
 * mirrors the patterns from expo/agent-cli-detector for coding agents.
 * Keeping both channels on one entry avoids a second, duplicated agent list.
 */
export interface AgentEntry {
  readonly id: AgentId;
  readonly detectEnv: Detector;
  readonly processPatterns?: readonly RegExp[];
}

/**
 * Faithful ports of the environment detectors this library derives from.
 * Each function is named after the agent it identifies and mirrors the
 * original signal checks exactly (including the order-insensitive env
 * presence checks, substring/prefix matching and the single filesystem probe
 * used for Kimi claw).
 */

function workbuddy({ env }: DetectorContext): boolean {
  return (
    env.CLIENT_INFO_IDE_TYPE === 'WorkBuddy' ||
    env.CLIENT_INFO_PLATFORM === 'WorkBuddy' ||
    env.CLIENT_INFO_PRODUCT_NAME === 'WorkBuddy' ||
    !!env.CODEBUDDY_HOST?.startsWith('workbuddy') ||
    !!env.CODEBUDDY_CONFIG_DIR?.includes('.workbuddy')
  );
}

function kimiwork({ env, pathLower }: DetectorContext): boolean {
  return (
    pathLower.includes('kimi-desktop/daimon-share') ||
    pathLower.includes('.kimi-work') ||
    env.KIMI_SKILLS_ROOT !== undefined ||
    env.KIMI_AGENT_GW_KEY !== undefined
  );
}

function kimiclaw({ env, scriptDir, pathLower }: DetectorContext): boolean {
  if (
    pathLower.includes('kimi_openclaw') ||
    env.KIMI_CLAW_STATE_DIR !== undefined ||
    env.KIMI_PLUGIN_API_KEY !== undefined ||
    !!env.__CFBundleIdentifier?.includes('moonshot.kimichat')
  ) {
    return true;
  }
  if (!scriptDir.includes('.openclaw')) return false;
  const home = homedir();
  return existsSync('/root/.kimi/kimi-claw') || existsSync(path.join(home, '.kimi', 'kimi-claw'));
}

function hermes({ env }: DetectorContext): boolean {
  return (
    env.HERMES_SESSION_ID !== undefined ||
    env.HERMES_KANBAN_BOARD !== undefined ||
    env.HERMES_INTERACTIVE === '1'
  );
}

function wukong({ env }: DetectorContext): boolean {
  return (
    env.WUKONG_ABILITY_CODE !== undefined ||
    env.WUKONG_BIN !== undefined ||
    env.WUKONG_BIZ_ID !== undefined
  );
}

function arkclawcloud({ env }: DetectorContext): boolean {
  return (
    env.ARK_BASE_URL !== undefined ||
    env.ARK_CLAW_TEMPLATE_DESCRIPTION !== undefined ||
    env.ARK_CLAW_TEMPLATE_LABEL !== undefined ||
    env.ARK_CODING_PLAN !== undefined ||
    env.ARK_MODEL_FALLBACKS !== undefined ||
    env.ARK_MODEL_ID !== undefined
  );
}

function qclaw({ env }: DetectorContext): boolean {
  return (
    env.QCLAW_BUNDLED_CONFIG_DIR !== undefined ||
    env.QCLAW_CLI_NODE_BINARY !== undefined ||
    env.QCLAW_CLI_OPENCLAW_MJS !== undefined ||
    env.QCLAW_CONFIG_HMAC_SECRET !== undefined ||
    env.QCLAW_DEVICE_ID !== undefined
  );
}

function claudecode({ env }: DetectorContext): boolean {
  return (
    env.CLAUDECODE === '1' ||
    !!env.AI_AGENT?.includes('claude-code') ||
    env.CLAUDE_CODE_SESSION_ID !== undefined ||
    env.CLAUDE_CODE_ENTRY_POINT !== undefined
  );
}

function codex({ env }: DetectorContext): boolean {
  return (
    env.CODEX_ENV === '1' ||
    env.CODEX_SHELL === '1' ||
    env.CODEX_THREAD_ID !== undefined ||
    env.CODEX_CI === '1' ||
    env.CODEX_INTERNAL_ORIGINATOR_OVERRIDE !== undefined ||
    env.AI_AGENT?.includes('codex') === true
  );
}

function qwenwork({ env }: DetectorContext): boolean {
  return (
    !!env.__CFBundleIdentifier?.includes('qwenwork') ||
    env.QODER_WORK_INTEGRATION_PRODUCT === 'qwenworkcn' ||
    !!env.QODER_CONFIG_DIR?.includes('.qwenworkcn') ||
    !!env.QODERCN_CONFIG_DIR?.includes('.qwenworkcn')
  );
}

function qoderwork({ env }: DetectorContext): boolean {
  return (
    env.QODERCLI_INTEGRATION_MODE === 'qoder_work' ||
    !!env.QODERWORK_SOURCE_CHAT_ID ||
    env.NCS_AUTH_AGENT_ID === 'agent-qoderwork' ||
    !!env.__CFBundleIdentifier?.includes('qoder.work')
  );
}

function qodercloud({ env }: DetectorContext): boolean {
  return env.QODER_RUNNING_ENV === 'cloud';
}

function qoder({ env, scriptDir }: DetectorContext): boolean {
  return (
    env.QODER_AGENT === 'true' ||
    env.QODER_IDE === '1' ||
    !!env.__CFBundleIdentifier?.includes('qoder.ide') ||
    (scriptDir.includes('.qoder') && !scriptDir.includes('.qoderwork'))
  );
}

function minimax({ env }: DetectorContext): boolean {
  return (
    !!env.__CFBundleIdentifier?.includes('minimax') ||
    env.MAVIS_AGENT === 'mavis' ||
    env.__MAVIS_PARENT_AGENT_NAME === 'mavis' ||
    !!env.NEXT_PUBLIC_DOMAIN_URL?.includes('minimaxi.com')
  );
}

function doubao({ env }: DetectorContext): boolean {
  return !!env.__CFBundleIdentifier?.includes('com.bot.pc.doubao');
}

function doubaocloud({ env, scriptDir, pathLower }: DetectorContext): boolean {
  return (
    pathLower.includes('.doubao') ||
    scriptDir.includes('.super_doubao') ||
    !!env.RUNTIME_PATH?.includes('.super_doubao') ||
    !!env.SKILLS_DOWNLOAD_URL?.includes('doubaocdn.com') ||
    env.DOUBAO_OFFICE_APP_ID !== undefined ||
    env.DOUBAO_OFFICE_LOG_ID !== undefined
  );
}

function easyclaw({ env }: DetectorContext): boolean {
  return (
    env.EASYCLAW_REGION !== undefined ||
    env.EASYCLAW_APP_LANGUAGE !== undefined ||
    !!env.OPENCLAW_HOME?.endsWith('easyclaw') ||
    env.EASYCLAW_RPC_PORT !== undefined
  );
}

function maxclawcloud({ env }: DetectorContext): boolean {
  return !!env.HOSTNAME?.startsWith('maxclaw') && env.AGENT_TYPE === 'claw';
}

function openclaw({ env }: DetectorContext): boolean {
  return env.OPENCLAW_CLI === '1' || env.OPENCLAW_SERVICE_MARKER === 'openclaw';
}

function qwencowork({ env }: DetectorContext): boolean {
  return (
    !!env.__CFBundleIdentifier?.includes('com.alibaba.tongyi') || env.QWEN_AGENT_BUN !== undefined
  );
}

// ---------------------------------------------------------------------------
// Coding-agent environment detectors, ported from
// https://github.com/expo/agent-cli-detector (src/agents.ts).
// Their process-tree patterns are registered alongside each agent below.
// ---------------------------------------------------------------------------

function antigravity({ env }: DetectorContext): boolean {
  return env.ANTIGRAVITY_AGENT === '1' || env.ANTIGRAVITY_TRAJECTORY_ID !== undefined;
}

function bolt({ env }: DetectorContext): boolean {
  return (
    env.BOLT_ENV !== undefined || env.BOLT_ORIGIN !== undefined || env.BOLT_SERVER_URL !== undefined
  );
}

function cline({ env }: DetectorContext): boolean {
  return env.CLINE_WRAPPER_PATH !== undefined;
}

function copilot({ env }: DetectorContext): boolean {
  return (
    env.COPILOT_CLI === '1' ||
    env.COPILOT_AGENT_SESSION_ID !== undefined ||
    env.COPILOT_RUN_APP === '1'
  );
}

function cursor({ env }: DetectorContext): boolean {
  return env.CURSOR_AGENT === '1' || env.CURSOR_CONVERSATION_ID !== undefined;
}

function devin(): boolean {
  // Devin has no environment signals; it is matched via the process-tree
  // strategy using the `/devin/i` pattern below.
  return false;
}

function gemini({ env }: DetectorContext): boolean {
  return env.GEMINI_CLI === '1';
}

function kiro({ env }: DetectorContext): boolean {
  return env.KIRO_SESSION_ID !== undefined;
}

function kilocode({ env }: DetectorContext): boolean {
  return env.KILO === '1' || env.KILOCODE_VERSION !== undefined || env.KILO_RUN_ID !== undefined;
}

function opencode({ env }: DetectorContext): boolean {
  return env.OPENCODE === '1' || env.OPENCODE_PID !== undefined;
}

function pi({ env }: DetectorContext): boolean {
  return env.PI_CODING_AGENT === 'true';
}

function replit({ env }: DetectorContext): boolean {
  return env.REPLIT_SESSION !== undefined;
}

function rork({ env }: DetectorContext): boolean {
  return env.RORK_API_URL !== undefined;
}

/**
 * Ordered agent registry. Order matters: when multiple agents match, the
 * first entry wins (see `detectAll` / `detect` in index.ts).
 */
export const AGENT_DETECTORS: ReadonlyArray<AgentEntry> = [
  { id: 'trae', detectEnv: ({ env }) => !!env['TRAE_AI_SHELL_ID'] },
  { id: 'workbuddy', detectEnv: workbuddy },
  { id: 'kimiwork', detectEnv: kimiwork },
  { id: 'kimiclaw', detectEnv: kimiclaw },
  { id: 'hermes', detectEnv: hermes },
  { id: 'wukong', detectEnv: wukong },
  { id: 'arkclawcloud', detectEnv: arkclawcloud },
  { id: 'qclaw', detectEnv: qclaw },
  { id: 'claudecode', detectEnv: claudecode, processPatterns: [/^claude$/i] },
  { id: 'codex', detectEnv: codex, processPatterns: [/^codex$/i] },
  { id: 'qwenwork', detectEnv: qwenwork },
  { id: 'qoderwork', detectEnv: qoderwork },
  { id: 'qodercloud', detectEnv: qodercloud },
  { id: 'qoder', detectEnv: qoder },
  { id: 'minimax', detectEnv: minimax },
  { id: 'doubao', detectEnv: doubao },
  { id: 'doubaocloud', detectEnv: doubaocloud },
  { id: 'easyclaw', detectEnv: easyclaw },
  { id: 'maxclawcloud', detectEnv: maxclawcloud },
  { id: 'openclaw', detectEnv: openclaw },
  { id: 'qwencowork', detectEnv: qwencowork },
  // Coding agents (ported from expo/agent-cli-detector)
  {
    id: 'antigravity',
    detectEnv: antigravity,
    processPatterns: [/^antigravity$/i],
  },
  { id: 'bolt', detectEnv: bolt },
  { id: 'cline', detectEnv: cline, processPatterns: [/^cline$/i] },
  {
    id: 'copilot',
    detectEnv: copilot,
    processPatterns: [/^(github-copilot-cli|copilot)$/i],
  },
  { id: 'cursor', detectEnv: cursor, processPatterns: [/^cursor$/i] },
  { id: 'devin', detectEnv: devin, processPatterns: [/devin/i] },
  { id: 'gemini', detectEnv: gemini, processPatterns: [/^gemini$/i] },
  { id: 'kiro', detectEnv: kiro, processPatterns: [/kiro/i] },
  {
    id: 'kilocode',
    detectEnv: kilocode,
    processPatterns: [/^(kilo|kilocode)$/i],
  },
  { id: 'opencode', detectEnv: opencode, processPatterns: [/^opencode$/i] },
  { id: 'pi', detectEnv: pi },
  { id: 'replit', detectEnv: replit },
  { id: 'rork', detectEnv: rork },
];
