'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';

import { paths } from 'src/routes/paths';

const NAVY = '#214b7eff';

export function SignUpChoiceView() {
  const router = useRouter();
  const [type, setType] = useState('personal');
  const [bizNo, setBizNo] = useState('');

  const handleSubmit = () => {
    if (type === 'personal') {
      router.push(paths.auth.terms.userTerms);
    } else {
      // TODO: 나중에 여기서 사업자번호 검증 API 붙이면 됨
      router.push(paths.auth.terms.corpTerms);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        // ✅ 전체 컨테이너 가로폭 넓힘
        maxWidth: { xs: 400, sm: 500, md: 600 },
        mx: 'auto',
        mt: { xs: 6, md: 10 },
        mb: { xs: 6, md: 8 },
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* 상단 환영 문구 (위치는 고정) */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1.5 }}>
          <Typography
            component="span"
            variant="h4"
            sx={{ color: NAVY, fontWeight: 700 }}
          >
            진로
          </Typography>
          에 오신 것을 환영해요
        </Typography>

        <Typography variant="body1" color="text.secondary">
          지금 회원 가입하신 후 <br />
          진로의 다양한 서비스를 만나보세요!
        </Typography>
      </Box>

      {/* 상단 문구 + 개인회원 카드는 항상 같은 위치 */}
      <Stack spacing={2.5}>
        {/* 개인 회원 카드 (위치 고정) */}
        <Card
          sx={{
            width: '100%',
            p: 3,
            borderRadius: 3,
            border: type === 'personal' ? `2px solid ${NAVY}` : '1px solid',
            borderColor: type === 'personal' ? NAVY : 'divider',
            boxShadow: type === 'personal' ? 3 : 0,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onClick={() => setType('personal')}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Radio
              checked={type === 'personal'}
              onChange={() => setType('personal')}
              sx={{
                color: NAVY,
                '&.Mui-checked': { color: NAVY },
                mr: 1.5,
              }}
            />

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                개인 회원
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                사건 관리 시스템을 이용할 일반 사용자용 계정
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* 법무법인 회원 카드 (이 아래만 늘었다 줄었다) */}
        <Card
          sx={{
            width: '100%',
            p: 3,
            borderRadius: 3,
            border: type === 'business' ? `2px solid ${NAVY}` : '1px solid',
            borderColor: type === 'business' ? NAVY : 'divider',
            boxShadow: type === 'business' ? 3 : 0,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onClick={() => setType('business')}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Radio
              checked={type === 'business'}
              onChange={() => setType('business')}
              sx={{
                color: NAVY,
                '&.Mui-checked': { color: NAVY },
                mr: 1.5,
                mt: 0.3,
              }}
            />

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                법무법인 회원
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                법무법인(로펌) 및 관리자 계정을 생성
              </Typography>

              {/* ✅ 선택됐을 때만 아래쪽으로 영역이 확장됨 */}
              {type === 'business' && (
                <Box
                  sx={{
                    mt: 2.5,
                    p: 2.5,
                    // ✅ 안쪽 박스도 가로를 최대한 사용
                    bgcolor: 'grey.50',
                    border: '1px solid',
                    borderColor: 'grey.200',
                  }}
                  onClick={(e) => e.stopPropagation()} // 카드 클릭 이벤트 막기
                >
                  <TextField
                    fullWidth
                    placeholder="사업자 등록번호"
                    value={bizNo}
                    onChange={(e) => setBizNo(e.target.value)}
                    variant="outlined"
                    size="medium"
                    sx={{
                      bgcolor: 'common.white',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2.5,
                        height: 52,
                      },
                    }}
                  />

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1.5, display: 'block', lineHeight: 1.5 }}
                  >
                    사업자 정보 확인에 문제가 있는 경우, <br />
                    사업자등록증 사본과 연락 가능한 이메일을 <br />
                    NICE평가정보, biz_submit@nice.co.kr로 보내주세요.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Card>
      </Stack>

      {/* 하단 버튼 */}
      <Divider sx={{ my: 4 }} />

      <Button
        fullWidth
        size="large"
        variant="contained"
        sx={{
          py: 1.6,
          bgcolor: NAVY,
          fontWeight: 600,
          fontSize: 16,
          '&:hover': { bgcolor: '#0F273F' },
        }}
        onClick={handleSubmit}
      >
        {type === 'personal' ? '계속하기' : '인증하기'}
      </Button>
    </Box>
  );
}
