const mongoose = require('mongoose');

const SharedGoalSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  thrustArea: { type: String, required: true, trim: true },
  uomType: {
    type: String,
    enum: ['Numeric', 'Percentage', 'Timeline', 'Zero-based'],
    required: true,
  },
  target: { type: Number, required: true, default: 0 },
  targetDate: { type: Date },
  primaryOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  linkedEmployees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  weightageByEmployee: [{
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    weightage: { type: Number, default: 0 },
  }],
  achievement: { type: Number, default: 0 },
  progressScore: { type: Number, default: 0 },
  quarter: { type: String },
  cycle: { type: mongoose.Schema.Types.ObjectId, ref: 'Cycle' },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'archived'],
    default: 'draft',
  },
  auditLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AuditLog' }],
}, { timestamps: true });

module.exports = mongoose.model('SharedGoal', SharedGoalSchema);
