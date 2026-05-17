const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sheet: { type: mongoose.Schema.Types.ObjectId, ref: 'GoalSheet' },
  sharedGoal: { type: mongoose.Schema.Types.ObjectId, ref: 'SharedGoal' },
  thrustArea: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  uomType: {
    type: String,
    enum: ['Numeric', 'Percentage', 'Timeline', 'Zero-based'],
    required: true,
  },
  target: { type: Number, default: 0 },
  targetDate: { type: Date },
  weightage: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'rejected', 'returned', 'locked'],
    default: 'draft',
  },
  approval: {
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rejectedAt: { type: Date },
    rejectionReason: { type: String },
    returnedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    returnedAt: { type: Date },
    returnRemarks: { type: String },
  },
  actualAchievement: { type: Number, default: 0 },
  statusTracking: {
    type: String,
    enum: ['Not Started', 'On Track', 'Completed'],
    default: 'Not Started',
  },
  progressScore: { type: Number, default: 0 },
  quarter: { type: String },
  cycle: { type: mongoose.Schema.Types.ObjectId, ref: 'Cycle' },
  isShared: { type: Boolean, default: false },
  isLocked: { type: Boolean, default: false },
  audit: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AuditLog' }],
  metadata: {
    createdByRole: { type: String },
  },
}, { timestamps: true });

module.exports = mongoose.model('Goal', GoalSchema);
