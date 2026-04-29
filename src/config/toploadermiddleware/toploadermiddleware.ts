import {
  isFulfilled,
  isPending,
  isRejectedWithValue,
  Middleware,
} from "@reduxjs/toolkit";

import { setApiLoading } from "../../redux/MainSlice";
import { store } from "../../redux/store";

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
