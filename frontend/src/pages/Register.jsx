import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';
import {
  registerStep1Schema,
  registerStep2Schema,
  registerStep3Schema,
  getPasswordStrength,
} from '../utils/validators';
import { GENDER_OPTIONS, HEALTH_CONDITIONS } from '../utils/constants';
import { calculateBMI, getBMICategory } from '../utils/helpers';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { CheckIcon } from '@heroicons/react/24/solid';

const steps = ['Hesap Bilgileri', 'Kişisel Bilgiler', 'Sağlık Profili'];

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    birthDate: '',
    gender: '',
    height: '',
    weight: '',
    healthConditions: [],
    acceptTerms: false,
  });

  const schemas = {
    1: registerStep1Schema,
    2: registerStep2Schema,
    3: registerStep3Schema,
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schemas[currentStep]),
    defaultValues: formData,
  });

  const password = watch('password', '');
  const passwordStrength = getPasswordStrength(password);

  const height = watch('height');
  const weight = watch('weight');
  const bmi = calculateBMI(weight, height);
  const bmiCategory = getBMICategory(bmi);

  const onSubmitStep = async (data) => {
    const newFormData = { ...formData, ...data };
    setFormData(newFormData);

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setLoading(true);
      try {
        await registerUser({
          email: newFormData.email,
          password: newFormData.password,
          name: newFormData.name,
          birthDate: newFormData.birthDate,
          gender: newFormData.gender,
          height: Number(newFormData.height),
          weight: Number(newFormData.weight),
          healthConditions: newFormData.healthConditions,
        });
        toast.success('Hesabınız oluşturuldu!');
        navigate('/dashboard');
      } catch (error) {
        toast.error(getErrorMessage(error, 'Kayıt yapılırken bir hata oluştu'));
      } finally {
        setLoading(false);
      }
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConditionChange = (conditionId, checked) => {
    setFormData((prev) => ({
      ...prev,
      healthConditions: checked
        ? [...prev.healthConditions, conditionId]
        : prev.healthConditions.filter((c) => c !== conditionId),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">N</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Hesap Oluşturun
        </h2>

        {/* Step Indicator */}
        <div className="mt-8 flex items-center justify-center">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index + 1 < currentStep
                    ? 'bg-primary-500 text-white'
                    : index + 1 === currentStep
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1 < currentStep ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-1 mx-2 ${
                    index + 1 < currentStep ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="mt-2 text-center text-sm text-gray-600">
          {steps[currentStep - 1]}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <form onSubmit={handleSubmit(onSubmitStep)} className="space-y-5">
            {/* Step 1: Account Info */}
            {currentStep === 1 && (
              <>
                <Input
                  label="E-posta"
                  type="email"
                  placeholder="E-posta adresiniz"
                  {...register('email')}
                  error={errors.email?.message}
                />

                <div>
                  <Input
                    label="Şifre"
                    type="password"
                    placeholder="Şifreniz"
                    {...register('password')}
                    error={errors.password?.message}
                  />
                  {password && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${passwordStrength.color} transition-all`}
                            style={{ width: passwordStrength.width }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {passwordStrength.label}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <Input
                  label="Şifre Tekrar"
                  type="password"
                  placeholder="Şifrenizi tekrar girin"
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                />
              </>
            )}

            {/* Step 2: Personal Info */}
            {currentStep === 2 && (
              <>
                <Input
                  label="Ad Soyad"
                  placeholder="Adınız ve soyadınız"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cinsiyet
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {GENDER_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-colors ${
                          formData.gender === option.value
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          value={option.value}
                          {...register('gender')}
                          onChange={(e) =>
                            setFormData({ ...formData, gender: e.target.value })
                          }
                          className="sr-only"
                        />
                        <span className="text-sm font-medium">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Step 3: Health Profile */}
            {currentStep === 3 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Boy (cm)"
                    type="number"
                    placeholder="165"
                    {...register('height', { valueAsNumber: true })}
                    error={errors.height?.message}
                  />
                  <Input
                    label="Kilo (kg)"
                    type="number"
                    placeholder="60"
                    {...register('weight', { valueAsNumber: true })}
                    error={errors.weight?.message}
                  />
                </div>

                {bmi && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">VKİ</span>
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
                  <div className="space-y-2">
                    {HEALTH_CONDITIONS.map((condition) => (
                      <label
                        key={condition.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.healthConditions.includes(
                            condition.id
                          )}
                          onChange={(e) =>
                            handleConditionChange(condition.id, e.target.checked)
                          }
                          className="h-4 w-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-gray-700">{condition.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    {...register('acceptTerms')}
                    className="mt-1 h-4 w-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600">
                    Kullanım koşullarını okudum ve kabul ediyorum
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="text-sm text-red-500">
                    {errors.acceptTerms.message}
                  </p>
                )}
              </>
            )}

            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={goBack}
                  className="flex-1"
                >
                  Geri
                </Button>
              )}
              <Button
                type="submit"
                loading={loading}
                className={currentStep === 1 ? 'w-full' : 'flex-1'}
              >
                {currentStep === 3 ? 'Kayıt Ol' : 'Devam'}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Zaten hesabınız var mı?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-700"
            >
              Giriş yapın
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
