import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import { ApiErrorHandler } from '../utils/ApiErrorHandler';

interface DashboardStats {
  totalPumps: number;
  activePumps: number;
  todaysSales: number;
  totalTransactions: number;
}

interface PumpStatus {
  id: number;
  status: 'active' | 'inactive' | 'maintenance';
  fuelLevel: number;
  currentTransaction?: string;
}

const Dashboard: React.FC = React.memo(() => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPumps: 0,
    activePumps: 0,
    todaysSales: 0,
    totalTransactions: 0,
  });
  const [pumps, setPumps] = useState<PumpStatus[]>([]);
  const [userRole] = useState(localStorage.getItem('userRole') || 'manager');
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const fetchDashboardData = useCallback(async () => {
    try {
      // Mock data - replace with actual API calls
      setStats({
        totalPumps: 8,
        activePumps: 6,
        todaysSales: 25430.5,
        totalTransactions: 142,
      });

      setPumps([
        {
          id: 1,
          status: 'active',
          fuelLevel: 85,
          currentTransaction: 'TXN001',
        },
        { id: 2, status: 'active', fuelLevel: 92 },
        { id: 3, status: 'maintenance', fuelLevel: 15 },
        { id: 4, status: 'active', fuelLevel: 78 },
        { id: 5, status: 'inactive', fuelLevel: 5 },
        { id: 6, status: 'active', fuelLevel: 88 },
        { id: 7, status: 'active', fuelLevel: 76 },
        { id: 8, status: 'active', fuelLevel: 95 },
      ]);
    } catch (error) {
      // Use structured error handling per guidelines (Error Code: 1200)
      const errorMessage = ApiErrorHandler.handleError(
        error as string | number
      );
      showError(errorMessage || 'Failed to load dashboard data');
      ApiErrorHandler.logError(
        typeof error === 'string' ? error : String(error),
        'Dashboard.fetchDashboardData'
      );
    }
  }, [showError]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    showSuccess('Logged out successfully');
    navigate('/login');
  }, [navigate, showSuccess]);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'maintenance':
        return 'bg-yellow-500';
      case 'inactive':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  }, []);

  const getFuelLevelColor = useCallback((level: number) => {
    if (level > 70) return 'bg-green-500';
    if (level > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Petrol Pump Dashboard
              </h1>
              <span
                className={
                  'ml-4 px-3 py-1 bg-yellow-400 text-black text-sm ' +
                  'rounded-full font-medium'
                }
              >
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className={
                'bg-red-500 text-white px-6 py-2 rounded-full text-sm ' +
                'hover:bg-red-600 transition-colors font-medium min-w-fit'
              }
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Pumps</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalPumps}
                </p>
              </div>
              <div
                className={
                  'w-12 h-12 bg-blue-100 rounded-lg flex items-center ' +
                  'justify-center'
                }
              >
                <span className="text-blue-600 text-xl">⛽</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Active Pumps
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.activePumps}
                </p>
              </div>
              <div
                className={
                  'w-12 h-12 bg-green-100 rounded-lg flex items-center ' +
                  'justify-center'
                }
              >
                <span className="text-green-600 text-xl">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Today&apos;s Sales
                </p>
                <p className="text-3xl font-bold text-yellow-600">
                  ${stats.todaysSales.toLocaleString()}
                </p>
              </div>
              <div
                className={
                  'w-12 h-12 bg-yellow-100 rounded-lg flex items-center ' +
                  'justify-center'
                }
              >
                <span className="text-yellow-600 text-xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Transactions
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.totalTransactions}
                </p>
              </div>
              <div
                className={
                  'w-12 h-12 bg-purple-100 rounded-lg flex items-center ' +
                  'justify-center'
                }
              >
                <span className="text-purple-600 text-xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pump Status Grid */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Pump Status Overview
            </h2>
          </div>
          <div className="p-6">
            <div
              className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'}
            >
              {pumps.map(pump => (
                <div
                  key={pump.id}
                  className={
                    'border border-gray-200 rounded-lg p-4 hover:shadow-md ' +
                    'transition-shadow'
                  }
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">
                      Pump {pump.id}
                    </h3>
                    <span
                      className={`w-3 h-3 rounded-full ${getStatusColor(pump.status)}`}
                    ></span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div
                        className={
                          'flex justify-between text-sm text-gray-600 mb-1'
                        }
                      >
                        <span>Fuel Level</span>
                        <span>{pump.fuelLevel}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getFuelLevelColor(pump.fuelLevel)}`}
                          style={{ width: `${pump.fuelLevel}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-sm">
                      <span className="text-gray-600">Status: </span>
                      <span
                        className={`font-medium capitalize ${
                          pump.status === 'active'
                            ? 'text-green-600'
                            : pump.status === 'maintenance'
                              ? 'text-yellow-600'
                              : 'text-red-600'
                        }`}
                      >
                        {pump.status}
                      </span>
                    </div>

                    {pump.currentTransaction && (
                      <div className="text-sm">
                        <span className="text-gray-600">Transaction: </span>
                        <span className="font-medium text-blue-600">
                          {pump.currentTransaction}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
