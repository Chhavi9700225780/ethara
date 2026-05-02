import { Link, useLocation } from 'react-router-dom'; // ✅ FIXED
import { LayoutDashboard, FolderKanban, CheckSquare, Users } from 'lucide-react';
import { cn } from './ui/utils';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, adminOnly: false },
  { name: 'Projects', path: '/projects', icon: FolderKanban, adminOnly: false },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare, adminOnly: false },
  { name: 'Users', path: '/admin/users', icon: Users, adminOnly: true },
];

export function AppSidebar() {
  const location = useLocation();
  const { isAdmin } = useAuth();

  return (
    <aside className="w-64 border-r bg-gray-50 p-6">
      <nav className="space-y-2">
        {navItems
          .filter(item => !item.adminOnly || isAdmin) // ✅ ADMIN FILTER
          .map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
      </nav>
    </aside>
  );
}