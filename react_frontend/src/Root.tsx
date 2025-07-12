// src/Root.tsx
import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { RouterProvider } from 'react-router-dom';
import { store, persistor,  } from './store/store';
import type { RootState } from './store/store';
import { logout } from './store/authSlice';
import { isTokenExpired } from './utils/token'; 
import { router } from './routes';

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
    </PersistGate>
  </Provider>
);

export default Root;
