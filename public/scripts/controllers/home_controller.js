/*
 * Author: Alton Lau
 * Date: February 4, 2017
 * File: home_controller.js
 * Description: Home controller
 */

angular.module('altonApp').controller('HomeController', function ($scope, websiteService) {

  $scope.maintenance = null;

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
