const express = require('express');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const returns = require('../routes/returns');
const users = require('../routes/users');
const admin = require('../routes/adminUsers');
const auth = require('../routes/auth');
const owners = require('../routes/owners');
const authAdmin = require('../routes/authAdmin');
const companies = require('../routes/companies');
const menu = require('../routes/menu');
const tags = require('../routes/tags');
const locations = require('../routes/locations');
const wallet = require('../routes/wallet');
const userPreference = require('../routes/preference');
const orders = require('../routes/orders');

const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  // app.use('/api/genres', genres);
  // app.use('/api/customers', customers);
  // app.use('/api/movies', movies);
  // app.use('/api/rentals', rentals);
 // app.use('/api/returns', returns);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/api/admin', admin);
  app.use('/api/authAdmin', authAdmin);
  app.use('/api/owners', owners);
  app.use('/api/companies', companies);
  app.use('/api/locations', locations);
  app.use('/api/menu', menu);
  app.use('/api/tags', tags);
  app.use('/api/wallet', wallet);
  app.use('/api/preference', userPreference);
   app.use('/api/orders', orders);


  app.use(error);
}