import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { validatePassword } from '../../utils/validation';
import FormInput from '../FormInput';
import Button from '../Button';
import { User, Lock, Mail, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updatePassword } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    const passwordError = validatePassword(passwordData.newPassword);
    if (passwordError) newErrors.newPassword = passwordError;
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setLoading(true);
    try {
      const result = await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      if (result.success) {
        setShowPasswordForm(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setErrors({});
      }
    } catch (error) {
      console.error('Password update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordForm = () => {
    setShowPasswordForm(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account information</p>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-sm text-gray-900">{user?.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-sm text-gray-900">{user?.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p className="text-sm text-gray-900">{user?.address}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="h-5 w-5 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-400">ROLE</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Role</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user?.role === 'system_admin' ? 'bg-red-100 text-red-800' :
                user?.role === 'store_owner' ? 'bg-green-100 text-green-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {user?.role.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Password Management */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Password Management</h2>
          <Button
            variant="outline"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="flex items-center"
          >
            <Lock className="h-4 w-4 mr-2" />
            {showPasswordForm ? 'Cancel' : 'Change Password'}
          </Button>
        </div>
        
        {showPasswordForm && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <FormInput
              label="Current Password"
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              error={errors.currentPassword}
              placeholder="Enter your current password"
              required
            />
            
            <FormInput
              label="New Password"
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              error={errors.newPassword}
              placeholder="Enter new password (8-16 chars, 1 uppercase, 1 special)"
              required
            />
            
            <FormInput
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              error={errors.confirmPassword}
              placeholder="Confirm your new password"
              required
            />
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={resetPasswordForm}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={loading}
              >
                Update Password
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
