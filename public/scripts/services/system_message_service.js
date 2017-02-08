/*
 * Author: Alton Lau
 * Date: February 8, 2017
 * File: system_message_service.js
 * Description: System message provider
 */

angular.module('altonApp').service('systemMessageService', function () {

  var systemMessage = $('<div class="system-message"></div>');
  var messageQueue = [];
  var messageType = {
    DEFAULT: 0,
    SUCCESS: 1,
    ERROR: 2
  };
  var messageShowing = false;
  systemMessage.css({
    'background': '#424242',
    'border-radius': '128px',
    'bottom': '16px',
    'box-shadow': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    'color': 'white',
    'font-size': '14px',
    'font-weight': '300',
    'padding': '8px 16px',
    'position': 'fixed',
    'left': '50%',
    'margin': '0 auto',
    'opacity': '0',
    'text-align': 'center',
    'transform': 'translate(-50%)',
    'width': '90%',
    'white-space': 'nowrap',
  });

  this.showMessage = function (message) {
    messageQueue.push({
      message: message,
      type: messageType.DEFAULT
    });
    showMessage();
  };

  this.showErrorMessage = function (message) {
    messageQueue.push({
      message: message,
      type: messageType.ERROR
    });
    showMessage();
  };

  this.showSuccessMessage = function (message) {
    messageQueue.push({
      message: message,
      type: messageType.SUCCESS
    });
    showMessage();
  };

  function showMessage() {
    if (!messageShowing) {
      var message = messageQueue.shift();

      messageShowing = true;
      systemMessage.html(message.message);
      if (message.type === messageType.ERROR) {
        systemMessage.css('background', '#EB7565');
      } else if (message.type === messageType.SUCCESS) {
        systemMessage.css('background', '#7BCAA5');
      } else {
        systemMessage.css('background', '#424242');
      }

      systemMessage.fadeTo(200, 0.87).delay(2000).fadeOut(200, function () {
        messageShowing = false;
        if (messageQueue.length) {
          showMessage();
        }
      });
    }
  }

  function resize() {
    var width = $(window).width();

    if (width < 576) {
      systemMessage.css('max-width', '560px');
    } else if (width < 768) {
      systemMessage.css('max-width', '752px');
    } else {
      systemMessage.css('width', 'auto');
    }
  }

  function setup() {
    if ($('body').children('.system-message').length) {
      systemMessage = $($('body').children('.system-message')[0]);
    } else {
      $('body').append(systemMessage);
    }
    resize();
  }

  $(window).resize(function () {
    resize();
  });

  setup();

});
