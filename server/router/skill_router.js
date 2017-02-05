/*
 * Author: Alton Lau
 * Date: February 3, 2017
 * File: skill_router.js
 * Description: Skill router
 */

var express = require('express');
var router = express.Router();

// Skill API ===================================================================
// GET /api/skill
// POST /api/skill
// PUT /api/skill
// DELETE /api/skill

router.get('/', function (req, res) {
  res.json({
    message: 'hello'
  });
});

module.exports = router;
