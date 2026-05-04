export const HEALTH_CONDITIONS = [
  { id: 'diabetes', label: 'Diabetes', description: 'Requires blood sugar control' },
  { id: 'hypertension', label: 'Hypertension', description: 'Requires blood pressure control' },
  { id: 'kidney', label: 'Kidney Disease', description: 'Requires protein and sodium restriction' },
];

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Prefer not to say' },
];

export const GOAL_TYPES = [
  { value: 'lose', label: 'Lose Weight' },
  { value: 'maintain', label: 'Maintain' },
  { value: 'gain', label: 'Gain Weight' },
];

export const DATE_FILTERS = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'all', label: 'All' },
];

export const PORTION_OPTIONS = [
  { value: 0.5, label: '0.5x' },
  { value: 1, label: '1x' },
  { value: 1.5, label: '1.5x' },
  { value: 2, label: '2x' },
];

export const BMI_CATEGORIES = [
  { max: 18.5, label: 'Underweight', color: 'text-blue-600' },
  { max: 24.9, label: 'Normal', color: 'text-green-600' },
  { max: 29.9, label: 'Overweight', color: 'text-yellow-600' },
  { max: 34.9, label: 'Obese (Class 1)', color: 'text-orange-600' },
  { max: 39.9, label: 'Obese (Class 2)', color: 'text-red-600' },
  { max: Infinity, label: 'Obese (Class 3)', color: 'text-red-800' },
];

export const NUTRITION_THRESHOLDS = {
  diabetes: {
    carbs: 45,
    sugar: 25,
  },
  hypertension: {
    sodium: 500,
  },
  kidney: {
    protein: 15,
    potassium: 400,
  },
};
