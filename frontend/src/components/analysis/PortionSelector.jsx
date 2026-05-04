import { clsx } from 'clsx';
import { PORTION_OPTIONS } from '../../utils/constants';

export default function PortionSelector({ value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Portion
      </label>
      <div className="flex rounded-xl overflow-hidden border border-gray-300">
        {PORTION_OPTIONS.map((option, index) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={clsx(
              'flex-1 py-2.5 px-4 text-sm font-medium transition-colors',
              value === option.value
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50',
              index !== PORTION_OPTIONS.length - 1 && 'border-r border-gray-300'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
