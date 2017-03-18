/*
 * Author: Alton Lau
 * Date: February 7, 2017
 * File: admin_dashboard_controller.js
 * Description: Admin dashboard controller
 */

angular.module('altonApp').controller('AdminDashboardController', function ($scope, $timeout, projectFactory, skillFactory, accountService, systemMessageService, websiteService) {

  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  $scope.calendar = {
    month: months[0],
    day: 0
  };
  $scope.projects = null;
  $scope.skills = null;
  $scope.stats = {
    maintenance: null,
    enableStats: null,
    projectViews: null,
    skillViews: null,
    websiteViews: null
  };
  $scope.user = null;

  $scope.projectViews = function (project) {
    var views = $scope.stats.projectViews.filter(function (view) {
      return view.projectId === project.id;
    });
    return -views.length;
  };

  $scope.skillViews = function (skill) {
    var views = $scope.stats.skillViews.filter(function (view) {
      return view.skillId === skill.id;
    });
    return -views.length;
  };

  $scope.updateMaintenance = function () {
    websiteService.maintenance($scope.stats.maintenance).then(function (response) {
      systemMessageService.showSuccessMessage(response);
    }, function (response) {
      systemMessageService.showErrorMessage(response);
    });
  };

  $scope.updateEnableStats = function () {
    websiteService.enableStats($scope.stats.enableStats).then(function (response) {
      systemMessageService.showSuccessMessage(response);
    }, function (response) {
      systemMessageService.showErrorMessage(response);
    });
  };

  function setTime() {
    var date = new Date();

    $scope.calendar.month = months[date.getMonth()];
    $scope.calendar.day = date.getDate();
    $timeout(setTime, 1000);
  }

  function loadWebsite() {
    websiteService.load().then(function () {
      $scope.stats.projectViews = projectFactory.views();
      $scope.stats.skillViews = skillFactory.views();

      $scope.projects = projectFactory.getAll();
      $scope.skills = skillFactory.getAll();
    }, function (response) {
      systemMessageService.showErrorMessage(response);
    });
  }

  function loadUser() {
    $scope.user = accountService.getProfile();
  }

  function loadWebsiteStats() {
    websiteService.maintenance().then(function (response) {
      $scope.stats.maintenance = response;
    }, function (response) {
      systemMessageService.showErrorMessage(response);
    });

    websiteService.views().then(function (response) {
      $scope.stats.websiteViews = response;
    }, function (response) {
      systemMessageService.showErrorMessage(response);
    });
  }

  function setup() {
    setTime();
    loadWebsite();
    loadUser();
    loadWebsiteStats();
  }

  setup();

});
