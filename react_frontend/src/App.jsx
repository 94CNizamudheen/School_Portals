import { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

import Spinner from './components/Spinner';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

const App = () => {
  return (
    <>
      <Suspense fallback={<Spinner />}>
        <RouterProvider router={router} />
      </Suspense>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop />
    </>
  );
};

export default App;
