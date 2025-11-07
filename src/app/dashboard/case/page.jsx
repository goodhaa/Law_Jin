import { CONFIG } from 'src/global-config';

import { CaseListView } from 'src/sections/case/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Case list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <CaseListView />;
}
