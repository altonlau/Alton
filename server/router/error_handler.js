/*
 * Author: Alton Lau
 * Date: February 4, 2017
 * File: error_handler.js
 * Description: Error handler for all wrong routes or failed routes.
 */

 var ERROR_STATUS = {
   UNKNOWN: {
     code: 500,
     message: 'Whoops! D: Not sure what happened there...'
   },
   NOT_FOUND: {
     code: 400,
     message: 'Woah! I can\'t find what you\'re looking for ):'
   }
 };

 module.exports = {
   status: ERROR_STATUS,
   sendStatus: function(res, status) {
     res.status(status.code).json({
       message: status.message
     });
   }
 };
