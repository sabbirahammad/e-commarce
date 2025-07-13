import { useEffect, useState } from 'react';
import { Eye, Pencil, Trash2, Download } from 'lucide-react';
import axios from 'axios';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [deletingOrder, setDeletingOrder] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3000/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter((order) => order.status === filterStatus);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handleStatusUpdate = async () => {
    try {
      const response = await axios.patch(`http://localhost:3000/orders/${editingOrder.id}`, {
        status: updatedStatus,
      });
      const updated = orders.map((order) =>
        order.id === editingOrder.id ? response.data : order
      );
      setOrders(updated);
      setEditingOrder(null);
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      await axios.delete(`http://localhost:3000/orders/${deletingOrder.id}`);
      setOrders((prev) => prev.filter((o) => o.id !== deletingOrder.id));
      setDeletingOrder(null);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Customer', 'Total', 'Status', 'Date'];
    const rows = filteredOrders.map(order => [
      order.customer,
      order.total,
      order.status,
      order.date
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,'
      + headers.join(',') + '\n'
      + rows.map(e => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'orders.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">All Orders</h2>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm text-gray-600">Filter by status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border bg-white rounded-xl">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order, index) => (
                <tr key={order.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="p-3">{order.customer}</td>
                  <td className="p-3">৳{order.total}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3">{order.date}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 rounded hover:bg-gray-100"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setEditingOrder(order);
                        setUpdatedStatus(order.status);
                      }}
                      className="p-1.5 rounded hover:bg-gray-100"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => setDeletingOrder(order)}
                      className="p-1.5 rounded hover:bg-red-100 text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === i + 1
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {i + 1}
          </button>
        ))}
        
      </div>
   {/* View Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Order Details</h3>
            <p><strong>Customer:</strong> {selectedOrder.customer}</p>
            <p><strong>Total:</strong> ৳{selectedOrder.total}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Date:</strong> {selectedOrder.date}</p>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Order Status</h3>
            <p className="mb-2 text-sm">Customer: {editingOrder.customer}</p>

            <select
              value={updatedStatus}
              onChange={(e) => setUpdatedStatus(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingOrder(null)}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Order Confirmation Modal */}
      {deletingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Confirm Delete</h3>
            <p className="text-sm text-gray-700 mb-4">
              Are you sure you want to delete order from <strong>{deletingOrder.customer}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingOrder(null)}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteOrder}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderListPage;



