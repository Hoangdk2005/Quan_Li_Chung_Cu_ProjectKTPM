import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';

// --- IMPORT LAYOUT & AUTH ---
import MainLayout from './app/layouts/MainLayout';
import ResidentLayout from './app/layouts/ResidentLayout';
import PrivateRoute from './routes/PrivateRoute';
import Login from './app/pages/Login';
import Register from './app/pages/Register';

// --- IMPORT CÁC PAGE CHỨC NĂNG (ADMIN) ---
import Dashboard from './app/pages/Dashboard';
import Notifications from './app/pages/Notifications';
import Users from './app/pages/Users';
import Households from './app/pages/Households';
import HouseholdDetail from './app/pages/HouseholdDetail';
import Persons from './app/pages/Persons';
import Residents from './app/pages/Resident'; // File tên là Resident.tsx nhưng component thường gọi là Residents
import Vehicles from './app/pages/Vehicles';
import Apartments from './app/pages/Apartments';

// --- IMPORT QUẢN LÝ PHÍ ---
import FeeItems from './app/pages/FeeItems';
import FeePeriods from './app/pages/FeePeriods';
import FeeObligations from './app/pages/FeeObligations';

// --- IMPORT CÁC PAGE CHO CƯ DÂN ---
import ResidentDashboard from './app/pages/resident/ResidentDashboard';
import ResidentFees from './app/pages/resident/ResidentFees';
import ResidentNotifications from './app/pages/resident/ResidentNotifications';
import ResidentProfile from './app/pages/resident/ResidentProfile';

// Component Dummy cho trang chưa có
const Settings = () => <div><h2>Trang Cài Đặt (Đang phát triển)</h2></div>;

export default function App() {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <Routes>
          {/* 1. Route Public (Không cần đăng nhập) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 2. Route Protected (Cần đăng nhập) */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<MainLayout />}>
              
              {/* Redirect mặc định về dashboard */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />

              {/* --- NHÓM QUẢN LÝ CƯ DÂN --- */}
              <Route path="households" element={<Households />} />
              <Route path="households/:id" element={<HouseholdDetail />} />
              <Route path="residents" element={<Residents />} />
              <Route path="persons/:householdId" element={<Persons />} />
              <Route path="vehicles" element={<Vehicles />} />

              {/* --- NHÓM QUẢN LÝ PHÍ & DỊCH VỤ --- */}
              <Route path="fee-items" element={<FeeItems />} />
              <Route path="fee-periods" element={<FeePeriods />} />
              <Route path="fee-obligations" element={<FeeObligations />} />

              {/* --- NHÓM HỆ THỐNG & TIỆN ÍCH --- */}
              <Route path="users" element={<Users />} />
              <Route path="apartments" element={<Apartments />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} />

            </Route>
          </Route>

          {/* 3. Route cho Cư dân (Resident User) */}
          <Route element={<PrivateRoute />}>
            <Route path="/resident" element={<ResidentLayout />}>
              <Route index element={<Navigate to="/resident/dashboard" replace />} />
              <Route path="dashboard" element={<ResidentDashboard />} />
              <Route path="fees" element={<ResidentFees />} />
              <Route path="notifications" element={<ResidentNotifications />} />
              <Route path="profile" element={<ResidentProfile />} />
            </Route>
          </Route>

          {/* Catch-all: Nếu nhập đường dẫn sai thì về Login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}