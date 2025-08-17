import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// --- LAYOUT COMPONENTS ---
import DefaultLayout from './components/DefaultLayout';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// --- CORE & AUTH PAGES ---
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// --- CUSTOMER ACCOUNT PAGES ---
import CustomerDashboardPage from './pages/customer/CustomerDashboardPage';
import ProfilePage from './pages/ProfilePage';
import UpdateProfilePage from './pages/UpdateProfilePage';
import OrderHistoryPage from './pages/customer/OrderHistoryPage';
import WishlistPage from './pages/customer/WishlistPage';

// --- E-COMMERCE PUBLIC PAGES ---
import ProductListPage from './pages/public/ProductListPage';
import ProductDetailPage from './pages/public/ProductDetailPage';
import CustomerSupportPage from './pages/support/CustomerSupportPage';

// --- CHECKOUT PROCESS PAGES ---
import ShoppingCartPage from './pages/checkout/ShoppingCartPage';
import CheckoutPage from './pages/checkout/CheckoutPage';

// --- ADMIN PAGES ---
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import AddNewProductPage from './pages/admin/AddNewProductPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import SettingsPage from './pages/admin/SettingsPage';
import EditProductPage from './pages/admin/EditProductPage';


function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true }}>
      <AuthProvider> 
        {/*
          ==========================================
          --- THIS IS THE ONLY LINE THAT HAS CHANGED ---
          The `future` prop has been added to the <Routes> component below
          to resolve the warnings from React Router.
          ==========================================
        */}
        <Routes future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>

          {/* --- PUBLIC & CUSTOMER ROUTES --- */}
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<HomePage />} /> 
            <Route path="products" element={<ProductListPage />} />
            <Route path="products/:productId" element={<ProductDetailPage />} />
            <Route path="support" element={<CustomerSupportPage />} />
            <Route path="signin" element={<SignInPage />} />
            <Route path="signup" element={<SignUpPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="dashboard" element={<ProtectedRoute><CustomerDashboardPage /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="profile/update" element={<ProtectedRoute><UpdateProfilePage /></ProtectedRoute>} />
            <Route path="orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
            <Route path="wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
            <Route path="cart" element={<ProtectedRoute><ShoppingCartPage /></ProtectedRoute>} />
            <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          </Route>

          {/* --- ADMIN ROUTES --- */}
          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="products" element={<ProductManagementPage />} />
            <Route path="products/new" element={<AddNewProductPage />} />
            <Route path="orders" element={<OrderManagementPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="products/edit/:productId" element={<EditProductPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;