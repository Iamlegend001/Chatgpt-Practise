const express = require('express');
const path = require('path');
const indexRoutes = require('./Routes/index.routes');

const app = express();

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // 👈 Fix here

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', indexRoutes);

module.exports = app;
