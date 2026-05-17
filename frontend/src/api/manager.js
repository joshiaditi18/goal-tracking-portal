import api from './axiosClient.js';

export const fetchTeamOverview = async () => {
  const response = await api.get('/reports/dashboard');
  return response.data.data;
};

export const fetchPendingApprovals = async () => {
  const response = await api.get('/reports/pending');
  return response.data.data;
};

export const fetchSubmittedGoals = async () => {
  const response = await api.get('/reports/pending');
  return response.data.data;
};

export const approveGoalSheet = async (sheetId) => {
  const response = await api.post(`/sheets/approve/${sheetId}`);
  return response.data.data;
};

export const rejectGoalSheet = async (sheetId, payload) => {
  const response = await api.post(`/sheets/reject/${sheetId}`, payload);
  return response.data.data;
};

export const returnGoalSheet = async (sheetId, payload) => {
  const response = await api.post(`/sheets/return/${sheetId}`, payload);
  return response.data.data;
};

export const fetchSharedGoals = async () => {
  const response = await api.get('/shared-goals');
  return response.data.data;
};

export const updateSharedWeightage = async (sharedGoalId, payload) => {
  const response = await api.put(`/shared-goals/weight/${sharedGoalId}`, payload);
  return response.data.data;
};

export const syncSharedGoalAchievement = async (sharedGoalId, payload) => {
  const response = await api.post(`/shared-goals/sync/${sharedGoalId}`, payload);
  return response.data.data;
};

export const fetchTeamCheckins = async () => {
  const response = await api.get('/tracking/checkins');
  return response.data.data;
};

export const submitManagerComment = async (goalId, payload) => {
  const response = await api.post(`/tracking/checkin/${goalId}`, payload);
  return response.data.data;
};

export const fetchTeamAnalytics = async () => {
  const response = await api.get('/reports/dashboard');
  return response.data.data;
};
