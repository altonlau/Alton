/*
 * Author: Alton Lau
 * Date: March 18, 2017
 * File: skill_views_model.js
 * Description: Skill views model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Skill = require('./skill_model');

var skillViewsSchema = new Schema({
  skillId: {
    type: Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SkillViews', skillViewsSchema);
