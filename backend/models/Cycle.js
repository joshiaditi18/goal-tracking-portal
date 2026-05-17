const mongoose = require('mongoose');

const CycleSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  quarter: { type: String, required: true },
  year: { type: Number, required: true },
  goalSettingWindowStart: { type: Date },
  goalSettingWindowEnd: { type: Date },
  q1WindowStart: { type: Date },
  q1WindowEnd: { type: Date },
  q2WindowStart: { type: Date },
  q2WindowEnd: { type: Date },
  q3WindowStart: { type: Date },
  q3WindowEnd: { type: Date },
  q4WindowStart: { type: Date },
  q4WindowEnd: { type: Date },
  trackingWindowStart: { type: Date },
  trackingWindowEnd: { type: Date },
  active: { type: Boolean, default: false },
  metadata: {
    year: { type: Number },
    phase: { type: String },
  },
}, { timestamps: true });

module.exports = mongoose.model('Cycle', CycleSchema);
