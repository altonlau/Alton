/*
 * Author: Alton Lau
 * Date: February 7, 2017
 * File: admin_dashboard_controller.js
 * Description: Admin dashboard controller
 */

angular.module('altonApp').controller('AdminDashboardController', function ($scope, $timeout, projectFactory) {

  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var projectLoaded = false;

  $scope.calendar = {
    month: months[0],
    day: 0
  };
  $scope.projects = null;

  function setTime() {
    var date = new Date();

    $scope.calendar.month = months[date.getMonth()];
    $scope.calendar.day = date.getDate();
    $timeout(setTime, 1000);
  }

  function loaded() {
    if (projectLoaded) {
      $scope.projects = projectFactory.getAll();
    }
  }

  function setup() {
    setTime();
    projectFactory.load().then(function() {
      projectLoaded = true;
      loaded();
    }, function(response) {
      console.error(response);
    });
  }

  setup();

});
