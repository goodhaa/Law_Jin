'use client';

import { useState } from 'react';
import { useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { _roles } from 'src/_mock';

import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { UserTableRow } from '../userTableRow';
import { UserTableToolbar } from '../userTableToolbar';
import { UserTableFiltersResult } from '../userTableFiltersResult';
import { getSupabaseBrowser } from 'src/lib/supabase/client';
import React, { useContext, useEffect } from 'react';
import { AuthContext } from 'src/auth/context/auth-context';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'no', label: 'No', width: 60 },
  { id: 'USER_NM', label: '사용자' },
  { id: 'PHONE', label: '연락처', width: 180 },
  { id: 'DEPT', label: '소속', width: 180 },
  { id: 'GRADE', label: '직급', width: 180 },
  { id: 'ROLE', label: '직책', width: 180 },
  { id: 'EX_NO', label: '내선번호', width: 180 },
];

// ----------------------------------------------------------------------

export function UserListView() {
  const table = useTable();

  const [tableData, setTableData] = useState([]);   // ← 서버 데이터 받을 배열
  const [loading, setLoading] = useState(true);      // ← 로딩 상태
  const [error, setError] = useState(null);          // ← 에러 상태

  const filters = useSetState({ name: '', role: [] });
  const { state: currentFilters} = filters;

  const { userBase } = useContext(AuthContext); // 로그인된 사용자 정보 가져오기

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const canReset =
    !!currentFilters.name || currentFilters.role.length > 0 ;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

   console.log('✅ 로그인된 회원정보:', userBase);

  useEffect(() => {

    let mounted = true;

    const fetchUsers = async () => {
      setLoading(true);

      try {
        const supabase = getSupabaseBrowser();
        const { data, error } = await supabase
          .from('USER_BASE')
          .select('id, USER_NM, EMAIL, PHONE, GRADE, ROLE, EX_NO, DEPT')
          .eq('COMPANY_CD', userBase?.COMPANY_CD);

        console.log('✅ supabase raw data:', data);

        if (error) throw error;

        const users = (data || []).map((r) => ({
          id: r.id,
          USER_NM: r.USER_NM ?? '',
          EMAIL: r.EMAIL ?? '',
          PHONE: r.PHONE ?? '',
          GRADE: r.GRADE ?? '',
          ROLE: r.ROLE ?? '',
          EX_NO: r.EX_NO ?? '',
          DEPT: r.DEPT_NM ?? '',
        }));
        
        if (mounted) setTableData(users);
      } catch (err) {
        console.error(err);
        if (mounted) setError(String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };

  fetchUsers();
  return () => {
    mounted = false;
  };
}, []);
  // -------------------
  // 로딩 / 에러 처리 (useEffect 뒤, 실제 JSX return 전에 위치)
  // -------------------
  if (loading) {
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


  return (
    <>
      <DashboardContent>
        
        <CustomBreadcrumbs
          heading="사용자 목록"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: '사용자', href: paths.dashboard.user.root },
            { name: '목록' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          {/* 검색바 시작 */}
          
          <UserTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ roles: _roles }}
          />

          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          {/* 검색바 끝 */}
          
          <Box sx={{ position: 'relative' }}>           
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960, '& .MuiTableCell-root': { textAlign: 'center' }, }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD}
                  onSort={table.onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row, index) => {
                     const no = table.page * table.rowsPerPage + index + 1;
                     return (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        no={no}
                      />
                    );
                  })}

                  {/** 테이블의 행 높이를 맞춰주는 역할 */}
                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  {/**화면에 "검색 결과 없음" 같은 표시를 보여줌 */}
                  <TableNoData notFound={notFound} />
                </TableBody>
                
              </Table>
            </Scrollbar>
            
          </Box>

          {/** 페이지 바 시작 */}
          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
          {/** 페이지 바 끝 */}
        </Card>
      </DashboardContent>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, role } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((user) => user.USER_NM.toLowerCase().includes(name.toLowerCase()));
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.ROLE));
  }

  return inputData;
}
