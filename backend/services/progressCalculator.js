const calculateProgress = ({ uomType, target, achievement, targetDate, completionDate }) => {
  if (uomType === 'Numeric') {
    if (!target || target === 0) return 0;
    return Math.min(100, Math.max(0, (achievement / target) * 100));
  }

  if (uomType === 'Percentage') {
    if (!target || target === 0) return 0;
    return Math.min(100, Math.max(0, (achievement / target) * 100));
  }

  if (uomType === 'Timeline') {
    if (!targetDate || !completionDate) return 0;
    const deadline = new Date(targetDate).getTime();
    const finished = new Date(completionDate).getTime();
    if (finished <= deadline) return 100;
    return 0;
  }

  if (uomType === 'Zero-based') {
    return achievement === 0 ? 100 : 0;
  }

  return 0;
};

module.exports = { calculateProgress };
