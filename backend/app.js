require('express-async-errors');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const goalRoutes = require('./routes/goalRoutes');
const goalSheetRoutes = require('./routes/goalSheetRoutes');
const sharedGoalRoutes = require('./routes/sharedGoalRoutes');
const trackingRoutes = require('./routes/trackingRoutes');
const cycleRoutes = require('./routes/cycleRoutes');
const auditRoutes = require('./routes/auditRoutes');
const reportRoutes = require('./routes/reportRoutes');
const errorHandler = require('./middleware/errorHandler');
require('./models');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/sheets', goalSheetRoutes);
app.use('/api/shared-goals', sharedGoalRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/cycles', cycleRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/reports', reportRoutes);

app.use(errorHandler);

module.exports = app;
