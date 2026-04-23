import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { HEALTH_CONDITIONS } from '../../utils/constants';
import { calculateBMI, getBMICategory } from '../../utils/helpers';

export default function HealthConditionsForm({ user, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    height: user?.height || '',
    weight: user?.weight || '',
    healthConditions: user?.healthConditions || [],
  });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setFormData({
      height: user?.height || '',
      weight: user?.weight || '',
      healthConditions: user?.healthConditions || [],
    });
  }, [user]);

  const bmi = calculateBMI(formData.weight, formData.height);
  const bmiCategory = getBMICategory(bmi);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleConditionChange = (conditionId) => {
    setFormData((prev) => {
      const conditions = prev.healthConditions.includes(conditionId)
        ? prev.healthConditions.filter((c) => c !== conditionId)
        : [...prev.healthConditions, conditionId];
      return { ...prev, healthConditions: conditions };
    });
    setIsDirty(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      height: Number(formData.height),
      weight: Number(formData.weight),
      healthConditions: formData.healthConditions,
    });
    setIsDirty(false);
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Sağlık Profili</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Boy (cm)"
            type="number"
            value={formData.height}
            onChange={(e) => handleChange('height', e.target.value)}
            min="100"
            max="250"
          />
          <Input
            label="Kilo (kg)"
            type="number"
            value={formData.weight}
            onChange={(e) => handleChange('weight', e.target.value)}
            min="30"
            max="300"
          />
        </div>

        {bmi && (
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Vücut Kitle İndeksi (VKİ)</span>
              <span className={`font-semibold ${bmiCategory?.color}`}>
                {bmi} - {bmiCategory?.label}
              </span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Sağlık Durumları
          </label>
          <div className="space-y-3">
            {HEALTH_CONDITIONS.map((condition) => (
              <label
                key={condition.id}
                className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={formData.healthConditions.includes(condition.id)}
                  onChange={() => handleConditionChange(condition.id)}
                  className="mt-1 h-4 w-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                />
                <div>
                  <span className="font-medium text-gray-900">
                    {condition.label}
                  </span>
                  <p className="text-sm text-gray-500">{condition.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <Button type="submit" loading={loading} disabled={!isDirty}>
          Kaydet
        </Button>
      </form>
    </Card>
  );
}
