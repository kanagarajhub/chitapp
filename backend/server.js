const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/chitplans', require('./routes/chitPlanRoutes'));
app.use('/api/chits', require('./routes/chitRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/bids', require('./routes/bidRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Chit Fund Management API', version: '1.0.0' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
