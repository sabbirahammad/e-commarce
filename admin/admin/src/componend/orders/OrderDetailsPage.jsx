// OrderDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to fetch order:', err);
      }
    };
    fetchOrder();
  }, [id]);

  if (!order) return <p className="p-4">Loading order details...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Order #{order.id}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Customer:</strong> {order.customer}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Date:</strong> {order.date}</p>
        </div>
        <div>
          <p><strong>Total Amount:</strong> ৳{order.total}</p>
          <p><strong>Payment:</strong> Paid</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Items</h3>
        <ul className="divide-y">
          {(order.items || []).map((item, i) => (
            <li key={i} className="py-2 flex justify-between">
              <span>{item.name} x {item.qty}</span>
              <span>৳{item.total}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 border-t pt-4 text-right">
        <span className="font-bold text-lg">Grand Total: ৳{order.total}</span>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
