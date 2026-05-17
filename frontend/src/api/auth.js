import api from './axiosClient.js';

export const login = async ({ email, password }) => {
  const response = await api.post('/auth/login', { email, password });
  return {
    token: response.data.data.token,
    user: response.data.data,
  };
};

export const logout = async () => {
  await api.post('/auth/logout');
};

export const fetchProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data.data;
};
