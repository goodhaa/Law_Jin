import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { Iconify } from 'src/components/iconify';
import { formHelperTextClasses } from '@mui/material/FormHelperText';
import { useCodes } from 'src/hooks/useCodes';
import dayjs from 'dayjs'
// ----------------------------------------------------------------------

export function CaseTableToolbar({ filters, dateError, onResetPage }) {

  const { codes: smallClassCodes } = useCodes('SMALL_CLASS'); // ✅ 소분류 코드 가져오기

  const { state: currentFilters, setState: updateFilters } = filters;

  const handleFilterName = useCallback(
    (event) => {
      onResetPage();
      updateFilters({ name: event.target.value });
    },
    [onResetPage, updateFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue) => {
      onResetPage();
      if (newValue) {
        // Dayjs 객체로 변환 + 시간 조정 (시작일은 00:00:00로)
        const adjustedDate = dayjs(newValue).startOf('day');
        updateFilters({ startDate: adjustedDate });
      } else {
        updateFilters({ startDate: null });
      }
    },
    [onResetPage, updateFilters]
  );
  
  const handleFilterEndDate = useCallback(
    (newValue) => {
      onResetPage();
      if (newValue) {
        // Dayjs 객체로 변환 + 시간 조정
        const adjustedDate = dayjs(newValue).endOf('day'); // 23:59:59로 맞춤
        updateFilters({ endDate: adjustedDate });
      } else {
        updateFilters({ endDate: null });
      }
    },
    [onResetPage, updateFilters]
  );

  const handleFilterSmallClass = (event) => {
    const {
      target: { value },
    } = event;
    // MUI Select multiple에서 value가 string으로 올 수도 있으니 방어적으로 처리
    filters.setState({
      smallClass: typeof value === 'string' ? value.split(',') : value,
    });
    // 만약 페이지를 리셋해야 하면 호출 (table.onResetPage 등)
    if (typeof onResetPage === 'function') onResetPage();
  };

  return (
    <>
      <Box
        sx={{
          p: 2.5,
          gap: 2,
          display: 'flex',
          pr: { xs: 2.5, md: 1 },
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-end', md: 'center' },
        }}
      >
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
          <InputLabel htmlFor="filter-small-class-select">소분류</InputLabel>
          <Select
            multiple
            label="소분류"
            value={currentFilters.smallClass || []}
            onChange={handleFilterSmallClass}
            renderValue={(selected) =>
              (selected || [])
                .map((code) => smallClassCodes.find((c) => c.code === code)?.code_nm ?? code)
                .join(', ')
            }
            inputProps={{ id: 'filter-small-class-select' }}
            MenuProps={{
              slotProps: { paper: { sx: { maxHeight: 240 } } },
            }}
          >
            {smallClassCodes.map((option) => (
              <MenuItem key={option.code} value={option.code}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={(currentFilters.smallClass || []).includes(option.code)}
                  slotProps={{ input: { id: `${option.code}-checkbox` } }}
                />
                {option.code_nm}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <DatePicker
          label="시작일"
          value={currentFilters.startDate || null}
          onChange={handleFilterStartDate}
          sx={{ maxWidth: { md: 180 } }}
        />

        <DatePicker
          label="종료일"
          value={currentFilters.endDate || null}
          onChange={handleFilterEndDate}
          slotProps={{
            textField: {
              error: dateError,
              helperText: dateError ? 'End date must be later than start date' : null,
            },
          }}
          sx={{
            maxWidth: { md: 180 },
            [`& .${formHelperTextClasses.root}`]: {
              bottom: { md: -40 },
              position: { md: 'absolute' },
            },
          }}
        />

        <Box
          sx={{
            gap: 2,
            width: 1,
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <TextField
            fullWidth
            value={currentFilters.name}
            onChange={handleFilterName}
            placeholder="의뢰인, 사건번호, 사건명 검색..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      </Box>

    </>
  );
}
