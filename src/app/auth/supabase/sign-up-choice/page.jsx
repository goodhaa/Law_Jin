import { CONFIG } from 'src/global-config';

import { SignUpChoiceView } from 'src/auth/view';

// ----------------------------------------------------------------------

export const metadata = { title: `회원 가입 - ${CONFIG.appName}` };

export default function Page() {
  return <SignUpChoiceView />;
}
