const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const DbConnection = require("./config/db")
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
DbConnection();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pdf', require('./routes/pdfRoutes'));


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
