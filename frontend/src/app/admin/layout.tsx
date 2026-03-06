import { isAuthenticated } from '@/lib/auth';
import AdminShell from './AdminShell';

export const metadata = {
  title: 'Admin - Sơn Hằng Travel',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthenticated();
  if (!authed) return <>{children}</>;
  return <AdminShell>{children}</AdminShell>;
}
