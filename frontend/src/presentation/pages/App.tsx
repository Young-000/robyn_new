import { useState } from 'react';
import { Routine } from '@/domain/entities/Routine';
import { RoutineForm } from '../components/RoutineForm';
import { RoutineList } from '../components/RoutineList';
import { useRoutineScheduler } from '../hooks/useRoutineScheduler';
import { useNotification } from '../hooks/useNotification';

function App() {
  const [showForm, setShowForm] = useState(false);
  const {
    routines,
    addRoutine,
    removeRoutine,
    updateRoutine,
    isSupported,
    permission,
    requestPermission,
  } = useRoutineScheduler();

  const { sendNotification } = useNotification();

  const handleAddRoutine = (routine: Routine) => {
    addRoutine(routine);
    setShowForm(false);
  };

  const handleToggleRoutine = (routine: Routine) => {
    if (routine.enabled) {
      routine.disable();
    } else {
      routine.enable();
    }
    updateRoutine(routine);
  };

  const handleDeleteRoutine = (routineId: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      removeRoutine(routineId);
    }
  };

  const handleTestNotification = async () => {
    try {
      await sendNotification(
        '테스트 알림',
        '브라우저 알림이 정상적으로 작동합니다!'
      );
    } catch (error) {
      alert('알림 권한이 필요합니다. 권한을 요청해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            루틴 정보 알림 시스템
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            출퇴근 시간에 필요한 정보를 자동으로 알림해드립니다.
          </p>
        </div>

        {/* 알림 권한 설정 */}
        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                알림 권한
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isSupported
                  ? permission === 'granted'
                    ? '✅ 알림 권한이 허용되었습니다.'
                    : permission === 'denied'
                    ? '❌ 알림 권한이 거부되었습니다. 브라우저 설정에서 변경해주세요.'
                    : '⚠️ 알림 권한이 필요합니다.'
                  : '❌ 이 브라우저는 알림을 지원하지 않습니다.'}
              </p>
            </div>
            {isSupported && permission !== 'granted' && (
              <button
                onClick={requestPermission}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                권한 요청
              </button>
            )}
            {permission === 'granted' && (
              <button
                onClick={handleTestNotification}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                테스트 알림
              </button>
            )}
          </div>
        </div>

        {/* 루틴 목록 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              내 루틴 ({routines.length})
            </h2>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                + 루틴 추가
              </button>
            )}
          </div>
          {showForm ? (
            <RoutineForm
              onSubmit={handleAddRoutine}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <RoutineList
              routines={routines}
              onToggle={handleToggleRoutine}
              onDelete={handleDeleteRoutine}
            />
          )}
        </div>

        {/* 사용 안내 */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            사용 안내
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• 루틴을 추가하고 알림 시간을 설정하세요.</li>
            <li>• 설정한 시간에 브라우저가 열려있으면 알림이 표시됩니다.</li>
            <li>• 브라우저를 닫으면 알림이 작동하지 않습니다. (POC 단계)</li>
            <li>• 다음 단계에서 휴대폰 푸시 알림을 지원할 예정입니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
