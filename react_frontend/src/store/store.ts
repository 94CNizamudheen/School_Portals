import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import authReducer from './authSlice.ts';
import studentReducer from './studentSlice.ts'
import parentReducer from './parentSlice.ts'
import teacherReducer from './teacherSlice.ts'
import admissionReducer from './admissionSlice.ts';
import divisionReducer from './divisionSlice.ts'
import subjectReducer from './subjectSlice.ts'
import academicCalenderReducer from './calenderAndEventsSlice.ts'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth','student'], 
};

const rootReducer = combineReducers({
  auth: authReducer,
  student: studentReducer,
  parent:parentReducer,
  admissions:admissionReducer,
  divisions:divisionReducer,
  subjects:subjectReducer,
  teacher:teacherReducer,
  academicCalender:academicCalenderReducer
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