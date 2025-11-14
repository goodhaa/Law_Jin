import { CONFIG } from 'src/global-config';

import { SignUpCompanyView } from 'src/auth/view';

// ----------------------------------------------------------------------

export const metadata = { title: `법무법인 회원가입 - ${CONFIG.appName}` };

export default function Page() {
  return <SignUpCompanyView />;
}
