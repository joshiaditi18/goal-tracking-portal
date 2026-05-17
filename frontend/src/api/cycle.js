import api from './axiosClient.js';

export const fetchCycles = async () => {
  const response = await api.get('/cycles');
  return response.data.data;
};

export const fetchActiveCycle = async () => {
  const response = await api.get('/cycles/active');
  return response.data.data;
};

export const createCycle = async (payload) => {
  const response = await api.post('/cycles', payload);
  return response.data.data;
};

export const updateCycle = async (cycleId, payload) => {
  const response = await api.put(`/cycles/${cycleId}`, payload);
  return response.data.data;
};

export const deleteCycle = async (cycleId) => {
  const response = await api.delete(`/cycles/${cycleId}`);
  return response.data;
};

export const activateCycle = async (cycleId) => {
  const response = await api.post(`/cycles/activate/${cycleId}`);
  return response.data.data;
};

export const deactivateCycle = async (cycleId) => {
  const response = await api.post(`/cycles/deactivate/${cycleId}`);
  return response.data.data;
};
