// src/App.js
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { ModalProvider } from './context/ModalContext';
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
import RefundPolicyPage from './pages/public/RefundPolicyPage';
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage';
import TermsConditionsPage from './pages/public/TermsConditionsPage';
import FaqPage from './pages/public/FaqPage';
import ContactUsPage from './pages/public/ContactUsPage';

// --- CHECKOUT PROCESS PAGES ---
import ShoppingCartPage from './pages/checkout/ShoppingCartPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import OrderSuccessPage from './pages/checkout/OrderSuccessPage'; // NEW

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
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <ModalProvider>
              <Routes>
                {/* --- PUBLIC & CUSTOMER ROUTES --- */}
                <Route path="/" element={<DefaultLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="products" element={<ProductListPage />} />
                  <Route path="products/:productId" element={<ProductDetailPage />} />
                  <Route path="support" element={<CustomerSupportPage />} />
                  <Route path="faq" element={<FaqPage />} />
                  <Route path="contact" element={<ContactUsPage />} />
                  <Route path="refund-policy" element={<RefundPolicyPage />} />
                  <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="terms-conditions" element={<TermsConditionsPage />} />
                  <Route path="signin" element={<SignInPage />} />
                  <Route path="signup" element={<SignUpPage />} />
                  <Route path="forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="dashboard" element={<ProtectedRoute><CustomerDashboardPage /></ProtectedRoute>} />
                  <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                  <Route path="profile/update" element={<ProtectedRoute><UpdateProfilePage /></ProtectedRoute>} />
                  <Route path="orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
                  <Route path="wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                  <Route path="cart" element={<ShoppingCartPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
                </Route>

                {/* --- ADMIN ROUTES --- */}
                <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>}>
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="products" element={<ProductManagementPage />} />
                  <Route path="products/new" element={<AddNewProductPage />} />
                  <Route path="products/edit/:productId" element={<EditProductPage />} />
                  <Route path="orders" element={<OrderManagementPage />} />
                  <Route path="users" element={<UserManagementPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Routes>
            </ModalProvider>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;