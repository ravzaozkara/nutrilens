import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { GOAL_TYPES } from '../../utils/constants';

export default function GoalsSettings({ user, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    dailyCalories: user?.goals?.dailyCalories || 1800,
    goalType: user?.goals?.goalType || 'maintain',
    protein: user?.goals?.protein || 25,
    carbs: user?.goals?.carbs || 50,
    fat: user?.goals?.fat || 25,
  });

  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData({
      dailyCalories: user?.goals?.dailyCalories || 1800,
      goalType: user?.goals?.goalType || 'maintain',
      protein: user?.goals?.protein || 25,
      carbs: user?.goals?.carbs || 50,
      fat: user?.goals?.fat || 25,
    });
  }, [user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setError('');
  };

  const totalMacros = formData.protein + formData.carbs + formData.fat;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (totalMacros !== 100) {
      setError('Macronutrient percentages must add up to 100');
      return;
    }

    onSubmit({
      goals: {
        dailyCalories: Number(formData.dailyCalories),
        goalType: formData.goalType,
        protein: Number(formData.protein),
        carbs: Number(formData.carbs),
        fat: Number(formData.fat),
      },
    });
    setIsDirty(false);
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Nutrition Goals
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Daily Calorie Goal"
          type="number"
          value={formData.dailyCalories}
          onChange={(e) => handleChange('dailyCalories', Number(e.target.value))}
          min="1000"
          max="5000"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Goal Type
          </label>
          <select
            value={formData.goalType}
            onChange={(e) => handleChange('goalType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          >
            {GOAL_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Macro Distribution (%)
          </label>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Protein</span>
                <span className="font-medium">{formData.protein}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={formData.protein}
                onChange={(e) => handleChange('protein', Number(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Carbs</span>
                <span className="font-medium">{formData.carbs}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="70"
                value={formData.carbs}
                onChange={(e) => handleChange('carbs', Number(e.target.value))}
                className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Fat</span>
                <span className="font-medium">{formData.fat}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={formData.fat}
                onChange={(e) => handleChange('fat', Number(e.target.value))}
                className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
            </div>
          </div>

          <div
            className={`mt-3 text-sm ${
              totalMacros === 100 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            Total: {totalMacros}% {totalMacros !== 100 && '(must be 100%)'}
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button
          type="submit"
          loading={loading}
          disabled={!isDirty || totalMacros !== 100}
        >
          Save
        </Button>
      </form>
    </Card>
  );
}
