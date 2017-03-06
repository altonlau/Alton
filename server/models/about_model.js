/*
 * Author: Alton Lau
 * Date: February 5, 2017
 * File: about_model.js
 * Description: About model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var aboutSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('About', aboutSchema);
