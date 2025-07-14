import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store, persistor } from './store/store';
import { logout } from './store/authSlice';
import { isTokenExpired } from './utils/token'; 
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import type { RootState } from './store/store';

const TokenChecker: React.FC = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      dispatch(logout());
    }
  }, [token, dispatch]);

  return <RouterProvider router={router} />;
};

const Root: React.FC = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <TokenChecker />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop />
    </PersistGate>
  </Provider>
);

export default Root;
