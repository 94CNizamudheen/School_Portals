import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import authReducer from './authSlice';
import studentReducer from './studentSlice'
import parentReducer from './parentSlice'
import teacherReducer from './teacherSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], 
};

const rootReducer = combineReducers({
  auth: authReducer,
  student: studentReducer,
  parent:parentReducer,
  teacher:teacherReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;