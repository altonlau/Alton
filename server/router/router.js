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

function init(auth, fileManager) {
  setupAuthenticationRoutes(auth);

  router.use('/user', require('./user_router')(fileManager));
  router.use('/skill', require('./skill_router')(fileManager));
  router.use('/about', require('./about_router')(fileManager));
  router.use('/project', require('./project_router')(fileManager));
  router.use('/website', require('./website_router')(fileManager));
}

function setupAuthenticationRoutes(auth) {
  router.post('/authenticate', function (req, res) {
    var name = req.body.name;
    var password = req.body.password;

    // Validation
    if (name && password) {
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
    } else {
      var missingFields = [];

      if (!name) {
        missingFields.push('name');
      }
      if (!password) {
        missingFields.push('password');
      }

      errorHandler.sendStatus(res, errorHandler.status.MISSING_PARAMETERS, {
        fields: missingFields
      });
    }
  });
}

module.exports = function (app, auth, fileManager) {
  init(auth, fileManager);
  app.use('/api', router);
};
