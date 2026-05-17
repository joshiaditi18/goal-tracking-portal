import api from './axiosClient.js';

export const fetchDashboard = async () => {
  const response = await api.get('/reports/dashboard');
  return response.data.data;
};

export const fetchAchievements = async () => {
  const response = await api.get('/reports/achievements');
  return response.data.data;
};

export const fetchPendingReports = async () => {
  const response = await api.get('/reports/pending');
  return response.data.data;
};
