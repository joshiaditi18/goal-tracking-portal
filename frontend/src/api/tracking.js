import api from './axiosClient.js';

export const submitCheckin = async (goalId, payload) => {
  const response = await api.post(`/tracking/checkin/${goalId}`, payload);
  return response.data.data;
};

export const fetchCheckins = async () => {
  const response = await api.get('/tracking/checkins');
  return response.data.data;
};

export const fetchPlannedVsActual = async () => {
  const response = await api.get('/tracking/planned-vs-actual');
  return response.data.data;
};
