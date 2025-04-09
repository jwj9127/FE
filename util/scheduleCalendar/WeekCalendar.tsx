'use client';

import React, { useCallback, useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import { DateClickArg } from '@fullcalendar/interaction';
import { DateSelectArg, EventMountArg } from '@fullcalendar/core';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import UseReactSelect from '../select/UseReactSelect';

import dayjs from 'dayjs';
import 'dayjs/locale/ko'; // 한국어 요일/달 표기
dayjs.locale('ko');

import styles from './WeekCalendar.module.scss';
import getMonthWeekString from './getMonthWeekString';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
}

interface WeekCalendarProps {
  events: CalendarEvent[];
  // 여러 슬롯 클릭 시마다 상위로 전달
  onSlotSelect: (date: Date) => void;
}

const WeekCalendar = ({ events, onSlotSelect }: WeekCalendarProps) => {
  const pluginMini = useMemo(() => [dayGridPlugin, interactionPlugin], []);
  const pluginsMain = useMemo(() => [timeGridPlugin, interactionPlugin], []);
  const localesArray = useMemo(() => [koLocale], []);

  const handleEventDidMount = useCallback((arg: EventMountArg) => {
    const start = arg.event.start;
    if (!start) return;

    const timeStr = dayjs(start).format('HH:mm:00');
    const dateStr = dayjs(start).format('YYYY-MM-DD');

    const slotLaneEl = document.querySelector(
      `[data-date="${dateStr}"] [data-time="${timeStr}"].fc-timegrid-slot-lane`
    );
    const slotLabelEl = document.querySelector(
      `[data-date="${dateStr}"] [data-time="${timeStr}"].fc-timegrid-slot-label`
    );
    if (slotLaneEl && slotLabelEl) {
      slotLaneEl.classList.add('has-event');
      slotLabelEl.classList.add('has-event');
    }
  }, []);

  const handleEventWillUnmount = useCallback((arg: EventMountArg) => {
    const start = arg.event.start;
    if (!start) return;

    const timeStr = dayjs(start).format('HH:mm:00');
    const dateStr = dayjs(start).format('YYYY-MM-DD');

    const slotLaneEl = document.querySelector(
      `[data-date="${dateStr}"] [data-time="${timeStr}"].fc-timegrid-slot-lane`
    );
    const slotLabelEl = document.querySelector(
      `[data-date="${dateStr}"] [data-time="${timeStr}"].fc-timegrid-slot-label`
    );
    if (slotLaneEl && slotLabelEl) {
      slotLaneEl.classList.remove('has-event');
      slotLabelEl.classList.remove('has-event');
    }
  }, []);

  const [mainViewDate, setMainViewDate] = useState(new Date());

  const handleMiniDateClick = useCallback((arg: DateSelectArg) => {
    setMainViewDate(arg.start);
  }, []);

  const handleMainSelect = useCallback(
    (arg: DateClickArg) => {
      // 선택 상태를 상위에서 관리하고 있다면 onSlotSelect로 상태 업데이트
      onSlotSelect(arg.date);

      // DOM에서 해당 슬롯의 요소를 찾아서, 이미 선택되었으면 제거하고, 아니면 추가
      const timeStr = dayjs(arg.date).format('HH:mm:00');
      const dateStr = dayjs(arg.date).format('YYYY-MM-DD');

      const slotLaneEl = document.querySelector(
        `[data-date="${dateStr}"] [data-time="${timeStr}"].fc-timegrid-slot-lane`
      );
      const slotLabelEl = document.querySelector(
        `[data-date="${dateStr}"] [data-time="${timeStr}"].fc-timegrid-slot-label`
      );

      if (slotLaneEl && slotLabelEl) {
        // 이미 선택되어 있으면 제거, 아니면 추가 (토글)
        const isSelected = slotLaneEl.classList.contains('has-event');
        if (isSelected) {
          slotLaneEl.classList.remove('has-event');
          slotLabelEl.classList.remove('has-event');
        } else {
          slotLaneEl.classList.add('has-event');
          slotLabelEl.classList.add('has-event');
        }
      }
    },
    [onSlotSelect]
  );

  const hasEventOnDate = (date: Date) => {
    const dayYmd = dayjs(date).format('YYYY-MM-DD');
    return events.some((ev) => {
      const startYmd = dayjs(ev.start).format('YYYY-MM-DD');
      const endYmd = ev.end ? dayjs(ev.end).format('YYYY-MM-DD') : startYmd;
      return dayYmd >= startYmd && dayYmd <= endYmd;
    });
  };

  const handleDayCellClassNames = useCallback(
    (arg: any) => {
      return hasEventOnDate(arg.date) ? ['has-event'] : [];
    },
    [hasEventOnDate]
  );

  const getWeekDates = (baseDate: Date) => {
    const startOfWeek = dayjs(baseDate).startOf('week');
    return Array.from({ length: 7 }).map((_, i) => startOfWeek.add(i, 'day'));
  };

  const weekDates = getWeekDates(mainViewDate);

  const [openDays, setOpenDays] = useState<Record<string, boolean>>({});

  const handleDayColumnClick = useCallback(
    (event: React.MouseEvent, dateStr: string) => {
      if ((event.target as HTMLElement).classList.contains(styles.dayHeader)) {
        setOpenDays((prev) => ({
          ...prev,
          [dateStr]: !prev[dateStr],
        }));
        requestAnimationFrame(() => {
          window.dispatchEvent(new Event('resize'));
        });
      }
    },
    []
  );

  const getDayColumnClickHandler = useCallback(
    (dateStr: string) => (event: React.MouseEvent) =>
      handleDayColumnClick(event, dateStr),
    [handleDayColumnClick]
  );

  const slotLabelContent = useCallback((arg: any) => {
    const hour = arg.date.getHours();
    const hourStr = String(hour).padStart(2, '0');
    return hourStr + ' -';
  }, []);

  const headerToolbarConfig = useMemo(
    () => ({
      left: 'prev',
      center: 'title',
      right: 'next',
    }),
    []
  );

  const dayCellContent = useCallback((arg: any) => {
    return arg.date.getDate().toString();
  }, []);

  const gridTemplateColumns = useMemo(() => {
    return weekDates
      .map((day) => {
        const dayStr = day.format('YYYY-MM-DD');
        return openDays[dayStr] ? '2fr' : '1fr';
      })
      .join(' ');
  }, [weekDates, openDays]);

  const dayColumnDivStyle = useMemo<React.CSSProperties>(
    () => ({ gridTemplateColumns }),
    [gridTemplateColumns]
  );

  const [activeTab, setActiveTab] = useState('지역');
  const [selectedLocation, setSelectedLocation] = useState('서울');
  const [selectedTheme, setSelectedTheme] = useState('체험/액티비티');

  const createClickHandler = useCallback(
    (setter: any) => (e: any) => {
      const value = e.currentTarget.textContent?.trim();
      if (value) {
        setter(value);
      }
    },
    []
  );

  const handleTabClick = createClickHandler(setActiveTab);
  const handleLocationClick = createClickHandler(setSelectedLocation);
  const handleThemeClick = createClickHandler(setSelectedTheme);

  return (
    <div className={styles.container}>
      {/* ──────────────── 메인 스케줄(요일별) ──────────────── */}
      {/* 한 주(7일) 날짜를 가로로 나열하고, 각 날짜마다 timeGridDay FullCalendar */}
      <div className={styles.mainScheduleDays}>
        <div className={styles.daySelect}>
          <p>{getMonthWeekString(mainViewDate)}</p>
          <UseReactSelect type="calendar" />
        </div>
        <div className={styles.dayColumnDiv} style={dayColumnDivStyle}>
          {weekDates.map((day) => {
            const dayStr = day.format('YYYY-MM-DD');
            const isOpen = openDays[dayStr] ?? false;

            return (
              <div
                key={dayStr}
                className={`${styles.dayColumn} ${isOpen ? styles.expanded : styles.collapsed}`}
                onClick={getDayColumnClickHandler(dayStr)}
                data-date={dayStr}
              >
                {/* 날짜 헤더 */}
                <h3 className={styles.dayHeader}>{day.format('D (ddd)')}</h3>

                {isOpen && (
                  <FullCalendar
                    // Day 단위
                    initialView="timeGridDay"
                    // 각 날짜마다 다른 initialDate
                    initialDate={dayStr}
                    dayHeaders={false}
                    plugins={pluginsMain}
                    locales={localesArray}
                    locale="ko"
                    headerToolbar={false}
                    slotLabelContent={slotLabelContent}
                    // 시간 범위 (05:00 ~ 자정)
                    slotMinTime="05:00:00"
                    slotMaxTime="24:00:00"
                    // 높이 조정
                    height="auto"
                    // 시간 슬롯 간격을 1시간 단위로
                    slotDuration="01:00:00"
                    // 시간 라벨도 1시간마다
                    slotLabelInterval="01:00:00"
                    // 이벤트
                    events={events}
                    eventDidMount={handleEventDidMount}
                    eventWillUnmount={handleEventWillUnmount}
                    dateClick={handleMainSelect}
                    // allDaySlot 여부
                    allDaySlot={false}
                    displayEventTime={false}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.content}>
        {/* ───────────────── 미니 달력 ───────────────── */}
        <div className={styles.miniCalendar}>
          <FullCalendar
            plugins={pluginMini}
            initialView="dayGridMonth"
            initialDate={mainViewDate}
            locales={localesArray}
            locale="ko"
            headerToolbar={headerToolbarConfig}
            height="255px"
            selectable={true}
            select={handleMiniDateClick}
            events={events}
            // 이벤트 텍스트 표시 안 함 (동그라미만)
            eventDisplay="none"
            // 날짜 셀마다 has-event 클래스 부여
            dayCellClassNames={handleDayCellClassNames}
            dayCellContent={dayCellContent}
            fixedWeekCount={false}
          />
        </div>
        <div className={styles.switch}>
          <div
            className={activeTab === '지역' ? styles.active : styles.non_active}
            onClick={handleTabClick}
          >
            지역
          </div>
          <div
            className={activeTab === '테마' ? styles.active : styles.non_active}
            onClick={handleTabClick}
          >
            테마
          </div>
        </div>
        {activeTab === '지역' && (
          <div className={styles.locate}>
            <table>
              <tr>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '서울' ? styles.selected : ''}
                >
                  서울
                </td>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '인천' ? styles.selected : ''}
                >
                  인천
                </td>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '대전' ? styles.selected : ''}
                >
                  대전
                </td>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '대구' ? styles.selected : ''}
                >
                  대구
                </td>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '광주' ? styles.selected : ''}
                >
                  광주
                </td>
              </tr>
              <tr>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '부산' ? styles.selected : ''}
                >
                  부산
                </td>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '울산' ? styles.selected : ''}
                >
                  울산
                </td>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '경기' ? styles.selected : ''}
                >
                  경기
                </td>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '강원' ? styles.selected : ''}
                >
                  강원
                </td>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '충북' ? styles.selected : ''}
                >
                  충북
                </td>
              </tr>
              <tr>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '충남' ? styles.selected : ''}
                >
                  충남
                </td>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '세종' ? styles.selected : ''}
                >
                  세종
                </td>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '경북' ? styles.selected : ''}
                >
                  경북
                </td>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '경남' ? styles.selected : ''}
                >
                  경남
                </td>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '전북' ? styles.selected : ''}
                >
                  전북
                </td>
              </tr>
              <tr>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '전남' ? styles.selected : ''}
                >
                  전남
                </td>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '제주' ? styles.selected : ''}
                >
                  제주
                </td>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '가평' ? styles.selected : ''}
                >
                  가평
                </td>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '양평' ? styles.selected : ''}
                >
                  양평
                </td>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '강릉' ? styles.selected : ''}
                >
                  강릉
                </td>
              </tr>
              <tr>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '경주' ? styles.selected : ''}
                >
                  경주
                </td>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '전주' ? styles.selected : ''}
                >
                  전주
                </td>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '여수' ? styles.selected : ''}
                >
                  여수
                </td>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '춘천' ? styles.selected : ''}
                >
                  춘천
                </td>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '홍천' ? styles.selected : ''}
                >
                  홍천
                </td>
              </tr>
              <tr>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '태안' ? styles.selected : ''}
                >
                  태안
                </td>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '통영' ? styles.selected : ''}
                >
                  통영
                </td>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '거제' ? styles.selected : ''}
                >
                  거제
                </td>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '포항' ? styles.selected : ''}
                >
                  포항
                </td>
                <td
                  onClick={handleLocationClick}
                  className={selectedLocation === '안동' ? styles.selected : ''}
                >
                  안동
                </td>
              </tr>
            </table>
          </div>
        )}
        {activeTab === '테마' && (
          <div className={styles.theme}>
            <div
              onClick={handleThemeClick}
              className={
                selectedTheme === '체험/액티비티' ? styles.selected : ''
              }
            >
              체험/액티비티
            </div>
            <div
              onClick={handleThemeClick}
              className={
                selectedTheme === '자연 속에서 힐링' ? styles.selected : ''
              }
            >
              자연 속에서 힐링
            </div>
            <div
              onClick={handleThemeClick}
              className={
                selectedTheme === '열정적인 쇼핑 투어' ? styles.selected : ''
              }
            >
              열정적인 쇼핑 투어
            </div>
            <div
              onClick={handleThemeClick}
              className={
                selectedTheme === '미식 여행, 먹방 중심' ? styles.selected : ''
              }
            >
              미식 여행, 먹방 중심
            </div>
            <div
              onClick={handleThemeClick}
              className={
                selectedTheme === '문화, 예술 & 역사 탐방'
                  ? styles.selected
                  : ''
              }
            >
              문화, 예술 & 역사 탐방
            </div>
          </div>
        )}
        <div className={styles.ai_schedule}>AI 맞춤 일정 구성하기</div>
      </div>
    </div>
  );
};

export default WeekCalendar;
