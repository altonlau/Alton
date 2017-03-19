/*
 * Author: Alton Lau
 * Date: March 6, 2017
 * File: about_controller.js
 * Description: About controller
 */

angular.module('altonApp').controller('AboutController', function ($scope, $timeout, aboutFactory, stateTransitionService, websiteService) {

  $scope.abouts = null;
  $scope.viewing = null;

  $scope.moveToHomePage = function () {
    $scope.abouts = null;

    $timeout(function () {
      stateTransitionService.transition('home');
    }, 200);
  };

  $scope.moveTo404Page = function () {
    stateTransitionService.transition('404');
  };

  $scope.viewAbout = function (index, about) {
    $scope.viewing.index = index;
    $scope.viewing.about = about;
  };

  function setup() {
    websiteService.maintenance().then(function (response) {
      if (response) {
        stateTransitionService.transition('home');
      } else {
        websiteService.load().then(function () {
          $scope.abouts = aboutFactory.getAll().map(function (about) {
            about.description = marked(about.description);
            return about;
          });
          $scope.viewing = {
            index: 0,
            about: $scope.abouts[0]
          };

          websiteService.enableStats().then(function (response) {
            if (response) {
              websiteService.viewed();
            }
          }, {});
        }, function () {
          $scope.moveTo404Page();
        });
      }
    }, function () {
      $scope.moveToHomePage();
    });
  }

  setup();

});
