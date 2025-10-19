import { Menu, LogOut, Bell, User } from 'lucide-react';

export const Topbar = ({ onMenuClick }) => {
  return (
    <header className="h-16 bg-white flex items-center justify-between px-3 sm:px-4 border-b shadow-sm">
      {/* Mobile sidebar toggle */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* Desktop sidebar toggle */}
      <button
        onClick={onMenuClick}
        className="hidden md:flex p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Menu size={20} />
      </button>

      <h1 className="text-base sm:text-lg font-semibold text-gray-800 ml-2 md:ml-0">
        Admin Dashboard
      </h1>

      {/* Right side user controls */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Notifications */}
        <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} />
        </button>

        {/* User info */}
        <div className="hidden sm:flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <span className="text-sm text-gray-600">Admin</span>
        </div>

        {/* Logout */}
        <button
          onClick={() => alert('Logout logic here')}
          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};
