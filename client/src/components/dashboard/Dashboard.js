import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { Users, Store, Star, TrendingUp } from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (user?.role === 'system_admin') {
        try {
          const response = await userService.getDashboardStats();
          setStats(response.data);
        } catch (error) {
          console.error('Failed to fetch dashboard stats:', error);
        }
      }
      setLoading(false);
    };

    fetchStats();
  }, [user]);

  const getWelcomeMessage = () => {
    switch (user?.role) {
      case 'system_admin':
        return 'Welcome to the System Administration Dashboard';
      case 'store_owner':
        return 'Welcome to your Store Management Dashboard';
      case 'normal_user':
        return 'Welcome to the Store Rating System';
      default:
        return 'Welcome';
    }
  };

  const getRoleDescription = () => {
    switch (user?.role) {
      case 'system_admin':
        return 'Manage users, stores, and monitor system statistics';
      case 'store_owner':
        return 'View your store ratings and manage your business';
      case 'normal_user':
        return 'Rate and review stores in your area';
      default:
        return '';
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="mt-8" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">{getWelcomeMessage()}</h1>
        <p className="text-gray-600 mt-2">{getRoleDescription()}</p>
      </div>

      {/* Stats Cards - Only for System Admin */}
      {user?.role === 'system_admin' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Store className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Stores</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalStores}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Ratings</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalRatings}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user?.role === 'system_admin' && (
            <>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <Users className="h-6 w-6 text-blue-600 mb-2" />
                <h3 className="font-medium text-gray-900">Manage Users</h3>
                <p className="text-sm text-gray-500">Add, edit, or remove users</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <Store className="h-6 w-6 text-green-600 mb-2" />
                <h3 className="font-medium text-gray-900">Manage Stores</h3>
                <p className="text-sm text-gray-500">Add, edit, or remove stores</p>
              </button>
            </>
          )}
          
          {user?.role === 'normal_user' && (
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <Store className="h-6 w-6 text-blue-600 mb-2" />
              <h3 className="font-medium text-gray-900">Browse Stores</h3>
              <p className="text-sm text-gray-500">Find and rate stores</p>
            </button>
          )}
          
          {user?.role === 'store_owner' && (
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <TrendingUp className="h-6 w-6 text-green-600 mb-2" />
              <h3 className="font-medium text-gray-900">View Analytics</h3>
              <p className="text-sm text-gray-500">Check your store performance</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
