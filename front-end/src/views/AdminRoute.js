import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = ({ }) => {
    const userRole = localStorage.getItem('role');
    return userRole === 'ADMIN' ? <Outlet /> : <Navigate to="/lastest" />;
};

export default AdminRoute;
