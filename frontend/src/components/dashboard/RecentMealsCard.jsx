import { Link } from 'react-router-dom';
import Card from '../common/Card';
import EmptyState from '../common/EmptyState';
import { timeAgo } from '../../utils/helpers';
import { CameraIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function RecentMealsCard({ meals = [] }) {
  if (meals.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Yemekler</h3>
        <EmptyState
          icon={CameraIcon}
          title="Henüz yemek kaydı yok"
          description="İlk yemeğinizi analiz ederek başlayın!"
          actionLabel="Yemek Analiz Et"
          onAction={() => window.location.href = '/analysis'}
        />
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Son Yemekler</h3>
        <Link
          to="/history"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
        >
          Tümünü Gör
          <ChevronRightIcon className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {meals.slice(0, 5).map((meal) => (
          <div
            key={meal.id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {/* Thumbnail */}
            <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
              {meal.imageUrl ? (
                <img
                  src={meal.imageUrl}
                  alt={meal.foodName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <CameraIcon className="w-6 h-6" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{meal.foodName}</p>
              <p className="text-sm text-gray-500">{timeAgo(meal.createdAt)}</p>
            </div>

            {/* Calories */}
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {meal.nutrition.calories} kcal
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
