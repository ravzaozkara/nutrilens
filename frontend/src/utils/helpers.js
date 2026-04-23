import { format, formatDistanceToNow, parseISO, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { tr } from 'date-fns/locale';
import { BMI_CATEGORIES, NUTRITION_THRESHOLDS } from './constants';

export function formatDate(date, formatStr = 'dd MMMM yyyy') {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: tr });
}

export function formatDateTime(date) {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd MMMM HH:mm', { locale: tr });
}

export function timeAgo(date) {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
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

export function getHealthWarnings(nutrition, healthConditions) {
  const warnings = [];

  // Early return if inputs are invalid
  if (!nutrition || !healthConditions || !Array.isArray(healthConditions)) {
    return warnings;
  }

  if (healthConditions.includes('diabetes')) {
    const carbs = nutrition.carbs ?? 0;
    if (carbs > NUTRITION_THRESHOLDS.diabetes.carbs) {
      warnings.push({
        type: 'diabetes',
        severity: 'high',
        message: `Diyabet Uyarısı: Yüksek karbonhidrat içeriği (${carbs}g). Kan şekerinizi takip edin.`,
        color: 'border-red-500 bg-red-50',
      });
    }
  }

  if (healthConditions.includes('hypertension')) {
    const sodium = nutrition.sodium ?? 0;
    if (sodium > NUTRITION_THRESHOLDS.hypertension.sodium) {
      warnings.push({
        type: 'hypertension',
        severity: 'medium',
        message: `Tansiyon Uyarısı: Yüksek sodyum içeriği (${sodium}mg). Tuz alımınıza dikkat edin.`,
        color: 'border-orange-500 bg-orange-50',
      });
    }
  }

  if (healthConditions.includes('kidney')) {
    const protein = nutrition.protein ?? 0;
    if (protein > NUTRITION_THRESHOLDS.kidney.protein) {
      warnings.push({
        type: 'kidney',
        severity: 'medium',
        message: `Böbrek Uyarısı: Orta düzey protein (${protein}g). Diyetisyeninize danışın.`,
        color: 'border-yellow-500 bg-yellow-50',
      });
    }
  }

  return warnings;
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
