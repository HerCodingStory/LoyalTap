const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const passRoutes = require('./routes/passRoutes');
const customerRoutes = require('./routes/customerRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/pass', passRoutes);
app.use('/api/customers', customerRoutes);

module.exports = app;
