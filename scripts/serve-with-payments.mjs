import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const development = process.argv.includes('--dev');
const args = process.argv.slice(2).filter(arg => arg !== '--dev');
const app = spawn(process.execPath, [require.resolve('next/dist/bin/next'), development ? 'dev' : 'start', ...args], { stdio: 'inherit' });
const worker = spawn(process.execPath, ['scripts/automatic-payments.mjs'], { stdio: 'inherit' });
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  process.exitCode = code;
  app.kill(); worker.kill();
}
for (const child of [app, worker]) {
  child.on('error', () => stop(1));
  child.on('exit', code => stop(code || 0));
}
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
