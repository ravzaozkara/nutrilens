import {
  ExclamationTriangleIcon,
  HeartIcon,
  BeakerIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

const CONDITION_ICONS = {
  diabetes: BeakerIcon,
  hypertension: HeartIcon,
  kidney: ExclamationTriangleIcon,
  backend: InformationCircleIcon,
};

const SEVERITY_COLORS = {
  high: 'border-red-500 bg-red-50',
  medium: 'border-orange-500 bg-orange-50',
  low: 'border-yellow-500 bg-yellow-50',
};

export default function HealthWarnings({ warnings = [] }) {
  if (warnings.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Health Warnings</h3>

      {warnings.map((warning, index) => {
        const Icon = CONDITION_ICONS[warning.condition] || ExclamationTriangleIcon;
        // Backend warnings use a distinct blue info style
        const colorClass = warning.condition === 'backend'
          ? 'border-blue-500 bg-blue-50'
          : (SEVERITY_COLORS[warning.severity] || SEVERITY_COLORS.medium);

        return (
          <div key={index} className={`rounded-xl border-l-4 p-4 ${colorClass}`}>
            <div className="flex items-start gap-3">
              <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{warning.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
