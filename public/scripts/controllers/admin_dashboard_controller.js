/*
 * Author: Alton Lau
 * Date: February 7, 2017
 * File: admin_dashboard_controller.js
 * Description: Admin dashboard controller
 */

angular.module('altonApp').controller('AdminDashboardController', function ($scope, $timeout, projectFactory, skillFactory, accountService, systemMessageService, websiteService) {

  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var projectLoaded = false;
  var skillLoaded = false;

  $scope.calendar = {
    month: months[0],
    day: 0
  };
  $scope.projects = null;
  $scope.skills = null;
  $scope.stats = {
    devMode: null,
    maintenance: null,
    views: null
  };
  $scope.user = null;

  $scope.updateDevMode = function() {
    websiteService.devMode($scope.stats.devMode);
  };

  $scope.updateMaintenance = function() {
    websiteService.maintenance($scope.stats.maintenance).then(function (response) {
      systemMessageService.showSuccessMessage(response);
    }, function(response) {
      systemMessageService.showErrorMessage(response);
    });
  };

  function setTime() {
    var date = new Date();

    $scope.calendar.month = months[date.getMonth()];
    $scope.calendar.day = date.getDate();
    $timeout(setTime, 1000);
  }

  function loadProjects() {
    projectFactory.load().then(function () {
      projectLoaded = true;
      $scope.projects = projectFactory.getAll();
    }, function (response) {
      systemMessageService.showErrorMessage(response);
    });
  }

  function loadSkills() {
    skillFactory.load().then(function () {
      skillLoaded = true;
      $scope.skills = skillFactory.getAll();
    }, function (response) {
      systemMessageService.showErrorMessage(response);
    });
  }

  function loadUser() {
    $scope.user = accountService.getProfile();
  }

  function loadWebsiteStats() {
    $scope.stats.devMode = websiteService.devMode();

    websiteService.maintenance().then(function (response) {
      $scope.stats.maintenance = response;
    }, function (response) {
      systemMessageService.showErrorMessage(response);
    });

    websiteService.views().then(function (response) {
      $scope.stats.views = response;
    }, function (response) {
      systemMessageService.showErrorMessage(response);
    });
  }

  function setup() {
    setTime();
    loadProjects();
    loadSkills();
    loadUser();
    loadWebsiteStats();
  }

  setup();

});
