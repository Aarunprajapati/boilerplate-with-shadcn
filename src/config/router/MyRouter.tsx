import AuthWrapper from '@/components/common/authWrapper/AuthWrapper';
import NotFound from '@/components/common/notFound/NotFound';
import { DashboardPage, LoginPage, MainPage, UserPage } from '@/pages';
import { createBrowserRouter } from 'react-router-dom';
import { RouterKeys } from './RouterKeys';


export const routes = [
  {
    path: '/',
    element: <AuthWrapper />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <MainPage/>,
        children:[
          {
             index: true,
             path:RouterKeys.DASHBOARD,
            element: <DashboardPage/>,
      
          },
           {
             path:RouterKeys.USER,
            element: <UserPage/>,
      
          },
        ]
      }
    ],
  },
  {path: RouterKeys.COMMON.LOGIN, element: <LoginPage/>}
];

export const MyRouter = createBrowserRouter(routes);
