import { CONFIG } from 'src/global-config';
import { _userList } from 'src/_mock/_user';

import { UserEditView } from 'src/sections/user/view';
import { cookies } from 'next/headers';
import { createServerSupabase } from 'src/lib/supabase/server';
// ----------------------------------------------------------------------

export const metadata = { title: `User edit | Dashboard - ${CONFIG.appName}` };

export default async function Page({ params }) {
  const supabase = await createServerSupabase(); // ← 중요!!

const {
  data: { user },
} = await supabase.auth.getUser();

const userId = user?.id;

  // 또는 service role 키로 직접 DB를 조회(주의: 보안)
  const { data: currentUser } = await supabase
    .from('USER_BASE')
    .select('id, EMAIL, USER_ID, USER_NM, PHONE, RRN, COMPANY_CD, COMPANY_NM, DUTY_CD, POSITION_CD, EX_NO, GENDER')
    .eq('id', userId)
    .single();

  console.log(JSON.stringify(currentUser, null, 2));
  return <UserEditView user={currentUser} />;
}

// ----------------------------------------------------------------------

/**
 * Static Exports in Next.js
 *
 * 1. Set `isStaticExport = true` in `next.config.{mjs|ts}`.
 * 2. This allows `generateStaticParams()` to pre-render dynamic routes at build time.
 *
 * For more details, see:
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 *
 * NOTE: Remove all "generateStaticParams()" functions if not using static exports.
 */
export async function generateStaticParams() {
  const data = CONFIG.isStaticExport ? _userList : _userList.slice(0, 1);

  return data.map((user) => ({
    id: user.id,
  }));
}
