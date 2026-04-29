import { setApiLoading } from "@/redux/MainSlice";
import { store } from "@/redux/store";
import {
  isFulfilled,
  isPending,
  isRejectedWithValue,
  type Middleware,
} from "@reduxjs/toolkit";



export const TopLoaderMiddleware: Middleware = () => (next) => (action) => {
  if (isPending(action)) {
    store.dispatch(setApiLoading(true));
  }

  if (isFulfilled(action)) {
    store.dispatch(setApiLoading(false));
  }
  if (isRejectedWithValue(action)) {
    store.dispatch(setApiLoading(false));
  }

  return next(action);
};
