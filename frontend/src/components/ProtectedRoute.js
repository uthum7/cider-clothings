// src/components/ProtectedRoute.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    // Destructure directly from context
    const { isLoggedIn, user } = useAuth();
    const location = useLocation();

    // Log the values being checked for debugging
    console.log("ProtectedRoute Check - isLoggedIn:", isLoggedIn, "User Object:", user);

    // If not logged in, redirect to signin
    if (!isLoggedIn) {
        console.log("ProtectedRoute: Redirecting to /signin (not logged in)");
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    // If adminOnly is true AND user is logged in AND user.role is NOT 'admin'
    if (adminOnly && user && user.role !== 'admin') {
        console.log("ProtectedRoute: Redirecting to /dashboard (admin access denied)");
        return <Navigate to="/dashboard" replace />; // Or to an "/unauthorized" page
    }

    // If all checks pass (logged in, and either not adminOnly OR is admin)
    return children;
};

export default ProtectedRoute;