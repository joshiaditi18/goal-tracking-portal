const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  entityType: { type: String, required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  field: { type: String, required: true },
  oldValue: { type: mongoose.Schema.Types.Mixed },
  newValue: { type: mongoose.Schema.Types.Mixed },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  changedByRole: { type: String },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
