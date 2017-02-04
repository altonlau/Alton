'use strict';

/*
 * Author: Alton Lau
 * Date: February 3, 2017
 * File: router.js
 * Description: Manages all routes accessing the web page
 */

var express = require('express');
var router = express.Router();

// Skill API ===================================================================
// GET /api/skill
// POST /api/skill
// PUT /api/skill
// DELETE /api/skill

router.get('/skill', function (req, res) {
  res.json({
    message: 'hello'
  });
});

module.exports = function (app) {
  app.use('/api', router);
};
