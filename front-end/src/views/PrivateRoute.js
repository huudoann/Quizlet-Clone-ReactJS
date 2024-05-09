import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {

    const parseJwt = (token) => {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    let auth = false; // determine if authorized, from context or however you're doing it

    const token = localStorage.getItem("token")
    if (token) {
        // Decode the token
        const decodedToken = parseJwt(token);

        // Check if the token is expired
        const currentTime = Date.now() / 1000; // Get current time in seconds
        if (decodedToken.exp > currentTime) {
            // Token is not expired
            auth = true;
        } else {
            // Token is expired
            auth = false;
            // Clear expired token from local storage
            localStorage.removeItem("token");
        }
    } else {
        // Token does not exist
        auth = false;
    }


    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return auth ? <Outlet /> : <Navigate to="/login" />;
}
export default PrivateRoute;