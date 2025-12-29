import type { InformationSourceType } from '@/shared/types';
import type { Location } from '@/shared/types';

interface InformationSourceConfigProps {
  type: InformationSourceType;
  config: any;
  onChange: (config: any) => void;
}

export function InformationSourceConfig({
  type,
  config,
  onChange,
}: InformationSourceConfigProps) {
  if (type === 'weather' || type === 'airQuality') {
    const location = (config.location || {}) as Location;
    
    return (
      <div className="space-y-2 mt-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          위치 설정
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            step="0.0001"
            placeholder="위도"
            value={location.latitude || ''}
            onChange={(e) =>
              onChange({
                ...config,
                location: {
                  ...location,
                  latitude: parseFloat(e.target.value) || 0,
                },
              })
            }
            className="px-2 py-1 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            type="number"
            step="0.0001"
            placeholder="경도"
            value={location.longitude || ''}
            onChange={(e) =>
              onChange({
                ...config,
                location: {
                  ...location,
                  longitude: parseFloat(e.target.value) || 0,
                },
              })
            }
            className="px-2 py-1 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <input
          type="text"
          placeholder="주소 (선택사항)"
          value={location.address || ''}
          onChange={(e) =>
            onChange({
              ...config,
              location: {
                ...location,
                address: e.target.value,
              },
            })
          }
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          예: 서울시청 (위도: 37.5665, 경도: 126.9780)
        </p>
      </div>
    );
  }

  if (type === 'bus') {
    return (
      <div className="space-y-2 mt-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          버스 정보
        </label>
        <input
          type="text"
          placeholder="정류장 ID"
          value={config.stationId || ''}
          onChange={(e) => onChange({ ...config, stationId: e.target.value })}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          type="text"
          placeholder="노선 ID"
          value={config.routeId || ''}
          onChange={(e) => onChange({ ...config, routeId: e.target.value })}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          type="text"
          placeholder="정류장 이름 (예: 강남역)"
          value={config.stationName || ''}
          onChange={(e) => onChange({ ...config, stationName: e.target.value })}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          type="text"
          placeholder="노선 이름 (예: 146번)"
          value={config.routeName || ''}
          onChange={(e) => onChange({ ...config, routeName: e.target.value })}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          공공데이터포털에서 정류장 ID와 노선 ID를 확인하세요.
        </p>
      </div>
    );
  }

  if (type === 'subway') {
    return (
      <div className="space-y-2 mt-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          지하철 정보
        </label>
        <input
          type="text"
          placeholder="역 ID"
          value={config.stationId || ''}
          onChange={(e) => onChange({ ...config, stationId: e.target.value })}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          type="text"
          placeholder="호선 ID (예: 2)"
          value={config.lineId || ''}
          onChange={(e) => onChange({ ...config, lineId: e.target.value })}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <select
          value={config.direction || 'up'}
          onChange={(e) =>
            onChange({ ...config, direction: e.target.value as 'up' | 'down' })
          }
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="up">상행</option>
          <option value="down">하행</option>
        </select>
        <input
          type="text"
          placeholder="역 이름 (예: 강남역)"
          value={config.stationName || ''}
          onChange={(e) => onChange({ ...config, stationName: e.target.value })}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          type="text"
          placeholder="호선 이름 (예: 2호선)"
          value={config.lineName || ''}
          onChange={(e) => onChange({ ...config, lineName: e.target.value })}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          공공데이터포털에서 역 ID와 호선 ID를 확인하세요.
        </p>
      </div>
    );
  }

  return null;
}
