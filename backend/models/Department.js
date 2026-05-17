const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  code: { type: String, required: true, trim: true, uppercase: true },
  description: { type: String },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  active: { type: Boolean, default: true },
  metadata: {
    location: { type: String },
    function: { type: String },
  },
}, { timestamps: true });

module.exports = mongoose.model('Department', DepartmentSchema);
