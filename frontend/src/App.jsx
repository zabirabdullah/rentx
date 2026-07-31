import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import ScrollToTop from './components/ScrollToTop';
import Home from './Home';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import DashboardLayout from './components/dashboard/DashboardLayout';

// Owner pages
import OwnerOverview from './components/dashboard/owner/OwnerOverview';
import ManageProperties from './components/dashboard/owner/ManageProperties';
import RentalRequests from './components/dashboard/owner/RentalRequests';

// Tenant pages
import TenantOverview from './components/dashboard/tenant/TenantOverview';
import MyRentals from './components/dashboard/tenant/MyRentals';
import MyServiceBookings from './components/dashboard/tenant/MyServiceBookings';

// Company pages
import CompanyOverview from './components/dashboard/company/CompanyOverview';
import ManageServices from './components/dashboard/company/ManageServices';
import ClientJobs from './components/dashboard/company/ClientJobs';

// Public pages
import PropertiesPage from './components/public/PropertiesPage';
import PropertyDetailsPage from './components/public/PropertyDetailsPage';
import CompaniesPage from './components/public/CompaniesPage';
import CompanyDetailsPage from './components/public/CompanyDetailsPage';
import ServiceRequestForm from './components/public/ServiceRequestForm';

import './index.css';

// Smart dashboard index — redirects to the right overview based on role
const DashboardIndex = () => {
  const { user } = useUser();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'tenant') return <TenantOverview />;
  if (user.role === 'company') return <CompanyOverview />;
  return <OwnerOverview />; // default to owner
};

function App() {
  return (
    <UserProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/properties/:id" element={<PropertyDetailsPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/companies/:id" element={<CompanyDetailsPage />} />
          <Route path="/request-service/:companyId" element={<ServiceRequestForm />} />

          {/* Dashboard — nested routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardIndex />} />

            {/* Owner routes */}
            <Route path="properties" element={<ManageProperties />} />
            <Route path="requests" element={<RentalRequests />} />

            {/* Tenant routes */}
            <Route path="rentals" element={<MyRentals />} />
            <Route path="bookings" element={<MyServiceBookings />} />

            {/* Company routes */}
            <Route path="services" element={<ManageServices />} />
            <Route path="jobs" element={<ClientJobs />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
