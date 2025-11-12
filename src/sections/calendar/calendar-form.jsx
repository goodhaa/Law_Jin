import * as z from 'zod';
import { useCallback } from 'react';
import { uuidv4 } from 'minimal-shared/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DialogActions from '@mui/material/DialogActions';

import { fIsAfter } from 'src/utils/format-time';

import { createEvent, updateEvent, deleteEvent } from 'src/actions/calendar';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { Form, Field } from 'src/components/hook-form';
import { ColorPicker } from 'src/components/color-utils';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export const EventSchema = z.object({
  sch_title: z
    .string()
    .min(1, { error: '제목을 입력하세요' })
    .max(100, { error: '제목은 100자 미만이어야 합니다' }),
  sch_desc: z.string().optional(),
  color_cd: z.string().optional(),
  all_day: z.boolean().optional(),
  start_dt: z.union([z.string(), z.number()]),
  end_dt: z.union([z.string(), z.number()]),
  register_id: z.string().optional(),
  register_nm: z.string().optional(),
  company_cd: z.string().optional(),
});

// ----------------------------------------------------------------------

export function CalendarForm({ currentEvent, colorOptions, onClose }) {
  const { user } = useAuthContext(); // 로그인된 유저 정보 Get
  console.log('user 항목 :: ', JSON.stringify(user, null, 2));
  const defaultValues = {
    id: currentEvent?.id ? currentEvent.id : uuidv4(),
    color_cd: currentEvent?.color ? currentEvent.color : '',
    sch_title: currentEvent?.title ? currentEvent.title : '',
    all_day: currentEvent?.allDay ? currentEvent.allDay : false,
    sch_desc: currentEvent?.description ? currentEvent.description : '',
    end_dt: currentEvent?.end ? currentEvent.end : '',
    start_dt: currentEvent?.start ? currentEvent.start : '',
    register_nm: user?.displayName ?? '',
    register_id: user?.userId ?? '',
    user_id: user?.userId ?? '',
    company_cd: user?.companyCd ?? '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(EventSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  // 필드명에 맞춰 검사 수정 (start_dt / end_dt)
  const dateError = fIsAfter(values.start_dt, values.end_dt);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // nullish 값을 ''로 치환하거나 필요한 변환 수행
      const payload = Object.fromEntries(
        Object.entries({
          ...data,
          register_id: user?.userId ?? '',
          register_nm: user?.displayName ?? '',
          user_id: user?.userId ?? '',
          company_cd: user?.companyCd ?? '',
        }).map(([key, value]) => [key, value ?? ''])
      );

      console.log('Submit 일정 항목 :: ', JSON.stringify(payload, null, 2));

      if (currentEvent?.id) {
        // UPDATE 경로: updateEvent(id, payload) 사용 (헬퍼 시그니처에 맞게 조정)
        const res = await updateEvent(currentEvent.id, payload);

        // 헬퍼 함수의 반환 형태에 따라 에러 처리
        if (res?.error) {
          console.error('updateEvent error:', res.error);
          toast.error('일정 수정에 실패했습니다.');
          return;
        }

        toast.success('일정이 변경되었습니다.');
      } else {
        // INSERT 경로: createEvent(payload) 사용
        const res = await createEvent(payload);

        if (res?.error) {
          console.error('createEvent error:', res.error);
          toast.error('신규 일정 생성에 실패했습니다.');
          return;
        }

        toast.success('신규 일정이 생성되었습니다.');
      }

      // 성공 시 폼 닫고 리셋
      onClose();
      reset();
      

    } catch (error) {
      console.error('onSubmit error:', error);
      toast.error('요청 처리 중 오류가 발생했습니다.');
    }
  });

  const onDelete = useCallback(async () => {
    try {
      if (!currentEvent?.id) return;
      await deleteEvent(currentEvent.id);
      toast.success('일정이 삭제되었습니다.');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('일정 삭제 중 오류가 발생했습니다.');
    }
  }, [currentEvent?.id, onClose]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Scrollbar sx={{ p: 3, bgcolor: 'background.neutral' }}>
        <Stack spacing={3}>
          <Field.Text name="sch_title" label="제목" />
          <Field.Text name="sch_desc" label="내용" multiline rows={3} />
          <Field.Switch name="all_day" label="하루 종일" />
          <Field.DateTimePicker name="start_dt" label="시작일" format="YYYY/MM/DD hh:mm" />
          <Field.DateTimePicker
            name="end_dt"
            label="종료일"
            format="YYYY/MM/DD hh:mm"
            slotProps={{
              textField: {
                error: dateError,
                helperText: dateError ? '종료 날짜는 시작 날짜 이후여야 합니다.' : null,
              },
            }}
          />

          <Controller
            name="color_cd"
            control={control}
            render={({ field }) => (
              <ColorPicker value={field.value} onChange={(color) => field.onChange(color)} options={colorOptions} />
            )}
          />
        </Stack>
      </Scrollbar>

      <DialogActions sx={{ flexShrink: 0 }}>
        {!!currentEvent?.id && (
          <Tooltip title="Delete event">
            <IconButton color="error" onClick={onDelete} edge="start">
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        )}

        <Box component="span" sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onClose}>
          취소
        </Button>
        <Button type="submit" variant="contained" loading={isSubmitting} disabled={dateError}>
          {currentEvent?.id ? '일정 변경' : '일정 생성'}
        </Button>
      </DialogActions>
    </Form>
  );
}
