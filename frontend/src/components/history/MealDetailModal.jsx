import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import PortionSelector from '../analysis/PortionSelector';
import { formatDateTime } from '../../utils/helpers';
import { CameraIcon } from '@heroicons/react/24/outline';

const nutritionLabels = {
  calories: { label: 'Calories', unit: 'kcal' },
  protein: { label: 'Protein', unit: 'g' },
  carbs: { label: 'Carbs', unit: 'g' },
  fat: { label: 'Fat', unit: 'g' },
  fiber: { label: 'Fiber', unit: 'g' },
  sodium: { label: 'Sodium', unit: 'mg' },
};

export default function MealDetailModal({
  isOpen,
  onClose,
  meal,
  onUpdate,
  onDelete,
}) {
  const [portion, setPortion] = useState(meal?.portion || 1);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!meal) return null;

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await onUpdate(meal.id, { portion });
      onClose();
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      setDeleting(true);
      try {
        await onDelete(meal.id);
        onClose();
      } finally {
        setDeleting(false);
      }
    }
  };

  const adjustedNutrition = Object.fromEntries(
    Object.entries(meal.nutrition).map(([key, value]) => [
      key,
      Math.round((value / meal.portion) * portion),
    ])
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Meal Details" size="md">
      <div className="space-y-6">
        {/* Image and basic info */}
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0">
            {meal.imageUrl ? (
              <img
                src={meal.imageUrl}
                alt={meal.foodName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <CameraIcon className="w-10 h-10" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {meal.foodName}
            </h3>
            <p className="text-sm text-gray-500">
              {formatDateTime(meal.createdAt)}
            </p>
          </div>
        </div>

        {/* Portion selector */}
        <PortionSelector value={portion} onChange={setPortion} />

        {/* Nutrition facts */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Nutrition Facts ({portion} serving{portion === 1 ? '' : 's'})
          </h4>
          <div className="bg-gray-50 rounded-xl p-4 divide-y divide-gray-200">
            {Object.entries(nutritionLabels).map(([key, { label, unit }]) => {
              const value = adjustedNutrition[key];
              if (value === undefined) return null;

              return (
                <div
                  key={key}
                  className="flex items-center justify-between py-2 first:pt-0 last:pb-0"
                >
                  <span className="text-gray-600">{label}</span>
                  <span className="font-medium text-gray-900">
                    {value} {unit}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={deleting}
            className="flex-1"
          >
            Delete
          </Button>
          <Button
            onClick={handleUpdate}
            loading={updating}
            disabled={portion === meal.portion}
            className="flex-1"
          >
            Update
          </Button>
        </div>
      </div>
    </Modal>
  );
}
