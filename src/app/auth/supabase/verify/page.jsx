import { CONFIG } from 'src/global-config';

import { SupabaseVerifyView } from 'src/auth/view';

// ----------------------------------------------------------------------

export const metadata = { title: `가입 확인 - ${CONFIG.appName}` };

export default function Page() {
  return <SupabaseVerifyView />;
}
