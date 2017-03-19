/*
 * Author: Alton Lau
 * Date: March 6, 2017
 * File: state_transition_service.js
 * Description: Deals with state transitions with animation
 */

angular.module('altonApp').service('stateTransitionService', function ($state) {

  this.circularTransition = function (referenceElement, state) {
    var element = $(referenceElement);
    var parent = element.parent();
    var fill = $('<span></span>');

    fill.css({
      'background': element.css('background'),
      'border-radius': element.height() / 2,
      'height': element.height(),
      'position': 'absolute',
      'left': element.position().left + element.width() / 2,
      'top': element.position().top + element.height() / 2,
      'transform': 'translate(-50%, -50%)',
      'width': element.width(),
      'z-index': -1
    });

    fill.insertBefore(element);
    parent.css('z-index', 1);

    fill.animate({
      'border-radius': '200vh',
      'height': '400vh',
      'width': '400vh'
    }, 'slow', function () {
      $state.go(state);
    });
  };

  this.fadeTransition = function (referenceElement, state) {
    var element = $(referenceElement);

    element.fadeOut('fast', function () {
      $state.go(state);
    });
  };

  this.transition = function (state) {
    $state.go(state);
  };

});
