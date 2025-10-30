import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

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
const SEX_OPTIONS = ['남자', '여자'];
// ----------------------------------------------------------------------

export function UserCreateEditForm({ currentUser }) {
  const router = useRouter();

  const defaultValues = {
    status: '',
    avatarUrl: null,
    isVerified: true,
    name: '',
    email: '',
    phoneNumber: '',
    country: '',
    state: '',
    city: '',
    address: '',
    zipCode: '',
    company: '',
    role: '',
  };

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(UserCreateSchema),
    defaultValues,
    values: currentUser,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(currentUser ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentUser && (
              <Label
                color={
                  (values.status === 'active' && 'success') ||
                  (values.status === 'banned' && 'error') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

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
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {currentUser && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'banned' : 'active')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{
                  mx: 0,
                  mb: 3,
                  width: 1,
                  justifyContent: 'space-between',
                }}
              />
            )}

            {/* 
            <Field.Switch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the user a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />
            */}

            {currentUser && (
              <Stack sx={{ mt: 3, alignItems: 'center', justifyContent: 'center' }}>
                <Button variant="soft" color="error">
                  Delete user
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
              <Field.Text name="name" label="이름" />
              <Field.Text name="email" label="Email 주소" />
              
              {/*<Field.Phone name="phone" label="핸드폰 번호" defaultCountry="US" />
              <Field.CountrySelect
                fullWidth
                name="country"
                label="Country"
                placeholder="Choose a country"
              />
              */}
              
              <Field.Text name="user_id" label="사용자ID" />
              <Field.Text name="phone" label="핸드폰 번호" />

              <Field.Select
                fullWidth
                name="sex"
                label="성별"
                slotProps={{ inputLabel: { shrink: true } }}
              >
                {SEX_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option} sx={{ textTransform: 'capitalize' }}>
                    {option}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Text name="rrn" label="생년월일" />
              <Field.Text name="company_cd" label="회사코드" />
              <Field.Text name="company_nm" label="회사명" />
              <Field.Text name="duty_cd" label="직급" />
              <Field.Text name="position_cd" label="직책" />
            </Box>

            <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
              <Button type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? '저장' : '변경사항 저장'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
