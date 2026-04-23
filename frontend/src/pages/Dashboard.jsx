import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDailySummary, useWeeklySummary, useMeals } from '../hooks/useMeals';
import { formatDate } from '../utils/helpers';
import CalorieSummaryCard from '../components/dashboard/CalorieSummaryCard';
import MacronutrientCard from '../components/dashboard/MacronutrientCard';
import RecentMealsCard from '../components/dashboard/RecentMealsCard';
import WeeklyChart from '../components/dashboard/WeeklyChart';
import Loading from '../components/common/Loading';
import { CameraIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { user } = useAuth();
  const { summary, loading: summaryLoading } = useDailySummary();
  const { data: weeklyData, loading: weeklyLoading } = useWeeklySummary();
  const { meals, loading: mealsLoading } = useMeals({ limit: 5 });

  const loading = summaryLoading || weeklyLoading || mealsLoading;

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <Loading size="lg" text="Yükleniyor..." />
      </div>
    );
  }

  const today = new Date();

  return (
    <div className="page-container">
      {/* Greeting */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Merhaba, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-gray-600">{formatDate(today, 'dd MMMM yyyy, EEEE')}</p>
          </div>
          <Link
            to="/analysis"
            className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-medium px-6 py-3 rounded-xl transition-colors"
          >
            <CameraIcon className="w-5 h-5" />
            Yemek Analiz Et
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Calorie Summary - Takes up more space on larger screens */}
        <div className="lg:row-span-2">
          <CalorieSummaryCard
            consumed={summary?.calories?.consumed || 0}
            target={summary?.calories?.target || user?.goals?.dailyCalories || 1800}
          />
        </div>

        {/* Macronutrient Card */}
        <MacronutrientCard
          macros={{
            protein: {
              consumed: summary?.protein?.consumed || 0,
              target: summary?.protein?.target || user?.goals?.protein || 90,
            },
            carbs: {
              consumed: summary?.carbs?.consumed || 0,
              target: summary?.carbs?.target || user?.goals?.carbs || 200,
            },
            fat: {
              consumed: summary?.fat?.consumed || 0,
              target: summary?.fat?.target || user?.goals?.fat || 60,
            },
          }}
        />

        {/* Recent Meals */}
        <RecentMealsCard meals={meals} />
      </div>

      {/* Weekly Chart */}
      <WeeklyChart
        data={weeklyData}
        target={user?.goals?.dailyCalories || 1800}
      />
    </div>
  );
}
