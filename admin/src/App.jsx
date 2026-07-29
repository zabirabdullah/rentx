import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import DashboardHome from './components/DashboardHome';
import UserManagement from './components/UserManagement';
import PropertyApprovals from './components/PropertyApprovals';
import ServiceManagement from './components/ServiceManagement';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="properties" element={<PropertyApprovals />} />
          <Route path="services" element={<ServiceManagement />} />
        </Route>
        {/* Redirect root to /admin */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
