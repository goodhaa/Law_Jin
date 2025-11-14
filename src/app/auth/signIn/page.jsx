import { CONFIG } from 'src/global-config';

import { SupabaseSignInView } from 'src/auth/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Sign in - ${CONFIG.appName}` };

export default function Page() {
  return <SupabaseSignInView />;
}
