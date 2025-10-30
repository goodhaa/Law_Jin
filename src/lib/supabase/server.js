import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { CONFIG } from 'src/global-config';

export async function createServerSupabase() {
  const cookieStore = await cookies(); // ✅ Next.js 15: 반드시 await

  return createServerClient(CONFIG.supabase.url, CONFIG.supabase.key, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value ?? null;
      },
      set(name, value, options) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (e) {
          console.error('쿠키 설정 실패:', e);
        }
      },
      remove(name, options) {
        try {
          // ✅ 비우기(set) 대신 delete 사용
          cookieStore.delete({ name, ...options });
        } catch (e) {
          console.error('쿠키 삭제 실패:', e);
        }
      },
    },
  });
}
