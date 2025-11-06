import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { RouterLink } from 'src/routes/components';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

import { UserQuickEditForm } from './user-quick-edit-form';

// ----------------------------------------------------------------------

export function UserTableRow({ row, no, selected }) {

  const quickEditForm = useBoolean();

  const renderQuickEditForm = () => (
    <UserQuickEditForm
      currentUser={row}
      open={quickEditForm.value}
      onClose={quickEditForm.onFalse}
    />
  );

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        {/*
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            slotProps={{
              input: {
                id: `${row.id}-checkbox`,
                'aria-label': `${row.id} checkbox`,
              },
            }}
          />
        </TableCell>
        */}
        <TableCell align="center">{no}</TableCell>
        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            {/** 사용자 프로필사진 
            <Avatar alt={row.name} src={row.avatarUrl} />
            */}
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link
                component="button"         // 시맨틱하게 버튼 역할을 하게 설정
                underline="hover"
                sx={{ cursor: 'pointer', p: 0, fontSize: 'inherit', textTransform: 'none' }}
                onClick={() => quickEditForm.onTrue()}
              >
                {row.USER_NM}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.EMAIL}
              </Box>
            </Stack>
          </Box>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.PHONE}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.DEPT}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.GRADE}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.ROLE}</TableCell>

        
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.EX_NO}</TableCell>
        {/** 수정/삭제 아이콘 제거
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Quick edit" placement="top" arrow>
              <IconButton
                color={quickEditForm.value ? 'inherit' : 'default'}
                onClick={quickEditForm.onTrue}
              >
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>

            <IconButton
              color={menuActions.open ? 'inherit' : 'default'}
              onClick={menuActions.onOpen}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Box>
        </TableCell>
         */}
      </TableRow>
      
       
      {renderQuickEditForm()}
      
    </>
  );
}
