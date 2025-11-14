'use client';

import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

export function SignUpChoiceView() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minWidth: 550,         // ⬅️ 가로폭 더 넓게
        width: '100%',
        mx: 'auto',
        mt: 12,
        px: { xs: 2, md: 4 },   // 좌우 여백
        textAlign: 'center',
      }}
    >
      {/*
      <Typography variant="h4" sx={{ mb: 5 }}>
        회원가입 유형 선택
      </Typography>
    */}
      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}   // 모바일: 세로 / 데스크탑: 가로 2열
        sx={{ width: '100%' }}
      >
        {/* 법무법인 버튼 */}
        <Card
          sx={{
            flex: 1,                          // 가로 공간 균등 분배
            cursor: 'pointer',
            borderRadius: 3,
            p: { xs: 3, md: 4 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            transition: '0.25s',
            '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' },
          }}
          onClick={() => router.push(paths.auth.supabase.signUpCompany)}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Iconify
              icon="solar:buildings-2-bold-duotone"
              width={44}
              sx={{ mb: 1 }}
            />

            <Typography variant="h5">
              법무법인 회원가입
            </Typography>

            <Typography variant="body1" color="text.secondary">
              회사 정보와 대표 관리자 정보를 함께 등록합니다.
            </Typography>
          </Box>
        </Card>

        {/* 개인 회원 버튼 */}
        <Card
          sx={{
            flex: 1,
            cursor: 'pointer',
            borderRadius: 3,
            p: { xs: 3, md: 4 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            transition: '0.25s',
            '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' },
          }}
          onClick={() => router.push(paths.auth.supabase.signUp)}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Iconify
              icon="solar:user-bold-duotone"
              width={44}
              sx={{ mb: 1 }}
            />

            <Typography variant="h5">
              개인 회원가입
            </Typography>

            <Typography variant="body1" color="text.secondary">
              일반 사용자 계정을 생성합니다.
            </Typography>
          </Box>
        </Card>
      </Stack>
    </Box>
  );
}
