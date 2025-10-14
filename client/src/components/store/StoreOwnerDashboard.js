import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storeService } from '../../services/storeService';
import { Star, Users, TrendingUp, MessageSquare } from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';
import toast from 'react-hot-toast';

const StoreOwnerDashboard = () => {
  const { user } = useAuth();
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchStoreData();
  }, [pagination.page]);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      
      // Find user's store
      const storesResponse = await storeService.getAllStores({ limit: 1000 });
      const userStore = storesResponse.data.stores.find(s => s.ownerId === user.id);
      
      if (userStore) {
        setStore(userStore);
        
        // Fetch store ratings
        const ratingsResponse = await storeService.getStoreRatings(userStore.id, {
          page: pagination.page,
          limit: pagination.limit
        });
        setRatings(ratingsResponse.data.ratings);
        setPagination(ratingsResponse.data.pagination);
      }
    } catch (error) {
      toast.error('Failed to fetch store data');
      console.error('Error fetching store data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 text-yellow-400 fill-current opacity-50" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="mt-8" />;
  }

  if (!store) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <Store className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Store Found</h3>
          <p className="text-gray-500">You don't have a store registered yet. Please contact the system administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Store Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor your store's performance and customer feedback</p>
      </div>

      {/* Store Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{store.name}</h2>
            <p className="text-gray-600">{store.address}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end mb-2">
              {renderStars(store.averageRating)}
            </div>
            <p className="text-sm text-gray-500">
              Average Rating: {store.averageRating.toFixed(1)}/5
            </p>
            <p className="text-sm text-gray-500">
              Total Ratings: {store.totalRatings}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Average Rating</p>
              <p className="text-2xl font-semibold text-gray-900">
                {store.averageRating.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Ratings</p>
              <p className="text-2xl font-semibold text-gray-900">{store.totalRatings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Performance</p>
              <p className="text-2xl font-semibold text-gray-900">
                {store.averageRating >= 4 ? 'Excellent' : 
                 store.averageRating >= 3 ? 'Good' : 
                 store.averageRating >= 2 ? 'Fair' : 'Needs Improvement'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Ratings */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Customer Ratings</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {ratings.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No ratings yet. Encourage your customers to leave feedback!</p>
            </div>
          ) : (
            ratings.map((rating) => (
              <div key={rating.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-900 mr-3">
                        {rating.user.name}
                      </h4>
                      <div className="flex items-center">
                        {renderStars(rating.rating)}
                        <span className="ml-2 text-sm text-gray-500">
                          ({rating.rating}/5)
                        </span>
                      </div>
                    </div>
                    
                    {rating.comment && (
                      <p className="text-sm text-gray-600 mb-2">{rating.comment}</p>
                    )}
                    
                    <p className="text-xs text-gray-500">
                      {new Date(rating.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span> of{' '}
                  <span className="font-medium">{pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
