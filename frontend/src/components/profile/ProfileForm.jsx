import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { GENDER_OPTIONS } from '../../utils/constants';

const profileSchema = z.object({
  name: z.string().min(2, 'Ad en az 2 karakter olmalı'),
  birthDate: z.string().min(1, 'Doğum tarihi gerekli'),
  gender: z.string().min(1, 'Cinsiyet seçimi gerekli'),
});

export default function ProfileForm({ user, onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      birthDate: user?.birthDate || '',
      gender: user?.gender || '',
    },
  });

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Kişisel Bilgiler
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Ad Soyad"
          {...register('name')}
          error={errors.name?.message}
        />

        <Input
          label="Doğum Tarihi"
          type="date"
          {...register('birthDate')}
          error={errors.birthDate?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cinsiyet
          </label>
          <select
            {...register('gender')}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          >
            <option value="">Seçiniz</option>
            {GENDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>
          )}
        </div>

        <Button type="submit" loading={loading} disabled={!isDirty}>
          Kaydet
        </Button>
      </form>
    </Card>
  );
}
