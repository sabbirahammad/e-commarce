import { Menu, LogOut } from 'lucide-react';

export const Topbar = () => {
  return (
    <header className="h-16 bg-white flex items-center justify-between px-4 border-b shadow-sm">
      {/* Mobile sidebar toggle - future use */}
      <button className="md:hidden p-2 text-gray-600 hover:text-black">
        <Menu size={24} />
      </button>

      <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>

      {/* Right side user controls */}
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">Admin</span>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};
