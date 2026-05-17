const validateGoalPayload = (goals) => {
  if (!Array.isArray(goals)) {
    return 'Goals must be an array.';
  }
  if (goals.length === 0) {
    return 'At least one goal is required.';
  }
  if (goals.length > 8) {
    return 'Maximum of 8 goals is allowed.';
  }

  let totalWeight = 0;
  for (const goal of goals) {
    if (!goal.thrustArea || !goal.title || !goal.uomType) {
      return 'Each goal must include thrustArea, title, and uomType.';
    }
    if (goal.weightage == null || goal.weightage < 10) {
      return 'Each goal must have at least 10% weightage.';
    }
    totalWeight += Number(goal.weightage || 0);
  }

  if (totalWeight !== 100) {
    return 'Total weightage of all goals must equal 100%.';
  }

  return null;
};

module.exports = { validateGoalPayload };
