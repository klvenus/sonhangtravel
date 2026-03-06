import { db } from '@/lib/db';
import { tours, categories, siteSettings } from '@/lib/schema';
import { sql } from 'drizzle-orm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [tourCount] = await db.select({ count: sql<number>`count(*)` }).from(tours);
  const [catCount] = await db.select({ count: sql<number>`count(*)` }).from(categories);
  const [publishedCount] = await db.select({ count: sql<number>`count(*)` }).from(tours).where(sql`published = true`);
  const [featuredCount] = await db.select({ count: sql<number>`count(*)` }).from(tours).where(sql`featured = true`);
  const [settings] = await db.select().from(siteSettings).limit(1);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat icon="🗺️" label="Tổng tour" value={Number(tourCount.count)} color="blue" />
        <Stat icon="✅" label="Đã xuất bản" value={Number(publishedCount.count)} color="green" />
        <Stat icon="⭐" label="Nổi bật" value={Number(featuredCount.count)} color="yellow" />
        <Stat icon="📁" label="Danh mục" value={Number(catCount.count)} color="purple" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/tours/new" className="bg-green-600 text-white rounded-xl p-4 flex items-center gap-3 hover:bg-green-700 transition-colors">
          <span className="text-2xl">➕</span>
          <div><p className="font-semibold">Thêm tour mới</p><p className="text-sm text-green-100">Tạo tour du lịch</p></div>
        </Link>
        <Link href="/categories" className="bg-purple-600 text-white rounded-xl p-4 flex items-center gap-3 hover:bg-purple-700 transition-colors">
          <span className="text-2xl">📁</span>
          <div><p className="font-semibold">Quản lý danh mục</p><p className="text-sm text-purple-100">Thêm, sửa, xóa</p></div>
        </Link>
        <Link href="/settings" className="bg-blue-600 text-white rounded-xl p-4 flex items-center gap-3 hover:bg-blue-700 transition-colors">
          <span className="text-2xl">⚙️</span>
          <div><p className="font-semibold">Cài đặt site</p><p className="text-sm text-blue-100">Logo, banner, thông tin</p></div>
        </Link>
      </div>

      {/* Site info */}
      {settings && (
        <div className="bg-white rounded-xl border p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Thông tin site</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-gray-500">Tên:</span> {settings.siteName}</div>
            <div><span className="text-gray-500">SĐT:</span> {settings.phoneNumber}</div>
            <div><span className="text-gray-500">Email:</span> {settings.email}</div>
            <div><span className="text-gray-500">Zalo:</span> {settings.zaloNumber}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200', green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200', purple: 'bg-purple-50 border-purple-200',
  };
  return (
    <div className={`rounded-xl border p-4 ${colors[color] || 'bg-gray-50 border-gray-200'}`}>
      <div className="text-2xl">{icon}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}
