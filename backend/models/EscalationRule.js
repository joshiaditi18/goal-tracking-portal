const mongoose = require('mongoose');

const EscalationRuleSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  trigger: {
    type: String,
    enum: ['employee_not_submitted', 'manager_not_approved', 'missed_quarterly_update'],
    required: true,
  },
  thresholdDays: { type: Number, required: true, default: 1 },
  escalationChain: [{ type: String, enum: ['employee', 'manager', 'admin', 'hr'] }],
  active: { type: Boolean, default: true },
  description: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

module.exports = mongoose.model('EscalationRule', EscalationRuleSchema);
