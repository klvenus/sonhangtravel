import { NextResponse } from 'next/server';
import { listBackups, runBackup } from '@/lib/backup';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const backups = await listBackups();
    return NextResponse.json({ backups });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST() {
  try {
    const result = await runBackup();
    const backups = await listBackups();
    return NextResponse.json({ ...result, backups });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
