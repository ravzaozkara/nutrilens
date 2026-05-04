import { useState, useEffect, useCallback, useRef } from 'react';
import { mealService } from '../services/mealService';
import toast from 'react-hot-toast';

export function useMeals(initialParams = {}) {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  // Use ref to store initialParams to avoid dependency changes on every render
  const initialParamsRef = useRef(initialParams);

  const fetchMeals = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mealService.getMeals({
        ...initialParamsRef.current,
        ...params,
      });
      setMeals(response.meals);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
      });
    } catch (err) {
      setError(err.message);
      toast.error('An error occurred while loading meals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const deleteMeal = async (id) => {
    try {
      await mealService.deleteMeal(id);
      setMeals(prevMeals => prevMeals.filter(meal => meal.id !== id));
      toast.success('Meal deleted successfully');
    } catch (err) {
      toast.error('An error occurred while deleting the meal');
      throw err;
    }
  };

  const updateMeal = async (id, data) => {
    try {
      await mealService.updateMeal(id, data);
      setMeals(prevMeals =>
        prevMeals.map(meal => (meal.id === id ? { ...meal, ...data } : meal))
      );
      toast.success('Meal updated successfully');
    } catch (err) {
      toast.error('An error occurred while updating the meal');
      throw err;
    }
  };

  return {
    meals,
    loading,
    error,
    pagination,
    fetchMeals,
    deleteMeal,
    updateMeal,
  };
}

export function useDailySummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const data = await mealService.getSummary('daily');
        setSummary(data);
      } catch (err) {
        toast.error('Could not load daily summary');
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  return { summary, loading };
}

export function useWeeklySummary() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const weeklyData = await mealService.getSummary('weekly');
        setData(weeklyData);
      } catch (err) {
        toast.error('Could not load weekly summary');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { data, loading };
}
