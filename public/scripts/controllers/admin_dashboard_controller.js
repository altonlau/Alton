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

  $scope.chartIntervals = ['Hourly', 'Daily', 'Monthly'];
  $scope.currentProjectInterval = 'Hourly';
  $scope.currentSkillInterval = 'Hourly';
  $scope.currentWebsiteInterval = 'Hourly';
  $scope.projectChart = null;
  $scope.skillChart = null;
  $scope.websiteChart = null;

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

  $scope.buildProjectChart = function (interval ,event) {
    $scope.currentProjectInterval = interval
    if (event) {
      event.preventDefault();
    }

    var now = new Date();
    var x = [];
    var y = [];

    if ($scope.currentProjectInterval === $scope.chartIntervals[0]) {
      // Get the last 12 hours
      for (var i = 0; i < 12; i++) {
        var date = new Date(now.toString());
        date.setHours(date.getHours() - 11 + i);

        var views = $scope.stats.projectViews.filter(function (view) {
          var viewDate = new Date(view.date);
          return date.getHours() === viewDate.getHours() &&
            date.getDate() === viewDate.getDate() &&
            date.getMonth() === viewDate.getMonth() &&
            date.getYear() === viewDate.getYear();
        }).length;
        x.push(date.getHours());
        y.push(views);
      }
    } else if ($scope.currentProjectInterval === $scope.chartIntervals[1]) {
      // Get the last 7 days
      var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (var i = 0; i < 7; i++) {
        var date = new Date(now.toString());
        date.setDate(date.getDate() - 6 + i);

        var views = $scope.stats.projectViews.filter(function (view) {
          var viewDate = new Date(view.date);
          return date.getDate() === viewDate.getDate() &&
            date.getMonth() === viewDate.getMonth() &&
            date.getYear() === viewDate.getYear();
        }).length;
        x.push(days[date.getDay()]);
        y.push(views);
      }
    } else {
      // Get the last 12 months
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (var i = 0; i < 12; i++) {
        var date = new Date(now.toString());
        date.setMonth(date.getMonth() - 11 + i);

        var views = $scope.stats.projectViews.filter(function (view) {
          var viewDate = new Date(view.date);
          return date.getMonth() === viewDate.getMonth() &&
            date.getYear() === viewDate.getYear();
        }).length;
        x.push(months[date.getMonth()]);
        y.push(views);
      }
    }

    $scope.projectChart = {
      labels: x,
      data: [y]
    };
  };

  $scope.buildSkillChart = function (interval ,event) {
    $scope.currentSkillInterval = interval
    if (event) {
      event.preventDefault();
    }

    var now = new Date();
    var x = [];
    var y = [];

    if ($scope.currentSkillInterval === $scope.chartIntervals[0]) {
      // Get the last 12 hours
      for (var i = 0; i < 12; i++) {
        var date = new Date(now.toString());
        date.setHours(date.getHours() - 11 + i);

        var views = $scope.stats.skillViews.filter(function (view) {
          var viewDate = new Date(view.date);
          return date.getHours() === viewDate.getHours() &&
            date.getDate() === viewDate.getDate() &&
            date.getMonth() === viewDate.getMonth() &&
            date.getYear() === viewDate.getYear();
        }).length;
        x.push(date.getHours());
        y.push(views);
      }
    } else if ($scope.currentSkillInterval === $scope.chartIntervals[1]) {
      // Get the last 7 days
      var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (var i = 0; i < 7; i++) {
        var date = new Date(now.toString());
        date.setDate(date.getDate() - 6 + i);

        var views = $scope.stats.skillViews.filter(function (view) {
          var viewDate = new Date(view.date);
          return date.getDate() === viewDate.getDate() &&
            date.getMonth() === viewDate.getMonth() &&
            date.getYear() === viewDate.getYear();
        }).length;
        x.push(days[date.getDay()]);
        y.push(views);
      }
    } else {
      // Get the last 12 months
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (var i = 0; i < 12; i++) {
        var date = new Date(now.toString());
        date.setMonth(date.getMonth() - 11 + i);

        var views = $scope.stats.skillViews.filter(function (view) {
          var viewDate = new Date(view.date);
          return date.getMonth() === viewDate.getMonth() &&
            date.getYear() === viewDate.getYear();
        }).length;
        x.push(months[date.getMonth()]);
        y.push(views);
      }
    }

    $scope.skillChart = {
      labels: x,
      data: [y]
    };
  };

  $scope.buildWebsiteChart = function (interval ,event) {
    $scope.currentWebsiteInterval = interval
    if (event) {
      event.preventDefault();
    }

    var now = new Date();
    var x = [];
    var y = [];

    if ($scope.currentWebsiteInterval === $scope.chartIntervals[0]) {
      // Get the last 12 hours
      for (var i = 0; i < 12; i++) {
        var date = new Date(now.toString());
        date.setHours(date.getHours() - 11 + i);

        var views = $scope.stats.websiteViews.filter(function (view) {
          var viewDate = new Date(view.date);
          return date.getHours() === viewDate.getHours() &&
            date.getDate() === viewDate.getDate() &&
            date.getMonth() === viewDate.getMonth() &&
            date.getYear() === viewDate.getYear();
        }).length;
        x.push(date.getHours());
        y.push(views);
      }
    } else if ($scope.currentWebsiteInterval === $scope.chartIntervals[1]) {
      // Get the last 7 days
      var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (var i = 0; i < 7; i++) {
        var date = new Date(now.toString());
        date.setDate(date.getDate() - 6 + i);

        var views = $scope.stats.websiteViews.filter(function (view) {
          var viewDate = new Date(view.date);
          return date.getDate() === viewDate.getDate() &&
            date.getMonth() === viewDate.getMonth() &&
            date.getYear() === viewDate.getYear();
        }).length;
        x.push(days[date.getDay()]);
        y.push(views);
      }
    } else {
      // Get the last 12 months
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (var i = 0; i < 12; i++) {
        var date = new Date(now.toString());
        date.setMonth(date.getMonth() - 11 + i);

        var views = $scope.stats.websiteViews.filter(function (view) {
          var viewDate = new Date(view.date);
          return date.getMonth() === viewDate.getMonth() &&
            date.getYear() === viewDate.getYear();
        }).length;
        x.push(months[date.getMonth()]);
        y.push(views);
      }
    }

    $scope.websiteChart = {
      labels: x,
      data: [y]
    };
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

      $scope.buildProjectChart($scope.currentProjectInterval);
      $scope.buildSkillChart($scope.currentSkillInterval);
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

      $scope.buildWebsiteChart($scope.currentWebsiteInterval);
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
