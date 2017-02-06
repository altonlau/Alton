/*
 * Author: Alton Lau
 * Date: February 4, 2017
 * File: user_router.js
 * Description: User router
 */

var express = require('express');
var passport = require('passport');
var router = express.Router();

var errorHandler = require('./error_handler');
var User = require('../models/user_model');

// User API ====================================================================
// GET /api/user
// POST /api/user
// PUT /api/user
// DELETE /api/user

function setupRoutes(fileManager) {

  router.get('/', passport.authenticate('jwt', {
    session: false
  }), function (req, res) {
    var id = req.query.id;
    var name = req.query.name;
    var firstName = req.query.firstName;
    var lastName = req.query.lastName;
    var query = {};

    if (id) {
      query.id = id;
    }
    if (name) {
      query.name = name;
    }
    if (firstName) {
      query.firstName = firstName;
    }
    if (lastName) {
      query.lastName = lastName;
    }

    User.find(query, function (error, docs) {
      if (error) {
        errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
      } else if (docs && docs.length) {
        var results = [];
        docs.forEach(function (doc) {
          results.push({
            id: doc._id,
            name: doc.name,
            firstName: doc.firstName || '',
            lastName: doc.lastName || '',
            createdAt: doc.createdAt
          });
        });
        res.status(200).json(results);
      } else {
        errorHandler.sendStatus(res, errorHandler.status.NOT_FOUND);
      }
    });
  });

  router.post('/', function (req, res) {
    var name = req.body.name;
    var password = req.body.password;

    if (name && password) {
      var newUser = new User({
        name: name,
        password: password
      });

      newUser.save(function (error) {
        if (error) {
          errorHandler.sendStatus(res, errorHandler.status.ALREADY_EXISTS, {
            fields: {
              name: name
            }
          });
        } else {
          res.status(201).json({
            message: 'Successfully created new user \'' + name + '\'.'
          });
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

  router.put('/', passport.authenticate('jwt', {
    session: false
  }), function (req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var password = req.body.password;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;

    if (id) {
      User.findById(id, function (error, doc) {
        if (error) {
          errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
        } else if (doc) {
          if (name) {
            doc.name = name;
          }
          if (password) {
            doc.password = password;
          }
          if (firstName) {
            doc.firstName = firstName;
          }
          if (lastName) {
            doc.lastName = lastName;
          }
          doc.save();

          res.status(200).json({
            message: 'Successfully updated ' + doc.name + '.'
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

  router.delete('/', passport.authenticate('jwt', {
    session: false
  }), function (req, res) {
    var id = req.body.id;
    var password = req.body.password;

    if (id) {
      User.findById(id, function (error, doc) {
        if (error) {
          errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
        } else if (doc) {
          // Check if the password is correct.
          doc.comparePassword(password, function (error, match) {
            if (match && !error) {
              User.remove({
                _id: id
              }, function (error) {
                if (error) {
                  errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
                } else {
                  res.json({
                    message: 'Successfully deleted ' + doc.name
                  });
                }
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
