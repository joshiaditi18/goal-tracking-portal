const SharedGoal = require('../models/SharedGoal');
const Goal = require('../models/Goal');
const { validateSharedGoal } = require('../validators/sharedGoalValidator');
const { calculateProgress } = require('../services/progressCalculator');
const { logChange } = require('../services/auditService');

exports.createSharedGoal = async (req, res, next) => {
  try {
    const payload = req.body;
    const error = validateSharedGoal(payload);
    if (error) return res.status(400).json({ message: error });

    const sharedGoal = await SharedGoal.create({
      title: payload.title,
      description: payload.description,
      thrustArea: payload.thrustArea,
      uomType: payload.uomType,
      target: payload.target,
      targetDate: payload.targetDate,
      primaryOwner: payload.primaryOwner || req.user.id,
      linkedEmployees: payload.linkedEmployees,
      weightageByEmployee: payload.weightageByEmployee || payload.linkedEmployees.map((employee) => ({ employee, weightage: 0 })),
      quarter: payload.quarter,
      cycle: payload.cycle,
      status: 'active',
    });

    const createdGoals = [];
    for (const weightEntry of sharedGoal.weightageByEmployee) {
      const goal = await Goal.create({
        owner: weightEntry.employee,
        sharedGoal: sharedGoal._id,
        thrustArea: sharedGoal.thrustArea,
        title: sharedGoal.title,
        description: sharedGoal.description,
        uomType: sharedGoal.uomType,
        target: sharedGoal.target,
        targetDate: sharedGoal.targetDate,
        weightage: weightEntry.weightage,
        status: 'draft',
        isShared: true,
      });
      createdGoals.push(goal._id);
    }
    await sharedGoal.save();

    res.status(201).json({ success: true, data: { sharedGoal, createdGoals } });
  } catch (error) {
    next(error);
  }
};

exports.updateSharedWeightage = async (req, res, next) => {
  try {
    const sharedGoal = await SharedGoal.findById(req.params.id);
    if (!sharedGoal) return res.status(404).json({ message: 'Shared goal not found.' });

    const entry = sharedGoal.weightageByEmployee.find((item) => item.employee.toString() === req.user.id);
    if (!entry) return res.status(403).json({ message: 'You do not have permission to update weightage for this shared goal.' });
    if (req.body.weightage == null || req.body.weightage < 0) {
      return res.status(400).json({ message: 'Weightage is required and must be a positive number.' });
    }

    const oldValue = entry.weightage;
    entry.weightage = req.body.weightage;
    await sharedGoal.save();

    await Goal.updateMany({ sharedGoal: sharedGoal._id, owner: req.user.id }, { weightage: req.body.weightage });

    await logChange({
      entityType: 'SharedGoal',
      entityId: sharedGoal._id,
      field: 'weightageByEmployee',
      oldValue,
      newValue: req.body.weightage,
      changedBy: req.user.id,
      changedByRole: req.user.role,
    });

    res.json({ success: true, data: sharedGoal });
  } catch (error) {
    next(error);
  }
};

exports.syncSharedAchievement = async (req, res, next) => {
  try {
    const sharedGoal = await SharedGoal.findById(req.params.id);
    if (!sharedGoal) return res.status(404).json({ message: 'Shared goal not found.' });
    if (sharedGoal.primaryOwner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only the primary owner or admin may sync achievements.' });
    }
    if (req.body.achievement == null) {
      return res.status(400).json({ message: 'Achievement is required.' });
    }

    const oldValue = sharedGoal.achievement;
    sharedGoal.achievement = req.body.achievement;
    sharedGoal.progressScore = calculateProgress({
      uomType: sharedGoal.uomType,
      target: sharedGoal.target,
      achievement: sharedGoal.achievement,
      targetDate: sharedGoal.targetDate,
      completionDate: req.body.completionDate,
    });
    await sharedGoal.save();

    await Goal.updateMany(
      { sharedGoal: sharedGoal._id },
      {
        actualAchievement: sharedGoal.achievement,
        progressScore: sharedGoal.progressScore,
      }
    );

    await logChange({
      entityType: 'SharedGoal',
      entityId: sharedGoal._id,
      field: 'achievement',
      oldValue,
      newValue: sharedGoal.achievement,
      changedBy: req.user.id,
      changedByRole: req.user.role,
    });

    res.json({ success: true, data: sharedGoal });
  } catch (error) {
    next(error);
  }
};

exports.getSharedGoals = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === 'employee') {
      filter.linkedEmployees = req.user.id;
    }
    const sharedGoals = await SharedGoal.find(filter).populate('primaryOwner linkedEmployees');
    res.json({ success: true, count: sharedGoals.length, data: sharedGoals });
  } catch (error) {
    next(error);
  }
};
