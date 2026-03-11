import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { access } from 'node:fs/promises';
import { constants } from 'node:fs';

const execFileAsync = promisify(execFile);

export const backupConfig = {
  root: '/Users/khumlong/sonhangtravel',
  backupRoot: '/Users/khumlong/sonhangtravel/backups/vercel-snapshots',
  backupScript: '/Users/khumlong/sonhangtravel/ops/backup-sonhang.sh',
  restoreScript: '/Users/khumlong/sonhangtravel/ops/restore-sonhang.sh',
  listScript: '/Users/khumlong/sonhangtravel/ops/list-backups.sh',
};

export interface BackupEntry {
  name: string;
  path: string;
}

export async function ensureExecutable(path: string) {
  await access(path, constants.X_OK);
}

export async function listBackups(): Promise<BackupEntry[]> {
  await ensureExecutable(backupConfig.listScript);
  const { stdout } = await execFileAsync(backupConfig.listScript);
  return stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((name) => ({ name, path: `${backupConfig.backupRoot}/${name}.tar.gz` }));
}

export async function runBackup() {
  await ensureExecutable(backupConfig.backupScript);
  const { stdout, stderr } = await execFileAsync(backupConfig.backupScript);
  return {
    ok: true,
    output: [stdout, stderr].filter(Boolean).join('\n').trim(),
  };
}

export async function runRestore(nameOrPath: string) {
  await ensureExecutable(backupConfig.restoreScript);
  const { stdout, stderr } = await execFileAsync(backupConfig.restoreScript, [nameOrPath]);
  return {
    ok: true,
    output: [stdout, stderr].filter(Boolean).join('\n').trim(),
  };
}
