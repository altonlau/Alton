/*
 * Author: Alton Lau
 * Date: March 18, 2017
 * File: project_views_model.js
 * Description: Project views model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Project = require('./project_model');

var projectViewsSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ProjectViews', projectViewsSchema);
