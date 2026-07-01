import { configureStore } from '@reduxjs/toolkit';
import reviewReducer from './slices/reviewSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    reviews: reviewReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
