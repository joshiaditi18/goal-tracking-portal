const QuarterCheckin = require('../models/QuarterCheckin');
const Goal = require('../models/Goal');
const { calculateProgress } = require('../services/progressCalculator');
const { validateCheckin } = require('../validators/checkinValidator');
const { logChange } = require('../services/auditService');

exports.submitCheckin = async (req, res, next) => {
  try {
    const { goalId } = req.params;
    const { actualAchievement, achievementStatus, completionDate } = req.body;
    const error = validateCheckin({ actualAchievement, achievementStatus });
    if (error) return res.status(400).json({ message: error });

    const goal = await Goal.findById(goalId);
    if (!goal) return res.status(404).json({ message: 'Goal not found.' });
    if (goal.owner.toString() !== req.user.id && req.user.role !== 'manager' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to update this check-in.' });
    }

    const score = calculateProgress({
      uomType: goal.uomType,
      target: goal.target,
      achievement: actualAchievement,
      targetDate: goal.targetDate,
      completionDate,
    });

    let checkin = await QuarterCheckin.findOne({ goal: goalId, employee: goal.owner });
    if (!checkin) {
      checkin = await QuarterCheckin.create({
        goal: goalId,
        employee: goal.owner,
        cycle: goal.cycle,
        quarter: goal.quarter,
        actualAchievement,
        achievementStatus,
        checkinDate: completionDate || new Date(),
        score,
        updatedBy: req.user.id,
      });
    } else {
      const oldValue = checkin.toObject();
      checkin.actualAchievement = actualAchievement;
      checkin.achievementStatus = achievementStatus;
      if (completionDate) checkin.checkinDate = completionDate;
      checkin.score = score;
      checkin.updatedBy = req.user.id;
      await checkin.save();
      await logChange({
        entityType: 'QuarterCheckin',
        entityId: checkin._id,
        field: 'actualAchievement',
        oldValue: oldValue.actualAchievement,
        newValue: actualAchievement,
        changedBy: req.user.id,
        changedByRole: req.user.role,
      });
    }

    goal.actualAchievement = actualAchievement;
    goal.statusTracking = achievementStatus;
    goal.progressScore = score;
    await goal.save();

    res.json({ success: true, data: checkin });
  } catch (error) {
    next(error);
  }
};

exports.getGoalCheckins = async (req, res, next) => {
  try {
    const query = {};
    if (req.user.role === 'employee') {
      query.employee = req.user.id;
    }
    const checkins = await QuarterCheckin.find(query).populate('goal employee');
    res.json({ success: true, count: checkins.length, data: checkins });
  } catch (error) {
    next(error);
  }
};

exports.getPlannedVsActual = async (req, res, next) => {
  try {
    const pipeline = [
      { $lookup: { from: 'goals', localField: 'goal', foreignField: '_id', as: 'goalInfo' } },
      { $unwind: '$goalInfo' },
      {
        $project: {
          goal: '$goalInfo.title',
          plannedTarget: '$goalInfo.target',
          actualAchievement: '$actualAchievement',
          status: '$achievementStatus',
          score: '$score',
          owner: '$goalInfo.owner',
        },
      },
    ];
    const results = await QuarterCheckin.aggregate(pipeline);
    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    next(error);
  }
};
