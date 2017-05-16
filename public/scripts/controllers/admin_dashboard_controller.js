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
  $scope.projectChart = 0;
  $scope.skillChart = 1;
  $scope.websiteChart = 2;

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

  $scope.buildChart = function (chart, interval, event) {
    if (event) {
      event.preventDefault();
    }

    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var now = new Date();
    var date;
    var views;
    var x = [];
    var y = [];
    var i = 0;

    if (chart === $scope.projectChart) {
      stats = $scope.stats.projectViews;
      $scope.currentProjectInterval = interval;
    } else if (chart === $scope.skillChart) {
      stats = $scope.stats.skillViews;
      $scope.currentSkillInterval = interval;
    } else {
      stats = $scope.stats.websiteViews;
      $scope.currentWebsiteInterval = interval;
    }

    if (interval === $scope.chartIntervals[0]) {
      // Get the last 12 hours
      for (i = 0; i < 12; i++) {
        date = new Date(now.toString());
        date.setHours(date.getHours() - 11 + i);
        views = filterHours(stats, date).length;
        x.push(date.getHours());
        y.push(views);
      }
    } else if (interval === $scope.chartIntervals[1]) {
      // Get the last 7 days
      for (i = 0; i < 7; i++) {
        date = new Date(now.toString());
        date.setDate(date.getDate() - 6 + i);
        views = filterDays(stats, date).length;
        x.push(days[date.getDay()]);
        y.push(views);
      }
    } else {
      // Get the last 12 months
      for (i = 0; i < 12; i++) {
        date = new Date(now.toString());
        date.setMonth(date.getMonth() - 11 + i);
        views = filterMonths(stats, date).length;
        x.push(months[date.getMonth()]);
        y.push(views);
      }
    }

    if (chart === $scope.projectChart) {
      $scope.projectChart = {
        labels: x,
        data: [y]
      };
    } else if (chart === $scope.skillChart) {
      $scope.skillChart = {
        labels: x,
        data: [y]
      };
    } else {
      $scope.websiteChart = {
        labels: x,
        data: [y]
      };
    }
  };

  function filterHours(views, date) {
    if (views) {
      return views.filter(function (view) {
        var viewDate = new Date(view.date);
        return date.getHours() === viewDate.getHours() &&
          date.getDate() === viewDate.getDate() &&
          date.getMonth() === viewDate.getMonth() &&
          date.getYear() === viewDate.getYear();
      });
    }

    return [];
  }

  function filterDays(views, date) {
    if (views) {
      return views.filter(function (view) {
        var viewDate = new Date(view.date);
        return date.getDate() === viewDate.getDate() &&
          date.getMonth() === viewDate.getMonth() &&
          date.getYear() === viewDate.getYear();
      });
    }
    return [];
  }

  function filterMonths(views, date) {
    if (views) {
      return views.filter(function (view) {
        var viewDate = new Date(view.date);
        return date.getMonth() === viewDate.getMonth() &&
          date.getYear() === viewDate.getYear();
      });
    }
    return [];
  }

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

      $scope.buildChart($scope.projectChart, $scope.currentProjectInterval);
      $scope.buildChart($scope.skillChart, $scope.currentSkillInterval);
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

    websiteService.enableStats().then(function (response) {
      $scope.stats.enableStats = response;
    }, function (response) {
      systemMessageService.showErrorMessage(response);
    });

    websiteService.views().then(function (response) {
      $scope.stats.websiteViews = response;

      $scope.buildChart($scope.websiteChart, $scope.currentWebsiteInterval);
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
