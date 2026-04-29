import { envConfig } from '../env.config';

export const BASE_URL = `${envConfig.base_url}/api`;


// export const BASE_URL = `http://192.168.1.50:3040/api`;

export const APIS = {

  Login: {
    loginUser: '/auth/login',
    verifyOtp: '/users/validateOtp',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/update-password',
  },
};
