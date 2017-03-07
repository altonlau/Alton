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
    var name = req.query.name;
    var query = {};

    if (name) {
      query.name = name;
    }

    About.find(query, function (error, docs) {
      if (error) {
        errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
      } else if (docs && ((name && docs.length) || !name)) {
        var images = [];
        var results = [];
        docs.forEach(function (doc) {
          results.push({
            id: doc._id,
            name: doc.name,
            description: doc.description,
            icon: 'downloads/' + doc.icon
          });
          images = images.concat(doc.icon);
        });

        fileManager.get(images).then(function () {
          res.status(200).json(results);
        }, function () {
          errorHandler.sendStatus(res, errorHandler.status.DOWNLOAD_FAILED);
        });
      } else {
        errorHandler.sendStatus(res, errorHandler.status.NOT_FOUND);
      }
    });
  });

  router.post('/', fileManager.multer.single('icon'), passport.authenticate('jwt', {
    session: false
  }), function (req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var icon = req.file;

    if (name && description && icon) {
      fileManager.save([icon]).then(function () {
        var newAbout = new About({
          name: name,
          description: description,
          icon: icon.filename
        });

        fileManager.clearCache();
        newAbout.save(function (error) {
          if (error) {
            errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
          } else {
            res.status(201).json({
              message: 'Cool! I learned more about you!'
            });
          }
        });
      }, function () {
        fileManager.clearCache();
        errorHandler.sendStatus(res, errorHandler.status.UPLOAD_FAILED);
      });
    } else {
      var missingFields = [];

      if (!name) {
        missingFields.push('name');
      }
      if (!description) {
        missingFields.push('description');
      }
      if (!icon) {
        missingFields.push('icon');
      }

      fileManager.clearCache();
      errorHandler.sendStatus(res, errorHandler.status.MISSING_PARAMETERS, {
        fields: missingFields
      });
    }
  });

  router.put('/', fileManager.multer.single('icon'), passport.authenticate('jwt', {
    session: false
  }), function (req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var description = req.body.description;
    var icon = req.file;

    if (id) {
      fileManager.save(icon ? [icon] : []).then(function () {
        fileManager.clearCache();

        About.findById(id, function (error, doc) {
          if (error) {
            errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
          } else if (doc) {
            fileManager.delete(icon ? [doc.icon] : []).then(function () {
              if (name) {
                doc.name = name;
              }
              if (description) {
                doc.description = description;
              }
              if (icon) {
                doc.icon = icon.filename;
              }
              doc.save();
              res.status(200).json({
                message: 'Okay. People change. I hope it\'s a good change...'
              });
            }, function () {
              errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
            });
          } else {
            errorHandler.sendStatus(res, errorHandler.status.NOT_FOUND);
          }
        });
      }, function () {
        fileManager.clearCache();
        errorHandler.sendStatus(res, errorHandler.status.UPLOAD_FAILED);
      });
    } else {
      errorHandler.sendStatus(res, errorHandler.status.MISSING_PARAMETERS, {
        fields: 'id'
      });
    }
  });

  router.delete('/', passport.authenticate('jwt', {
    session: false
  }), function (req, res) {
    var id = req.body.id;

    if (id) {
      About.findById(id, function (error, doc) {
        if (error) {
          errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
        } else if (doc) {
          fileManager.delete([doc.icon]).then(function () {
            About.findByIdAndRemove(id, function (error) {
              if (error) {
                errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
              } else {
                res.status(200).json({
                  message: 'Do you not want me to know you!? T^T'
                });
              }
            });
          }, function () {
            errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
          });
        } else {
          errorHandler.sendStatus(res, errorHandler.status.NOT_FOUND);
        }
      });
    } else {
      errorHandler.sendStatus(res, errorHandler.status.MISSING_PARAMETERS, {
        fields: 'id'
      });
    }
  });

}

module.exports = function (fileManager) {
  setupRoutes(fileManager);
  return router;
};
