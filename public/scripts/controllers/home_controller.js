/*
 * Author: Alton Lau
 * Date: February 4, 2017
 * File: home_controller.js
 * Description: Home controller
 */

angular.module('altonApp').controller('HomeController', function ($scope, websiteService) {

  var disableClick = false;

  $scope.maintenance = null;

  $scope.buttonHovered = function (event, over) {
    if (!$scope.mobile()) {
      var title = $($(event.currentTarget).siblings('.button-title')[0]);
      title.css('opacity', over ? 1 : 0);
    }
  };

  $scope.moveToProjectPage = function (event) {
    if (!disableClick) {
      disableClick = !disableClick;

      var button = $(event.currentTarget);
      var parent = button.parent();

      var fill = $('<span></span>');
      fill.css({
        'background': button.css('background'),
        'border-radius': button.height() / 2,
        'height': button.height(),
        'position': 'absolute',
        'left': button.position().left + button.width() / 2,
        'top': button.position().top + button.height() / 2,
        'transform': 'translate(-50%, -50%)',
        'width': button.width(),
        'z-index': -1
      });

      fill.insertBefore(button);
      parent.css('z-index', 1);

      fill.animate({
        'border-radius': '200vh',
        height: '400vh',
        width: '400vh'
      }, 'slow', function () {
        // TODO: Move to project page
      });
    }
  };

  $scope.moveToSkillPage = function (event) {
    if (!disableClick) {
      disableClick = !disableClick;

      var button = $(event.currentTarget);
      var parent = button.parent();

      var fill = $('<span></span>');
      fill.css({
        'background': button.css('background'),
        'border-radius': button.height() / 2,
        'height': button.height(),
        'position': 'absolute',
        'left': button.position().left + button.width() / 2,
        'top': button.position().top + button.height() / 2,
        'transform': 'translate(-50%, -50%)',
        'width': button.width(),
        'z-index': -1
      });

      fill.insertBefore(button);
      parent.css('z-index', 1);

      fill.animate({
        'border-radius': '200vh',
        height: '400vh',
        width: '400vh'
      }, 'slow', function () {
        // TODO: Move to skill page
      });
    }
  };

  function loadWebsiteStats() {
    websiteService.maintenance().then(function (response) {
      $scope.maintenance = response;
    }, function () {
      $scope.maintenance = true;
    });
  }

  function setup() {
    loadWebsiteStats();
  }

  setup();

});
