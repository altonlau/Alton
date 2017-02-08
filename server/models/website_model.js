/*
 * Author: Alton Lau
 * Date: February 8, 2017
 * File: website_model.js
 * Description: Website model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var websiteSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  value: {
    type: Schema.Types.Mixed,
    required: true
  }
});

module.exports = mongoose.model('Website', websiteSchema);
