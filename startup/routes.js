const express = require('express');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const admin = require('../routes/adminUsers');
const auth = require('../routes/auth');
const authAdmin = require('../routes/authAdmin');
const returns = require('../routes/returns');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  // app.use('/api/genres', genres);
  // app.use('/api/customers', customers);
  // app.use('/api/movies', movies);
  // app.use('/api/rentals', rentals);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/api/admin', admin);
  app.use('/api/authAdmin', authAdmin);
  // app.use('/api/returns', returns);
  app.use(error);
}