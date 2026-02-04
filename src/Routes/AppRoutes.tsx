import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../Pages/Login/Login";
import LandingPage from "../Pages/LandingPage/LandingPage";
import DashboardLayout from "../Layout/DashboarLayout/DashboardLayout";
import Dashboard from "../Pages/Dashboard/Dashboard";
import MenuManagement from "../Pages/MenuManagement/MenuManagement";
import Reports from "../Pages/Reports/Reports";
import OrdersHistory from "../Pages/OrdersHistory/OrdersHistory";
import Settings from "../Pages/Settings/Settings";
import TableManagement from "../Pages/TableManagement/TableManagement";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/menu-management" element={<MenuManagement />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/orders" element={<OrdersHistory />} />
        <Route path="/tables" element={<TableManagement />} />
        <Route path="/settings" element={<Settings />} />
        {/* Add more auth routes here later */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
