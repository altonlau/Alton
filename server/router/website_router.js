/*
 * Author: Alton Lau
 * Date: February 5, 2017
 * File: website_router.js
 * Description: Website router
 */

var express = require('express');
var passport = require('passport');
var router = express.Router();

var errorHandler = require('./error_handler');
var Website = require('../models/website_model');
var WebsiteViews = require('../models/website_views_model');

// Website API ===================================================================
// GET /api/website/maintenance
// GET /api/website/enableStats
// GET /api/website/views
// POST /api/website/maintenance
// POST /api/website/enableStats
// POST /api/website/viewed

function setupRoutes(fileManager) {

  router.get('/maintenance', function (req, res) {
    var name = 'maintenance';

    Website.findOne({
      name: name
    }, function (error, doc) {
      if (error) {
        errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
      } else if (doc) {
        res.status(200).json(doc.value);
      } else {
        res.status(200).json(false);
      }
    });
  });

  router.get('/enableStats', function (req, res) {
    var name = 'enableStats';

    Website.findOne({
      name: name
    }, function (error, doc) {
      if (error) {
        errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
      } else if (doc) {
        res.status(200).json(doc.value);
      } else {
        res.status(200).json(false);
      }
    });
  });

  router.get('/views', passport.authenticate('jwt', {
    session: false
  }), function (req, res) {
    WebsiteViews.find({}, function (error, docs) {
      if (error) {
        errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
      } else {
        res.status(200).json(docs);
      }
    });
  });

  router.post('/maintenance', passport.authenticate('jwt', {
    session: false
  }), function (req, res) {
    var name = 'maintenance';
    var value = req.body.value;

    Website.findOne({
      name: name
    }, function (error, doc) {
      if (error) {
        errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
      } else if (doc) {
        doc.value = value;
        doc.save();
        res.status(200).json({
          message: 'Maintenance set to \'' + value + '\'.'
        });
      } else {
        var newWebsite = new Website({
          name: name,
          value: value
        });

        newWebsite.save(function (error) {
          if (error) {
            errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
          } else {
            res.status(200).json({
              message: 'Maintenance set to \'' + value + '\'.'
            });
          }
        });
      }
    });
  });

  router.post('/enableStats', passport.authenticate('jwt', {
    session: false
  }), function (req, res) {
    var name = 'enableStats';
    var value = req.body.value;

    Website.findOne({
      name: name
    }, function (error, doc) {
      if (error) {
        errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
      } else if (doc) {
        doc.value = value;
        doc.save();
        res.status(200).json({
          message: 'Enable stats set to \'' + value + '\'.'
        });
      } else {
        var newWebsite = new Website({
          name: name,
          value: value
        });

        newWebsite.save(function (error) {
          if (error) {
            errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
          } else {
            res.status(200).json({
              message: 'Enable stats set to \'' + value + '\'.'
            });
          }
        });
      }
    });
  });

  router.post('/viewed', function (req, res) {
    var newView = new WebsiteViews();

    newView.save(function (error) {
      if (error) {
        errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
      } else {
        res.status(200).json({
          message: 'Wow! One more new view for you!'
        });
      }
    });
  });

}

module.exports = function (fileManager) {
  setupRoutes(fileManager);
  return router;
};
