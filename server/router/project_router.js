/*
 * Author: Alton Lau
 * Date: February 5, 2017
 * File: project_router.js
 * Description: Project router
 */

var express = require('express');
var passport = require('passport');
var router = express.Router();

var errorHandler = require('./error_handler');
var Project = require('../models/project_model');
var Skill = require('../models/skill_model');

// About API ===================================================================
// GET /api/project
// POST /api/project
// PUT /api/project
// DELETE /api/project
// POST /api/project/viewed

function setupRoutes(fileManager) {

  router.get('/', function (req, res) {
    var name = req.query.name;
    var query = {};

    if (name) {
      query.name = name;
    }

    Project.find(query, function (error, docs) {
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
            images: doc.images.map(function (image) {
              return 'downloads/' + image;
            }),
            skills: doc.skills,
            views: doc.views
          });
          images = images.concat(doc.images);
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

  router.post('/', fileManager.multer.array('images'), passport.authenticate('jwt', {
    session: false
  }), function (req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var imageFiles = req.files;
    var images = [];
    var skills = JSON.parse(req.body.skills || '[]');

    if (name && description) {
      Skill.find({}, function (error, docs) {
        if (error) {
          fileManager.clearCache();
          errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
        } else if (docs) {
          var skillsExist = true;
          var docSkills = docs.map(function (doc) {
            return '' + doc._id;
          });

          if (skills && skills.length) {
            skills.forEach(function (skill) {
              if (docSkills.indexOf(skill) < 0) {
                skillsExist = false;
              }
            });
          }

          if (skillsExist) {
            imageFiles.forEach(function (file) {
              images.push(file.filename);
            });

            fileManager.save(imageFiles).then(function () {
              var newProject = new Project({
                name: name,
                description: description,
                images: images || [],
                skills: skills || []
              });

              fileManager.clearCache();
              newProject.save(function (error) {
                if (error) {
                  errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
                } else {
                  res.status(201).json({
                    message: 'Yay you got a new project in your portfolio!'
                  });
                }
              });
            }, function () {
              fileManager.clearCache();
              errorHandler.sendStatus(res, errorHandler.status.UPLOAD_FAILED);
            });
          } else {
            fileManager.clearCache();
            errorHandler.sendStatus(res, errorHandler.status.INVALID_PARAMETERS, {
              invalid: 'You do not possess some of these skills. Go earn those before creating this project.'
            });
          }
        } else {
          fileManager.clearCache();
          errorHandler.sendStatus(res, errorHandler.status.INVALID_PARAMETERS, {
            invalid: 'You do not have any skills. Go get some ;)'
          });
        }
      });
    } else {
      var missingFields = [];

      if (!name) {
        missingFields.push('name');
      }
      if (!description) {
        missingFields.push('description');
      }

      fileManager.clearCache();
      errorHandler.sendStatus(res, errorHandler.status.MISSING_PARAMETERS, {
        fields: missingFields
      });
    }
  });

  router.put('/', fileManager.multer.array('images'), passport.authenticate('jwt', {
    session: false
  }), function (req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var description = req.body.description;
    var imageFiles = req.files;
    var images = JSON.parse(req.body.existingImages || '[]').map(function (image) {
      return image.replace('downloads/', '');
    });
    var skills = JSON.parse(req.body.skills || '[]');
    var update = {};

    if (id) {
      Skill.find({}, function (error, docs) {
        if (error) {
          fileManager.clearCache();
          errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
        } else if (docs) {
          var skillsExist = true;
          var docSkills = docs.map(function (doc) {
            return '' + doc._id;
          });

          if (skills && skills.length) {
            skills.forEach(function (skill) {
              if (docSkills.indexOf(skill) < 0) {
                skillsExist = false;
              }
            });
          }

          if (skillsExist) {
            imageFiles.forEach(function (file) {
              images.push(file.filename);
            });

            fileManager.save(imageFiles).then(function () {
              fileManager.clearCache();

              Project.findById(id, function (error, doc) {
                if (error) {
                  errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
                } else if (doc) {
                  var removeImages = [];

                  doc.images.forEach(function (image) {
                    if (images.indexOf(image) < 0) {
                      removeImages.push(image);
                    }
                  });

                  fileManager.delete(removeImages).then(function () {
                    if (name) {
                      doc.name = name;
                    }
                    if (description) {
                      doc.description = description;
                    }
                    if (images) {
                      doc.images = images;
                    }
                    if (skills) {
                      doc.skills = skills;
                    }
                    doc.save();
                    res.status(200).json({
                      message: 'I did it! I just updated your project! :)'
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
            fileManager.clearCache();
            errorHandler.sendStatus(res, errorHandler.status.INVALID_PARAMETERS, {
              invalid: 'You do not possess some of these skills. Go earn those before creating this project.'
            });
          }
        } else {
          fileManager.clearCache();
          errorHandler.sendStatus(res, errorHandler.status.INVALID_PARAMETERS, {
            invalid: 'You do not have any skills. Go get some ;)'
          });
        }
      });
    } else {
      fileManager.clearCache();
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
      Project.findById(id, function (error, doc) {
        if (error) {
          errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
        } else if (doc) {
          fileManager.delete(doc.images).then(function () {
            Project.findByIdAndRemove(id, function (error) {
              if (error) {
                errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
              } else {
                res.status(200).json({
                  message: 'Oh no! You have one less project now. D:'
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

  router.post('/viewed', function (req, res) {
    var id = req.body.id;

    if (id) {
      Project.findById(id, function(error, doc) {
        if (error) {
          errorHandler.sendStatus(res, errorHandler.status.UNKNOWN);
        } else if (doc) {
          doc.views++;
          doc.save();
          res.status(200).json({
            message: 'Awesome! One more view for your project!'
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
