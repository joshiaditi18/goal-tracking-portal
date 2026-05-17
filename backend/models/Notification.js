const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['goal_submitted', 'goal_approved', 'goal_rejected', 'reminder', 'escalation', 'system'],
    default: 'system',
  },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  relatedEntityType: { type: String },
  relatedEntityId: { type: mongoose.Schema.Types.ObjectId },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
