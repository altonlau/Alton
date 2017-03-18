/*
 * Author: Alton Lau
 * Date: February 4, 2017
 * File: home_controller.js
 * Description: Home controller
 */

angular.module('altonApp').controller('HomeController', function ($scope, stateTransitionService, websiteService) {

  var disableClick = false;

  $scope.maintenance = null;

  $scope.buttonHovered = function (event, over) {
    if (!$scope.mobile()) {
      var title = $($(event.currentTarget).siblings('.button-title')[0]);
      title.css('opacity', over ? 1 : 0);
    }
  };

  $scope.moveToAboutPage = function (event) {
    if (!disableClick) {
      disableClick = !disableClick;
      stateTransitionService.fadeTransition(event.currentTarget.parentNode, 'about');
    }
  };

  $scope.moveToProjectPage = function (event) {
    if (!disableClick) {
      disableClick = !disableClick;
      stateTransitionService.circularTransition(event.currentTarget, 'project');
    }
  };

  $scope.moveToSkillPage = function (event) {
    if (!disableClick) {
      disableClick = !disableClick;
      stateTransitionService.circularTransition(event.currentTarget, 'skill');
    }
  };

  function loadWebsite() {
    websiteService.maintenance().then(function (response) {
      $scope.maintenance = response;

      if (!$scope.maintenance) {
        websiteService.enableStats().then(function (response) {
          if (response) {
            websiteService.viewed();
          }
        }, {});
        websiteService.load().then({}, function () {
          // TODO: Whoops page.
        });
      }
    }, function () {
      $scope.maintenance = true;
    });
  }

  function setup() {
    loadWebsite();
  }

  setup();

});
