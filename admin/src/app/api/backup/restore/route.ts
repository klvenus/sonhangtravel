import { NextRequest, NextResponse } from 'next/server';
import { listBackups, runRestore } from '@/lib/backup';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const backupName = String(body.backupName || '').trim();
    if (!backupName) {
      return NextResponse.json({ error: 'Thiếu backupName' }, { status: 400 });
    }

    const result = await runRestore(backupName);
    const backups = await listBackups();
    return NextResponse.json({ ...result, backups });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
