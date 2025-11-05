'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { IncidentCreateEditForm } from '../incidentCreateEditForm';

// ----------------------------------------------------------------------

export function IncidentCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="신건 등록"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: '사건', href: paths.dashboard.product.root },
          { name: '등록' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <IncidentCreateEditForm />
    </DashboardContent>
  );
}
