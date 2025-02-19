import React from 'react';
import { useSelector } from "react-redux";
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoute = ({ isAdminRoute }) => {
  const { currentUser } = useSelector(state => state.user);

  if (!currentUser) {
    // User is not logged in
    return <Navigate to="/sign-in" />;
  }

  if (isAdminRoute && currentUser.id !== "admin") {
    // User is not admin, redirect to home or an unauthorized page
    return <Navigate to="/" />;
  }

  // User is authenticated and either not an admin route or is admin
  return <Outlet />;
};

export default PrivateRoute;
