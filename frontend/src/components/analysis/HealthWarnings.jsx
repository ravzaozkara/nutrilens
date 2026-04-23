import {
  ExclamationTriangleIcon,
  HeartIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';

const warningIcons = {
  diabetes: BeakerIcon,
  hypertension: HeartIcon,
  kidney: ExclamationTriangleIcon,
};

export default function HealthWarnings({ warnings = [] }) {
  if (warnings.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Sağlık Uyarıları</h3>

      {warnings.map((warning, index) => {
        const Icon = warningIcons[warning.type] || ExclamationTriangleIcon;

        return (
          <div
            key={index}
            className={`rounded-xl border-l-4 p-4 ${warning.color}`}
          >
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
