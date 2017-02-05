/*
 * Author: Alton Lau
 * Date: February 4, 2017
 * File: authenticate.js
 * Description: Passport handler
 */

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jwt-simple');

var User = require('./models/user_model');
var config = require('./config/passport');

module.exports = {
  init: function (passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
      User.findOne({
        id: jwt_payload.id
      }, function (err, user) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
    }));
  },
  generateToken: function (user) {
    return 'JWT ' + jwt.encode(user, config.secret);
  }
};
