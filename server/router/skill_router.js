/*
 * Author: Alton Lau
 * Date: February 3, 2017
 * File: skill_router.js
 * Description: Skill router
 */

var express = require('express');
var passport = require('passport');
var router = express.Router();

var errorHandler = require('./error_handler');
var Skill = require('../models/skill_model');

// Skill API ===================================================================
// GET /api/skill
// POST /api/skill
// PUT /api/skill
// DELETE /api/skill

router.get('/', function (req, res) {
  var name = req.query.name;
  var query = {};

  if (name) {
    query.name = name;
  }

  Skill.find(query, function (error, docs) {
    if (error) {
      errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
    } else if (docs || docs.length) {
      var results = [];
      docs.forEach(function(doc) {
        results.push({
          id: doc._id,
          name: doc.name,
          level: doc.level
        });
      })
      res.status(200).json(results);
    } else {
      errorHandler.sendStatus(res, errorHandler.status.NOT_FOUND);
    }
  });
});

router.post('/', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  var name = req.body.name;
  var level = req.body.level;

  if (!name || !level) {
    var missingFields = [];

    if (!name) {
      missingFields.push('name');
    }
    if (!level) {
      missingFields.push('level');
    }

    errorHandler.sendStatus(res, errorHandler.status.MISSING_PARAMETERS, {
      fields: missingFields
    });
  } else {
    if (level >= 0 && level <= 1) {
      var newSkill = new Skill({
        name: name,
        level: level
      });

      newSkill.save(function (error) {
        if (error) {
          errorHandler.sendStatus(res, errorHandler.status.ALREADY_EXISTS, {
            fields: {
              name: name
            }
          });
        } else {
          res.status(201).json({
            message: 'Hooray! You\'ve learned a skill \'' + name + '\'.'
          });
        }
      });
    } else {
      errorHandler.sendStatus(res, errorHandler.status.INVALID_PARAMETERS, {
        invalid: 'Skill level must be between 0 and 1'
      });
    }
  }
});

router.put('/', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  var id = req.body.id;
  var name = req.body.name;
  var level = req.body.level;
  var update = {};

  if (id) {
    if (name) {
      update.name = name;
    }
    if (level) {
      update.level = level;
    }

    Skill.findByIdAndUpdate(id, update, function (error, doc) {
      if (error) {
        errorHandler.sendStatus(res, errorHandler.status.ALREADY_EXISTS, {
          fields: {
            name: update.name
          }
        });
      } else if (doc) {
        res.status(200).json({
          message: 'Finished updating your skill.'
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

  if (id) {
    Skill.findByIdAndRemove(id, function (error) {
      if (error) {
        errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
      } else {
        res.status(200).json({
          message: 'Goodbye skill, you weren\'t that great anyways.'
        });
      }
    });
  } else {
    errorHandler.sendStatus(res, errorHandler.status.MISSING_PARAMETERS, {
      fields: 'id'
    });
  }
});

module.exports = router;
