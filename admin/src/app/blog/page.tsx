'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  category: string;
  published: boolean;
  publishedAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog').then(r => r.json()).then(setPosts).finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Xóa bài viết "${title}"?`)) return;
    const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
    if (res.ok) setPosts(prev => prev.filter(p => p.id !== id));
    else alert('Lỗi khi xóa');
  }

  async function togglePublished(id: number, current: boolean) {
    const res = await fetch(`/api/blog/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !current }),
    });
    if (res.ok) setPosts(prev => prev.map(p => p.id === id ? { ...p, published: !current } : p));
  }

  if (loading) return <div className="text-gray-500 p-8">Đang tải...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Blog ({posts.length})</h2>
        <Link href="/blog/new" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
          ➕ Thêm bài viết
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Bài viết</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Chuyên mục</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Ngày đăng</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {posts.length === 0 && (
              <tr><td colSpan={5} className="text-center py-12 text-gray-400">Chưa có bài viết nào. <Link href="/blog/new" className="text-emerald-600 hover:underline">Thêm bài viết mới →</Link></td></tr>
            )}
            {posts.map(post => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900 truncate max-w-xl">{post.title}</p>
                    <p className="text-xs text-gray-500">/{post.slug}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{post.category}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{new Date(post.publishedAt).toLocaleDateString('vi-VN')}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => togglePublished(post.id, post.published)}
                    className={`text-xs px-2 py-0.5 rounded-full ${post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {post.published ? '✅ Công khai' : '📝 Nháp'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/blog/${post.id}`} className="text-blue-600 hover:underline text-sm">Sửa</Link>
                    <button onClick={() => handleDelete(post.id, post.title)} className="text-red-500 hover:text-red-700 text-sm">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
