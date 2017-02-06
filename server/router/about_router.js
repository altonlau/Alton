/*
 * Author: Alton Lau
 * Date: February 5, 2017
 * File: about_router.js
 * Description: About router
 */

var express = require('express');
var passport = require('passport');
var router = express.Router();

var errorHandler = require('./error_handler');
var About = require('../models/about_model');

// About API ===================================================================
// GET /api/about
// POST /api/about
// PUT /api/about
// DELETE /api/about

function setupRoutes(fileManager) {

  router.get('/', function (req, res) {
    About.findOne({}, function (error, doc) {
      if (error) {
        errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
      } else if (doc) {
        var result = {
          details: doc.details
        };

        res.status(200).json(result);
      } else {
        errorHandler.sendStatus(res, errorHandler.status.NOT_FOUND);
      }
    });
  });

  router.post('/', passport.authenticate('jwt', {
    session: false
  }), function (req, res) {
    var details = req.body.details;

    About.findOne({}, function (error, doc) {
      if (error) {
        errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
      } else if (doc) {
        errorHandler.sendStatus(res, errorHandler.status.ALREADY_EXISTS, {
          fields: 'about'
        });
      } else {
        if (details) {
          var newAbout = new About({
            details: details
          });

          newAbout.save(function (error) {
            if (error) {
              errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
            } else {
              res.status(201).json({
                message: 'Cool! I learned more about you! :D'
              });
            }
          });
        } else {
          errorHandler.sendStatus(res, errorHandler.status.MISSING_PARAMETERS, {
            fields: 'details'
          });
        }
      }
    });
  });

  router.put('/', passport.authenticate('jwt', {
    session: false
  }), function (req, res) {
    var details = req.body.details;
    var update = {};

    if (details) {
      update.details = details;

      About.findOneAndUpdate({}, update, function (error, doc) {
        if (error) {
          errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
        } else if (doc) {
          res.status(200).json({
            message: 'Okay. People change. I hope it\'s a good change...'
          });
        } else {
          errorHandler.sendStatus(res, errorHandler.status.NOT_FOUND);
        }
      });
    } else {
      errorHandler.sendStatus(res, errorHandler.status.MISSING_PARAMETERS, {
        fields: 'details'
      });
    }
  });

  router.delete('/', passport.authenticate('jwt', {
    session: false
  }), function (req, res) {
    About.findOneAndRemove({}, function (error) {
      if (error) {
        errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
      } else {
        res.status(200).json({
          message: 'Do you not want me to know you!? T^T'
        });
      }
    });
  });

}

module.exports = function (fileManager) {
  setupRoutes(fileManager);
  return router;
};
