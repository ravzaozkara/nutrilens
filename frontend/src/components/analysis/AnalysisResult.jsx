import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getHealthWarnings } from '../../utils/helpers';
import Card from '../common/Card';
import Button from '../common/Button';
import PortionSelector from './PortionSelector';
import NutritionTable from './NutritionTable';
import HealthWarnings from './HealthWarnings';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

export default function AnalysisResult({ result, onSave, onReset, saving }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [portion, setPortion] = useState(1);

  const warnings = getHealthWarnings(
    {
      ...result.nutrition,
      protein: result.nutrition.protein * portion,
      carbs: result.nutrition.carbs * portion,
      sodium: result.nutrition.sodium * portion,
    },
    user?.healthConditions || []
  );

  const handleSave = async () => {
    const mealData = {
      foodName: result.foodName,
      imageUrl: result.imageUrl,
      nutrition: Object.fromEntries(
        Object.entries(result.nutrition).map(([key, value]) => [
          key,
          Math.round(value * portion),
        ])
      ),
      portion,
    };

    await onSave(mealData);
    navigate('/dashboard');
  };

  return (
    <div className="space-y-6">
      {/* Food identification */}
      <Card>
        <div className="flex items-start gap-4">
          {/* Image */}
          {result.imageUrl && (
            <img
              src={result.imageUrl}
              alt={result.foodName}
              className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
            />
          )}

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {result.foodName}
            </h2>
            <div className="flex items-center gap-2">
              <CheckBadgeIcon className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">
                {Math.round(result.confidence * 100)}% eşleşme
              </span>
            </div>
            <button className="text-sm text-primary-600 hover:text-primary-700 mt-2">
              Yanlış mı? Manuel girin
            </button>
          </div>
        </div>
      </Card>

      {/* Portion selector */}
      <PortionSelector value={portion} onChange={setPortion} />

      {/* Nutrition table */}
      <NutritionTable nutrition={result.nutrition} portion={portion} />

      {/* Health warnings */}
      <HealthWarnings warnings={warnings} />

      {/* Actions */}
      <div className="space-y-3">
        <Button fullWidth onClick={handleSave} loading={saving}>
          Günlüğe Kaydet
        </Button>
        <button
          onClick={onReset}
          className="w-full text-center text-primary-600 hover:text-primary-700 font-medium py-2"
        >
          Yeni Analiz
        </button>
      </div>
    </div>
  );
}
