import api from './axiosClient.js';

export const fetchAdminDashboard = async () => {
  const response = await api.get('/reports/dashboard');
  return response.data.data;
};

export const fetchAuditLogs = async (params) => {
  const response = await api.get('/audit', { params });
  return response.data.data;
};

export const createUser = async (payload) => {
  const response = await api.post('/admin/users', payload);
  return response.data.data;
};

export const listUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data.data;
};

export const updateUser = async (id, payload) => {
  const response = await api.put(`/admin/users/${id}`, payload);
  return response.data.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const fetchPendingSheets = async () => {
  const response = await api.get('/reports/pending');
  return response.data.data;
};

export const unlockGoalSheet = async (sheetId) => {
  const response = await api.post(`/sheets/unlock/${sheetId}`);
  return response.data.data;
};

export const exportCsvReport = async (reportType) => {
  const response = await api.get(`/reports/achievements/export/csv`, { responseType: 'blob', params: { type: reportType } });
  return response.data;
};

export const exportExcelReport = async (reportType) => {
  const response = await api.get(`/reports/achievements/export/excel`, { responseType: 'blob', params: { type: reportType } });
  return response.data;
};
