import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import authReducer from './authSlice';
import studentReducer from './studentSlice'
import parentReducer from './parentSlice'
import teacherReducer from './teacherSlice'
import admissionReducer from './admissionSlice';
import divisionReducer from './divisionSlice.ts'
import subjectReducer from './subjectSlice.ts'


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth','student'], 
};

const rootReducer = combineReducers({
  auth: authReducer,
  student: studentReducer,
  parent:parentReducer,
  teacher:teacherReducer,
  admissions:admissionReducer,
  divisions:divisionReducer,
  subjects:subjectReducer
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

