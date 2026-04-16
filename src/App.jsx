import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import Header from './components/Header';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CheckoutPage from './pages/CheckoutPage';
import ScannerPage from './pages/ScannerPage';
import AddAssetPage from './pages/AddAssetPage';
import './index.css';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useStore();
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  const { user } = useStore();

  return (
    <div className="app">
      {user && <Header />}
      <main className="container mt-4">
        <Routes>
          <Route path="/" element={user ? (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/user" />) : <Login />} />
          <Route path="/user" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/scanner" element={<ProtectedRoute role="admin"><ScannerPage /></ProtectedRoute>} />
          <Route path="/admin/add-asset" element={<ProtectedRoute role="admin"><AddAssetPage /></ProtectedRoute>} />
          <Route path="/checkout/:id" element={<ProtectedRoute role="user"><CheckoutPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <Router>
        <AppRoutes />
      </Router>
    </StoreProvider>
  );
}

export default App;
