import { execFileSync } from 'node:child_process';
import path from 'node:path';
import type { AgentEntry } from './detectors.js';
import type { AgentId, ProcessInfo } from './types.js';

/** Default max ancestors inspected when walking the process tree. */
export const DEFAULT_MAX_PROCESS_DEPTH = 20;

/** Process table limit above which we stop matching (safety cap). */
const PROCESS_TABLE_LIMIT = 100_000;

/**
 * Parse `ps -eo pid=,ppid=,comm=` output into a pid → ProcessInfo map.
 * Pure, so it is fully unit-testable.
 */
export function parsePsOutput(raw: string): ReadonlyMap<number, ProcessInfo> {
  const table = new Map<number, ProcessInfo>();

  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const parts = trimmed.split(/\s+/);
    if (parts.length < 3) continue;

    const pid = Number.parseInt(parts[0], 10);
    const ppid = Number.parseInt(parts[1], 10);
    if (!Number.isInteger(pid) || !Number.isInteger(ppid)) continue;
    if (table.size >= PROCESS_TABLE_LIMIT) break;

    table.set(pid, { pid, ppid, command: parts.slice(2).join(' ') });
  }

  return table;
}

/**
 * Read the full process table in a single `ps` call (instead of one call per
 * ancestor). Returns `null` when `ps` is unavailable or blocked.
 */
export function readPsTable(): ReadonlyMap<number, ProcessInfo> | null {
  try {
    const raw = execFileSync('ps', ['-eo', 'pid=,ppid=,comm='], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return parsePsOutput(raw);
  } catch {
    return null;
  }
}

/**
 * Walk from `startPid` up its ancestor chain (child → ... → root), at most
 * `maxDepth` entries. Stops when a pid is missing from the table, reaches the
 * init process (ppid <= 1), or hits a self-parenting (loop) process.
 */
export function walkProcessTree(
  table: ReadonlyMap<number, ProcessInfo>,
  startPid: number,
  maxDepth: number,
): readonly ProcessInfo[] {
  const chain: ProcessInfo[] = [];
  let pid = startPid;

  for (let depth = 0; depth < maxDepth && pid > 0; depth += 1) {
    const info = table.get(pid);
    if (info === undefined) break;

    chain.push(info);
    if (info.ppid <= 1 || info.ppid === pid) break;
    pid = info.ppid;
  }

  return chain;
}

/**
 * Match a process chain against every agent's `processPatterns`, returning
 * the distinct agent ids that matched at least one ancestor.
 */
export function matchProcessPatterns(
  chain: readonly ProcessInfo[],
  entries: readonly AgentEntry[],
): Set<AgentId> {
  const matched = new Set<AgentId>();

  for (const info of chain) {
    const command = normalizeCommand(info.command);

    for (const entry of entries) {
      if (matched.has(entry.id) || entry.processPatterns === undefined) continue;
      if (entry.processPatterns.some((pattern) => pattern.test(command))) {
        matched.add(entry.id);
      }
    }
  }

  return matched;
}

function normalizeCommand(command: string): string {
  return path.basename(command.trim()).replace(/^-+/, '');
}
