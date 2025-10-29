// src/lib/supabase/client.js
import { createBrowserClient } from '@supabase/ssr';
import { CONFIG } from 'src/global-config';

// 브라우저 전용 Supabase 클라이언트 생성기
export function getSupabaseBrowser() {
  return createBrowserClient(CONFIG.supabase.url, CONFIG.supabase.key);
}
