import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminLayout from './componend/mainlayoutpage/AdminLayout';
import DashboardPage from './componend/mainlayoutpage/DashboardPage';
import ProductListPage from './componend/products/ProductListPage';
import AddProductForm from './componend/products/AddProductForm';
import CustomerListPage from './componend/castomar/CustomerListPage';
import OrderListPage from './componend/products/OrderListPage';
import OrderDetailsPage from './componend/orders/OrderDetailsPage';
import SalesReportPage from './componend/sells/SalesReportPage';
import RefundRequestPage from './componend/sells/RefundRequestPage';
import AdminSettingsPage from './componend/settingsPage/AdminSettingsPage';
import CouponListPage from './componend/coupon/CouponListPage';
import AddCouponPage from './componend/coupon/AddCouponPage';
import EditCouponPage from './componend/coupon/EditCouponPage';
import MessageListPage from './componend/messages/MessageListPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="add-product" element={<AddProductForm />} />
          <Route path="customers" element={<CustomerListPage />} />
          <Route path="orders" element={<OrderListPage />} />
          <Route path="orders/:id" element={<OrderDetailsPage />} />
          <Route path="reports" element={<SalesReportPage />} />
          <Route path="refunds" element={<RefundRequestPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="coupons" element={<CouponListPage />} />
          <Route path="coupons/add" element={<AddCouponPage />} />
          <Route path="coupons/edit/:id" element={<EditCouponPage />} />
          <Route path="messages" element={<MessageListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;


