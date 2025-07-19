
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
;

interface Props {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const isAuthenticated = useSelector((state:RootState) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/guest/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
