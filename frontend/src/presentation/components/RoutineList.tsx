import { Routine } from '@/domain/entities/Routine';

interface RoutineListProps {
  routines: Routine[];
  onToggle: (routine: Routine) => void;
  onDelete: (routineId: string) => void;
}

export function RoutineList({ routines, onToggle, onDelete }: RoutineListProps) {
  if (routines.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        등록된 루틴이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {routines.map((routine) => (
        <div
          key={routine.id}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {routine.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                루틴 시간: {routine.schedule.time} | 알림 시간: {routine.notificationTime}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                요일: {routine.schedule.daysOfWeek
                  .map((d) => ['일', '월', '화', '수', '목', '금', '토'][d])
                  .join(', ')}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                정보 소스: {routine.informationSources.length}개
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onToggle(routine)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  routine.enabled
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                {routine.enabled ? '활성' : '비활성'}
              </button>
              <button
                onClick={() => onDelete(routine.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-medium"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
