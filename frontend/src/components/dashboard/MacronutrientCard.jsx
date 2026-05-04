import Card from '../common/Card';

function MacroBar({ label, consumed, target, color }) {
  const safeTarget = target > 0 ? target : 1;
  const percentage = Math.min(100, (consumed / safeTarget) * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">
          {consumed}g / {target}g
        </span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function MacronutrientCard({ macros }) {
  const defaultMacros = {
    protein: { consumed: 0, target: 90 },
    carbs: { consumed: 0, target: 200 },
    fat: { consumed: 0, target: 60 },
    ...macros,
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Macronutrients</h3>

      <div className="space-y-5">
        <MacroBar
          label="Protein"
          consumed={defaultMacros.protein.consumed}
          target={defaultMacros.protein.target}
          color="bg-blue-500"
        />
        <MacroBar
          label="Carbs"
          consumed={defaultMacros.carbs.consumed}
          target={defaultMacros.carbs.target}
          color="bg-orange-500"
        />
        <MacroBar
          label="Fat"
          consumed={defaultMacros.fat.consumed}
          target={defaultMacros.fat.target}
          color="bg-yellow-500"
        />
      </div>
    </Card>
  );
}
