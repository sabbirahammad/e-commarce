import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ClipboardList,
  BarChart2,
  Settings,
  LogOut,
  Tag,
  MessageSquare,
  Bell,
  ShieldCheck
} from 'lucide-react';

const adminMenu = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Orders', path: '/admin/orders', icon: ClipboardList },
  { name: 'Customers', path: '/admin/customers', icon: Users },
  { name: 'Reports', path: '/admin/reports', icon: BarChart2 },
  { name: 'Coupons', path: '/admin/coupons', icon: Tag },
  { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
  { name: 'Notifications', path: '/admin/notifications', icon: Bell },
  { name: 'Admin Users', path: '/admin/admin-users', icon: ShieldCheck },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-white border-r shadow-md hidden md:flex flex-col">
      <div className="h-16 px-4 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold text-gray-800 tracking-wide">Admin Panel</h1>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        <h2 className="text-sm text-gray-400 uppercase tracking-wide pl-2 mb-2">Navigation</h2>

        {adminMenu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 text-sm font-medium ${
                isActive
                  ? 'bg-blue-100 text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
              }`
            }
          >
            <item.icon size={20} className="shrink-0" />
            <span className="truncate">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 pb-4 border-t space-y-2">
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'bg-blue-100 text-blue-600 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
            }`
          }
        >
          <Settings size={20} /> <span>Settings</span>
        </NavLink>

        <button
          onClick={() => alert('Logout logic here')}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-100 transition"
        >
          <LogOut size={20} /> <span>Logout</span>
        </button>
      </div>

      <div className="p-4 text-xs text-gray-400 border-t mt-auto">
        © {new Date().getFullYear()} YourCompany
      </div>
    </aside>
  );
};

