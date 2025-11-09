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
import dayjs from 'dayjs';

import { useCodes } from 'src/hooks/useCodes';
// ----------------------------------------------------------------------

export function CaseTableRow({ row, no, selected }) {
  const { codes: smallClassCodes } = useCodes('SMALL_CLASS');
  
  const codeLabel = smallClassCodes.find(
    (c) => c.code === row.small_class_cd
  )?.code_nm ?? row.small_class_cd; 
  85
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
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.client_nm}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.case_no}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.case_nm}</TableCell>
        
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <a
            href="https://ssgo.scourt.go.kr/ssgo/index.on"
            target="_blank"
            rel="noopener noreferrer"
          >
            ELEC
          </a>
        </TableCell>
         <TableCell sx={{ whiteSpace: 'nowrap' }}>{codeLabel}</TableCell>
        {/** 
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.assignee_id}</TableCell>
        */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.small_class_cd}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}> {dayjs(row.created_at).format('YYYY-MM-DD')}</TableCell>
        
      </TableRow>
      
       
      {renderQuickEditForm()}
      
    </>
  );
}
