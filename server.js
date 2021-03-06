/*
 * Author: Alton Lau
 * Date: February 3, 2017
 * File: server.js
 * Description: Link between front end and back end
 */

var express = require('express');
var app = express();

var backend = require('./server/app')(app);

app.use(express.static(__dirname + (process.env.ENVIRONMENT === 'production' ? '/dist' : '/public')));
app.use('/downloads', express.static(__dirname + '/downloads'));

backend.run();
