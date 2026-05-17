const mongoose = require('mongoose');

const GoalSheetSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Goal' }],
  cycle: { type: mongoose.Schema.Types.ObjectId, ref: 'Cycle' },
  quarter: { type: String },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'rejected', 'returned', 'locked'],
    default: 'draft',
  },
  totalWeightage: { type: Number, default: 0 },
  submittedAt: { type: Date },
  approvedAt: { type: Date },
  rejectedAt: { type: Date },
  returnedAt: { type: Date },
  isLocked: { type: Boolean, default: false },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  auditLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AuditLog' }],
  metadata: {
    draftSavedAt: { type: Date },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
}, { timestamps: true });

module.exports = mongoose.model('GoalSheet', GoalSheetSchema);
