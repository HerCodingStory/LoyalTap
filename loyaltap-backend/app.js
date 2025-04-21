const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const passRoutes = require('./routes/customerPassRoutes');
const customerRoutes = require('./routes/rewardCardRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", authRoutes);
app.use('/api/pass', passRoutes);
app.use('/api/restaurant', customerRoutes);

module.exports = app;
