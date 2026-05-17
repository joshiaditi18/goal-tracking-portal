const Cycle = require('../models/Cycle');

const createCycle = async (payload) => {
  const cycle = await Cycle.create({
    name: payload.name,
    quarter: payload.quarter,
    year: payload.year,
    goalSettingWindowStart: payload.goalSettingWindowStart,
    goalSettingWindowEnd: payload.goalSettingWindowEnd,
    q1WindowStart: payload.q1WindowStart,
    q1WindowEnd: payload.q1WindowEnd,
    q2WindowStart: payload.q2WindowStart,
    q2WindowEnd: payload.q2WindowEnd,
    q3WindowStart: payload.q3WindowStart,
    q3WindowEnd: payload.q3WindowEnd,
    q4WindowStart: payload.q4WindowStart,
    q4WindowEnd: payload.q4WindowEnd,
    trackingWindowStart: payload.trackingWindowStart,
    trackingWindowEnd: payload.trackingWindowEnd,
    active: payload.active || false,
    metadata: {
      year: payload.year,
      phase: payload.quarter,
    },
  });

  return cycle;
};

const listCycles = async () => {
  return Cycle.find().sort({ year: -1, quarter: 1 });
};

const getCycleById = async (id) => {
  return Cycle.findById(id);
};

const updateCycle = async (id, payload) => {
  const cycle = await Cycle.findById(id);
  if (!cycle) return null;

  Object.keys(payload).forEach((key) => {
    cycle[key] = payload[key];
  });

  if (payload.year || payload.quarter) {
    cycle.metadata.year = payload.year || cycle.year;
    cycle.metadata.phase = payload.quarter || cycle.quarter;
  }

  return cycle.save();
};

const deleteCycle = async (id) => {
  return Cycle.findByIdAndDelete(id);
};

const deactivateCycle = async (id) => {
  const cycle = await Cycle.findById(id);
  if (!cycle) return null;
  cycle.active = false;
  return cycle.save();
};

const activateCycle = async (id) => {
  const cycle = await Cycle.findById(id);
  if (!cycle) return null;

  await Cycle.updateMany({ active: true }, { active: false });
  cycle.active = true;
  return cycle.save();
};

const getActiveCycle = async () => {
  return Cycle.findOne({ active: true });
};

module.exports = {
  createCycle,
  listCycles,
  getCycleById,
  updateCycle,
  deleteCycle,
  activateCycle,
  deactivateCycle,
  getActiveCycle,
};
