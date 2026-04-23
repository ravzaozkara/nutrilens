import { formatDateTime } from '../../utils/helpers';
import { CameraIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function MealHistoryTable({ meals, onView, onDelete }) {
  return (
    <div className="hidden md:block overflow-hidden bg-white rounded-xl border border-gray-100">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tarih
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fotoğraf
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Yemek
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kalori
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Protein
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Karb
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Yağ
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {meals.map((meal) => (
            <tr key={meal.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatDateTime(meal.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="w-10 h-10 rounded-lg bg-gray-200 overflow-hidden">
                  {meal.imageUrl ? (
                    <img
                      src={meal.imageUrl}
                      alt={meal.foodName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <CameraIcon className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="font-medium text-gray-900">{meal.foodName}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {meal.nutrition.calories}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {meal.nutrition.protein}g
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {meal.nutrition.carbs}g
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {meal.nutrition.fat}g
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onView(meal)}
                    className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Detayları Gör"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(meal.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Sil"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
