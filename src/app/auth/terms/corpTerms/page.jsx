import { CONFIG } from 'src/global-config';

import { CorpTermsView } from 'src/auth/view';

// ----------------------------------------------------------------------

export const metadata = { title: `회원가입 - ${CONFIG.appName}` };

export default function Page() {
  return <CorpTermsView />;
}
