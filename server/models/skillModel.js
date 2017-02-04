'use strict';

/*
 * Author: Alton Lau
 * Date: February 3, 2017
 * File: models.js
 * Description: Skill model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var skillSchema = new Schema({
  name: String,
  level: Number
});

module.exports = mongoose.model('Skill', skillSchema);
