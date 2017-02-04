/*
 * Author: Alton Lau
 * Date: February 3, 2017
 * File: app.js
 * Description: Backend main application
 */

var app, bodyParser, db, methodOverride, mongoose, port;

function init(express) {
  app = express;
  bodyParser = require('body-parser');
  methodOverride = require('method-override');
  mongoose = require('mongoose');

  db = require('./config/db');
  port = process.env.PORT || 3000;

  setupConfiguration();
  setupDatabase();
  setupRouter();
}

function setupConfiguration() {
  // Get all data/stuff of the body (POST) parameters
  // Parse application/json
  app.use(bodyParser.json());

  // Parse application/vnd.api+json as json
  app.use(bodyParser.json({
    type: 'application/vnd.api+json'
  }));

  // Parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  // Override with the X-HTTP-Method-Override header in the request. Simulate DELETE/PUT
  app.use(methodOverride('X-HTTP-Method-Override'));
}

function setupDatabase() {
  mongoose.connect(db.url);
}

function setupRouter() {
  require('./router')(app);
}

function startListening() {
  // Listen at http://localhost:3000
  app.listen(port);
  console.log('\x1b[1;34m%s\x1b[0m', '--- Starting Alton Lau\'s Website ---');
  console.log('\x1b[32m%s\x1b[0m', 'Listening at port: ' + port);
}

module.exports = function (express) {
  init(express);

  return {
    run: function () {
      startListening();
    }
  };
};
