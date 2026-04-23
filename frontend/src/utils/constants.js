export const HEALTH_CONDITIONS = [
  { id: 'diabetes', label: 'Diyabet', description: 'Kan şekeri kontrolü gerektirir' },
  { id: 'hypertension', label: 'Hipertansiyon', description: 'Tansiyon kontrolü gerektirir' },
  { id: 'kidney', label: 'Böbrek Hastalığı', description: 'Protein ve sodyum kısıtlaması gerektirir' },
];

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Erkek' },
  { value: 'female', label: 'Kadın' },
  { value: 'other', label: 'Belirtmek istemiyorum' },
];

export const GOAL_TYPES = [
  { value: 'lose', label: 'Kilo Ver' },
  { value: 'maintain', label: 'Koru' },
  { value: 'gain', label: 'Kilo Al' },
];

export const DATE_FILTERS = [
  { value: 'today', label: 'Bugün' },
  { value: 'week', label: 'Bu Hafta' },
  { value: 'month', label: 'Bu Ay' },
  { value: 'all', label: 'Tümü' },
];

export const PORTION_OPTIONS = [
  { value: 0.5, label: '0.5x' },
  { value: 1, label: '1x' },
  { value: 1.5, label: '1.5x' },
  { value: 2, label: '2x' },
];

export const BMI_CATEGORIES = [
  { max: 18.5, label: 'Zayıf', color: 'text-blue-600' },
  { max: 24.9, label: 'Normal', color: 'text-green-600' },
  { max: 29.9, label: 'Fazla Kilolu', color: 'text-yellow-600' },
  { max: 34.9, label: 'Obez (1. derece)', color: 'text-orange-600' },
  { max: 39.9, label: 'Obez (2. derece)', color: 'text-red-600' },
  { max: Infinity, label: 'Obez (3. derece)', color: 'text-red-800' },
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
