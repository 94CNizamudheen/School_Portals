import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { login, logout } from '../store/authSlice';
import type { RootState } from './store';
import {jwtDecode} from 'jwt-decode';

const API = import.meta.env.VITE_BACKEND_URL;

interface JwtPayload {
  exp: number;
}

interface VerifyTokenResponse {
  user: {
    id: string;
    role: string;
  };
  access_token: string;
}

const getLocalStorageItem = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true; 
  }
};

export const useAuthCheck = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const token = getLocalStorageItem('token');
        const role = getLocalStorageItem('role');
        const userId = getLocalStorageItem('userId');

        console.log(token, role, userId)

        if (token && role === 'ADMIN' && userId && !isTokenExpired(token)) {
          const response = await axios.get<VerifyTokenResponse>(`${API}/auth/verify-token`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const { user, access_token } = response.data;

          if (user?.role !== 'ADMIN') {
            dispatch(logout());
            navigate('/unauthorized');
          } else {
            dispatch(login({ access_token, role: user.role, userId: user.id }));
          }
        } else {
          dispatch(logout());
          navigate('/admin/login');
        }
      } catch (err) {
        console.error('Token verification failed:', err);
        dispatch(logout());
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthenticated) {
      checkAdminAuth();
    } else {
      setLoading(false);
    }
  }, [dispatch, navigate, isAuthenticated]);

  return { loading };
};