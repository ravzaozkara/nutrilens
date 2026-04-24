import api from './api';
import { getRandomFood } from '../utils/mockData';

const USE_MOCK = false;

function normalizeAnalysis(data, imageUrl) {
  return {
    foodName: data.food_name,
    confidence: data.confidence ?? 0,
    imageUrl,
    nutrition: {
      calories: data.calories ?? 0,
      protein: data.protein ?? 0,
      carbs: data.carbs ?? 0,
      fat: data.fat ?? 0,
      fiber: null,
      sodium: null,
    },
    warnings: data.health_warning ? [data.health_warning] : [],
  };
}

export const analysisService = {
  async analyzePhoto(imageFile) {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = getRandomFood();
      return {
        ...result,
        imageUrl: URL.createObjectURL(imageFile),
      };
    }

    const imageUrl = URL.createObjectURL(imageFile);
    const formData = new FormData();
    formData.append('file', imageFile);

    const { data } = await api.post('/analyze-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return normalizeAnalysis(data, imageUrl);
  },
};
