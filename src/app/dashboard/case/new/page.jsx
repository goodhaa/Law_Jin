import { CONFIG } from 'src/global-config';

import { CaseCreateView } from 'src/sections/case/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new Case | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <CaseCreateView/>;
}
