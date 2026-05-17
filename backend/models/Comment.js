const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  targetType: { type: String, required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ['employee', 'manager', 'admin', 'system'],
    default: 'employee',
  },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
