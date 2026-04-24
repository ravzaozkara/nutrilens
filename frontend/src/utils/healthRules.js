// Dish-name heuristics used when the backend does not return a sodium value.
// LIMITATION: accuracy depends on substring match; compound dish names may be missed.
// Expand this list as the food database grows.
const HIGH_SODIUM_DISHES = [
  'turşu', 'şalgam', 'salamura', 'pastırma', 'sucuk',
  'kavurma', 'salam', 'sosis', 'füme', 'jambon',
];

// High-sugar dessert heuristics for the diabetes rule.
// Backend does not return sugar content, so dish name is the only signal.
const HIGH_SUGAR_DESSERTS = [
  'baklava', 'sütlaç', 'kazandibi', 'künefe', 'revani',
  'lokma', 'şekerpare', 'tulumba', 'helva', 'kadayıf',
  'muhallebi', 'profiterol', 'tiramisu',
];

const THRESHOLDS = {
  diabetes: { carbs: 60 },
  kidney: { protein: 30 },
};

function matchesAny(foodName, terms) {
  if (!foodName) return false;
  const lower = foodName.toLowerCase();
  return terms.some(term => lower.includes(term));
}

/**
 * Evaluate frontend health rules for a single meal.
 *
 * Pure function — no side effects, safe to test in isolation.
 *
 * @param {{ foodName?: string, nutrition?: { carbs?: number, protein?: number } }} meal
 * @param {string[]} healthConditions - ["diabetes", "hypertension", "kidney"]
 * @returns {{ severity: "high"|"medium"|"low", condition: string, message: string }[]}
 *
 * TODO: Add Vitest once a test runner is configured for the frontend.
 * Example tests to cover:
 *   - carbs > 60 → diabetes high warning
 *   - dessert name + diabetes condition → medium warning
 *   - protein > 30 → kidney medium warning
 *   - turşu + hypertension → medium warning
 *   - empty conditions → []
 *   - null meal → []
 */
export function evaluateHealthRules(meal, healthConditions) {
  if (!meal || !healthConditions || !Array.isArray(healthConditions)) return [];

  const { foodName = '', nutrition = {} } = meal;
  const carbs = nutrition.carbs ?? 0;
  const protein = nutrition.protein ?? 0;
  const warnings = [];

  if (healthConditions.includes('diabetes')) {
    if (carbs > THRESHOLDS.diabetes.carbs) {
      warnings.push({
        severity: 'high',
        condition: 'diabetes',
        message: `Diyabet Uyarısı: Yüksek karbonhidrat içeriği (${carbs}g). Kan şekerinizi takip edin.`,
      });
    } else if (matchesAny(foodName, HIGH_SUGAR_DESSERTS)) {
      warnings.push({
        severity: 'medium',
        condition: 'diabetes',
        message: 'Diyabet Uyarısı: Bu tatlı yüksek şeker içerebilir. Porsiyonunuza dikkat edin.',
      });
    }
  }

  if (healthConditions.includes('hypertension')) {
    // NOTE: Backend does not return sodium. High-sodium dishes are identified by name only.
    if (matchesAny(foodName, HIGH_SODIUM_DISHES)) {
      warnings.push({
        severity: 'medium',
        condition: 'hypertension',
        message: 'Tansiyon Uyarısı: Bu yemek yüksek sodyum içerebilir. Tuz alımınıza dikkat edin.',
      });
    }
  }

  if (healthConditions.includes('kidney')) {
    if (protein > THRESHOLDS.kidney.protein) {
      warnings.push({
        severity: 'medium',
        condition: 'kidney',
        message: `Böbrek Uyarısı: Yüksek protein içeriği (${protein}g). Diyetisyeninize danışın.`,
      });
    }
    // Same high-sodium heuristic applies to kidney disease (sodium restriction)
    if (matchesAny(foodName, HIGH_SODIUM_DISHES)) {
      warnings.push({
        severity: 'medium',
        condition: 'kidney',
        message: 'Böbrek Uyarısı: Bu yemek yüksek sodyum içerebilir. Tuz alımınıza dikkat edin.',
      });
    }
  }

  return warnings;
}
