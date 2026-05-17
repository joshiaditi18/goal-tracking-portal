const validateCheckin = (payload) => {
  if (payload.actualAchievement == null) {
    return 'Actual achievement is required.';
  }
  if (!['Not Started', 'On Track', 'Completed'].includes(payload.achievementStatus)) {
    return 'achievementStatus must be Not Started, On Track, or Completed.';
  }
  return null;
};

module.exports = { validateCheckin };
