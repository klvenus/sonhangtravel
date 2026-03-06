import './globals.css';

export const metadata = {
  title: 'Admin — Sơn Hằng Travel',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-56 bg-white border-r border-gray-200 flex-shrink-0">
            <div className="p-4 border-b">
              <h1 className="text-lg font-bold text-green-600">🏝️ SH Admin</h1>
              <p className="text-xs text-gray-400">Local only</p>
            </div>
            <nav className="p-3 space-y-1">
              <NavLink href="/" icon="📊" label="Dashboard" />
              <NavLink href="/tours" icon="🗺️" label="Tours" />
              <NavLink href="/tours/new" icon="➕" label="Thêm tour" />
              <NavLink href="/categories" icon="📁" label="Danh mục" />
              <NavLink href="/settings" icon="⚙️" label="Cài đặt" />
              <NavLink href="/upload" icon="🖼️" label="Upload ảnh" />
              <div className="pt-3 border-t mt-3">
                <NavLink href="/seed" icon="🌱" label="Seed data" />
                <NavLink href="/revalidate" icon="🔄" label="Revalidate" />
              </div>
            </nav>
          </aside>
          {/* Main content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <a
      href={href}
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors"
    >
      <span>{icon}</span>
      {label}
    </a>
  );
}
