import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeals } from '../hooks/useMeals';
import { filterMealsByDate } from '../utils/helpers';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import DateFilter from '../components/history/DateFilter';
import MealCard from '../components/history/MealCard';
import MealHistoryTable from '../components/history/MealHistoryTable';
import MealDetailModal from '../components/history/MealDetailModal';
import { CameraIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function History() {
  const navigate = useNavigate();
  const { meals, loading, deleteMeal, updateMeal } = useMeals();
  const [dateFilter, setDateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeal, setSelectedMeal] = useState(null);

  const filteredMeals = useMemo(() => {
    let result = filterMealsByDate(meals, dateFilter);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((meal) =>
        meal.foodName.toLowerCase().includes(query)
      );
    }

    return result;
  }, [meals, dateFilter, searchQuery]);

  const stats = useMemo(() => {
    if (filteredMeals.length === 0) return null;

    const totalCalories = filteredMeals.reduce(
      (sum, meal) => sum + meal.nutrition.calories,
      0
    );
    const avgCalories = Math.round(totalCalories / filteredMeals.length);

    const foodCounts = filteredMeals.reduce((acc, meal) => {
      acc[meal.foodName] = (acc[meal.foodName] || 0) + 1;
      return acc;
    }, {});

    const mostFrequent = Object.entries(foodCounts).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0];

    return {
      totalMeals: filteredMeals.length,
      avgCalories,
      mostFrequent,
    };
  }, [filteredMeals]);

  const handleView = (meal) => {
    setSelectedMeal(meal);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu yemeği silmek istediğinizden emin misiniz?')) {
      await deleteMeal(id);
    }
  };

  const handleUpdate = async (id, data) => {
    await updateMeal(id, data);
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <Loading size="lg" text="Yükleniyor..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Yemek Geçmişi</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <DateFilter value={dateFilter} onChange={setDateFilter} />

          <div className="relative flex-1 max-w-xs">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Yemek ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card padding="sm">
            <p className="text-sm text-gray-500">Toplam Öğün</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalMeals}</p>
          </Card>
          <Card padding="sm">
            <p className="text-sm text-gray-500">Ort. Kalori</p>
            <p className="text-2xl font-bold text-gray-900">{stats.avgCalories}</p>
          </Card>
          <Card padding="sm">
            <p className="text-sm text-gray-500">En Sık</p>
            <p className="text-2xl font-bold text-gray-900 truncate">
              {stats.mostFrequent || '-'}
            </p>
          </Card>
        </div>
      )}

      {/* Meals List */}
      {filteredMeals.length === 0 ? (
        <Card>
          <EmptyState
            icon={CameraIcon}
            title="Henüz yemek kaydı yok"
            description={
              searchQuery
                ? 'Arama kriterlerinize uygun yemek bulunamadı.'
                : 'İlk yemeğinizi analiz ederek başlayın!'
            }
            actionLabel={searchQuery ? undefined : 'Yemek Analiz Et'}
            onAction={searchQuery ? undefined : () => navigate('/analysis')}
          />
        </Card>
      ) : (
        <>
          {/* Desktop Table */}
          <MealHistoryTable
            meals={filteredMeals}
            onView={handleView}
            onDelete={handleDelete}
          />

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredMeals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onView={handleView}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}

      {/* Meal Detail Modal */}
      <MealDetailModal
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
        meal={selectedMeal}
        onUpdate={handleUpdate}
        onDelete={deleteMeal}
      />
    </div>
  );
}
