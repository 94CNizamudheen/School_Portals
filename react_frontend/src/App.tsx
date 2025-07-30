// App.tsx
import  { Suspense, } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import Spinner from './components/Spinner';
import { store, persistor } from './store/store';


const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;


const App = () => {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
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
