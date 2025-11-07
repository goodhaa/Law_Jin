import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import { Iconify } from 'src/components/iconify';
import { MenuItem } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaUtils } from 'src/components/hook-form';
import { useAuthContext } from 'src/auth/hooks';
import { _tags, _tourGuides, TOUR_SERVICE_OPTIONS } from 'src/_mock';

// 담당자선정
import Chip from '@mui/material/Chip';

import { getSupabaseBrowser } from 'src/lib/supabase/client';
import React, { useContext, useEffect, useState } from 'react';
import { DashboardContent } from 'src/layouts/dashboard';
import { useCodes } from 'src/hooks/useCodes'; // 공통코드
import { useUsers } from 'src/hooks/useUsers'; // 사용자리스트
// ----------------------------------------------------------------------

export const UserCreateSchema = z.object({
  large_class_cd: z.string().min(1, { message: '대분류를 선택하세요' }),
  small_class_cd: z.string().min(1, { message: '소분류를 선택하세요' }),
  court_level_cd: z.string().min(1, { message: '심급을 선택하세요' }),
  accept_date: schemaUtils.date({ error: { required: '수임일을 지정해주세요' } }),
  register_nm: z.string().optional(),
  register_id: z.string().optional(),
  court_cd: z.string().optional(),
  court_nm: z.string().min(1, { message: '법원을 입력해주세요' }),
  case_no: z.string().min(1, { message: '사건번호를 입력해주세요' }),
  courtroom_place: z.string().min(1, { message: '재판정을 입력해주세요' }),
  case_nm: z.string().min(1, { message: '사건명을 입력해주세요' }),
  client_nm: z.string().min(1, { message: '의뢰인명을 입력해주세요' }),
  client_type_cd: z.string().min(1, { message: '유형을 선택해주세요' }),
  internal_party_nm: z.string().optional(),
  ceo_nm: z.string().optional(),
  position_nm: z.string().optional(),
  client_phone: z.string().min(1, { message: '연락처를 입력해주세요' }),
  email: schemaUtils.email().optional(),
  telephone: z.string().optional(),
  fax: z.string().optional(),
  address: z.string().optional(),

  // 여기부터 배열 정의 (빈 배열 허용, 요소는 {id, name})
  //assignee_id: z.string().array().min(1, { error: '최소 한 명 이상의 수임자를 선택해야 합니다!' }),
  //person_in_charge_id: z.string().array().min(1, { error: '최소 한 명 이상의 담당자를 지정해야 합니다!' }),

  assignee_id: z.array( z.object({ 
            USER_ID: z.string(), 
            USER_NM: z.string(),
          })).min(1, { error: '최소 한 명 이상의 수임자를 선택해야 합니다!' }),
  person_in_charge_id: z.array( z.object({ 
            USER_ID: z.string(), 
            USER_NM: z.string(),
          })).min(1, { error: '최소 한 명 이상의 담당자를 선택해야 합니다!' }),    
  company_cd: z.string().optional(),
});

// ----------------------------------------------------------------------

export function CaseCreateEditForm() {
  const router = useRouter();
  const openBasic = useBoolean(true);
  const openDetails = useBoolean(true);
  const openClient = useBoolean(true);
  const openPic = useBoolean(true);

  const { user } = useAuthContext();
  //console.log("사건등록 화면 유저정보 :: " + JSON.stringify(user, null, 2));
/*
 const [loading, setLoading] = useState(true);      // ← 로딩 상태
  const [error, setError] = useState(null);          // ← 에러 상태
*/
  // 공통코드 호출
  const { codes: largeClassOptions } = useCodes('LARGE_CLASS');
  const { codes: smallClassOptions } = useCodes('SMALL_CLASS');
  const { codes: courtLevelOptions } = useCodes('COURT_LEVEL');

  const { codes: userList } = useUsers(user?.companyCd);
   console.log('userList 항목 :: ', JSON.stringify(userList, null, 2));
  const defaultValues = {
    large_class_cd: '',   // CR: 형사, CI: 민사, FA: 가사, AD: 행정
    small_class_cd: '',   // PR: 검찰, PO: 경찰, CO: 법원
    court_level_cd: '',     // 01, 02, 03
    accept_date: new Date(), // DatePicker가 Date 객체를 기대하면 Date로
    register_nm: user?.displayName ?? '',
    register_id: user?.userId ?? '',
    court_cd: '',
    court_nm: '',
    case_no: '',
    courtroom_place: '',
    case_nm: '',
    client_nm: '',
    client_type_cd: '',
    internal_party_nm: '',
    ceo_nm: '',
    position_nm: '',
    client_phone: '',
    email: '',
    telephone: '',
    fax: '',
    address: '',
    assignee_id: [],
    person_in_charge_id: [],
    company_cd: user?.companyCd ?? '',
  };


  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(UserCreateSchema),
    defaultValues,
  });

/*
  useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const supabase = getSupabaseBrowser();
        const { data, error } = await supabase
          .from('CODE_INFO')
          .select('*')
          .eq('code_group', 'LARGE_CLASS')
          .order('sort_order', { ascending: true });

        console.log('✅ supabase raw data:', data);

        if (error) throw error;

      } catch (err) {
        console.error(err);
        if (mounted) setError(String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUsers();
    return () => { mounted = false;};
  }, []);
  
  if (loading) { // 로딩 / 에러 처리 (useEffect 뒤, 실제 JSX return 전에 위치)
    return (
      <DashboardContent>
        <Card sx={{ p: 3 }}>데이터 불러오는 중...</Card>
      </DashboardContent>
    );
  }
  if (error) {
    return (
      <DashboardContent>
        <Card sx={{ p: 3 }}>에러 발생: {error}</Card>
      </DashboardContent>
    );
  }

*/
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  

  const renderCollapseButton = (value, onToggle) => (
    <IconButton onClick={onToggle}>
      <Iconify icon={value ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'} />
    </IconButton>
  );


  const onSubmit = handleSubmit(async (data) => {
    try {

      // Insert 항목 Setting
      const payload = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value ?? ''])
      );

      console.log('Insert 항목 :: ', JSON.stringify(payload, null, 2));
      const supabase = getSupabaseBrowser();

      // CASE_BASE 신규 사건 생성
      const resMain = await supabase
        .from('CASE_BASE')
        .insert(payload)     // 배열 형태로 넣어야 함
        .select()            // insert 후 결과 가져오기
        .single();           // 하나만 삽입했으므로 single() 사용  

      if (resMain.error) {
        console.error('Insert error details:', resMain.error);
        toast.error('신규 사건 생성에 실패했습니다.');
        return;
      }

      console.log('INSERT CASE_BASE with : ', resMain);
      
      toast.success('신규 사건이 생성되었습니다.');
      //reset();
      router.push(paths.dashboard.case.root);

    } catch (error) {
      console.error(error);
    }
  });

  const renderBasic = () => (
    <Card>
      <CardHeader
        title="기본사항"
        //subheader="민사,형사 수임일 등"
        action={renderCollapseButton(openBasic.value, openBasic.onToggle)}
        sx={{ mb: 2 }}
      />

      <Collapse in={openBasic.value}>
        <Divider />

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            {/* xs : 모바일 , sm : 중간크기 화면, lg : 큰화면 열 수  */}
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
              }}
            > 
              <Field.Select name="large_class_cd" label="대분류">
                {largeClassOptions.map(o => (
                  <MenuItem key={o.code} value={o.code}>{o.code_nm}</MenuItem>
                ))}
              </Field.Select> 

              <Field.Select name="small_class_cd" label="소분류">
                {smallClassOptions.map((opt) => (
                  <MenuItem key={opt.code} value={opt.code}>
                    {opt.code_nm}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Select name="court_level_cd" label="심급">
                {courtLevelOptions.map((opt) => (
                  <MenuItem key={opt.code} value={opt.code}>
                    {opt.code_nm}
                  </MenuItem>
                ))}
              </Field.Select>
              
              <Field.DatePicker name="accept_date" label="수임일" format="YYYY-MM-DD"/>

              <Field.Text name="register_nm" label="등록인"  value={user?.displayName} disabled  />
              <Field.Text name="register_id" label="등록인ID"  value={user?.userId}  sx={{ display: 'none' }} />
            </Box>

          </Card>
        </Grid>
      </Collapse>
    </Card>
  );

  const renderDetails = () => (
    <Card>
      <CardHeader
        title="계속기관"
        //subheader="민사,형사 수임일 등"
        action={renderCollapseButton(openDetails.value, openDetails.onToggle)}
        sx={{ mb: 2 }}
      />

      <Collapse in={openDetails.value}>
        <Divider />

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            {/* xs : 모바일 , sm : 중간크기 화면, lg : 큰화면 열 수  */}
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
              }}
            >  
              <Field.Text name="court_cd" label="법원코드" sx={{ display: 'none' }}/>
              <Field.Text name="court_nm" label="법원(기관)" />
              <Field.Text name="case_no" label="사건번호" />
              <Field.Text name="courtroom_place" label="장소(재판정)" />
              <Field.Text name="case_nm" label="사건명" />
              
            </Box>

          </Card>
        </Grid>
      </Collapse>
    </Card>
  );

  const renderClient = () => (
    <Card>
      <CardHeader
        title="고객"
        //subheader="민사,형사 수임일 등"
        action={renderCollapseButton(openClient.value, openClient.onToggle)}
        sx={{ mb: 2 }}
      />

      <Collapse in={openClient.value}>
        <Divider />

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            {/* xs : 모바일 , sm : 중간크기 화면, lg : 큰화면 열 수  */}
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
              }}
            >  
              <Field.Text name="client_nm" label="의뢰인명" />
              <Field.Text name="client_type_cd" label="유형" />
              <Field.Text name="internal_party_nm" label="내부관계인" />
              <Field.Text name="ceo_nm" label="대표자명" />
              <Field.Text name="position_nm" label="직위" />
              <Field.Text name="client_phone" label="연락처" />
              <Field.Text name="email" label="이메일" />
              <Field.Text name="telephone" label="전화" />
              <Field.Text name="fax" label="팩스" />
              <Field.Text name="address" label="주소" />
            </Box>
          </Card>
        </Grid>
      </Collapse>
    </Card>
  );

  const renderPic = () => (
    <Card>
      <CardHeader
        title="수임/담당자 지정"
        //subheader="민사,형사 수임일 등"
        action={renderCollapseButton(openPic.value, openPic.onToggle)}
        sx={{ mb: 2 }}
      />

      <Collapse in={openPic.value}>
        <Divider />

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>           
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
              }}
            >  
            <Field.Autocomplete
              multiple
              name="assignee_id"
              placeholder="+ 수임자 지정"
              disableCloseOnSelect
              options={userList}
              getOptionLabel={(option) => option.USER_NM}
              isOptionEqualToValue={(option, value) => option.USER_ID === value.USER_ID}
              renderOption={(props, option) => {
                const { key, ...otherProps } = props;

                return (
                  <li key={key} {...otherProps}>
                    {option.USER_NM}
                  </li>
                );
              }}
              renderValue={(selected, getItemProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getItemProps({ index })}
                    key={option.USER_ID}
                    label={option.USER_NM}
                    size="small"
                    variant="soft"
                  />
                ))
              }
            />

            <Field.Autocomplete
              multiple
              name="person_in_charge_id"
              placeholder="+ 담당자 지정"
              disableCloseOnSelect
              options={userList}
              getOptionLabel={(option) => option.USER_NM}
              isOptionEqualToValue={(option, value) => option.USER_ID === value.USER_ID}
              renderOption={(props, option) => {
                const { key, ...otherProps } = props;

                return (
                  <li key={key} {...otherProps}>
                    {option.USER_NM}
                  </li>
                );
              }}
              renderValue={(selected, getItemProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getItemProps({ index })}
                    key={option.USER_ID}
                    label={option.USER_NM}                    
                    size="small"
                    variant="soft"
                  />
                ))
              }
            />

            
          </Box>
          </Card>
        </Grid>
      </Collapse>
    </Card>
  );

  const renderActions = () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end' }}>
      
      <Button type="submit" variant="contained" loading={isSubmitting}>
        등록
      </Button>
      
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 1280 } }}>
     
        {renderBasic()}
        {renderDetails()}
        {renderClient()}
        {renderPic()}        
        {renderActions()}
        

      </Stack>
    </Form>
  );
}
