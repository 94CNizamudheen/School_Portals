
import React, { useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { toast } from 'react-toastify';
;

interface Props {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const hasWarned = useRef(false);
  if (!isAuthenticated) {
    if (!hasWarned.current) {
      toast.warn('Please login for this facility');
      hasWarned.current = true;
    }
    return <Navigate to="/guest/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
