import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Không cần định nghĩa interface Props vì dùng Outlet
const PrivateRoute: React.FC = () => {
  const token = localStorage.getItem('token');

  // Logic: 
  // - Nếu có token: Render <Outlet /> (đây là nơi các trang con như Dashboard, Households... sẽ hiển thị)
  // - Nếu không: Đá về trang Login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;