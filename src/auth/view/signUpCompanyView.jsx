'use client';

import * as z from 'zod';
import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { getErrorMessage } from '../utils';
import { signUp } from '../context/supabase';
import CompanyPickerDialog from './companyPickerDialog';

import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

// 🎨 NAVY 컬러 추가
const NAVY = '#214b7eff';

export const SignUpSchema = z.object({
  userName: z.string().min(1, { error: '이름을 입력하세요!' }),
  email: schemaUtils.email(),
  password: z
    .string()
    .min(1, { error: '비밀번호를 입력하세요!' })
    .min(8, { error: '비밀번호는 최소 8자 이상이어야 합니다!' }),
  passwordCheck: z.string().min(1, { error: '비밀번호 확인을 입력하세요!' }),
  company_cd: z.string().min(1, { error: '회사코드를 입력하거나 검색에서 선택하세요!' }),
  company_nm: z.string().min(1, { error: '회사명을 입력하거나 검색에서 선택하세요!' }),
  biz_no: z.string().optional(),
  ceo_nm: z.string().optional(),
  tel_no: z.string().optional(),
}).refine(
  (d) => {
    if (d.password === '' || d.passwordCheck === '') return true;
    return d.password === d.passwordCheck;
  },
  { path: ['passwordCheck'], message: '비밀번호가 일치하지 않습니다.' }
);

// ----------------------------------------------------------------------

export function SignUpCompanyView() {
  const router = useRouter();
  const showPassword = useBoolean();
  const [errorMessage, setErrorMessage] = useState(null);

  const defaultValues = {
    userName: '',
    email: '',
    password: '',
    passwordCheck: '',
    company_cd: '',
    company_nm: '',
    biz_no: '',
    ceo_nm: '',
    tel_no: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const {
    control,
    trigger,
    setValue,
    formState: { touchedFields, dirtyFields },
  } = methods;

  const pickerOpen = useBoolean(false);

  const pw = useWatch({ control, name: 'password' });
  const pwc = useWatch({ control, name: 'passwordCheck' });

  useEffect(() => {
    const interacted =
      dirtyFields.password ||
      dirtyFields.passwordCheck ||
      touchedFields.password ||
      touchedFields.passwordCheck;

    if (interacted && pw !== '' && pwc !== '') {
      void trigger('passwordCheck');
    }
  }, [pw, pwc, dirtyFields.password, dirtyFields.passwordCheck, touchedFields.password, touchedFields.passwordCheck, trigger]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (data.password !== data.passwordCheck) {
        setErrorMessage('비밀번호가 일치하지 않습니다.');
        return;
      }

      await signUp({
        email: data.email,
        password: data.password,
        userName: data.userName,
        companyCd: data.company_cd,
        companyNm: data.company_nm,
      });

      router.push(paths.auth.verify);
    } catch (error) {
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  const onCompanyPick = (c) => {
    setValue('company_cd', c.company_cd, { shouldDirty: true, shouldValidate: true });
    setValue('company_nm', c.company_nm, { shouldDirty: true, shouldValidate: true });
  };

  const renderForm = () => (
    <Stack spacing={3}>
      {/* 법무법인 정보 */}
      <Card sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, color: NAVY }}>
          법무법인 정보
        </Typography>

        <Stack spacing={2.5}>
          <Field.Text name="company_nm" label="회사명" slotProps={{ inputLabel: { shrink: true } }} />

          <Field.Text name="company_cd" label="회사코드" slotProps={{ inputLabel: { shrink: true } }} sx={{ display: 'none' }} />

          <Field.Text name="biz_no" label="사업자등록번호" slotProps={{ inputLabel: { shrink: true } }} />

          <Field.Text name="ceo_nm" label="대표자" slotProps={{ inputLabel: { shrink: true } }} />

          <Field.Text name="tel_no" label="회사대표번호" slotProps={{ inputLabel: { shrink: true } }} />
        </Stack>
      </Card>

      <Divider />

      {/* 담당자 정보 */}
      <Card sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, color: NAVY }}>
          담당자 정보
        </Typography>

        <Stack spacing={2.5}>
          <Field.Text name="userName" label="담당자 이름" slotProps={{ inputLabel: { shrink: true } }} />

          <Field.Text name="email" label="담당자 Email" slotProps={{ inputLabel: { shrink: true } }} />

          <Field.Text
            name="password"
            label="비밀번호"
            type={showPassword.value ? 'text' : 'password'}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={showPassword.onToggle} edge="end">
                      <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Field.Text
            name="passwordCheck"
            label="비밀번호 확인"
            type={showPassword.value ? 'text' : 'password'}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          {/* NAVY 컬러 버튼 적용 */}
          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            loadingIndicator="Create account..."
            sx={{
              mt: 1,
              py: 1.6,
              bgcolor: NAVY,
              fontWeight: 600,
              '&:hover': { bgcolor: '#0F273F' },
            }}
          >
            법무법인 회원 가입
          </Button>
        </Stack>
      </Card>
    </Stack>
  );

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { xs: 400, sm: 500, md: 600},
        mx: 'auto',
        mt: { xs: 6, md: 10 },
        mb: { xs: 6, md: 8 },
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <Link component={RouterLink} href={paths.auth.signIn} variant="subtitle2" sx={{ mt: 3, display: 'block' }}>
        이미 계정이 있으신가요? 로그인
      </Link>

      <CompanyPickerDialog open={pickerOpen.value} onClose={pickerOpen.onFalse} onSelect={onCompanyPick} />
    </Box>
  );
}
