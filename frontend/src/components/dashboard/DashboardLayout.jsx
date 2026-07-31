import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const roleConfig = {
  owner: {
    label: 'Owner',
    color: 'bg-blue-500',
    links: [
      { to: '/dashboard', label: 'Overview', end: true, icon: '📊' },
      { to: '/dashboard/properties', label: 'My Properties', icon: '🏠' },
      { to: '/dashboard/requests', label: 'Rental Requests', icon: '📋' },
    ],
  },
  tenant: {
    label: 'Tenant',
    color: 'bg-sky-500',
    links: [
      { to: '/dashboard', label: 'Overview', end: true, icon: '📊' },
      { to: '/dashboard/rentals', label: 'My Rentals', icon: '🔑' },
      { to: '/dashboard/bookings', label: 'Service Bookings', icon: '🛠️' },
    ],
  },
  company: {
    label: 'Company',
    color: 'bg-orange-500',
    links: [
      { to: '/dashboard', label: 'Overview', end: true, icon: '📊' },
      { to: '/dashboard/services', label: 'Manage Services', icon: '⚙️' },
      { to: '/dashboard/jobs', label: 'Client Jobs', icon: '💼' },
    ],
  },
  admin: {
    label: 'Admin',
    color: 'bg-purple-600',
    links: [
      { to: '/dashboard', label: 'Overview', end: true, icon: '📊' },
      { to: '/dashboard/admin/users', label: 'Manage Users', icon: '👥' },
      { to: '/dashboard/admin/properties', label: 'Properties', icon: '🏢' },
      { to: '/dashboard/admin/companies', label: 'Companies', icon: '🏬' },
      { to: '/dashboard/admin/reports', label: 'Reports', icon: '⚠️' },
    ],
  },
};

const DashboardLayout = () => {
  const { user, logout } = useUser();
  if (!user) return <div className="min-h-screen flex items-center justify-center"><p className="text-slate-500">Not logged in. <Link to="/login" className="text-green-600 font-semibold">Login here</Link></p></div>;

  const config = roleConfig[user.role];

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-slate-900 text-white flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-5 border-b border-slate-700">
          <Link to="/" className="flex items-center gap-2 text-white font-extrabold text-xl">
            <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9L12 2L21 9V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
              </svg>
            </div>
            RentX
          </Link>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full ${config.color} flex items-center justify-center text-white font-bold text-sm`}>
              {user.name ? user.name.charAt(0) : '?'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${config.color} bg-opacity-30 text-white font-medium`}>
                {config.label}
              </span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {config.links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${isActive ? 'bg-green-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`
              }
            >
              <span className="text-base">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>



        {/* Logout */}
        <div className="px-4 pb-5">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-base font-semibold text-slate-800">{config.label} Dashboard</h1>
            <p className="text-xs text-slate-400">Welcome back, {user.name.split(' ')[0]}!</p>
          </div>
          <Link to="/" className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
            ← Back to Home
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
