const cycleService = require('../services/cycleService');
const { validateCyclePayload } = require('../validators/cycleValidator');

exports.createCycle = async (req, res, next) => {
  try {
    const error = validateCyclePayload(req.body);
    if (error) return res.status(400).json({ message: error });

    const cycle = await cycleService.createCycle(req.body);
    res.status(201).json({ success: true, data: cycle });
  } catch (error) {
    next(error);
  }
};

exports.listCycles = async (req, res, next) => {
  try {
    const cycles = await cycleService.listCycles();
    res.json({ success: true, count: cycles.length, data: cycles });
  } catch (error) {
    next(error);
  }
};

exports.getActiveCycle = async (req, res, next) => {
  try {
    const cycle = await cycleService.getActiveCycle();
    res.json({ success: true, data: cycle });
  } catch (error) {
    next(error);
  }
};

exports.updateCycle = async (req, res, next) => {
  try {
    const error = validateCyclePayload(req.body);
    if (error) return res.status(400).json({ message: error });

    const cycle = await cycleService.updateCycle(req.params.id, req.body);
    if (!cycle) return res.status(404).json({ message: 'Cycle not found.' });
    res.json({ success: true, data: cycle });
  } catch (error) {
    next(error);
  }
};

exports.deleteCycle = async (req, res, next) => {
  try {
    const cycle = await cycleService.deleteCycle(req.params.id);
    if (!cycle) return res.status(404).json({ message: 'Cycle not found.' });
    res.json({ success: true, message: 'Cycle removed.' });
  } catch (error) {
    next(error);
  }
};

exports.activateCycle = async (req, res, next) => {
  try {
    const cycle = await cycleService.activateCycle(req.params.id);
    if (!cycle) return res.status(404).json({ message: 'Cycle not found.' });
    res.json({ success: true, data: cycle });
  } catch (error) {
    next(error);
  }
};

exports.deactivateCycle = async (req, res, next) => {
  try {
    const cycle = await cycleService.deactivateCycle(req.params.id);
    if (!cycle) return res.status(404).json({ message: 'Cycle not found.' });
    res.json({ success: true, data: cycle });
  } catch (error) {
    next(error);
  }
};
