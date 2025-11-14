import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export function FaqsForm({ sx, ...other }) {
  return (
    <Box sx={sx} {...other}>
      <Typography variant="h4">{`적절한 도움을 찾지 못하셨나요?`}</Typography>
      <Box
        sx={{
          my: 5,
          gap: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TextField fullWidth label="이름" />
        <TextField fullWidth label="Email" />
        <TextField fullWidth label="제목" />
        <TextField fullWidth label="당신의 메시지를 입력해주세요" multiline rows={4} />
      </Box>

      <Button size="large" variant="contained">
        전송
      </Button>
    </Box>
  );
}
