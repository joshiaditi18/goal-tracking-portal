const validateSharedGoal = (payload) => {
  if (!payload.title || !payload.thrustArea || !payload.uomType || payload.target == null) {
    return 'title, thrustArea, uomType, and target are required for shared goals.';
  }
  if (!Array.isArray(payload.linkedEmployees) || payload.linkedEmployees.length === 0) {
    return 'At least one linked employee is required.';
  }
  return null;
};

module.exports = { validateSharedGoal };
