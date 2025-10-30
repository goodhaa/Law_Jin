import { CONFIG } from 'src/global-config';

import { UserEditView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export const metadata = { title: `User edit | Dashboard - ${CONFIG.appName}` };


export default function Page() {
  return <UserEditView />;
}

