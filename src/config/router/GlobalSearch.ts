export enum GlobalSearchLabel {}

interface Route {
  path?: string;
  globalSearchLabel?: string;
  breadCrumbLabel?: string;
  children?: Route[];
  isShouldClickable?: boolean;
}

interface FlattenedRoute {
  path: string;
  label: string;
  isShouldClickable?: boolean;
}

export const flattenRoutes = (
  routes: Route[],
  parentPath = '',
  useBreadcrumbLabel?: boolean
): FlattenedRoute[] => {
  return routes.flatMap((route) => {
    const cleanParent = parentPath.replace(/\/$/, '');
    const cleanChild = route.path?.replace(/^\//, '') ?? '';
    const fullPath = route.path?.startsWith('/') ? route.path : `${cleanParent}/${cleanChild}`;

    const label = useBreadcrumbLabel ? route.breadCrumbLabel : route.globalSearchLabel;

    const current: FlattenedRoute[] = label
      ? [{ label, path: fullPath, isShouldClickable: route?.isShouldClickable ?? true }]
      : [];

    const children = route.children
      ? flattenRoutes(route.children, fullPath, useBreadcrumbLabel)
      : [];

    return [...current, ...children];
  });
};
