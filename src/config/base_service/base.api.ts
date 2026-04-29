import {

  fetchBaseQuery,
} from '@reduxjs/toolkit/query';
import { createApi } from '@reduxjs/toolkit/query/react';

import { envConfig } from '../env.config';
import { LocalStorageConfig } from '../router/LocalStorageConfig';
import { RouterKeys } from '../router/RouterKeys';
import { BASE_URL } from './http.config';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

const baseQueryWithHeaders = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = LocalStorageConfig.getToken();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('org_id', envConfig.org_id);
    // headers.set('x-browser-name', getBrowserName(navigator.userAgent));
    // headers.set('x-browser-version', getBrowserVersion(navigator.userAgent));
    // headers.set('x-device-type', getDeviceType(navigator.userAgent));
    headers.set('x-device-platform', navigator?.platform);
    headers.set('x-timezone', timezone);
    return headers;
  }
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQueryWithHeaders(args, api, extraOptions);

  const status = result?.error?.status;

  if (status === 511) {
    localStorage.clear();
    window.location.href = `/${RouterKeys.COMMON.LOGIN}`;
  }
  return result;
};

export const BaseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({})
});
