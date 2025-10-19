import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
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
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Products', path: '/products', icon: Package },
  { name: 'Orders', path: '/orders', icon: ClipboardList },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Reports', path: '/reports', icon: BarChart2 },
  { name: 'Coupons', path: '/coupons', icon: Tag },
  { name: 'Messages', path: '/messages', icon: MessageSquare },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Admin Users', path: '/admin-users', icon: ShieldCheck },
];

export const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 sm:w-72 md:w-64
        bg-white border-r shadow-lg md:shadow-md
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col h-full
      `}>
        {/* Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 tracking-wide">Admin Panel</h1>
          <button
            onClick={onClose}
            className="md:hidden p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-1">
          <h2 className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide pl-2 mb-3">Navigation</h2>

          {adminMenu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-150 text-sm font-medium ${
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

        {/* Bottom section */}
        <div className="px-3 sm:px-4 pb-4 border-t space-y-1">
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-100 text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
              }`
            }
          >
            <Settings size={20} /> <span>Settings</span>
          </NavLink>
          <NavLink
            to="/delivery-costs"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-100 text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
              }`
            }
          >
            <Package size={20} /> <span>Delivery Costs</span>
          </NavLink>

          <button
            onClick={() => {
              alert('Logout logic here');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-100 transition-colors"
          >
            <LogOut size={20} /> <span>Logout</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 text-xs text-gray-400 border-t">
          © {new Date().getFullYear()} OUTZEN
        </div>
      </aside>
    </>
  );
};

