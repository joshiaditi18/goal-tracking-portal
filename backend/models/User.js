const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ['employee', 'manager', 'admin'],
    default: 'employee',
  },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  profileImage: { type: String },
  phone: { type: String },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  meta: {
    hireDate: { type: Date },
    location: { type: String },
    jobTitle: { type: String },
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
