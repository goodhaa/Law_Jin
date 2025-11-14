import { CONFIG } from 'src/global-config';

import { SignUpChoiceView } from 'src/auth/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Sign up | Supabase - ${CONFIG.appName}` };

export default function Page() {
  return <SignUpChoiceView />;
}
