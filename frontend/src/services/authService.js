import api from './api';
import { mockUser } from '../utils/mockData';

const USE_MOCK = false;

// Backend snake_case → frontend camelCase.
// Decision: normalize in the service layer so no component needs to change.
// "kidney_disease" → "kidney" to match HEALTH_CONDITIONS constant id.
function normalizeUser(data) {
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    createdAt: data.created_at,
    birthDate: data.birth_date,
    gender: data.gender,
    height: data.height_cm,
    weight: data.weight_kg,
    healthConditions: (data.health_conditions || []).map((c) =>
      c === 'kidney_disease' ? 'kidney' : c
    ),
    goals: {
      dailyCalories: data.daily_calorie_goal,
      protein: data.protein_goal,
      carbs: data.carbs_goal,
      fat: data.fat_goal,
    },
  };
}

// Frontend camelCase → backend snake_case (partial — only present keys).
function serializeProfile(data) {
  const payload = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.birthDate !== undefined) payload.birth_date = data.birthDate;
  if (data.gender !== undefined) payload.gender = data.gender;
  if (data.height !== undefined) payload.height_cm = Number(data.height);
  if (data.weight !== undefined) payload.weight_kg = Number(data.weight);
  if (data.healthConditions !== undefined) {
    payload.is_diabetic = data.healthConditions.includes('diabetes');
    payload.is_hypertensive = data.healthConditions.includes('hypertension');
    payload.is_kidney_disease = data.healthConditions.includes('kidney');
  }
  if (data.goals?.dailyCalories !== undefined)
    payload.daily_calorie_goal = data.goals.dailyCalories;
  if (data.goals?.protein !== undefined) payload.protein_goal = data.goals.protein;
  if (data.goals?.carbs !== undefined) payload.carbs_goal = data.goals.carbs;
  if (data.goals?.fat !== undefined) payload.fat_goal = data.goals.fat;
  return payload;
}

export const authService = {
  async login(email, password) {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (email && password) {
        return {
          accessToken: 'mock-jwt-token',
          user: mockUser,
        };
      }
      throw new Error('Invalid email or password');
    }
    const { data } = await api.post('/auth/login', { email, password });
    // Store token before getMe() so the request interceptor can attach it.
    localStorage.setItem('accessToken', data.access_token);
    const user = await this.getMe();
    return { accessToken: data.access_token, user };
  },

  async register(userData) {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        accessToken: 'mock-jwt-token',
        user: {
          ...mockUser,
          ...userData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        },
      };
    }
    const conditions = userData.healthConditions || [];
    const payload = {
      email: userData.email,
      password: userData.password,
      name: userData.name || undefined,
      birth_date: userData.birthDate || undefined,
      gender: userData.gender || undefined,
      height_cm: userData.height ? Number(userData.height) : undefined,
      weight_kg: userData.weight ? Number(userData.weight) : undefined,
      is_diabetic: conditions.includes('diabetes'),
      is_hypertensive: conditions.includes('hypertension'),
      is_kidney_disease: conditions.includes('kidney'),
    };
    // Drop undefined fields so Pydantic doesn't reject them
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
    await api.post('/auth/register', payload);
    // Register returns the user but no token — login immediately after.
    const { data: loginData } = await api.post('/auth/login', {
      email: userData.email,
      password: userData.password,
    });
    localStorage.setItem('accessToken', loginData.access_token);
    const user = await this.getMe();
    return { accessToken: loginData.access_token, user };
  },

  async getMe() {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockUser;
    }
    const { data } = await api.get('/auth/me');
    return normalizeUser(data);
  },

  async updateProfile(profileData) {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const updatedUser = { ...mockUser, ...profileData };
      return updatedUser;
    }
    const payload = serializeProfile(profileData);
    const { data } = await api.put('/auth/profile', payload);
    return normalizeUser(data);
  },

  async changePassword(currentPassword, newPassword) {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, message: 'Password changed successfully' };
    }
    const { data } = await api.put('/auth/password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return data;
  },
};
