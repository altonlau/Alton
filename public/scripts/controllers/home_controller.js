/*
 * Author: Alton Lau
 * Date: February 4, 2017
 * File: home_controller.js
 * Description: Home controller
 */

angular.module('altonApp').controller('HomeController', function ($scope, aboutFactory, projectFactory, stateTransitionService, websiteService) {

  var aboutLoaded = 0;
  var projectLoaded = 0;
  var statsLoaded = 0;
  var loadTimeout = 10;
  var disableClick = false;

  $scope.loaded = false;
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

  function loadImages() {
    if (aboutLoaded === loadTimeout && projectLoaded === loadTimeout) {
      loaded();
      return;
    }

    if (aboutLoaded !== loadTimeout) {
      aboutFactory.load().then(function () {
        aboutLoaded = loadTimeout;
        loaded();
      }, function () {
        aboutLoaded++;
        loadImages();
      });
    }

    if (projectLoaded !== loadTimeout) {
      projectFactory.load().then(function () {
        projectLoaded = loadTimeout;
        loaded();
      }, function () {
        projectLoaded++;
        loadImages();
      });
    }
  }

  function loadWebsiteStats() {
    websiteService.maintenance().then(function (response) {
      $scope.maintenance = response;
      statsLoaded = loadTimeout;
      loaded();
    }, function () {
      $scope.maintenance = true;
      statsLoaded = loadTimeout;
      loaded();
    });
  }

  function loaded() {
    if (aboutLoaded === loadTimeout && projectLoaded === loadTimeout && statsLoaded === loadTimeout) {
      $scope.loaded = true
    }
  }

  function setup() {
    loadImages();
    loadWebsiteStats();
  }

  setup();

});
