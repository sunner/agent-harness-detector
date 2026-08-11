#!/usr/bin/env node
import { detect } from './index.js';

const id = detect();
if (!id) {
  console.error('No agent harness environment detected.');
  process.exit(1);
}
console.log(`AGENT=${id}`);
