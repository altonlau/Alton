'use strict';

/*
 * Author: Alton Lau
 * Date: February 3, 2017
 * File: app.js
 * Description: Backend main application
 */

// // Modules =====================================================================
// var express        = require('express');
// var app            = express();
// var bodyParser     = require('body-parser');
// var methodOverride = require('method-override');
//
// // Configuration ===============================================================
// var db = require('./config/db');
// var port = process.env.PORT || 3000;
//
// // connect to our mongoDB database
// // (uncomment after you enter in your own credentials in config/db.js)
// // mongoose.connect(db.url);
//
// // Get all data/stuff of the body (POST) parameters
// // Parse application/json
// app.use(bodyParser.json());
//
// // Parse application/vnd.api+json as json
// app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
//
// // Parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));
//
// // Override with the X-HTTP-Method-Override header in the request. Simulate DELETE/PUT
// app.use(methodOverride('X-HTTP-Method-Override'));
//
// // Set the static files location /public/img will be /img for users
// app.use(express.static(__dirname + '/public'));
//
// // Routes ======================================================================
// require('./app/routes')(app); // configure our routes
//
// // Start app ===================================================================
// // Listen at http://localhost:3000
// app.listen(port);
// console.log('Listening to da super awesome website at: ' + port);
//
// // Expose app
// exports = module.exports = app;
var app, bodyParser, db, methodOverride, port;

function init(express) {
  app = express;
  bodyParser = require('body-parser');
  methodOverride = require('method-override');

  db = require('./config/db');
  port = process.env.PORT || 3000;

  setupConfiguration();
  setupRouter();
}

function setupConfiguration() {
  // connect to our mongoDB database
  // (uncomment after you enter in your own credentials in config/db.js)
  // mongoose.connect(db.url);

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

function setupRouter() {
  // require('./app/routes')(app); // configure our routes
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
  }
};
