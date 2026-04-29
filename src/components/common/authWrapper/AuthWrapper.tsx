// import { LocalStorageConfig } from '@/config/router/LocalStorageConfig';
// import { RouterKeys } from '@/config/router/RouterKeys';
// import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { Outlet } from "react-router-dom";


const AuthWrapper = () => {
  // const token = LocalStorageConfig.getToken();
  // const { pathname } = useLocation();


// if (token && pathname == `/${RouterKeys.COMMON.LOGIN}`) {
//     return <Navigate to={`/${RouterKeys.DASHBOARD}`} replace />;
//   }

//   if (!token && pathname !== `/${RouterKeys.COMMON.LOGIN}`) {
//     return <Navigate to={`/${RouterKeys.COMMON.LOGIN}`} replace />;
//   }

  return <Outlet />
};

export default AuthWrapper;
