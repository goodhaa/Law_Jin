import { CONFIG } from 'src/global-config';

import { IncidentCreateView } from 'src/sections/incident/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new incident | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <IncidentCreateView/>;
}
