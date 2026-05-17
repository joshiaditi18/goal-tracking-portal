const Goal = require('../models/Goal');
const GoalSheet = require('../models/GoalSheet');
const { validateGoalPayload } = require('../validators/goalValidator');
const { logChange } = require('../services/auditService');

exports.createGoal = async (req, res, next) => {
  try {
    const payload = req.body;
    payload.owner = req.user.id;
    payload.status = 'draft';

    const goal = await Goal.create(payload);
    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    next(error);
  }
};

exports.updateGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found.' });
    if (goal.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own goals.' });
    }
    if (goal.isLocked) {
      return res.status(400).json({ message: 'Goal is locked and cannot be updated.' });
    }

    const allowedUpdates = ['thrustArea', 'title', 'description', 'uomType', 'target', 'targetDate', 'weightage'];
    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const oldValue = goal.toObject();
    Object.assign(goal, updates);
    await goal.save();

    for (const key of Object.keys(updates)) {
      await logChange({
        entityType: 'Goal',
        entityId: goal._id,
        field: key,
        oldValue: oldValue[key],
        newValue: updates[key],
        changedBy: req.user.id,
        changedByRole: req.user.role,
      });
    }

    res.json({ success: true, data: goal });
  } catch (error) {
    next(error);
  }
};

exports.submitGoal = async (req, res, next) => {
  try {
    const goalSheet = await GoalSheet.findById(req.params.sheetId).populate('goals');
    if (!goalSheet) return res.status(404).json({ message: 'Goal sheet not found.' });
    if (goalSheet.employee.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the owner can submit this sheet.' });
    }
    if (goalSheet.isLocked) {
      return res.status(400).json({ message: 'Goal sheet is locked and cannot be submitted.' });
    }

    const error = validateGoalPayload(goalSheet.goals.map((goal) => ({
      thrustArea: goal.thrustArea,
      title: goal.title,
      uomType: goal.uomType,
      weightage: goal.weightage,
    })));
    if (error) {
      return res.status(400).json({ message: error });
    }

    goalSheet.status = 'submitted';
    goalSheet.submittedAt = new Date();
    await goalSheet.save();

    await Goal.updateMany(
      { _id: { $in: goalSheet.goals } },
      { status: 'submitted' }
    );

    await logChange({
      entityType: 'GoalSheet',
      entityId: goalSheet._id,
      field: 'status',
      oldValue: goalSheet.status,
      newValue: 'submitted',
      changedBy: req.user.id,
      changedByRole: req.user.role,
    });

    res.json({ success: true, data: goalSheet });
  } catch (error) {
    next(error);
  }
};

exports.lockGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found.' });
    goal.isLocked = true;
    goal.status = 'locked';
    await goal.save();
    res.json({ success: true, data: goal });
  } catch (error) {
    next(error);
  }
};
