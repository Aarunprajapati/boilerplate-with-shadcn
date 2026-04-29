import { combineReducers, configureStore, type Reducer } from '@reduxjs/toolkit';

import { BaseApi } from '../config/base_service/base.api';
import { logoutAction, logoutMiddleware } from '../config/logoutMiddleware/LogoutMiddleware';
import { TopLoaderMiddleware } from '../config/toploadermiddleware/toploadermiddleware';
import { MainSlice } from './MainSlice';

const appReducer = combineReducers({
  main: MainSlice.reducer,
  [BaseApi.reducerPath]: BaseApi.reducer,
});

export type RootStateType = ReturnType<typeof appReducer>;

const rootReducer: Reducer<RootStateType> = (state, action) => {
  if (logoutAction.match(action)) {
    state = undefined; // 💥 FULL REDUX RESET
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(BaseApi.middleware)
      .concat(logoutMiddleware)
      .concat(TopLoaderMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
