'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserCreateEditForm } from '../userCreateEditForm';

// ----------------------------------------------------------------------


export function UserEditView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="사용자 정보"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: '사용자', href: paths.dashboard.user.root },
          { name: '저장' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserCreateEditForm />
    </DashboardContent>
  );
}

/*
export function UserEditView({ user: currentUser }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.user.list}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.root },
          { name: currentUser?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserCreateEditForm currentUser={currentUser} />
    </DashboardContent>
  );
}

*/