import api from './api';
import { getRandomFood } from '../utils/mockData';

const USE_MOCK = true;

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

    const formData = new FormData();
    formData.append('image', imageFile);

    const { data } = await api.post('/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};
