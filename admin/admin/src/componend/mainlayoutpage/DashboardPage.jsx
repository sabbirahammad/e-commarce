import {
  ShoppingCart,
  DollarSign,
  Package,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const stats = [
  {
    label: 'Total Orders',
    value: 1248,
    icon: ShoppingCart,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    label: 'Total Sales',
    value: 185320,
    icon: DollarSign,
    color: 'bg-green-100 text-green-600',
  },
  {
    label: 'Products in Stock',
    value: 329,
    icon: Package,
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    label: 'Total Customers',
    value: 768,
    icon: Users,
    color: 'bg-purple-100 text-purple-600',
  },
];

const DashboardPage = () => {
  const [animatedStats, setAnimatedStats] = useState(stats.map(s => ({ ...s, animatedValue: 0 })));
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedStats(prev =>
        prev.map((s) => {
          const step = Math.ceil(s.value / 30);
          const nextVal = s.animatedValue + step;
          return {
            ...s,
            animatedValue: nextVal >= s.value ? s.value : nextVal,
          };
        })
      );
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {animatedStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition rounded-2xl p-5 flex items-center space-x-4"
          >
            <div className={`p-3 rounded-full ${stat.color}`}>
              <stat.icon size={26} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {stat.label.includes('Sales')
                  ? `৳${stat.animatedValue.toLocaleString()}`
                  : stat.animatedValue.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 mt-10 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/admin/add-product')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg"
          >
            Add Product
          </button>
          <button
            onClick={() => navigate('/admin/orders')}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-lg"
          >
            View Orders
          </button>
          <button
            onClick={() => navigate('/admin/products')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium py-2 px-4 rounded-lg"
          >
            Manage Stock
          </button>
          <button
            onClick={() => navigate('/admin/customers')}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-4 rounded-lg"
          >
            Customers
          </button>
        </div>
      </div>

      {/* Recent Activity Example */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>✅ Order #1024 marked as completed</li>
          <li>🛒 New product "Modern Hoodie" added</li>
          <li>👤 Customer "Arif H." created an account</li>
          <li>📦 Stock updated for "Winter Jacket"</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;

