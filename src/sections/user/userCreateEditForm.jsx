import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import React, { useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { MenuItem } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { fData } from 'src/utils/format-number';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaUtils } from 'src/components/hook-form';
import { getSupabaseBrowser } from 'src/lib/supabase/client'; // 클라이언트용 supabase 인스턴스
// ----------------------------------------------------------------------

export const UserCreateSchema = z.object({
 // avatarUrl: schemaUtils.file({ error: 'Avatar is required!' }),
  //PHONE: schemaUtils.phoneNumber({ isValid: isValidPhoneNumber }),
  USER_ID: z.string().min(1, { error: '사용자 ID를 입력하세요' }),  
  GENDER: z.string().min(1, { error: '성별을 선택하세요' }),
  RRN: z.string().min(6, { error: '생년월일을 입력하세요' }),
  COMPANY_NM: z.string().min(1, { error: '회사명을 입력하세요' }),
  PHONE: z.string(),
  COMPANY_CD: z.string(),
  DUTY_CD: z.string(),
  POSITION_CD: z.string(),
  EX_NO: z.string(),
  UPDATED_DTIME: z.string().optional(),
});

// ----------------------------------------------------------------------

export function UserCreateEditForm({ currentUser }) {
  const router = useRouter();

  const defaultValues = {
    avatarUrl: '',
    USER_NM: '',
    EMAIL: '',
    USER_ID: '',
    PHONE: '',
    GENDER: '',
    RRN: '',
    COMPANY_CD: '',
    COMPANY_NM: '',
    EX_NO: '',
    DUTY_CD: '',
    POSITION_CD: '',
    UPDATED_DTIME: '',
  }

  // currentUser 값중 null인경우 ''으로 치환
  const safeUser = currentUser
  ? {
      ...defaultValues,
      ...Object.fromEntries(
        Object.entries(currentUser).map(([key, value]) => [key, value ?? ''])
      ),
    }
  : defaultValues;

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(UserCreateSchema),
    defaultValues: safeUser,
    //values: currentUser,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const { setValue } = methods;

  useEffect(() => {
    const now = new Date().toISOString(); // 또는 한국시간 포맷도 가능
    setValue('UPDATED_DTIME', now);
  }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
  try {
    // 반드시 currentUser.id가 있어야 업데이트 수행
    if (!currentUser?.id) {
      console.error('Update aborted: currentUser.id is missing', currentUser);
      toast.error('사용자 ID가 없어 업데이트할 수 없습니다.');
      return;
    }
    
    // 업데이트 항목 Setting
    const payload = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, value ?? ''])
    );

    console.log('currentUser:', currentUser);
    console.log('Attempting UPDATE, id:', currentUser.id);
    console.log('Payload:', JSON.stringify(payload, null, 2));

    // id 타입 맞추기 (숫자형 id인 경우 Number 변환)
    //const idForQuery = isNaN(Number(currentUser.id)) ? currentUser.id : Number(currentUser.id);
    
    const supabase = getSupabaseBrowser();

    const res = await supabase
      .from('USER_BASE')
      .update(payload)
      .eq('id', currentUser.id)
      .select()
      .single();

    console.log('Supabase update response:', JSON.stringify(res, null, 2));

    if (res.error) {
      console.error('Update error details:', res.error);
      toast.error('사용자 정보 수정에 실패했습니다. 콘솔을 확인하세요.');
      return;
    }

    // 성공 시
    toast.success('사용자 정보가 수정되었습니다.');
    reset();
    router.push(paths.dashboard.user.list);
  } catch (err) {
    console.error('onSubmit 예외:', err);
    toast.error('알 수 없는 오류가 발생했습니다. 콘솔을 확인하세요.');
  }
});

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            
            <Box sx={{ mb: 5 }}>
              <Field.UploadAvatar
                name="avatarUrl"
                maxSize={3145728}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    허용된 확장자 *.jpeg, *.jpg, *.png, *.gif
                    <br /> 최대 사이즈 {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {/*  Todo리스트 권한별 노출*/}
            {currentUser && (
              <Stack sx={{ mt: 3, alignItems: 'center', justifyContent: 'center' }}>
                <Button variant="soft" color="error">
                  사용자 삭제
                </Button>
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="USER_NM" label="이름" disabled/>
              <Field.Text name="EMAIL" label="Email 주소" disabled/>
              
              <Field.Text name="USER_ID" label="사용자ID" />
              <Field.Text name="PHONE" label="핸드폰 번호" />
              
              <Field.Select name="GENDER" label="성별" defaultValue="M" > 
                <MenuItem value="M">남자</MenuItem>
                <MenuItem value="F">여자</MenuItem>
              </Field.Select>
              
              <Field.Text name="RRN" label="생년월일" />
              {/*<Field.Text name="COMPANY_CD" label="회사코드"  sx={{ display: 'none' }} value = "C001" /> */}
              <Field.Text name="COMPANY_CD" label="회사코드" />
              <Field.Text name="COMPANY_NM" label="회사명" />
              <Field.Text name="EX_NO" label="내선번호" />
              <Field.Text name="DUTY_CD" label="직급" />
              <Field.Text name="POSITION_CD" label="직책" />
              <Field.Text name="UPDATED_DTIME" label="업데이트 시간" sx={{ display: 'none' }}  />
            </Box>

            <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
              <Button type="submit" variant="contained" loading={isSubmitting}>
                변경사항 저장
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
