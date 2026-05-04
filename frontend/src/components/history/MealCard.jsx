import { formatDateTime } from '../../utils/helpers';
import { CameraIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function MealCard({ meal, onView, onDelete }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
        {meal.imageUrl ? (
          <img
            src={meal.imageUrl}
            alt={meal.foodName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <CameraIcon className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{meal.foodName}</h3>
        <p className="text-sm text-gray-500">{formatDateTime(meal.createdAt)}</p>
        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
          <span>{meal.nutrition.calories} kcal</span>
          <span>P: {meal.nutrition.protein}g</span>
          <span>C: {meal.nutrition.carbs}g</span>
          <span>F: {meal.nutrition.fat}g</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onView(meal)}
          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="View Details"
        >
          <EyeIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(meal.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Delete"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
