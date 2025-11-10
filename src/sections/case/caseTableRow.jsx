import { useBoolean } from 'minimal-shared/hooks';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

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
    
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {Array.isArray(row.assignees) && row.assignees.length > 0
            ? row.assignees.map((a) => a.USER_NM).join(', ')
            : '-'}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {Array.isArray(row.personInCharge) && row.personInCharge.length > 0
            ? row.personInCharge.map((p) => p.USER_NM).join(', ')
            : '-'}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}> {dayjs(row.created_at).format('YYYY-MM-DD')}</TableCell>
        
      </TableRow>
      
       
      {renderQuickEditForm()}
      
    </>
  );
}
