const AuditLog = require('../models/AuditLog');

const logChange = async ({ entityType, entityId, field, oldValue, newValue, changedBy, changedByRole, metadata }) => {
  const audit = await AuditLog.create({
    entityType,
    entityId,
    field,
    oldValue,
    newValue,
    changedBy,
    changedByRole,
    metadata,
  });
  return audit;
};

module.exports = { logChange };
