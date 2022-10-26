const express = require('express');
const GuestRouter = require('./guest/GuestRouter');

const app = express();

app.use(express.json());

const cors = require('cors');
app.use(cors());

app.use(GuestRouter);

module.exports = app;
