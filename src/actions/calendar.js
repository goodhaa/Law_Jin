import useSWR, { mutate as globalMutate } from 'swr';
import { useMemo } from 'react';
import { getSupabaseBrowser } from 'src/lib/supabase/client';

/**
 * SWR 캐시 키 (반드시 통일해서 사용)
 */
const CALENDAR_KEY = 'SCHEDULE_BASE';

/**
 * DB Row -> UI Event 매핑
 * FullCalendar가 기대하는 형태: { id, title, start, end, allDay, color }
 */
const toUI = (row) => ({
  id: row.id,
  title: row.sch_title ?? '',
  description: row.sch_desc ?? '',
  start: row.start_dt,              // ISO string(또는 Date) OK
  end: row.end_dt,
  allDay: !!row.all_day,
  color: row.color_cd ?? '',
  textColor: row.color_cd ?? '',    // 캘린더에서 텍스트 색으로 사용
});

/**
 * UI Event의 부분 변경 -> DB 패치 오브젝트
 * (드래그/리사이즈/폼 업데이트 등 공통 처리)
 */
const toDBPartial = (ui) => {
  const patch = {};
  if (ui.title !== undefined) patch.sch_title = ui.title;
  if (ui.description !== undefined) patch.sch_desc = ui.description;
  if (ui.start !== undefined) patch.start_dt = ui.start;
  if (ui.end !== undefined) patch.end_dt = ui.end;
  if (ui.allDay !== undefined) patch.all_day = ui.allDay;
  if (ui.color !== undefined) patch.color_cd = ui.color;
  return patch;
};

/**
 * Fetcher: 서버에서 일정 조회 후 UI 모델로 반환
 */
export const fetchEvents = async () => {
  const supabase = getSupabaseBrowser();
  const { data, error } = await supabase
    .from('SCHEDULE_BASE')
    .select('*')
    .order('start_dt', { ascending: true });
  if (error) throw error;
  console.log('🔵 [fetchEvents] from DB', data?.length, 'rows'); // ✅ 여기에 추가
  return (data ?? []).map(toUI);
};

/**
 * Hook: 일정 목록 상태
 */
export function useGetEvents() {
  const { data, error, isValidating, mutate: swrMutate } = useSWR(CALENDAR_KEY, fetchEvents);

  const memoizedValue = useMemo(() => {
    const events = data ?? [];
    return {
      events,
      eventsLoading: !error && !data,
      eventsError: error,
      eventsValidating: isValidating,
      eventsEmpty: !error && events.length === 0,
      // 필요 시 수동 새로고침
      refreshEvents: () => swrMutate(), // 키 재검증
    };
  }, [data, error, isValidating, swrMutate]);

  return memoizedValue;
}

/**
 * CREATE: 폼에서 DB 스키마 그대로(eventData) 전달
 *  - 성공 시 캐시 배열에 toUI(data) 한 건 추가
 */
export async function createEvent(eventData /* DB shape */) {
  try {
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.from('SCHEDULE_BASE').insert(eventData);
    if (error) throw error;

    // ✅ 부분 추가 금지. 항상 DB에서 전체를 다시 가져와 반영
    await globalMutate(CALENDAR_KEY, fetchEvents(), false);
    return { data: true, error: null };
  } catch (error) {
    console.error('createEvent error:', error);
    return { data: null, error };
  }
}

/**
 * UPDATE: 두 가지 호출 형태 모두 지원
 *  1) 폼: updateEvent(id, dbPayload)
 *  2) 드래그/리사이즈: updateEvent({ id, start, end, allDay, ... })
 */
export async function updateEvent(arg1, arg2) {
  try {
    let id;
    let dbPatch;

    if (typeof arg1 === 'object' && arg1 !== null) {
      id = arg1.id;
      dbPatch = toDBPartial(arg1);
    } else {
      id = arg1;
      dbPatch = arg2;
    }
    if (!id) throw new Error('updateEvent: id is required');

    const supabase = getSupabaseBrowser();
    const { error } = await supabase.from('SCHEDULE_BASE').update(dbPatch).eq('id', id);
    if (error) throw error;

    // ✅ 전체 재검증
    await globalMutate(CALENDAR_KEY, fetchEvents(), false);
    return { data: true, error: null };
  } catch (error) {
    console.error('updateEvent error:', error);
    return { data: null, error };
  }
}

/**
 * DELETE
 */
export async function deleteEvent(id) {
  try {
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.from('SCHEDULE_BASE').delete().eq('id', id);
    if (error) throw error;

    // ✅ 전체 재검증
    await globalMutate(CALENDAR_KEY, fetchEvents(), false);
    return { data: true, error: null };
  } catch (error) {
    console.error('deleteEvent error:', error);
    return { data: null, error };
  }
}