/*
 * Author: Alton Lau
 * Date: February 3, 2017
 * File: skill_model.js
 * Description: Skill model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var skillSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  level: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Skill', skillSchema);
