import { envConfig } from "@/config/env.config";
import { lazy } from "react";

const org = envConfig.org_name;

const isCustomOrg = org && org !== "default";

export const Mainlayout = isCustomOrg ? lazy(() => import(`./${org}/main/MainLayout`)) : lazy(() => import(`./default/main/DefaultMainLayout`))

export const SideBarMenu = isCustomOrg ? lazy(() => import(`./${org}/main/components/SideBarMenu`)) : lazy(() => import(`./default/main/components/SideBarMenu`))


export const Dashboardlayout = isCustomOrg ? lazy(() => import(`./${org}/dashboard/DashboardLayout`)) : lazy(() => import(`./default/dashboard/DefaultDashboardLayout`))

export const LoginLayout = isCustomOrg ? lazy(() => import(`./${org}/login/LoginLayout`)) : lazy(() => import(`./default/login/DefaultLoginLayout`))

export const ThemeProvider = isCustomOrg ? lazy(() => import(`./${org}/styles/ThemeProvider`)) : lazy(() => import(`./default/styles/ThemeProvider`))