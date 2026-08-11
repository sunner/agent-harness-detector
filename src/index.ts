import { AGENT_DETECTORS } from './detectors.js';
import {
  DEFAULT_MAX_PROCESS_DEPTH,
  matchProcessPatterns,
  readPsTable,
  walkProcessTree,
} from './process.js';
import { AGENT_IDS } from './types.js';
import type { AgentId, DetectOptions, DetectorContext } from './types.js';

export { AGENT_IDS } from './types.js';
export type { AgentId, DetectOptions, DetectorEnv, ProcessInfo } from './types.js';

const PROCESS_CACHE_MAX = 64;

function buildContext(opts: DetectOptions = {}): DetectorContext {
  const scriptDir = process.cwd();
  return {
    env: opts.env ?? (process.env as Record<string, string | undefined>),
    scriptDir,
    pathLower: scriptDir.toLowerCase(),
  };
}

function collectEnvMatches(ctx: DetectorContext): readonly AgentId[] {
  const matches: AgentId[] = [];
  for (const entry of AGENT_DETECTORS) {
    if (entry.detectEnv(ctx)) matches.push(entry.id);
  }
  return matches;
}

/**
 * Process-tree matches are immutable once computed (a process's ancestor
 * chain never changes), so we cache them per pid to avoid repeated `ps` calls.
 * Injected tables (advanced/testing) bypass the cache.
 */
const processCache = new Map<number, readonly AgentId[]>();

function collectProcessMatches(opts: DetectOptions): readonly AgentId[] {
  if (opts.processTree === false) return [];

  const pid = opts.pid ?? process.pid;
  const depth = opts.maxProcessDepth ?? DEFAULT_MAX_PROCESS_DEPTH;

  if (opts.processTable === undefined) {
    if (process.platform === 'win32') return [];
    const cached = processCache.get(pid);
    if (cached !== undefined) return cached;
  }

  const table = opts.processTable ?? readPsTable();
  if (table === null) return [];

  const chain = walkProcessTree(table, pid, depth);
  const matched = [...matchProcessPatterns(chain, AGENT_DETECTORS)];

  if (opts.processTable === undefined) {
    processCache.set(pid, matched);
    if (processCache.size > PROCESS_CACHE_MAX) processCache.clear();
  }

  return matched;
}

/**
 * Detect every agent that matches the current environment, using both the
 * environment-signal detectors and (unless disabled) the process tree.
 *
 * Returns all matched ids in priority order (first entry wins for a single
 * match, e.g. one agent via env and another via the process tree).
 *
 * @example
 * ```ts
 * const all = detectAll();   // ['cursor', 'opencode', ...]
 * ```
 */
export function detectAll(opts?: DetectOptions): AgentId[] {
  const ctx = buildContext(opts);
  const matched = new Set<AgentId>(collectEnvMatches(ctx));

  for (const id of collectProcessMatches(opts ?? {})) matched.add(id);

  return AGENT_DETECTORS.filter((entry) => matched.has(entry.id)).map((entry) => entry.id);
}

/**
 * Detect the agent harness the process is running in.
 *
 * Mirrors the original detector semantics, extended with process-tree
 * detection (enabled by default; no-op on Windows):
 * - environment signals are probed with `process.env` and `process.cwd()`
 *   unless overridden via options;
 * - the process tree is matched with one (cached) `ps` call;
 * - when multiple agents match, the highest-priority one wins;
 * - returns `null` when nothing matches.
 *
 * @example
 * ```ts
 * const agent = detect();            // 'claudecode' | 'workbuddy' | null
 * ```
 */
export function detect(opts?: DetectOptions): AgentId | null {
  const all = detectAll(opts);
  return all[0] ?? null;
}

/** Type guard for {@link AgentId}. */
export function isKnownAgent(id: string): id is AgentId {
  return (AGENT_IDS as readonly string[]).includes(id);
}
