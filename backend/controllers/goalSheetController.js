const GoalSheet = require('../models/GoalSheet');
const Goal = require('../models/Goal');
const User = require('../models/User');
const { validateGoalPayload } = require('../validators/goalValidator');
const { logChange } = require('../services/auditService');

const buildGoalData = (goalPayload, ownerId, sheetId) => ({
  owner: ownerId,
  sheet: sheetId,
  thrustArea: goalPayload.thrustArea,
  title: goalPayload.title,
  description: goalPayload.description,
  uomType: goalPayload.uomType,
  target: goalPayload.target,
  targetDate: goalPayload.targetDate,
  weightage: goalPayload.weightage,
  status: goalPayload.status || 'draft',
});

exports.saveDraft = async (req, res, next) => {
  try {
    const payload = req.body;
    const { sheetId, employee, manager, quarter, cycle, goals } = payload;

    if (!employee || !manager || !goals) {
      return res.status(400).json({ message: 'employee, manager and goals are required.' });
    }

    let sheet = null;
    if (sheetId) {
      sheet = await GoalSheet.findById(sheetId);
      if (!sheet) return res.status(404).json({ message: 'Goal sheet not found.' });
      if (sheet.employee.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized to edit this draft.' });
      }
    }

    const goalDocs = [];
    for (const goalPayload of goals) {
      if (goalPayload.id) {
        const existingGoal = await Goal.findById(goalPayload.id);
        if (existingGoal) {
          if (existingGoal.isLocked) continue;
          Object.assign(existingGoal, buildGoalData(goalPayload, employee, sheet ? sheet._id : null));
          existingGoal.status = 'draft';
          await existingGoal.save();
          goalDocs.push(existingGoal._id);
          continue;
        }
      }
      const newGoal = await Goal.create(buildGoalData(goalPayload, employee, sheet ? sheet._id : null));
      goalDocs.push(newGoal._id);
    }

    if (!sheet) {
      sheet = await GoalSheet.create({
        employee,
        manager,
        cycle,
        quarter,
        goals: goalDocs,
        status: 'draft',
        totalWeightage: goals.reduce((sum, item) => sum + Number(item.weightage || 0), 0),
      });
    } else {
      const oldValue = sheet.toObject();
      sheet.manager = manager;
      sheet.goals = Array.from(new Set([...sheet.goals.map(String), ...goalDocs.map(String)]));
      sheet.status = 'draft';
      sheet.totalWeightage = goals.reduce((sum, item) => sum + Number(item.weightage || 0), 0);
      if (quarter) sheet.quarter = quarter;
      if (cycle) sheet.cycle = cycle;
      await sheet.save();

      await logChange({
        entityType: 'GoalSheet',
        entityId: sheet._id,
        field: 'goals',
        oldValue: oldValue.goals,
        newValue: sheet.goals,
        changedBy: req.user.id,
        changedByRole: req.user.role,
      });
    }

    res.json({ success: true, data: await GoalSheet.findById(sheet._id).populate('goals') });
  } catch (error) {
    next(error);
  }
};

exports.submitSheet = async (req, res, next) => {
  try {
    const sheet = await GoalSheet.findById(req.params.id).populate('goals');
    if (!sheet) return res.status(404).json({ message: 'Goal sheet not found.' });
    if (sheet.employee.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the owner can submit this sheet.' });
    }
    if (sheet.isLocked) {
      return res.status(400).json({ message: 'Sheet is locked and cannot be submitted.' });
    }

    const error = validateGoalPayload(sheet.goals.map((goal) => ({
      thrustArea: goal.thrustArea,
      title: goal.title,
      uomType: goal.uomType,
      weightage: goal.weightage,
    })));
    if (error) return res.status(400).json({ message: error });

    sheet.status = 'submitted';
    sheet.submittedAt = new Date();
    sheet.totalWeightage = sheet.goals.reduce((sum, goal) => sum + Number(goal.weightage || 0), 0);
    await sheet.save();

    await Goal.updateMany({ _id: { $in: sheet.goals } }, { status: 'submitted' });

    await logChange({
      entityType: 'GoalSheet',
      entityId: sheet._id,
      field: 'status',
      oldValue: 'draft',
      newValue: 'submitted',
      changedBy: req.user.id,
      changedByRole: req.user.role,
    });

    res.json({ success: true, data: sheet });
  } catch (error) {
    next(error);
  }
};

exports.approveSheet = async (req, res, next) => {
  try {
    const sheet = await GoalSheet.findById(req.params.id).populate('goals');
    if (!sheet) return res.status(404).json({ message: 'Goal sheet not found.' });
    if (sheet.status !== 'submitted') {
      return res.status(400).json({ message: 'Only submitted sheets may be approved.' });
    }

    sheet.status = 'approved';
    sheet.approvedAt = new Date();
    sheet.isLocked = true;
    await sheet.save();

    await Goal.updateMany({ _id: { $in: sheet.goals } }, {
      status: 'approved',
      isLocked: true,
      'approval.approvedAt': new Date(),
      'approval.approvedBy': req.user.id,
    });

    await logChange({
      entityType: 'GoalSheet',
      entityId: sheet._id,
      field: 'status',
      oldValue: 'submitted',
      newValue: 'approved',
      changedBy: req.user.id,
      changedByRole: req.user.role,
    });

    res.json({ success: true, data: sheet });
  } catch (error) {
    next(error);
  }
};

exports.rejectSheet = async (req, res, next) => {
  try {
    const sheet = await GoalSheet.findById(req.params.id).populate('goals');
    if (!sheet) return res.status(404).json({ message: 'Goal sheet not found.' });
    if (sheet.status !== 'submitted') {
      return res.status(400).json({ message: 'Only submitted sheets may be rejected.' });
    }

    sheet.status = 'rejected';
    sheet.rejectedAt = new Date();
    sheet.isLocked = false;
    await sheet.save();

    await Goal.updateMany({ _id: { $in: sheet.goals } }, {
      status: 'rejected',
      isLocked: false,
      'approval.rejectedAt': new Date(),
      'approval.rejectedBy': req.user.id,
      'approval.rejectionReason': req.body.reason || 'Rejected by manager',
    });

    await logChange({
      entityType: 'GoalSheet',
      entityId: sheet._id,
      field: 'status',
      oldValue: 'submitted',
      newValue: 'rejected',
      changedBy: req.user.id,
      changedByRole: req.user.role,
    });

    res.json({ success: true, data: sheet });
  } catch (error) {
    next(error);
  }
};

exports.returnForRework = async (req, res, next) => {
  try {
    const sheet = await GoalSheet.findById(req.params.id).populate('goals');
    if (!sheet) return res.status(404).json({ message: 'Goal sheet not found.' });
    if (sheet.status !== 'submitted') {
      return res.status(400).json({ message: 'Only submitted sheets can be returned for rework.' });
    }

    sheet.status = 'returned';
    sheet.returnedAt = new Date();
    sheet.isLocked = false;
    sheet.metadata = sheet.metadata || {};
    sheet.metadata.returnedBy = req.user.id;
    sheet.metadata.returnRemarks = req.body.remark || 'Please revise goals.';
    await sheet.save();

    await Goal.updateMany({ _id: { $in: sheet.goals } }, {
      status: 'returned',
      isLocked: false,
      'approval.returnedAt': new Date(),
      'approval.returnedBy': req.user.id,
      'approval.returnRemarks': req.body.remark || 'Please revise goals.',
    });

    await logChange({
      entityType: 'GoalSheet',
      entityId: sheet._id,
      field: 'status',
      oldValue: 'submitted',
      newValue: 'returned',
      changedBy: req.user.id,
      changedByRole: req.user.role,
    });

    res.json({ success: true, data: sheet });
  } catch (error) {
    next(error);
  }
};

exports.unlockSheet = async (req, res, next) => {
  try {
    const sheet = await GoalSheet.findById(req.params.id).populate('goals');
    if (!sheet) return res.status(404).json({ message: 'Goal sheet not found.' });

    sheet.isLocked = false;
    await sheet.save();

    await Goal.updateMany({ _id: { $in: sheet.goals } }, { isLocked: false });

    await logChange({
      entityType: 'GoalSheet',
      entityId: sheet._id,
      field: 'isLocked',
      oldValue: true,
      newValue: false,
      changedBy: req.user.id,
      changedByRole: req.user.role,
    });

    res.json({ success: true, data: sheet });
  } catch (error) {
    next(error);
  }
};

exports.getGoalSheet = async (req, res, next) => {
  try {
    const sheet = await GoalSheet.findById(req.params.id).populate('goals employee manager');
    if (!sheet) return res.status(404).json({ message: 'Goal sheet not found.' });
    res.json({ success: true, data: sheet });
  } catch (error) {
    next(error);
  }
};
