import { useState } from 'react';
import { analysisService } from '../services/analysisService';
import { mealService } from '../services/mealService';
import toast from 'react-hot-toast';

export function useAnalysis() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzePhoto = async (imageFile) => {
    try {
      setLoading(true);
      setError(null);
      const analysisResult = await analysisService.analyzePhoto(imageFile);
      setResult(analysisResult);
      return analysisResult;
    } catch (err) {
      setError(err.message);
      toast.error('An error occurred during analysis');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const saveMeal = async (mealData) => {
    try {
      const savedMeal = await mealService.createMeal(mealData);
      toast.success('Meal saved to your log');
      return savedMeal;
    } catch (err) {
      toast.error('An error occurred while saving the meal');
      throw err;
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return {
    result,
    loading,
    error,
    analyzePhoto,
    saveMeal,
    reset,
  };
}
