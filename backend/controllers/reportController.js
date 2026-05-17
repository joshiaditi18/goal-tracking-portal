const Goal = require('../models/Goal');
const GoalSheet = require('../models/GoalSheet');
const QuarterCheckin = require('../models/QuarterCheckin');
const User = require('../models/User');
const { exportCsv, exportExcel } = require('../services/exportService');

exports.employeeAchievementReport = async (req, res, next) => {
  try {
    const goals = await Goal.find({ owner: req.query.employee || req.user.id }).populate('owner sharedGoal');
    const report = goals.map((goal) => ({
      employee: goal.owner.name,
      title: goal.title,
      thrustArea: goal.thrustArea,
      plannedTarget: goal.target,
      actualAchievement: goal.actualAchievement,
      progressScore: goal.progressScore,
      status: goal.statusTracking,
      quarter: goal.quarter,
    }));

    res.json({ success: true, count: report.length, data: report });
  } catch (error) {
    next(error);
  }
};

exports.exportAchievementCsv = async (req, res, next) => {
  try {
    const goals = await Goal.find({ owner: req.query.employee || req.user.id }).populate('owner');
    const report = goals.map((goal) => ({
      employee: goal.owner.name,
      title: goal.title,
      thrustArea: goal.thrustArea,
      plannedTarget: goal.target,
      actualAchievement: goal.actualAchievement,
      progressScore: goal.progressScore,
      status: goal.statusTracking,
      quarter: goal.quarter,
    }));

    const csv = exportCsv(report, [
      'employee',
      'title',
      'thrustArea',
      'plannedTarget',
      'actualAchievement',
      'progressScore',
      'status',
      'quarter',
    ]);
    res.header('Content-Type', 'text/csv');
    res.attachment('achievement-report.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

exports.exportAchievementExcel = async (req, res, next) => {
  try {
    const goals = await Goal.find({ owner: req.query.employee || req.user.id }).populate('owner');
    const report = goals.map((goal) => ({
      employee: goal.owner.name,
      title: goal.title,
      thrustArea: goal.thrustArea,
      plannedTarget: goal.target,
      actualAchievement: goal.actualAchievement,
      progressScore: goal.progressScore,
      status: goal.statusTracking,
      quarter: goal.quarter,
    }));

    const buffer = await exportExcel(report, [
      { label: 'Employee', key: 'employee' },
      { label: 'Title', key: 'title' },
      { label: 'Thrust Area', key: 'thrustArea' },
      { label: 'Planned Target', key: 'plannedTarget' },
      { label: 'Actual Achievement', key: 'actualAchievement' },
      { label: 'Progress Score', key: 'progressScore' },
      { label: 'Status', key: 'status' },
      { label: 'Quarter', key: 'quarter' },
    ]);
    res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.attachment('achievement-report.xlsx');
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

exports.completionDashboard = async (req, res, next) => {
  try {
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const approvedSheets = await GoalSheet.countDocuments({ status: 'approved' });
    const submittedSheets = await GoalSheet.countDocuments({ status: 'submitted' });
    const pendingSheets = await GoalSheet.countDocuments({ status: { $in: ['draft', 'returned', 'rejected'] } });

    const employeeCompletion = totalEmployees === 0 ? 0 : Math.round((approvedSheets / totalEmployees) * 100);
    const managerCompletion = totalEmployees === 0 ? 0 : Math.round((submittedSheets / totalEmployees) * 100);

    res.json({
      success: true,
      data: {
        employeeCompletion,
        managerCompletion,
        pendingTasks: pendingSheets,
        totalEmployees,
        approvedSheets,
        submittedSheets,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.pendingUsersReport = async (req, res, next) => {
  try {
    const sheets = await GoalSheet.find({ status: { $in: ['draft', 'returned', 'rejected'] } }).populate('employee manager');
    const report = sheets.map((sheet) => ({
      sheetId: sheet._id,
      employee: sheet.employee.name,
      employeeEmail: sheet.employee.email,
      manager: sheet.manager.name,
      status: sheet.status,
      quarter: sheet.quarter,
      updatedAt: sheet.updatedAt,
    }));
    res.json({ success: true, count: report.length, data: report });
  } catch (error) {
    next(error);
  }
};
