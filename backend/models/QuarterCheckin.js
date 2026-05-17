const mongoose = require('mongoose');

const QuarterCheckinSchema = new mongoose.Schema({
  goal: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quarter: { type: String, required: true },
  cycle: { type: mongoose.Schema.Types.ObjectId, ref: 'Cycle' },
  actualAchievement: { type: Number, default: 0 },
  achievementStatus: {
    type: String,
    enum: ['Not Started', 'On Track', 'Completed'],
    default: 'Not Started',
  },
  checkinDate: { type: Date, default: Date.now },
  managerComments: { type: String },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('QuarterCheckin', QuarterCheckinSchema);
