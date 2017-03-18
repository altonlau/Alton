/*
 * Author: Alton Lau
 * Date: March 18, 2017
 * File: website_views_model.js
 * Description: Website views model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var webisteViewsSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WebsiteViews', webisteViewsSchema);
