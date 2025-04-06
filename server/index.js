require('dotenv').config(); // Load env variables

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRouter = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);

// Health check route (optional)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
