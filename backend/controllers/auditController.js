const AuditLog = require('../models/AuditLog');

exports.getAuditTrail = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.entityType) filter.entityType = req.query.entityType;
    if (req.query.entityId) filter.entityId = req.query.entityId;
    if (req.query.changedBy) filter.changedBy = req.query.changedBy;

    const logs = await AuditLog.find(filter)
      .populate('changedBy', 'name email role')
      .sort({ timestamp: -1 });

    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
};
