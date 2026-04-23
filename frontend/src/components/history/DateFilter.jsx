import { clsx } from 'clsx';
import { DATE_FILTERS } from '../../utils/constants';

export default function DateFilter({ value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {DATE_FILTERS.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={clsx(
            'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
            value === filter.value
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
