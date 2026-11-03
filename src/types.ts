/**
 * Agent harness identifiers, in the same priority order the original
 * detector uses (first match wins).
 *
 * The first 20 ids come from the original agent-skill detector; the remaining
 * coding-agent ids (antigravity .. rork) are ported from
 * expo/agent-cli-detector.
 */
export const AGENT_IDS = [
  'workbuddy',
  'kimiwork',
  'kimiclaw',
  'hermes',
  'wukong',
  'arkclawcloud',
  'qclaw',
  'claudecode',
  'codex',
  'qwenwork',
  'qoderwork',
  'qodercloud',
  'qoder',
  'minimax',
  'doubao',
  'doubaocloud',
  'easyclaw',
  'maxclawcloud',
  'openclaw',
  'qwencowork',
  'antigravity',
  'bolt',
  'cline',
  'copilot',
  'cursor',
  'devin',
  'gemini',
  'kiro',
  'kilocode',
  'opencode',
  'pi',
  'replit',
  'rork',
  'cue',
] as const;

export type AgentId = (typeof AGENT_IDS)[number];

/** Minimal env shape; defaults to `process.env`. */
export type DetectorEnv = Record<string, string | undefined>;

export interface DetectorContext {
  /** The environment object (defaults to process.env). */
  env: DetectorEnv;
  /** Working directory used as `scriptDir` (defaults to process.cwd()). */
  scriptDir: string;
  /** Lower-cased `scriptDir`. */
  pathLower: string;
}

export interface DetectOptions {
  /** Override process.env (default: process.env). */
  env?: DetectorEnv;
  /**
   * Enable process-tree detection (default: true). Uses a single `ps` call
   * (cached per pid) and is a no-op on Windows.
   */
  processTree?: boolean;
  /** Max ancestors to inspect when walking the process tree (default: 20). */
  maxProcessDepth?: number;
  /** Process id to start the tree walk from (default: process.pid). */
  pid?: number;
  /** Inject a pre-read process table, skipping the `ps` call (advanced/testing). */
  processTable?: ReadonlyMap<number, ProcessInfo>;
}

/** A single row from the process table. */
export interface ProcessInfo {
  readonly pid: number;
  readonly ppid: number;
  readonly command: string;
}

export type Detector = (ctx: DetectorContext) => boolean;
