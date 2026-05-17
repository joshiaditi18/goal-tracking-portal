const isValidWindow = (start, end) => {
  if (!start || !end) return false;
  const startDate = new Date(start);
  const endDate = new Date(end);
  return !Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime()) && startDate < endDate;
};

const validateCyclePayload = (payload) => {
  if (!payload.name) return 'Cycle name is required.';
  if (!payload.quarter) return 'Quarter label is required.';
  if (!payload.year || typeof payload.year !== 'number') return 'A valid year is required.';

  if (!isValidWindow(payload.goalSettingWindowStart, payload.goalSettingWindowEnd)) {
    return 'Goal setting window start/end dates are required and must form a valid range.';
  }

  if (!isValidWindow(payload.trackingWindowStart, payload.trackingWindowEnd)) {
    return 'Tracking window start/end dates are required and must form a valid range.';
  }

  const quarterWindows = [
    { start: payload.q1WindowStart, end: payload.q1WindowEnd, label: 'Q1' },
    { start: payload.q2WindowStart, end: payload.q2WindowEnd, label: 'Q2' },
    { start: payload.q3WindowStart, end: payload.q3WindowEnd, label: 'Q3' },
    { start: payload.q4WindowStart, end: payload.q4WindowEnd, label: 'Q4' },
  ];

  for (const window of quarterWindows) {
    if (!isValidWindow(window.start, window.end)) {
      return `${window.label} start/end dates are required and must form a valid range.`;
    }
  }

  const ranges = [
    { key: 'Goal Setting', start: new Date(payload.goalSettingWindowStart), end: new Date(payload.goalSettingWindowEnd) },
    { key: 'Q1', start: new Date(payload.q1WindowStart), end: new Date(payload.q1WindowEnd) },
    { key: 'Q2', start: new Date(payload.q2WindowStart), end: new Date(payload.q2WindowEnd) },
    { key: 'Q3', start: new Date(payload.q3WindowStart), end: new Date(payload.q3WindowEnd) },
    { key: 'Q4', start: new Date(payload.q4WindowStart), end: new Date(payload.q4WindowEnd) },
    { key: 'Tracking', start: new Date(payload.trackingWindowStart), end: new Date(payload.trackingWindowEnd) },
  ];

  for (let i = 0; i < ranges.length - 1; i += 1) {
    if (ranges[i].end > ranges[i + 1].start) {
      return `${ranges[i].key} window must end before ${ranges[i + 1].key} window starts.`;
    }
  }

  return null;
};

module.exports = { validateCyclePayload };
