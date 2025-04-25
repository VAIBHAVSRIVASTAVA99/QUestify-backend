require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const emailRoutes = require('./routes/emailRoutes');
const vjudgeRoutes = require('./routes/vjudge');
// const userRoutes = require('./routes/UserRoutes');
const scheduleDailyEmail = require('./cron/dailyMailer');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/email', emailRoutes);
app.use('/api/vjudge', vjudgeRoutes);
// app.use('/api/users', userRoutes);

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : err.message
    }
  });
});

// Start Cron Job for daily emails
if (process.env.NODE_ENV === 'production') {
  scheduleDailyEmail();
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
