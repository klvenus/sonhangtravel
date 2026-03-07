'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

interface BlogBlock {
  type: 'heading' | 'paragraph';
  text: string;
}

function slugify(text: string): string {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function BlogForm({ postId }: { postId?: string }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    excerpt: '',
    category: 'Blog',
    thumbnail: '',
    galleryText: '',
    keywords: '',
    published: true,
    publishedAt: new Date().toISOString().slice(0, 16),
    contentText: '',
  });

  useEffect(() => {
    if (!postId) return;
    fetch(`/api/blog/${postId}`).then(r => r.json()).then((d) => {
      setForm({
        title: d.title || '',
        slug: d.slug || '',
        description: d.description || '',
        excerpt: d.excerpt || '',
        category: d.category || 'Blog',
        thumbnail: d.thumbnail || '',
        galleryText: Array.isArray(d.gallery) ? d.gallery.join('\n') : '',
        keywords: Array.isArray(d.keywords) ? d.keywords.join(', ') : '',
        published: d.published !== false,
        publishedAt: d.publishedAt ? new Date(d.publishedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        contentText: Array.isArray(d.content) ? d.content.map((b: BlogBlock) => `${b.type === 'heading' ? '## ' : ''}${b.text}`).join('\n\n') : '',
      });
    });
  }, [postId]);

  const generatedSlug = useMemo(() => slugify(form.title || ''), [form.title]);

  function parseContent(text: string): BlogBlock[] {
    return text
      .split(/\n\s*\n/)
      .map(block => block.trim())
      .filter(Boolean)
      .map(block => block.startsWith('## ')
        ? { type: 'heading' as const, text: block.replace(/^##\s+/, '').trim() }
        : { type: 'paragraph' as const, text: block });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title,
      slug: form.slug || generatedSlug,
      description: form.description,
      excerpt: form.excerpt,
      category: form.category,
      thumbnail: form.thumbnail || null,
      gallery: form.galleryText.split('\n').map(x => x.trim()).filter(Boolean),
      keywords: form.keywords.split(',').map(x => x.trim()).filter(Boolean),
      published: form.published,
      publishedAt: form.publishedAt,
      content: parseContent(form.contentText),
    };

    const url = postId ? `/api/blog/${postId}` : '/api/blog';
    const method = postId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      router.push('/blog');
      router.refresh();
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.error || 'Lỗi khi lưu bài viết');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">{postId ? 'Sửa bài viết' : 'Thêm bài viết'}</h2>
        <div className="flex gap-2">
          <button type="button" onClick={() => router.push('/blog')} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">← Quay lại</button>
          <button disabled={saving} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50">
            {saving ? 'Đang lưu...' : 'Lưu bài viết'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Tiêu đề</label>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border rounded-lg px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder={generatedSlug} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Chuyên mục</label>
          <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Mô tả SEO</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border rounded-lg px-3 py-2" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Excerpt</label>
          <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={3} className="w-full border rounded-lg px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
          <input value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Keywords</label>
          <input value={form.keywords} onChange={e => setForm({ ...form, keywords: e.target.value })} placeholder="kw1, kw2, kw3" className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Gallery URLs</label>
          <textarea value={form.galleryText} onChange={e => setForm({ ...form, galleryText: e.target.value })} rows={4} placeholder="Mỗi dòng 1 ảnh" className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ngày đăng</label>
          <input type="datetime-local" value={form.publishedAt} onChange={e => setForm({ ...form, publishedAt: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div className="flex items-center gap-2 pt-7">
          <input id="published" type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
          <label htmlFor="published" className="text-sm font-medium">Công khai</label>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-5">
        <label className="block text-sm font-medium mb-2">Nội dung</label>
        <p className="text-xs text-gray-500 mb-2">Dùng dòng bắt đầu bằng <code>## </code> để tạo heading. Cách đoạn bằng 1 dòng trống.</p>
        <textarea value={form.contentText} onChange={e => setForm({ ...form, contentText: e.target.value })} rows={20} className="w-full border rounded-lg px-3 py-2 font-mono text-sm" required />
      </div>
    </form>
  );
}
