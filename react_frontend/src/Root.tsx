// src/Root.tsx
import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { persistor, store,  } from './store/store';
import { router } from './routes';
import { PersistGate } from 'redux-persist/integration/react';


const Root: React.FC = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Suspense fallback={<div>Loading ...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </PersistGate>
  </Provider>
);

export default Root;