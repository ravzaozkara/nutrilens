import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-posta gerekli')
    .email('Geçerli bir e-posta girin'),
  password: z
    .string()
    .min(1, 'Şifre gerekli')
    .min(6, 'Şifre en az 6 karakter olmalı'),
});

export const registerStep1Schema = z.object({
  email: z
    .string()
    .min(1, 'E-posta gerekli')
    .email('Geçerli bir e-posta girin'),
  password: z
    .string()
    .min(8, 'Şifre en az 8 karakter olmalı')
    .regex(/[A-Z]/, 'En az bir büyük harf içermeli')
    .regex(/[0-9]/, 'En az bir rakam içermeli'),
  confirmPassword: z.string().min(1, 'Şifre tekrarı gerekli'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
});

export const registerStep2Schema = z.object({
  name: z.string().min(2, 'Ad en az 2 karakter olmalı'),
  birthDate: z.string().min(1, 'Doğum tarihi gerekli'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Cinsiyet seçimi gerekli',
  }),
});

export const registerStep3Schema = z.object({
  height: z
    .number({ invalid_type_error: 'Boy gerekli' })
    .min(100, 'Geçerli bir boy girin')
    .max(250, 'Geçerli bir boy girin'),
  weight: z
    .number({ invalid_type_error: 'Kilo gerekli' })
    .min(30, 'Geçerli bir kilo girin')
    .max(300, 'Geçerli bir kilo girin'),
  healthConditions: z.array(z.string()),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Kullanım koşullarını kabul etmelisiniz',
  }),
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Ad en az 2 karakter olmalı'),
  height: z.number().min(100).max(250),
  weight: z.number().min(30).max(300),
  healthConditions: z.array(z.string()),
  goals: z.object({
    dailyCalories: z.number().min(1000).max(5000),
    protein: z.number().min(0).max(100),
    carbs: z.number().min(0).max(100),
    fat: z.number().min(0).max(100),
  }),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Mevcut şifre gerekli'),
  newPassword: z
    .string()
    .min(8, 'Şifre en az 8 karakter olmalı')
    .regex(/[A-Z]/, 'En az bir büyük harf içermeli')
    .regex(/[0-9]/, 'En az bir rakam içermeli'),
  confirmPassword: z.string().min(1, 'Şifre tekrarı gerekli'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
});

export function getPasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength <= 2) return { level: 'weak', label: 'Zayıf', color: 'bg-red-500', width: '33%' };
  if (strength <= 4) return { level: 'medium', label: 'Orta', color: 'bg-yellow-500', width: '66%' };
  return { level: 'strong', label: 'Güçlü', color: 'bg-green-500', width: '100%' };
}
