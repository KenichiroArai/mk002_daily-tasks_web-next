// daily-tasks-git の docs/data（Java の収集ツールの出力）を public/data にコピーする
import { cp, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// 未指定の場合は兄弟ディレクトリに置いた daily-tasks-git を使う
const sourceDir = process.env.CARRYOVER_DATA_DIR
  ? path.resolve(process.env.CARRYOVER_DATA_DIR)
  : path.resolve(projectDir, '..', 'daily-tasks-git', 'docs', 'data');
const targetDir = path.resolve(projectDir, 'public', 'data');

try {
  await stat(sourceDir);
} catch {
  console.error(`データのディレクトリが見つかりません: ${sourceDir}`);
  process.exit(1);
}

await rm(targetDir, { recursive: true, force: true });
await cp(sourceDir, targetDir, { recursive: true });
console.log(`データをコピーしました: ${sourceDir} -> ${targetDir}`);
