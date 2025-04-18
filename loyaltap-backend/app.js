const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const passRoutes = require('./routes/passRoutes');
const customerRoutes = require('./routes/customerRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", authRoutes);
app.use('/api/pass', passRoutes);
// TODO: uncomment when we implement
// app.use('/api/restaurant', customerRoutes);

module.exports = app;
