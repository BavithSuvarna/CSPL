// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Basic middleware

// allow x-admin-token in preflight/requests
app.use(cors({
  origin: true, // allow all origins in dev; restrict in prod
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-token'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Helper to safely require a route and validate it
function safeUse(routePath, mountPath) {
  try {
    const imported = require(routePath);
    // The router exported should be a function (Express Router is a function)
    if (!imported || (typeof imported !== 'function' && typeof imported !== 'object')) {
      console.error(`ERROR: The module at ${routePath} did not export a router function/object.`);
      console.error(`Module exported:`, imported);
      process.exit(1);
    }
    app.use(mountPath, imported);
    console.log(`Mounted ${routePath} on ${mountPath}`);
  } catch (err) {
    console.error(`Failed to load route ${routePath} -> ${err.message}`);
    console.error(err);
    process.exit(1);
  }
}

// Mount API routes (update paths if your files live elsewhere)
safeUse('./src/routes/teams', '/api/teams');
safeUse('./src/routes/players', '/api/players');
safeUse('./src/routes/auction', '/api/auction');

// Root health check
app.get('/', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Connect to Mongo and start
const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/cspl-auction';

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });