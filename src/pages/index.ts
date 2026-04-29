import { lazy } from 'react';

export const MainPage = lazy(() => import('@/pages/main/MainPage'));
export const DashboardPage = lazy(()=> import('@/pages/dashboard/DashboardPage'))
export const LoginPage = lazy(()=> import('@/pages/login/LoginPage'))

export const SideMenuPage = lazy(()=>import('@/pages/main/components/SideMenuPage'))