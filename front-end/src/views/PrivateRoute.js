import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ isAuthenticated }) => {

    const parseJwt = (token) => {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    let auth = isAuthenticated;

    const token = localStorage.getItem("token");
    if (token) {
        const decodedToken = parseJwt(token);
        const currentTime = Date.now() / 1000; // Get current time in seconds
        if (decodedToken.exp > currentTime) {
            auth = true;
        } else {
            auth = false;
            localStorage.removeItem("token");
        }
    }

    return auth ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
