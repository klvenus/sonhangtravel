import { isAuthenticated } from '@/lib/auth';
import AdminDashboard from './AdminDashboard';
import LoginForm from './LoginForm';

export default async function AdminPage() {
  const authed = await isAuthenticated();
  if (!authed) return <LoginForm />;
  return <AdminDashboard />;
}
