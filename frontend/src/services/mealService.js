import api from './api';
import { mockMeals, mockDailySummary, mockWeeklyData } from '../utils/mockData';

const USE_MOCK = false;

let localMeals = [...mockMeals];

// Backend weekday index → short Turkish abbreviation (Sunday = 0)
const TURKISH_DAYS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

function normalizeMeal(m) {
  return {
    id: m.id,
    foodName: m.food_label ?? '',
    imageUrl: m.image_path || null,
    nutrition: {
      calories: m.calories ?? 0,
      protein: m.protein ?? 0,
      carbs: m.carbs ?? 0,
      fat: m.fat ?? 0,
    },
    portion: 1,
    createdAt: m.created_at ?? null,
    healthWarnings: m.health_warnings || '',
  };
}

function normalizeDailySummary(data) {
  return {
    calories: { consumed: data.total_calories ?? 0, target: null },
    protein: { consumed: data.total_protein ?? 0, target: null },
    carbs: { consumed: data.total_carbs ?? 0, target: null },
    fat: { consumed: data.total_fat ?? 0, target: null },
    mealCount: data.meal_count ?? 0,
  };
}

function normalizeWeeklySummary(data) {
  return data.map(item => ({
    day: TURKISH_DAYS[new Date(item.date).getDay()],
    calories: item.total_calories ?? 0,
  }));
}

// Frontend camelCase/nested → backend snake_case/flat (only fields backend accepts)
function serializeMeal(mealData) {
  return {
    food_label: mealData.foodName || '',
    calories: mealData.nutrition?.calories ?? 0,
    protein: mealData.nutrition?.protein ?? 0,
    carbs: mealData.nutrition?.carbs ?? 0,
    fat: mealData.nutrition?.fat ?? 0,
    health_warnings: mealData.healthWarnings || '',
    // imageUrl is a client-side blob URL; not sent to backend
  };
}

export const mealService = {
  async getMeals(params = {}) {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 400));
      let filteredMeals = [...localMeals];

      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredMeals = filteredMeals.filter(meal =>
          meal.foodName.toLowerCase().includes(searchLower)
        );
      }

      filteredMeals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return {
        meals: filteredMeals,
        total: filteredMeals.length,
        page: params.page || 1,
        limit: params.limit || 10,
      };
    }
    const apiParams = {
      skip: ((params.page || 1) - 1) * (params.limit || 50),
      limit: params.limit || 50,
    };
    const { data } = await api.get('/meals', { params: apiParams });
    const meals = data.map(normalizeMeal);
    return {
      meals,
      total: meals.length,
      page: params.page || 1,
      limit: params.limit || 50,
    };
  },

  async getMealById(id) {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const meal = localMeals.find(m => m.id === id);
      if (!meal) throw new Error('Yemek bulunamadı');
      return meal;
    }
    // No GET /meals/{id} endpoint exists; this method is currently unused by any component
    throw new Error('getMealById desteklenmiyor');
  },

  async createMeal(mealData) {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newMeal = {
        id: Date.now().toString(),
        ...mealData,
        createdAt: new Date().toISOString(),
      };
      localMeals.unshift(newMeal);
      return newMeal;
    }
    const { data } = await api.post('/meals', serializeMeal(mealData));
    return normalizeMeal(data);
  },

  async updateMeal(id, mealData) {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const index = localMeals.findIndex(m => m.id === id);
      if (index === -1) throw new Error('Yemek bulunamadı');
      localMeals[index] = { ...localMeals[index], ...mealData };
      return localMeals[index];
    }
    // No PUT /meals/{id} endpoint; caller (useMeals) merges the delta into local state
    return mealData;
  },

  async deleteMeal(id) {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const index = localMeals.findIndex(m => m.id === id);
      if (index === -1) throw new Error('Yemek bulunamadı');
      localMeals.splice(index, 1);
      return { success: true };
    }
    await api.delete(`/meals/${id}`);
    return { success: true };
  },

  async getSummary(period = 'daily') {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      if (period === 'weekly') {
        return mockWeeklyData;
      }
      return mockDailySummary;
    }
    if (period === 'weekly') {
      const { data } = await api.get('/meals/weekly-summary');
      return normalizeWeeklySummary(data);
    }
    const { data } = await api.get('/meals/summary');
    return normalizeDailySummary(data);
  },
};
