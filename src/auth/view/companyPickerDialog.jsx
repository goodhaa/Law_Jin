'use client';

import { useState, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, List, ListItemButton, ListItemText,
  CircularProgress, Box, Stack, InputAdornment, IconButton, Typography,
} from '@mui/material';
import { getSupabaseBrowser } from 'src/lib/supabase/client';
import { Iconify } from 'src/components/iconify';

export default function CompanyPickerDialog({ open, onClose, onSelect }) {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false); // 처음엔 결과 안내 메시지 노출

  const runSearch = useCallback(async () => {
    setSearched(true);
    setLoading(true);
    try {
      const supabase = getSupabaseBrowser();
      const { data, error } = await supabase
        .from('COMPANY_BASE')                      // ← 실제 테이블명으로 변경 가능
        .select('company_cd, company_nm, ceo_nm')
       // .eq('biz_type', 'LAW_FIRM')                // 로펌만
        .ilike('company_nm', `%${q.trim()}%`)      // 이름 검색 (빈값이면 전부 안 나옴)
        .order('company_nm', { ascending: true })
        .limit(50);

      if (error) throw error;
      setRows(data ?? []);
    } catch (e) {
      console.error('[CompanyPickerDialog] fetch error:', e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [q]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      void runSearch();
    }
  };

  const handlePick = (r) => {
    // 안전하게 문자열 정규화 후 부모로 전달
    onSelect?.({
      company_cd: String(r.company_cd ?? ''),
      company_nm: String(r.company_nm ?? ''),
    });
    onClose?.();
  };

  const handleClose = () => {
    // 닫을 때 상태 초기화(선택)
    setQ('');
    setRows([]);
    setSearched(false);
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>로펌 검색</DialogTitle>

      <DialogContent dividers>
        <Box
        sx={{ display: 'flex', gap: { xs: 3, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' } }}
      >
       
          <TextField
            fullWidth
            autoFocus
           // label="회사명"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="예) ○○법무법인"
            
          />

          <Button
            variant="contained"
            onClick={runSearch}
            disabled={loading || q.trim().length === 0}
            sx={{ flexShrink: 0 }}
          >
            검색
          </Button>
        </Box>
        <Box sx={{ mt: 2, position: 'relative', minHeight: 56 }}>
          {loading && (
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          )}

          {!loading && !searched && (
            <Typography variant="body2" sx={{ color: 'text.secondary', p: 1 }}>
              회사명을 입력하고 <b>검색</b>을 눌러주세요.
            </Typography>
          )}

          {!loading && searched && rows.length === 0 && (
            <Typography variant="body2" sx={{ color: 'text.secondary', p: 1 }}>
              검색 결과가 없습니다.
            </Typography>
          )}

          <List dense sx={{ maxHeight: 360, overflow: 'auto', opacity: loading ? 0.5 : 1 }}>
            {rows.map((r) => (
              <ListItemButton key={r.company_cd} onClick={() => handlePick(r)}>
                <ListItemText
                  primary={r.company_nm}
                  secondary={`대표자 : ${r.ceo_nm ?? '-'}`}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
}
