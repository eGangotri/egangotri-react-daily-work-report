/* ***************************************************************************
 * Copyright © Biqmind Pte Ltd – 2021 - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * ************************************************************************ */
import React, { PropsWithChildren, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Layout from 'pages/Layout';

const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const isUserLoggedIn = true

  if (!isUserLoggedIn){
    return <Navigate to="/login" state={{ pathname: location.pathname }} />;
  }

  return <Layout>{children?children:<Outlet />}</Layout>;
};

export default ProtectedRoute;
