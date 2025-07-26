// App.tsx
import  { Suspense, useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import Spinner from './components/Spinner';
import { store, persistor } from './store/store';
import { logout } from './store/authSlice';
import { isTokenExpired } from './utils/token';
import type { RootState } from './store/store';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const TokenChecker = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      dispatch(logout());
    }
  }, [token, dispatch]);

  return null;
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <TokenChecker />
          <Suspense fallback={<Spinner />}>
            <RouterProvider router={router} />
          </Suspense>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop />
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  );
};

export default App;
