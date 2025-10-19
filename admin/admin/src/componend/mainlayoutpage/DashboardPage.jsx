import {
  ShoppingCart,
  DollarSign,
  Package,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OrderGraph from './OrderGraph';

const DashboardPage = () => {
  const { token } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    orders: {
      totalOrders: 0,
      totalRevenue: 0,
      monthlyRevenue: 0,
      dailyRevenue: []
    },
    products: {
      totalProducts: 0,
      trendingProducts: 0,
      topProducts: 0
    },
    users: {
      totalUsers: 0,
      recentUsers: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setError('No admin token found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch order stats
        const orderResponse = await fetch('http://localhost:5000/api/v1/orders/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Fetch product stats
        const productResponse = await fetch('http://localhost:5000/api/v1/products/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Fetch user stats
        const userResponse = await fetch('http://localhost:5000/api/v1/user/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!orderResponse.ok || !productResponse.ok || !userResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const orderData = await orderResponse.json();
        const productData = await productResponse.json();
        const userData = await userResponse.json();

        if (orderData.success && productData.success && userData.success) {
          setDashboardData({
            orders: {
              totalOrders: orderData.stats.totalOrders,
              totalRevenue: orderData.stats.totalRevenue,
              monthlyRevenue: orderData.stats.monthlyRevenue,
              dailyRevenue: orderData.stats.dailyRevenue || []
            },
            products: {
              totalProducts: productData.stats.totalProducts,
              trendingProducts: productData.stats.trendingProducts,
              topProducts: productData.stats.topProducts
            },
            users: {
              totalUsers: userData.stats.totalUsers,
              recentUsers: userData.stats.recentUsers
            }
          });
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  // Animation effect for stats
  const [animatedStats, setAnimatedStats] = useState([
    { label: 'Total Orders', value: 0, icon: ShoppingCart, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Sales', value: 0, icon: DollarSign, color: 'bg-green-100 text-green-600' },
    { label: 'Products in Stock', value: 0, icon: Package, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Total Customers', value: 0, icon: Users, color: 'bg-purple-100 text-purple-600' },
  ]);

  useEffect(() => {
    if (!loading && dashboardData.orders.totalOrders > 0) {
      const targetStats = [
        { label: 'Total Orders', value: dashboardData.orders.totalOrders, icon: ShoppingCart, color: 'bg-blue-100 text-blue-600' },
        { label: 'Total Sales', value: dashboardData.orders.totalRevenue, icon: DollarSign, color: 'bg-green-100 text-green-600' },
        { label: 'Products in Stock', value: dashboardData.products.totalProducts, icon: Package, color: 'bg-yellow-100 text-yellow-600' },
        { label: 'Total Customers', value: dashboardData.users.totalUsers, icon: Users, color: 'bg-purple-100 text-purple-600' },
      ];

      setAnimatedStats(targetStats.map(s => ({ ...s, animatedValue: 0 })));

      const interval = setInterval(() => {
        setAnimatedStats(prev =>
          prev.map((stat) => {
            const step = Math.ceil(stat.value / 30);
            const nextVal = stat.animatedValue + step;
            return {
              ...stat,
              animatedValue: nextVal >= stat.value ? stat.value : nextVal,
            };
          })
        );
      }, 30);

      return () => clearInterval(interval);
    }
  }, [loading, dashboardData]);

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

  if (loading) {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h2>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h2>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="text-center">
            <div className="text-red-600 dark:text-red-400 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Error Loading Dashboard</h3>
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-0">
          Admin Dashboard
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Welcome back! Here's your business overview.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {animatedStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center space-x-3 sm:space-x-4"
          >
            <div className={`p-2 sm:p-3 rounded-full ${stat.color}`}>
              <stat.icon size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium truncate">
                {stat.label}
              </p>
              <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                {stat.label.includes('Sales')
                  ? `৳${stat.animatedValue.toLocaleString()}`
                  : stat.animatedValue.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Graph - Temporarily disabled for debugging */}
      {/* <OrderGraph
        dailyRevenue={dashboardData.orders.dailyRevenue}
        monthlyRevenue={dashboardData.orders.monthlyRevenue}
        totalRevenue={dashboardData.orders.totalRevenue}
      /> */}

      {/* Simple Revenue Display */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Revenue Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ৳{dashboardData.orders.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ৳{dashboardData.orders.monthlyRevenue.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {dashboardData.orders.totalOrders}
            </p>
          </div>
        </div>

        {dashboardData.orders.dailyRevenue && dashboardData.orders.dailyRevenue.length > 0 ? (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800 dark:text-white">Recent Daily Revenue</h4>
            <div className="max-h-40 overflow-y-auto">
              {dashboardData.orders.dailyRevenue.slice(0, 10).map((day, index) => (
                <div key={index} className="flex justify-between py-1 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {new Date(day._id.year, day._id.month - 1, day._id.day).toLocaleDateString()}
                  </span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    ৳{day.total.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">📊</div>
            <p>No revenue data available</p>
            <p className="text-sm">Revenue data will appear here once orders are processed</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border dark:border-gray-700 shadow-sm">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/add-product')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium py-2 sm:py-3 px-2 sm:px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </button>
          <button
            onClick={() => navigate('/orders')}
            className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-medium py-2 sm:py-3 px-2 sm:px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <span className="hidden sm:inline">View Orders</span>
            <span className="sm:hidden">Orders</span>
          </button>
          <button
            onClick={() => navigate('/products')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs sm:text-sm font-medium py-2 sm:py-3 px-2 sm:px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <span className="hidden sm:inline">Manage Stock</span>
            <span className="sm:hidden">Stock</span>
          </button>
          <button
            onClick={() => navigate('/customers')}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-medium py-2 sm:py-3 px-2 sm:px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <span className="hidden sm:inline">Customers</span>
            <span className="sm:hidden">Users</span>
          </button>
          <button
            onClick={() => navigate('/category')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium py-2 sm:py-3 px-2 sm:px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <span className="hidden sm:inline">Home Category</span>
            <span className="sm:hidden">Home Cat</span>
          </button>
          <button
            onClick={() => navigate('/allcategories')}
            className="bg-pink-600 hover:bg-pink-700 text-white text-xs sm:text-sm font-medium py-2 sm:py-3 px-2 sm:px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <span className="hidden sm:inline">Top Category</span>
            <span className="sm:hidden">Top Cat</span>
          </button>
          <button
            onClick={() => navigate('/subcategory')}
            className="bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-medium py-2 sm:py-3 px-2 sm:px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <span className="hidden sm:inline">Sub Category</span>
            <span className="sm:hidden">Sub Cat</span>
          </button>
          <button
            onClick={() => navigate('/image')}
            className="bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-medium py-2 sm:py-3 px-2 sm:px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <span className="hidden sm:inline">Hero Image</span>
            <span className="sm:hidden">Hero</span>
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

