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
// ----------------------------------------------------------------------

export const UserCreateSchema = z.object({
  avatarUrl: schemaUtils.file({ error: 'Avatar is required!' }),
  name: z.string().min(1, { error: 'Name is required!' }),
  email: schemaUtils.email(),
  phoneNumber: schemaUtils.phoneNumber({ isValid: isValidPhoneNumber }),
  country: schemaUtils.nullableInput(z.string().min(1, { error: 'Country is required!' }), {
    error: 'Country is required!',
  }),
  address: z.string().min(1, { error: 'Address is required!' }),
  company: z.string().min(1, { error: 'Company is required!' }),
  state: z.string().min(1, { error: 'State is required!' }),
  city: z.string().min(1, { error: 'City is required!' }),
  role: z.string().min(1, { error: 'Role is required!' }),
  zipCode: z.string().min(1, { error: 'Zip code is required!' }),
  // Not required
  status: z.string(),
  isVerified: z.boolean(),
});

// ----------------------------------------------------------------------

export function IncidentCreateEditForm() {
  const router = useRouter();
  const openBasic = useBoolean(true);
  const openDetails = useBoolean(true);
  const openClient = useBoolean(true);
  const openPic = useBoolean(true);

  const { user } = useAuthContext();

  const defaultValues = {
    largeClass: '',
    smallClass: '',
    levelOfCourt: '',
    acceptDate: '',
    userNm: '',
    lawCourt: '',
    incidentNo: '',
    place: '',
    incidentNm: '',
    clientNm: '',
    clientCd: '',
    insider: '',
    ceoNm: '',
    role: '',
    phone: '',
    email: '',
    telePhone: '',
    fax: '',
    address: '',
    personInCharge: [],
    assignee: [],
  };


  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(UserCreateSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  

  const values = watch();


  const renderCollapseButton = (value, onToggle) => (
    <IconButton onClick={onToggle}>
      <Iconify icon={value ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'} />
    </IconButton>
  );


  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success('신건이 등록되었습니다!');
      router.push(paths.dashboard.user.list);
      console.info('DATA', data);
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
              <Field.Select name="largeClass" label="대분류" defaultValue="1">
                <MenuItem value="1">형사</MenuItem>
                <MenuItem value="2">민사</MenuItem>
              </Field.Select>

              <Field.Select name="smallClass" label="소분류" >
                <MenuItem value="1">검찰</MenuItem>
                <MenuItem value="2">경찰</MenuItem>
              </Field.Select>

              <Field.Select name="levelOfCourt" label="심급">
                <MenuItem value="1">1심</MenuItem>
                <MenuItem value="2">2심</MenuItem>
              </Field.Select>
              
              <Field.DatePicker name="acceptDate" label="수임일" format="YYYY-MM-DD" defaultValue={new Date()}/>

              <Field.Text name="userNm" label="등록인"  value={user?.displayName} disabled  />
              
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
              <Field.Text name="lawCourt" label="법원(기관)" />
              <Field.Text name="incidentNo" label="사건번호" />
              <Field.Text name="place" label="장소(재판정)" />
              <Field.Text name="incidentNm" label="사건명" />
              
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
              <Field.Text name="clientNm" label="의뢰인명" />
              <Field.Text name="clientCd" label="유형" />
              <Field.Text name="insider" label="내부관계인" />
              <Field.Text name="ceoNm" label="대표자명" />
              <Field.Text name="role" label="직위" />
              <Field.Text name="phone" label="이동전화" />
              <Field.Text name="email" label="이메일" />
              <Field.Text name="telePhone" label="전화" />
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
              name="assignee"
              placeholder="+ 수임자 지정"
              disableCloseOnSelect
              options={_tourGuides}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => {
                const { key, ...otherProps } = props;

                return (
                  <li key={key} {...otherProps}>
                    
                    
                    {option.name}
                  </li>
                );
              }}
              renderValue={(selected, getItemProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getItemProps({ index })}
                    key={option.id}
                    label={option.name}
                    size="small"
                    variant="soft"
                  />
                ))
              }
            />

            <Field.Autocomplete
              multiple
              name="personInCharge"
              placeholder="+ 담당자 지정"
              disableCloseOnSelect
              options={_tourGuides}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => {
                const { key, ...otherProps } = props;

                return (
                  <li key={key} {...otherProps}>
                    {option.name}
                  </li>
                );
              }}
              renderValue={(selected, getItemProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getItemProps({ index })}
                    key={option.id}
                    label={option.name}                    
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
