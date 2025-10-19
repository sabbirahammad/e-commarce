import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
