const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoDB = require('./db');

// Load environment variables
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoDB();

// ✅ Use CORS — allow both localhost (for dev) and Render domain (for production)
app.use(cors({
  origin: ['http://localhost:3000', 'https://gofood-1-ihh7.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// ✅ Backend API routes
app.use('/api', require('./Routes/CreateUser'));
app.use('/api', require('./Routes/LoginUser'));
app.use('/api', require('./Routes/DisplayData'));
app.use('/api', require('./Routes/OrderData'));

// // ✅ Serve frontend build (React)
// app.use(express.static(path.join(__dirname, '../frontend/build')));

// // ✅ Fix: Express v5+ wildcard route syntax (use RegExp instead of "*")
// app.get(/.*/, (req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
// });

// ✅ Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
