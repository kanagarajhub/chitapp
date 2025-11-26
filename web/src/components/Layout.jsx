import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiUsers, FiDollarSign, FiFileText, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: FiHome },
    { name: 'Customers', path: '/customers', icon: FiUsers },
    { name: 'Chit Plans', path: '/chit-plans', icon: FiFileText },
    { name: 'Chits', path: '/chits', icon: FiDollarSign },
    { name: 'Payments', path: '/payments', icon: FiDollarSign },
    { name: 'Auctions/Bids', path: '/bids', icon: FiFileText },
    { name: 'Reports', path: '/reports', icon: FiFileText },
  ];

  if (user?.role === 'admin') {
    navigation.push({ name: 'Employees', path: '/employees', icon: FiSettings });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-primary-600">
          <h1 className="text-xl font-bold text-white">Chit Fund</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white"
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="mt-6 px-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} className="mr-3" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="text-gray-400 hover:text-gray-600"
              title="Logout"
            >
              <FiLogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600"
            >
              <FiMenu size={24} />
            </button>
            <div className="flex items-center ml-auto">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-semibold">{user?.name}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
