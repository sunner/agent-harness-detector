# agent-harness-detector

Detect which AI agent / coding harness your Node.js process is running in, using **environment variables** and **process-tree matching** (`ps`).

## Supported agents

`workbuddy` · `kimiwork` · `kimiclaw` · `hermes` · `wukong` · `arkclawcloud` · `qclaw` · `claudecode` · `codex` · `qwenwork` · `qoderwork` · `qodercloud` · `qoder` · `minimax` · `doubao` · `doubaocloud` · `easyclaw` · `maxclawcloud` · `openclaw` · `qwencowork` · `antigravity` · `bolt` · `cline` · `copilot` · `cursor` · `devin` · `gemini` · `kiro` · `kilocode` · `opencode` · `pi` · `replit` · `rork` · `augment-cli`

## Install

```bash
npm install @uarix/agent-harness-detector
```

## Usage

```ts
import { detect, detectAll } from '@uarix/agent-harness-detector';

detect(); // 'claudecode' | 'workbuddy' | null
detectAll(); // all matches, e.g. ['cursor', 'opencode']
```

Detect with fake env for tests:

```ts
detect({ env: { CLAUDECODE: '1' }, processTree: false }); // 'claudecode'
```

## API

| Export             | Description                                                     |
| ------------------ | --------------------------------------------------------------- |
| `detect(opts?)`    | Highest-priority matched `AgentId`, or `null`.                  |
| `detectAll(opts?)` | Every matched `AgentId` in priority order (env + process tree). |
| `isKnownAgent(id)` | Type guard for `AgentId`.                                       |
| `AGENT_IDS`        | All agent ids, in priority order.                               |

```ts
interface DetectOptions {
  env?: Record<string, string | undefined>; // default: process.env
  processTree?: boolean; // default: true (no-op on Windows)
  maxProcessDepth?: number; // default: 20
  pid?: number; // default: process.pid
  processTable?: ReadonlyMap<number, ProcessInfo>; // advanced / testing
}
```

Process-tree detection is a single `ps` call (cached per pid). When multiple
agents match, `detect()` returns the highest-priority one.

## Credits

- [expo/agent-cli-detector](https://github.com/expo/agent-cli-detector)

## License

MIT
