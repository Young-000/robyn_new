import { useNotification } from '../hooks/useNotification';

export function TestNotificationButton() {
  const { sendNotification, permission, isSupported } = useNotification();

  const handleTest = async () => {
    try {
      await sendNotification(
        '테스트 알림',
        '브라우저 알림이 정상적으로 작동합니다! 🎉'
      );
    } catch (error) {
      alert(`알림 전송 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  if (!isSupported) {
    return (
      <div className="text-sm text-red-500">
        이 브라우저는 알림을 지원하지 않습니다.
      </div>
    );
  }

  if (permission !== 'granted') {
    return null;
  }

  return (
    <button
      onClick={handleTest}
      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
    >
      🔔 테스트 알림 보내기
    </button>
  );
}
