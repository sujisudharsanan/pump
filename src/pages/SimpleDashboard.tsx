import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SimpleDashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const navigate = useNavigate();

  const menuItems = {
    dashboard: 'Dashboard',
    sales: 'Sales',
    billing: 'Billing',
    inventory: 'Inventory',
    production: 'Production',
    purchase: 'Purchase',
    hr: 'Human Resources',
    finance: 'Finance',
    reports: 'Reports',
    settings: 'Settings',
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const setActivePage = (page: string) => {
    setCurrentPage(page);
  };

  const renderDashboard = () => {
    return (
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Total Sales</h3>
            <p className="text-3xl font-bold">₹1,25,000</p>
            <p className="text-blue-100 text-sm mt-2">+12% from last month</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold">₹95,000</p>
            <p className="text-green-100 text-sm mt-2">+8% from last month</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Active Customers</h3>
            <p className="text-3xl font-bold">342</p>
            <p className="text-purple-100 text-sm mt-2">+5% from last month</p>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Pending Orders</h3>
            <p className="text-3xl font-bold">23</p>
            <p className="text-orange-100 text-sm mt-2">-15% from last month</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                  ₹
                </div>
                <div className="ml-4">
                  <p className="font-semibold">New Sale Completed</p>
                  <p className="text-gray-600 text-sm">Invoice #INV-001 - ₹5,500</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  📦
                </div>
                <div className="ml-4">
                  <p className="font-semibold">Inventory Updated</p>
                  <p className="text-gray-600 text-sm">Stock levels synchronized</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  👥
                </div>
                <div className="ml-4">
                  <p className="font-semibold">New Customer Registered</p>
                  <p className="text-gray-600 text-sm">John Doe joined today</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setActivePage('sales')}
                className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="text-2xl mb-2">🛒</div>
                <p className="font-semibold text-blue-700">New Sale</p>
              </button>
              
              <button
                onClick={() => setActivePage('billing')}
                className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="text-2xl mb-2">💰</div>
                <p className="font-semibold text-green-700">Generate Bill</p>
              </button>
              
              <button
                onClick={() => setActivePage('inventory')}
                className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <div className="text-2xl mb-2">📦</div>
                <p className="font-semibold text-purple-700">Check Stock</p>
              </button>
              
              <button
                onClick={() => setActivePage('reports')}
                className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <div className="text-2xl mb-2">📊</div>
                <p className="font-semibold text-orange-700">View Reports</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGenericPage = (pageName: string) => {
    return (
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {menuItems[pageName as keyof typeof menuItems] || pageName}
          </h1>
          <p className="text-gray-600 mb-6">
            This page is under development. Content for {pageName} will be added soon.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Coming Soon:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Advanced {pageName} management</li>
              <li>Real-time data updates</li>
              <li>Export and reporting features</li>
              <li>Integration with other modules</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return renderDashboard();
      default:
        return renderGenericPage(currentPage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Business Portal</h1>
          <p className="text-sm text-gray-600 mt-1">Management System</p>
        </div>

        <nav className="flex-1 p-4">
          {Object.entries(menuItems).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActivePage(key)}
              className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${
                currentPage === key
                  ? 'bg-yellow-100 text-yellow-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm font-semibold rounded-lg text-red-600 bg-red-50 border border-red-600 hover:bg-red-100 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {menuItems[currentPage as keyof typeof menuItems] || currentPage}
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome,{' '}
                {JSON.parse(localStorage.getItem('user') || '{}').email || 'User'}
                {JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' && (
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                    ADMIN
                  </span>
                )}
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  JSON.parse(localStorage.getItem('user') || '{}').role === 'admin'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                }`}
              >
                <span className="text-white text-sm font-semibold">
                  {(JSON.parse(localStorage.getItem('user') || '{}').email || 'U')[0].toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{renderCurrentPage()}</main>
      </div>
    </div>
  );
};

export default SimpleDashboard;
