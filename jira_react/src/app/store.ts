import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import authReducer from "../features/auth/authSlice";
import taskReducer from "../features/task/taskSlice";

export const store = configureStore({
  reducer: {
    // authReducerをstoreへ登録
    auth: authReducer,
    // taskReducerをstoreへ登録
    task: taskReducer,
  },
});

// dispatch用の型
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
