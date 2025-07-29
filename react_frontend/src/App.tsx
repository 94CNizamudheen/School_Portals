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
import { isTokenExpired } from './utils/token';
import type { AppDispatch, RootState } from './store/store';
import { logoutThunk } from './store/api';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const TokenChecker = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      dispatch(logoutThunk());
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
          <ToastContainer position="top-right" autoClose={2000} hideProgressBar newestOnTop />
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  );
};

export default App;
