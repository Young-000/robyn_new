import { useState } from 'react';
import { Routine } from '@/domain/entities/Routine';
import { Schedule } from '@/domain/value-objects/Schedule';
import { InformationSource } from '@/domain/entities/InformationSource';
import { InformationSourceConfig } from './InformationSourceConfig';
import type { DayOfWeek, InformationSourceType } from '@/shared/types';

interface RoutineFormProps {
  onSubmit: (routine: Routine) => void;
  onCancel?: () => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: '일' },
  { value: 1, label: '월' },
  { value: 2, label: '화' },
  { value: 3, label: '수' },
  { value: 4, label: '목' },
  { value: 5, label: '금' },
  { value: 6, label: '토' },
] as const;

const INFORMATION_TYPES: { value: InformationSourceType; label: string }[] = [
  { value: 'weather', label: '날씨' },
  { value: 'airQuality', label: '미세먼지' },
  { value: 'bus', label: '버스' },
  { value: 'subway', label: '지하철' },
];

export function RoutineForm({ onSubmit, onCancel }: RoutineFormProps) {
  const [name, setName] = useState('');
  const [scheduleTime, setScheduleTime] = useState('08:00');
  const [notificationTime, setNotificationTime] = useState('07:50');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([1, 2, 3, 4, 5]);
  const [informationSources, setInformationSources] = useState<
    Array<{ type: InformationSourceType; config: any; order: number }>
  >([{ type: 'weather', config: {}, order: 0 }]);

  const handleDayToggle = (day: DayOfWeek) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day].sort()
    );
  };

  const handleAddInformationSource = () => {
    setInformationSources((prev) => [
      ...prev,
      { type: 'weather', config: {}, order: prev.length },
    ]);
  };

  const handleRemoveInformationSource = (index: number) => {
    setInformationSources((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInformationTypeChange = (
    index: number,
    type: InformationSourceType
  ) => {
    setInformationSources((prev) =>
      prev.map((source, i) => {
        if (i === index) {
          // 타입에 따라 기본 설정 제공
          let defaultConfig: any = {};
          
          if (type === 'weather' || type === 'airQuality') {
            // 현재 위치 또는 기본 위치 (서울시청)
            defaultConfig = {
              location: {
                latitude: 37.5665,
                longitude: 126.9780,
                address: '서울특별시 중구 세종대로 110',
              },
            };
          } else if (type === 'bus') {
            defaultConfig = {
              stationId: '',
              routeId: '',
              stationName: '강남역',
              routeName: '146번',
            };
          } else if (type === 'subway') {
            defaultConfig = {
              stationId: '',
              lineId: '2',
              direction: 'up' as const,
              stationName: '강남역',
              lineName: '2호선',
            };
          }
          
          return { ...source, type, config: defaultConfig };
        }
        return source;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || selectedDays.length === 0) {
      alert('이름과 요일을 입력해주세요.');
      return;
    }

    try {
      const schedule = Schedule.create(scheduleTime, selectedDays);
      const routine = Routine.create({
        userId: 'local-user', // 로컬 스토리지 사용 시
        name,
        schedule,
        notificationTime,
      });

      informationSources.forEach((source) => {
        routine.addInformationSource(
          InformationSource.create({
            type: source.type,
            config: source.config,
            order: source.order,
          })
        );
      });

      onSubmit(routine);
    } catch (error) {
      alert(`오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        새 루틴 추가
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          루틴 이름
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 출근 루틴"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          루틴 시간
        </label>
        <input
          type="time"
          value={scheduleTime}
          onChange={(e) => setScheduleTime(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          알림 시간
        </label>
        <input
          type="time"
          value={notificationTime}
          onChange={(e) => setNotificationTime(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          요일 선택
        </label>
        <div className="flex gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <button
              key={day.value}
              type="button"
              onClick={() => handleDayToggle(day.value)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                selectedDays.includes(day.value)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          정보 소스
        </label>
        {informationSources.map((source, index) => (
          <div key={index} className="mb-4 p-3 border border-gray-200 dark:border-gray-700 rounded-md">
            <div className="flex gap-2 mb-2">
              <select
                value={source.type}
                onChange={(e) =>
                  handleInformationTypeChange(
                    index,
                    e.target.value as InformationSourceType
                  )
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {INFORMATION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {informationSources.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveInformationSource(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  삭제
                </button>
              )}
            </div>
            <InformationSourceConfig
              type={source.type}
              config={source.config}
              onChange={(newConfig) => {
                const updated = [...informationSources];
                updated[index] = { ...updated[index], config: newConfig };
                setInformationSources(updated);
              }}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddInformationSource}
          className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          + 정보 추가
        </button>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          추가
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
}
