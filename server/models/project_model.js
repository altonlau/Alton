/*
 * Author: Alton Lau
 * Date: February 5, 2017
 * File: project_model.js
 * Description: Project model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Skill = require('./skill_model');

var projectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [String],
  skills: [{
    type: Schema.Types.ObjectId,
    ref: 'Skill'
  }],
  views: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Project', projectSchema);
