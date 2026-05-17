import api from './axiosClient.js';

export const saveDraftSheet = async (payload) => {
  const response = await api.post('/sheets/draft', payload);
  return response.data.data;
};

export const submitSheet = async (sheetId) => {
  const response = await api.post(`/sheets/submit/${sheetId}`);
  return response.data.data;
};

export const getGoalSheet = async (sheetId) => {
  const response = await api.get(`/sheets/${sheetId}`);
  return response.data.data;
};
