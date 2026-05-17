const validateGoalSheet = (payload) => {
  if (!payload.employee || !payload.manager) {
    return 'Employee and manager fields are required.';
  }
  if (!payload.goals || !Array.isArray(payload.goals)) {
    return 'Goals must be provided as an array.';
  }
  return null;
};

module.exports = { validateGoalSheet };
