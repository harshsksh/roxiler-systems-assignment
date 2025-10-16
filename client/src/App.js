import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Dashboard
import Dashboard from './components/dashboard/Dashboard';

// Admin Components
import UserManagement from './components/admin/UserManagement';
import StoreManagement from './components/admin/StoreManagement';

// User Components
import StoreList from './components/user/StoreList';
import Profile from './components/user/Profile';

// Store Owner Components
import StoreOwnerDashboard from './components/store/StoreOwnerDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: '#4aed88',
                },
              },
              error: {
                duration: 5000,
                theme: {
                  primary: '#ff6b6b',
                },
              },
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Navigate to="/dashboard" replace />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* System Admin Routes */}
            <Route path="/users" element={
              <ProtectedRoute allowedRoles={['system_admin']}>
                <Layout>
                  <UserManagement />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/admin/stores" element={
              <ProtectedRoute allowedRoles={['system_admin']}>
                <Layout>
                  <StoreManagement />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Normal User Routes */}
            <Route path="/stores" element={
              <ProtectedRoute allowedRoles={['normal_user']}>
                <Layout>
                  <StoreList />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute allowedRoles={['normal_user', 'store_owner']}>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Store Owner Routes */}
            <Route path="/my-store" element={
              <ProtectedRoute allowedRoles={['store_owner']}>
                <Layout>
                  <StoreOwnerDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
