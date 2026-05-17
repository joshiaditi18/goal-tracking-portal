exports.onlyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: admin access only.' });
  }
  next();
};

exports.onlyManager = (req, res, next) => {
  if (!req.user || req.user.role !== 'manager') {
    return res.status(403).json({ message: 'Forbidden: manager access only.' });
  }
  next();
};

exports.onlyEmployee = (req, res, next) => {
  if (!req.user || req.user.role !== 'employee') {
    return res.status(403).json({ message: 'Forbidden: employee access only.' });
  }
  next();
};

exports.allowRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: insufficient permissions.' });
  }
  next();
};
