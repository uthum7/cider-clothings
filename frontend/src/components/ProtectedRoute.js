import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isLoggedIn, user } = useAuth();
    const location = useLocation();

    if (!isLoggedIn) {
        // Redirect them to the /signin page, but save the current location they were
        // trying to go to. This allows us to send them back after they log in.
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    // If the route is for admins only and the user is not an admin,
    // redirect them to a "not authorized" page or their own dashboard.
    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />; // Or to an "/unauthorized" page
    }

    return children;
};

export default ProtectedRoute;