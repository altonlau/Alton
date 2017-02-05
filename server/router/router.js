/*
 * Author: Alton Lau
 * Date: February 3, 2017
 * File: router.js
 * Description: Manages all routes accessing the web page
 */

var express = require('express');
var router = express.Router();

var errorHandler = require('./error_handler');
var User = require('../models/user_model');

function init(auth) {
  setupAuthenticationRoutes(auth);

  router.use('/user', require('./user_router'));
  router.use('/skill', require('./skill_router'));
}

function setupAuthenticationRoutes(auth) {
  router.post('/authenticate', function (req, res) {
    var name = req.body.name;
    var password = req.body.password;

    // Validation
    if (!name || !password) {
      var message;

      if (!name && !password) {
        message = 'Please enter a name and password.';
      } else if (!name) {
        message = 'Please enter a name.';
      } else if (!password) {
        message = 'Please enter a password.';
      }

      if (message) {
        res.status(400).json({
          message: message
        });
      } else {
        errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
      }
    } else {
      User.findOne({
        name: name
      }, function (error, user) {
        if (error) {
          errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
        } else if (user) {
          // Check if the password is correct.
          user.comparePassword(password, function (error, match) {
            if (match && !error) {
              // Prepare token for authentication
              res.status(200).json({
                token: auth.generateToken(user)
              });
            } else {
              res.status(400).json({
                message: 'Incorrect password.'
              });
            }
          });
        } else {
          errorHandler.sendStatus(res, errorHandler.status.NOT_FOUND);
        }
      });
    }
  });
}

module.exports = function (app, auth) {
  init(auth);
  app.use('/api', router);
};
