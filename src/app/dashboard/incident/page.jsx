import { CONFIG } from 'src/global-config';

import { IncidentListView } from 'src/sections/incident/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Incident list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <IncidentListView />;
}
