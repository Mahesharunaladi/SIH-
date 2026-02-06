import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProductsList from './pages/ProductsList';
import CreateProduct from './pages/CreateProduct';
import TracePage from './pages/TracePage';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <ProductsList />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/products/create"
              element={
                <ProtectedRoute allowedRoles={['farmer', 'manufacturer', 'admin']}>
                  <CreateProduct />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/trace"
              element={
                <ProtectedRoute>
                  <TracePage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/trace/:productId"
              element={
                <ProtectedRoute>
                  <TracePage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
