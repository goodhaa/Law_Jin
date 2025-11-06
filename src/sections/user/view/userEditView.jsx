'use client';

import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { UserCreateEditForm } from '../userCreateEditForm';

import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from 'src/auth/context/auth-context';
import { getSupabaseBrowser } from 'src/lib/supabase/client';
// ----------------------------------------------------------------------

export function UserEditView() {
  console.log("사용자 editView :: ");
  
  const { userBase, loading } = useContext(AuthContext);
  const supabase = getSupabaseBrowser();

  // USER_BASE 전체 데이터 상태
  const [fullUser, setFullUser] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchFullUser = async () => {
      if (!userBase?.id) return;
      setFetching(true);

      const { data, error } = await supabase
        .from('USER_BASE')
        .select('id, EMAIL, USER_ID, USER_NM, PHONE, RRN, COMPANY_CD, COMPANY_NM, GRADE, ROLE, EX_NO, GENDER')
        .eq('id', userBase.id)
        .single();

      if (error) {
        console.error('USER_BASE 전체 조회 오류:', error);
      } else {
        setFullUser(data);
      }

      setFetching(false);
    };

    fetchFullUser();
  }, [userBase?.id, supabase]);

  // 화면 준비 전이면 로딩 표시
  if (loading || fetching) return <div>로딩중...</div>;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="수정"
        backHref={paths.dashboard.user.list}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: '사용자', href: paths.dashboard.user.root },
          { name: fullUser?.USER_NM ?? '생성' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {/* ✅ 이제 폼은 USER_BASE 전체 데이터를 그대로 받는다 */}
      <UserCreateEditForm currentUser={fullUser} />
    </DashboardContent>
  );
}