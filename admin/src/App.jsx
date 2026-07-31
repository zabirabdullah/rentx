import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import DashboardHome from './components/DashboardHome';
import UserManagement from './components/UserManagement';
import PropertyApprovals from './components/PropertyApprovals';
import ServiceManagement from './components/ServiceManagement';
import ReportsManagement from './components/ReportsManagement';
import Login from './components/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/admin" replace /> : <Login />} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<DashboardHome />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="properties" element={<PropertyApprovals />} />
        <Route path="reports" element={<ReportsManagement />} />
        <Route path="services" element={<ServiceManagement />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
