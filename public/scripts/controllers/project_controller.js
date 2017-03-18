/*
 * Author: Alton Lau
 * Date: March 17, 2017
 * File: project_controller.js
 * Description: Project controller
 */

angular.module('altonApp').controller('ProjectController', function ($scope, $state, $timeout, projectFactory, websiteService) {

  $scope.projects = null;

  $scope.moveToHomePage = function () {
    $scope.projects = null;

    $timeout(function () {
      $state.go('home');
    }, 200);
  };

  function setup() {
    websiteService.maintenance().then(function (response) {
      if (response) {
        $state.go('home');
      } else {
        websiteService.load().then(function () {
          $scope.projects = projectFactory.getAll();
        }, function () {
          // TODO: Whoops page.
        });
      }
    }, function () {
      $scope.moveToHomePage();
    });
  }

  setup();

});
