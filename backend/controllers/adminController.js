const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Department = require('../models/Department');

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, departmentId, managerId, phone, jobTitle } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password and role are required.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      department: departmentId,
      manager: managerId,
      phone,
      meta: { jobTitle },
    });

    if (departmentId) {
      await Department.findByIdAndUpdate(departmentId, { $addToSet: { members: user._id } });
    }

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').populate('department manager', 'name email role');
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('department manager', 'name email role');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 12);
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ success: true, message: 'User removed.' });
  } catch (error) {
    next(error);
  }
};
