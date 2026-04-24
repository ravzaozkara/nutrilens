import Card from '../common/Card';

const nutritionLabels = {
  calories: { label: 'Kalori', unit: 'kcal' },
  protein: { label: 'Protein', unit: 'g' },
  carbs: { label: 'Karbonhidrat', unit: 'g' },
  fat: { label: 'Yağ', unit: 'g' },
  fiber: { label: 'Lif', unit: 'g' },
  sodium: { label: 'Sodyum', unit: 'mg' },
};

export default function NutritionTable({ nutrition, portion = 1 }) {
  const adjustedNutrition = Object.fromEntries(
    Object.entries(nutrition)
      .filter(([, value]) => value != null)
      .map(([key, value]) => [key, Math.round(value * portion)])
  );

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Besin Değerleri</h3>
        <span className="text-sm text-gray-500">
          ({portion} porsiyon için)
        </span>
      </div>

      <div className="divide-y divide-gray-100">
        {Object.entries(nutritionLabels).map(([key, { label, unit }]) => {
          const value = adjustedNutrition[key];
          if (value === undefined) return null;

          return (
            <div
              key={key}
              className="flex items-center justify-between py-3"
            >
              <span className="text-gray-600">{label}</span>
              <span className="font-medium text-gray-900">
                {value} {unit}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
