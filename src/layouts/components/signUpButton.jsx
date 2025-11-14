import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export function SignUpButton({ sx, ...other }) {
  return (
    <Button
      component={RouterLink}
      href={CONFIG.auth.signUpChoice}
      variant="outlined"
      sx={sx}
      {...other}
    >
      회원가입
    </Button>
  );
}
