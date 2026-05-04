import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const registerStep1Schema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const registerStep2Schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  birthDate: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Please select a gender',
  }),
});

export const registerStep3Schema = z.object({
  height: z
    .number({ invalid_type_error: 'Height is required' })
    .min(100, 'Please enter a valid height')
    .max(250, 'Please enter a valid height'),
  weight: z
    .number({ invalid_type_error: 'Weight is required' })
    .min(30, 'Please enter a valid weight')
    .max(300, 'Please enter a valid weight'),
  healthConditions: z.array(z.string()),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms of service',
  }),
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
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
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
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

  if (strength <= 2) return { level: 'weak', label: 'Weak', color: 'bg-red-500', width: '33%' };
  if (strength <= 4) return { level: 'medium', label: 'Medium', color: 'bg-yellow-500', width: '66%' };
  return { level: 'strong', label: 'Strong', color: 'bg-green-500', width: '100%' };
}
