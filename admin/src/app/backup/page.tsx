'use client';

import { useEffect, useState } from 'react';

interface BackupEntry {
  name: string;
  path: string;
}

export default function BackupPage() {
  const [backups, setBackups] = useState<BackupEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningBackup, setRunningBackup] = useState(false);
  const [runningRestore, setRunningRestore] = useState<string | null>(null);
  const [selectedBackup, setSelectedBackup] = useState('');
  const [log, setLog] = useState<string[]>([]);

  function addLog(message: string) {
    setLog((prev) => [...prev, `[${new Date().toLocaleTimeString('vi-VN')}] ${message}`]);
  }

  async function loadBackups() {
    setLoading(true);
    try {
      const res = await fetch('/api/backup');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Không tải được danh sách backup');
      setBackups(data.backups || []);
      setSelectedBackup((prev) => prev || data.backups?.[0]?.name || '');
    } catch (error) {
      addLog(`❌ ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBackups();
  }, []);

  async function handleBackupNow() {
    setRunningBackup(true);
    addLog('📦 Bắt đầu tạo backup...');
    try {
      const res = await fetch('/api/backup', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Backup thất bại');
      setBackups(data.backups || []);
      setSelectedBackup(data.backups?.[0]?.name || '');
      addLog('✅ Tạo backup xong');
      if (data.output) addLog(data.output);
    } catch (error) {
      addLog(`❌ ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setRunningBackup(false);
    }
  }

  async function handleRestore() {
    if (!selectedBackup) return alert('Chọn 1 bản backup');
    if (!confirm(`Restore bản ${selectedBackup}? Các file env/config hiện tại sẽ bị ghi đè.`)) return;

    setRunningRestore(selectedBackup);
    addLog(`♻️ Bắt đầu restore ${selectedBackup}...`);
    try {
      const res = await fetch('/api/backup/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backupName: selectedBackup }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Restore thất bại');
      setBackups(data.backups || []);
      addLog('✅ Restore xong');
      if (data.output) addLog(data.output);
    } catch (error) {
      addLog(`❌ ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setRunningRestore(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">💾 Backup / Restore</h2>
          <p className="text-sm text-gray-500 mt-1">Giữ 5 ngày gần nhất, mỗi ngày 2 bản. Bấm tạo backup hoặc chọn 1 bản để restore nhanh.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadBackups} disabled={loading || runningBackup || !!runningRestore} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50">
            🔄 Tải lại
          </button>
          <button onClick={handleBackupNow} disabled={runningBackup || !!runningRestore} className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
            {runningBackup ? 'Đang backup...' : '📦 Backup ngay'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Danh sách backup</h3>
            <span className="text-xs text-gray-400">{backups.length} bản</span>
          </div>

          {loading ? (
            <div className="text-sm text-gray-500">Đang tải...</div>
          ) : backups.length === 0 ? (
            <div className="text-sm text-gray-400">Chưa có bản backup nào.</div>
          ) : (
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {backups.map((backup) => {
                const active = selectedBackup === backup.name;
                return (
                  <button
                    key={backup.name}
                    onClick={() => setSelectedBackup(backup.name)}
                    className={`w-full text-left border rounded-xl p-4 transition-colors ${active ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-gray-900">{backup.name}</p>
                        <p className="text-xs text-gray-500 mt-1 break-all">{backup.path}</p>
                      </div>
                      {active && <span className="text-green-600 text-sm font-semibold">Đang chọn</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-gray-800">Restore nhanh</h3>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Bản backup</label>
              <select value={selectedBackup} onChange={(e) => setSelectedBackup(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="">-- Chọn bản backup --</option>
                {backups.map((backup) => (
                  <option key={backup.name} value={backup.name}>{backup.name}</option>
                ))}
              </select>
            </div>
            <button onClick={handleRestore} disabled={!selectedBackup || runningBackup || !!runningRestore}
              className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {runningRestore ? 'Đang restore...' : '♻️ Restore bản đang chọn'}
            </button>
            <p className="text-xs text-amber-600">Restore sẽ ghi đè các file env/config local hiện tại. Sau đó chỉ cần build/deploy lại là dùng được.</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-sm text-green-800 space-y-2">
            <p><strong>Backup gồm:</strong> env files, config deploy, vercel.json, package/config chính của frontend/admin.</p>
            <p><strong>Retention:</strong> 5 ngày gần nhất, mỗi ngày 2 bản mới nhất.</p>
            <p><strong>Mục tiêu:</strong> đổi tài khoản Vercel mới xong chỉ việc restore 1 bản rồi deploy lại.</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 text-green-400 rounded-xl p-4 font-mono text-sm min-h-44 max-h-96 overflow-y-auto">
        {log.length === 0 ? (
          <div className="text-gray-500">Chưa có log. Bấm Backup ngay hoặc Restore để chạy.</div>
        ) : (
          log.map((line, idx) => <div key={idx} className="whitespace-pre-wrap">{line}</div>)
        )}
      </div>
    </div>
  );
}
