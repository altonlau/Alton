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
  },
  ALREADY_EXISTS: {
    code: 409,
    message: 'Oh noes! You already created something like this.'
  },
  MISSING_PARAMETERS: {
    code: 400,
    message: 'You\'re missing some fields.'
  },
  INVALID_PARAMETERS: {
    code: 400,
    message: 'You entered something wrong!'
  }
};

module.exports = {
  status: ERROR_STATUS,
  sendStatus: function (res, status, options) {
    if (status === ERROR_STATUS.MISSING_PARAMETERS || status === ERROR_STATUS.ALREADY_EXISTS) {
      res.status(status.code).json({
        message: status.message,
        fields: options.fields
      });
    } else if (status === ERROR_STATUS.INVALID_PARAMETERS) {
      res.status(status.code).json({
        message: status.message,
        invalid: options.invalid
      });
    } else {
      res.status(status.code).json({
        message: status.message
      });
    }
  }
};
