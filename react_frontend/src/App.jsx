import { Suspense } from 'react';

import Spinner from './components/Spinner';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

const App = () => {
  return (
    <>
      <Suspense fallback={<Spinner />}>
        <RouterProvider router={router} />
      </Suspense>

    </>
  );
};

export default App;
