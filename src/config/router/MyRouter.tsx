import AuthWrapper from '@/components/common/authWrapper/AuthWrapper';
import NotFound from '@/components/common/notFound/NotFound';
import { CreateOfferPage, DashboardPage, LoginPage, MainPage, UserPage } from '@/pages';
import { createBrowserRouter } from 'react-router-dom';
import { RouterKeys } from './RouterKeys';
import { ROUTE_HANDLES } from './RouteHandler';

export const routes = [
  {
    path: '/',
    element: <AuthWrapper />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <MainPage />,
        children: [
          {
            index: true,
            path: RouterKeys.DASHBOARD,
            element: <DashboardPage />,
            handle: ROUTE_HANDLES[RouterKeys.DASHBOARD],
          },
          {
            path: RouterKeys.USER,
            element: <UserPage />,
            handle: ROUTE_HANDLES[RouterKeys.USER],
          },
          {
            path: RouterKeys.CREATE_OFFER,
            element: <CreateOfferPage />,
            handle: ROUTE_HANDLES[RouterKeys.CREATE_OFFER],
          },
        ],
      },
    ],
  },
  { path: RouterKeys.COMMON.LOGIN, element: <LoginPage /> },
];

export const MyRouter = createBrowserRouter(routes);