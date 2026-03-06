'use client';

import { useState } from 'react';

export default function RevalidatePage() {
  const [path, setPath] = useState('/');
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  function addLog(msg: string) {
    setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }

  async function revalidatePath(p: string) {
    setRunning(true);
    addLog(`🔄 Revalidate: ${p}`);
    try {
      const res = await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: p }),
      });
      const data = await res.json();
      if (res.ok) addLog(`✅ Thành công: ${JSON.stringify(data)}`);
      else addLog(`❌ Lỗi: ${JSON.stringify(data)}`);
    } catch { addLog('❌ Lỗi kết nối tới Vercel'); }
    finally { setRunning(false); }
  }

  async function revalidateAll() {
    setRunning(true);
    const paths = ['/', '/tours'];
    addLog('🔄 Revalidate tất cả các trang...');
    for (const p of paths) {
      addLog(`  → ${p}`);
      try {
        await fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: p }),
        });
        addLog(`  ✅ ${p}`);
      } catch { addLog(`  ❌ ${p}`); }
    }
    addLog('🏁 Xong!');
    setRunning(false);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">🔄 Revalidate cache Vercel</h2>

      <div className="bg-white border rounded-xl p-6 space-y-4">
        <p className="text-sm text-gray-500">Sau khi thay đổi dữ liệu (thêm/sửa/xóa tour), bấm revalidate để cập nhật trang web production ngay lập tức mà không cần chờ ISR (1 giờ).</p>

        <div className="flex gap-2">
          <input value={path} onChange={e => setPath(e.target.value)} placeholder="VD: / hoặc /tours hoặc /tour/slug"
            className="flex-1 border rounded-lg px-3 py-2 text-sm" />
          <button onClick={() => revalidatePath(path)} disabled={running}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
            {running ? '⏳' : '🔄 Revalidate'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button onClick={() => revalidatePath('/')} disabled={running}
          className="bg-white border rounded-xl p-4 text-left hover:border-green-400 transition-colors">
          <p className="font-semibold text-gray-800">🏠 Trang chủ</p>
          <p className="text-xs text-gray-400">/</p>
        </button>
        <button onClick={() => revalidatePath('/tours')} disabled={running}
          className="bg-white border rounded-xl p-4 text-left hover:border-green-400 transition-colors">
          <p className="font-semibold text-gray-800">📋 Danh sách tour</p>
          <p className="text-xs text-gray-400">/tours</p>
        </button>
        <button onClick={revalidateAll} disabled={running}
          className="bg-green-50 border border-green-200 rounded-xl p-4 text-left hover:border-green-400 transition-colors">
          <p className="font-semibold text-green-800">⚡ Tất cả</p>
          <p className="text-xs text-green-500">Revalidate toàn bộ</p>
        </button>
      </div>

      {log.length > 0 && (
        <div className="bg-gray-900 text-green-400 rounded-xl p-4 font-mono text-sm max-h-80 overflow-y-auto">
          {log.map((line, i) => <div key={i}>{line}</div>)}
          <div className="flex justify-end mt-2">
            <button onClick={() => setLog([])} className="text-gray-500 text-xs hover:text-gray-300">Xóa log</button>
          </div>
        </div>
      )}
    </div>
  );
}
