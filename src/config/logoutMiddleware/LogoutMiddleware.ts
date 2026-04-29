import { createAction } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';

export const logoutAction = createAction('LOGOUT');

export const logoutMiddleware: Middleware = () => (next) => (action) => {
  if (logoutAction.match(action)) {
    // optional cleanup
    localStorage.clear(); // clear the local storage
  }

  return next(action);
};
