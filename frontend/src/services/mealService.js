import api from './api';
import { mockMeals, mockDailySummary, mockWeeklyData } from '../utils/mockData';

const USE_MOCK = true;

let localMeals = [...mockMeals];

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
    const { data } = await api.get('/meals', { params });
    return data;
  },

  async getMealById(id) {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const meal = localMeals.find(m => m.id === id);
      if (!meal) throw new Error('Yemek bulunamadı');
      return meal;
    }
    const { data } = await api.get(`/meals/${id}`);
    return data;
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
    const { data } = await api.post('/meals', mealData);
    return data;
  },

  async updateMeal(id, mealData) {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const index = localMeals.findIndex(m => m.id === id);
      if (index === -1) throw new Error('Yemek bulunamadı');
      localMeals[index] = { ...localMeals[index], ...mealData };
      return localMeals[index];
    }
    const { data } = await api.put(`/meals/${id}`, mealData);
    return data;
  },

  async deleteMeal(id) {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const index = localMeals.findIndex(m => m.id === id);
      if (index === -1) throw new Error('Yemek bulunamadı');
      localMeals.splice(index, 1);
      return { success: true };
    }
    const { data } = await api.delete(`/meals/${id}`);
    return data;
  },

  async getSummary(period = 'daily') {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      if (period === 'weekly') {
        return mockWeeklyData;
      }
      return mockDailySummary;
    }
    const { data } = await api.get('/meals/summary', { params: { period } });
    return data;
  },
};
