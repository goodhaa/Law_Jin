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
import { FormHead } from '../components/form-head';
import CompanyPickerDialog from './companyPickerDialog';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export const SignUpSchema = z.object({
  userName: z.string().min(1, { error: '이름을 입력하세요!' }),
  email: schemaUtils.email(),
  password: z
    .string()
    .min(1, { error: '비밀번호를 입력하세요!' })
    .min(8, { error: '비밀번호는 최소 8자 이상이어야 합니다!' }),
  passwordCheck: z
    .string()
    .min(1, { error: '비밀번호 확인을 입력하세요!' }),
  company_cd: z.string().min(1, { error: '회사코드를 입력하거나 검색에서 선택하세요!' }),
  company_nm: z.string().min(1, { error: '회사명을 입력하거나 검색에서 선택하세요!' }),  
  // company_no: z.string().optional(),
  // ceo_nm: z.string().optional(),
  // tel_no: z.string().optional(),
}).refine(
  (d) => {
    // 둘 다 비어있거나 하나라도 비어있으면 ‘일치’ 검사는 패스(= 에러 내지 않음)
    if (d.password === '' || d.passwordCheck === '') return true;
    // 둘 다 값이 있을 때만 일치 여부 검사
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
  };

  const methods = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
    mode: 'onSubmit',        // ✅ 전역은 제출 시 검증
    reValidateMode: 'onSubmit',
  });

  const {
    control,
    trigger,
    setValue,
    formState: { touchedFields, dirtyFields },
  } = methods;

  // 회사 선택 다이얼로그 열림 상태
  const pickerOpen = useBoolean(false);

  // 비밀번호, 비밀번호 확인 값 입력시 실시간 체크 로직 Start
  const pw  = useWatch({ control, name: 'password' });
  const pwc = useWatch({ control, name: 'passwordCheck' });

  useEffect(() => {
    // ❶ 두 필드 중 하나라도 ‘입력 상호작용’이 있었고
    const interacted = 
        dirtyFields.password || 
        dirtyFields.passwordCheck || 
        touchedFields.password || 
        touchedFields.passwordCheck;

    // ❷ 두 칸 모두 값이 있을 때만(= 일치검사 의미가 있을 때만) 재검증
    if (interacted && pw !== '' && pwc !== '') {
      void trigger('passwordCheck');    // passwordCheck만 재검증 → 다른 필드엔 영향 X
    }
  }, [pw, pwc, dirtyFields.password, dirtyFields.passwordCheck, touchedFields.password, touchedFields.passwordCheck, trigger]);
  // 비밀번호, 비밀번호 확인 값 입력시 실시간 체크 로직 End  

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
      
      router.push(paths.auth.supabase.verify); // 회원가입 클릭후 이동할 화면페이지
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  const onCompanyPick = (c) => {
    // 다이얼로그에서 선택 시 부모 폼 자동 기입
    setValue('company_cd', c.company_cd, { shouldDirty: true, shouldValidate: true });
    setValue('company_nm', c.company_nm, { shouldDirty: true, shouldValidate: true });
  };

  const renderForm = () => (
  <Stack spacing={3}>
    {/* ✅ 법무법인(회사) 정보 섹션 */}
    <Card
      sx={{
        p: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        법무법인 정보
      </Typography>

      <Stack spacing={2.5}>
        {/* 숨겨진 회사코드 (DB용) */}
        <Field.Text
          name="company_cd"
          label="회사코드"
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ display: 'none' }}
        />

        <Field.Text
          name="company_nm"
          label="회사명"
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={pickerOpen.onTrue} edge="end" aria-label="회사 검색">
                    <Iconify icon="eva:search-fill" />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          placeholder="검색 버튼으로 선택하세요"
        />

        <Field.Text
          name="company_no"
          label="사업자등록번호"
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <Field.Text
          name="ceo_nm"
          label="대표자"
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <Field.Text
          name="tel_no"
          label="회사대표번호"
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Stack>
    </Card>

    {/* 구분선 */}
    <Divider />

    {/* ✅ 담당자(관리자) 정보 섹션 */}
    <Card
      sx={{
        p: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        담당자 정보
      </Typography>

      <Stack spacing={2.5}>
        <Field.Text
          name="userName"
          label="담당자 이름"
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <Field.Text
          name="email"
          label="담당자 Email"
          slotProps={{ inputLabel: { shrink: true } }}
        />

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
                    <Iconify
                      icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
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
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />

        <Button
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          loadingIndicator="Create account..."
          sx={{ mt: 1 }}
        >
          법무법인 회원 가입
        </Button>
      </Stack>
    </Card>
  </Stack>
);

  return (
    <>
      

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <FormHead
        //title="Get started absolutely free"
        description={
          <>
            {`이미 계정이 있으신가요? `}
            <Link component={RouterLink} href={paths.auth.supabase.signIn} variant="subtitle2">
              로그인
            </Link>
          </>
        }
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />
       {/* 회사 검색 다이얼로그 */}
      <CompanyPickerDialog
        open={pickerOpen.value}
        onClose={pickerOpen.onFalse}
        onSelect={onCompanyPick}
      />
      {/* <SignUpTerms /> */}
    </>
  );
}
