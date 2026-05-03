import { Outlet, useMatches, Link } from 'react-router-dom';
import { SideMenuPage } from '@/pages';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import HeaderNav from './components/HeaderNav';
import { Fragment } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RouteHandle {
  breadCrumbLabel?: string;
}

interface MainLayoutProps {
  isOpen: boolean;
  handleLogout: () => void;
  onClose: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIDEBAR_WIDTH = '14rem';
const SIDEBAR_WIDTH_MOBILE = '16rem';

// ─── AppBreadcrumb ─────────────────────────────────────────────────────────────
// Reads every active route match and renders a breadcrumb item for each one
// that has a `handle.breadCrumbLabel` defined.

const AppBreadcrumb = () => {
  const matches = useMatches();

  console.log(matches)
  // Filter to only routes that opted-in to breadcrumb via handle.breadCrumbLabel
  const crumbs = matches.filter(
    (match) => (match.handle as RouteHandle)?.breadCrumbLabel
  );

  if (crumbs.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((match, index) => {
          const label = (match.handle as RouteHandle).breadCrumbLabel!;
          const isLast = index === crumbs.length - 1;

          return (
            <Fragment key={match.id}>
              <BreadcrumbItem>
                {isLast ? (
                  // Last segment — not a link, just the current page label
                  <BreadcrumbPage className='font-semibold' >{label}</BreadcrumbPage>
                ) : (
                  // Ancestor segment — clickable link back to that route
                  <BreadcrumbLink asChild>
                    <Link to={match.pathname} className='font-semibold'>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {/* Separator between items, not after the last one */}
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

// ─── DefaultMainLayout ────────────────────────────────────────────────────────

const DefaultMainLayout = (props: MainLayoutProps) => {
  const { handleLogout } = props;

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': SIDEBAR_WIDTH,
          '--sidebar-width-mobile': SIDEBAR_WIDTH_MOBILE,
        } as React.CSSProperties
      }
    >
      <SideMenuPage variant="inset" />

      <SidebarInset>
        <HeaderNav onLogout={handleLogout} />

        {/* Breadcrumb bar — sits between the header and page content */}
        <div className="flex items-center border-b px-4 py-2 lg:px-6">
          <AppBreadcrumb />
        </div>

        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DefaultMainLayout;