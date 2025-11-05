'use client';

import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';

import axios from 'src/lib/axios';
import { getSupabaseBrowser } from 'src/lib/supabase/client';

import { AuthContext } from '../auth-context';

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  // user: supabase 세션/유저(원본)
  // userBase: public.USER_BASE의 프로필({ USER_NM, EMAIL, USER_ID })
  const { state, setState } = useSetState({ user: null, userBase: null, loading: true });

  const supabase = useMemo(() => getSupabaseBrowser(), []);

  const fetchUserBase = useCallback(
    async (uid) => {
      // USER_BASE에서 USER_ID = auth.uid() 행을 가져옴
      const { data, error } = await supabase
        .from('USER_BASE')
        .select('USER_NM, EMAIL, USER_ID, RRN')
        .eq('id', uid)
        .single();

      if (error) {
        console.warn('USER_BASE fetch error:', error);
        return null;
      }
      return data;
    },
    [supabase]
  );

  const checkUserSession = useCallback(async () => {
    try {
      setState({ loading: true });

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
        setState({ user: null, userBase: null, loading: false });
        delete axios.defaults.headers.common.Authorization;
        return;
      }

      if (session?.user) {
        const accessToken = session.access_token;

        // 🔹 USER_BASE 함께 조회
        const userBase = await fetchUserBase(session.user.id);

        setState({
          user: { ...session, ...session.user },
          userBase,
          loading: false,
        });

        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      } else {
        setState({ user: null, userBase: null, loading: false });
        delete axios.defaults.headers.common.Authorization;
      }
    } catch (err) {
      console.error(err);
      setState({ user: null, userBase: null, loading: false });
      delete axios.defaults.headers.common.Authorization;
    }
  }, [fetchUserBase, setState, supabase]);

  useEffect(() => {
    checkUserSession();

    // 로그인/로그아웃/토큰갱신 등 변동 시 재조회
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setState({ user: null, userBase: null, loading: false });
        delete axios.defaults.headers.common.Authorization;
      } else {
        checkUserSession();
      }
    });

    return () => {
      listener.subscription?.unsubscribe?.();
    };
  }, [checkUserSession, setState, supabase]);

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';
  const status = state.loading ? 'loading' : checkAuthenticated;

  // 화면에서 바로 쓰기 편하게 displayName/email은 USER_BASE 우선으로 노출
  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
          ...state.user,
          id: state.user?.id,
          accessToken: state.user?.access_token,
          // 🔹 USER_BASE.USER_NM > user_metadata.* > email-id
          displayName: state.userBase?.USER_NM, 
          email: state.userBase?.EMAIL || state.user?.email || undefined,
          role: state.user?.role ?? 'admin',
        }
        : null,

      // 원본 USER_BASE도 그대로 노출(필요하면 컴포넌트에서 세부 접근)
      userBase: state.userBase,

      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',

      // 원하면 context로도 내려줌
      supabase,
    }),
    [state.user, state.userBase, status, supabase, checkUserSession]
  );

  return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}
