import { format, formatDistanceToNow, parseISO, isToday, isThisWeek, isThisMonth, isValid } from 'date-fns';
import { tr } from 'date-fns/locale';
import { BMI_CATEGORIES } from './constants';

export function formatDate(date, formatStr = 'dd MMMM yyyy') {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  return format(dateObj, formatStr, { locale: tr });
}

export function formatDateTime(date) {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  return format(dateObj, 'dd MMMM HH:mm', { locale: tr });
}

export function timeAgo(date) {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: tr });
}

export function calculateBMI(weight, height) {
  if (!weight || !height) return null;
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
}

export function getBMICategory(bmi) {
  if (!bmi) return null;
  const bmiValue = parseFloat(bmi);
  return BMI_CATEGORIES.find(cat => bmiValue <= cat.max);
}

export function calculateCalorieProgress(consumed, target) {
  if (!target) return 0;
  return Math.min(100, Math.round((consumed / target) * 100));
}

export function getCalorieStatus(consumed, target) {
  if (!target || target <= 0) {
    return { color: 'text-gray-600', bgColor: 'bg-gray-500' };
  }
  const percentage = (consumed / target) * 100;
  if (percentage <= 80) return { color: 'text-green-600', bgColor: 'bg-green-500' };
  if (percentage <= 100) return { color: 'text-yellow-600', bgColor: 'bg-yellow-500' };
  return { color: 'text-red-600', bgColor: 'bg-red-500' };
}

export function filterMealsByDate(meals, filter) {
  return meals.filter(meal => {
    const mealDate = typeof meal.createdAt === 'string' ? parseISO(meal.createdAt) : meal.createdAt;
    switch (filter) {
      case 'today':
        return isToday(mealDate);
      case 'week':
        return isThisWeek(mealDate, { weekStartsOn: 1 });
      case 'month':
        return isThisMonth(mealDate);
      default:
        return true;
    }
  });
}

export function calculateNutritionWithPortion(nutrition, portion) {
  return Object.fromEntries(
    Object.entries(nutrition).map(([key, value]) => [key, Math.round(value * portion)])
  );
}

export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
