'use client';

import { useState, useMemo } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

const NAVY = '#214b7eff';

const TERMS_ITEMS = [
  { id: 't1', label: '진로 회원 이용약관', required: true },
  { id: 't2', label: '개인정보 수집 및 이용동의', required: true },
  { id: 't3', label: '개인정보 제3자 제공 동의', required: true },
  { id: 't4', label: '만 14세 이상입니다.', required: true },
  { id: 't5', label: '개인정보 수집 및 이용동의', required: false },
  { id: 't6', label: '혜택 알림 이메일, 문자, 앱 푸시 수신 동의', required: false },
];

export function CorpTermsView() {
  const router = useRouter();

  const [checkedMap, setCheckedMap] = useState(() =>
    TERMS_ITEMS.reduce((acc, cur) => ({ ...acc, [cur.id]: false }), {})
  );

  const stateInfo = useMemo(() => {
    const values = Object.values(checkedMap);
    const all = values.length > 0 && values.every(Boolean);
    const some = values.some(Boolean);
    return { allChecked: all, someChecked: some && !all };
  }, [checkedMap]);

  const { allChecked, someChecked } = stateInfo;

  const handleToggleAll = () => {
    const next = !allChecked;
    const updated = TERMS_ITEMS.reduce(
      (acc, cur) => ({ ...acc, [cur.id]: next }),
      {}
    );
    setCheckedMap(updated);
  };

  const handleToggleOne = (id) => {
    setCheckedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleBack = () => {
    router.back(); // 혹은 원하는 경로로 router.push
  };

  const handleNext = () => {
    const allRequiredChecked = TERMS_ITEMS.filter((t) => t.required).every(
      (t) => checkedMap[t.id]
    );
    if (!allRequiredChecked) {
      alert('필수 약관에 모두 동의해 주세요.');
      return;
    }

    // 다음 단계로 이동 (경로는 원하는 곳으로 수정)
    router.push(paths.auth.signUpCompany);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { xs: 400, sm: 500, md: 600 }, // 앞에서 맞춘 레이아웃과 통일
        mx: 'auto',
        mt: { xs: 6, md: 10 },
        mb: { xs: 6, md: 8 },
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* 제목 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
          <Typography
            component="span"
            variant="h4"
            sx={{ fontWeight: 700, color: NAVY }}
          >
            이용약관
          </Typography>
          에 먼저
          <br />
          동의해주세요
        </Typography>
      </Box>

      <Stack spacing={2.5}>
        {/* 전체동의 영역 */}
        <Card
          sx={{
            p: 2.5,
            borderRadius: 3,
            bgcolor: '#f7f7f7',
          }}
          onClick={handleToggleAll}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              checked={allChecked}
              indeterminate={someChecked}
              onChange={handleToggleAll}
              sx={{
                mr: 1.5,
                color: NAVY,
                '&.Mui-checked': { color: NAVY },
                '&.MuiCheckbox-indeterminate': { color: NAVY },
              }}
            />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              전체동의
            </Typography>
          </Box>
        </Card>

        {/* 개별 약관 리스트 */}
        <Stack spacing={1.5}>
          {TERMS_ITEMS.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Checkbox
                checked={checkedMap[item.id]}
                onChange={() => handleToggleOne(item.id)}
                sx={{
                  color: NAVY,
                  '&.Mui-checked': { color: NAVY },
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                  {item.label}{' '}
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    ({item.required ? '필수' : '선택'})
                  </Typography>
                </Typography>
              </Box>
              <Link
                component="button"
                type="button"
                sx={{
                  typography: 'body2',
                  color: 'text.secondary',
                  whiteSpace: 'nowrap',
                }}
                onClick={() => {
                  // TODO: 약관 상세보기 모달/페이지 연결
                  console.log('보기 클릭:', item.id);
                }}
              >
                보기 &gt;
              </Link>
            </Box>
          ))}
        </Stack>
      </Stack>

      {/* 안내 문구 */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 3, display: 'block', lineHeight: 1.6 }}
      >
        고객은 동의를 거부할 권리가 있으며 동의를 거부할 경우, 사이트 가입 또는 일부 서비스
        이용이 제한됩니다.
      </Typography>

      {/* 하단 버튼 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1.5,
          mt: 4,
        }}
      >
        <Button
          variant="outlined"
          size="large"
          onClick={handleBack}
          sx={{
            minWidth: 140,
            borderRadius: 2.5,
          }}
        >
          처음으로
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={handleNext}
          sx={{
            minWidth: 160,
            borderRadius: 2.5,
            bgcolor: NAVY,
            fontWeight: 600,
            '&:hover': { bgcolor: '#0F273F' },
          }}
        >
          다음 단계로
        </Button>
      </Box>
    </Box>
  );
}
