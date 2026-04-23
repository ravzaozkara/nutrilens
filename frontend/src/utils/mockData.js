export const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Ravza Özkara',
  birthDate: '1998-05-15',
  gender: 'female',
  height: 165,
  weight: 60,
  healthConditions: [],
  goals: {
    dailyCalories: 1800,
    protein: 90,
    carbs: 200,
    fat: 60,
  },
  createdAt: '2024-01-15',
};

export const mockMeals = [
  {
    id: '1',
    foodName: 'Mercimek Çorbası',
    imageUrl: 'https://via.placeholder.com/100x100?text=Mercimek',
    nutrition: {
      calories: 180,
      protein: 12,
      carbs: 28,
      fat: 4,
      fiber: 8,
      sodium: 450,
    },
    portion: 1,
    createdAt: '2024-01-20T12:30:00Z',
  },
  {
    id: '2',
    foodName: 'Karnıyarık',
    imageUrl: 'https://via.placeholder.com/100x100?text=Karniyarik',
    nutrition: {
      calories: 320,
      protein: 18,
      carbs: 22,
      fat: 20,
      fiber: 6,
      sodium: 380,
    },
    portion: 1,
    createdAt: '2024-01-20T19:00:00Z',
  },
  {
    id: '3',
    foodName: 'Lahmacun',
    imageUrl: 'https://via.placeholder.com/100x100?text=Lahmacun',
    nutrition: {
      calories: 270,
      protein: 12,
      carbs: 35,
      fat: 10,
      fiber: 3,
      sodium: 520,
    },
    portion: 1,
    createdAt: '2024-01-19T13:00:00Z',
  },
  {
    id: '4',
    foodName: 'Menemen',
    imageUrl: 'https://via.placeholder.com/100x100?text=Menemen',
    nutrition: {
      calories: 220,
      protein: 14,
      carbs: 12,
      fat: 14,
      fiber: 4,
      sodium: 320,
    },
    portion: 1,
    createdAt: '2024-01-19T08:30:00Z',
  },
  {
    id: '5',
    foodName: 'Baklava',
    imageUrl: 'https://via.placeholder.com/100x100?text=Baklava',
    nutrition: {
      calories: 340,
      protein: 6,
      carbs: 42,
      fat: 18,
      fiber: 2,
      sodium: 180,
    },
    portion: 1,
    createdAt: '2024-01-18T16:00:00Z',
  },
];

export const mockAnalysisResult = {
  foodName: 'Lahmacun',
  confidence: 0.94,
  nutrition: {
    calories: 270,
    protein: 12,
    carbs: 35,
    fat: 10,
    fiber: 3,
    sodium: 520,
  },
  warnings: [],
};

export const mockDailySummary = {
  calories: { consumed: 1250, target: 1800 },
  protein: { consumed: 45, target: 90 },
  carbs: { consumed: 120, target: 200 },
  fat: { consumed: 35, target: 60 },
  mealCount: 3,
};

export const mockWeeklyData = [
  { day: 'Pzt', calories: 1650, target: 1800 },
  { day: 'Sal', calories: 1820, target: 1800 },
  { day: 'Çar', calories: 1540, target: 1800 },
  { day: 'Per', calories: 1780, target: 1800 },
  { day: 'Cum', calories: 2100, target: 1800 },
  { day: 'Cmt', calories: 1920, target: 1800 },
  { day: 'Paz', calories: 1250, target: 1800 },
];

export const turkishFoods = [
  { name: 'Mercimek Çorbası', calories: 180, protein: 12, carbs: 28, fat: 4, fiber: 8, sodium: 450 },
  { name: 'Karnıyarık', calories: 320, protein: 18, carbs: 22, fat: 20, fiber: 6, sodium: 380 },
  { name: 'Lahmacun', calories: 270, protein: 12, carbs: 35, fat: 10, fiber: 3, sodium: 520 },
  { name: 'Menemen', calories: 220, protein: 14, carbs: 12, fat: 14, fiber: 4, sodium: 320 },
  { name: 'Köfte', calories: 280, protein: 22, carbs: 8, fat: 18, fiber: 1, sodium: 400 },
  { name: 'Mantı', calories: 350, protein: 15, carbs: 40, fat: 14, fiber: 2, sodium: 480 },
  { name: 'İmam Bayıldı', calories: 180, protein: 4, carbs: 18, fat: 12, fiber: 5, sodium: 350 },
  { name: 'Adana Kebap', calories: 320, protein: 28, carbs: 4, fat: 22, fiber: 1, sodium: 450 },
  { name: 'Baklava', calories: 340, protein: 6, carbs: 42, fat: 18, fiber: 2, sodium: 180 },
  { name: 'Sütlaç', calories: 200, protein: 6, carbs: 36, fat: 4, fiber: 0, sodium: 120 },
  { name: 'Döner', calories: 350, protein: 25, carbs: 20, fat: 20, fiber: 2, sodium: 550 },
  { name: 'Pide', calories: 380, protein: 18, carbs: 45, fat: 14, fiber: 3, sodium: 600 },
  { name: 'Künefe', calories: 420, protein: 8, carbs: 50, fat: 22, fiber: 1, sodium: 200 },
  { name: 'İskender', calories: 450, protein: 30, carbs: 35, fat: 22, fiber: 2, sodium: 650 },
  { name: 'Çiğ Köfte', calories: 180, protein: 8, carbs: 30, fat: 4, fiber: 4, sodium: 380 },
];

export function getRandomFood() {
  const randomIndex = Math.floor(Math.random() * turkishFoods.length);
  const food = turkishFoods[randomIndex];
  return {
    foodName: food.name,
    confidence: 0.85 + Math.random() * 0.14,
    nutrition: {
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      fiber: food.fiber,
      sodium: food.sodium,
    },
  };
}
