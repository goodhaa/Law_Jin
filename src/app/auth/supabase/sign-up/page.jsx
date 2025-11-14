import { CONFIG } from 'src/global-config';

import { SupabaseSignUpView } from 'src/auth/view';

// ----------------------------------------------------------------------

export const metadata = { title: `회원가입 - ${CONFIG.appName}` };

export default function Page() {
  return <SupabaseSignUpView />;
}
