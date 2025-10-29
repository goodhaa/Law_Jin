import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { CONFIG } from 'src/global-config';

export function createServerSupabase() {
  const cookieStore = cookies();

  return createServerClient(CONFIG.supabase.url, CONFIG.supabase.key, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
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
          cookieStore.set({ name, value: '', ...options });
        } catch (e) {
          console.error('쿠키 삭제 실패:', e);
        }
      },
    },
  });
}
