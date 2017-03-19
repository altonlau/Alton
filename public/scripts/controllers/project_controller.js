/*
 * Author: Alton Lau
 * Date: March 17, 2017
 * File: project_controller.js
 * Description: Project controller
 */

angular.module('altonApp').controller('ProjectController', function ($scope, $timeout, projectFactory, skillFactory, stateTransitionService, websiteService) {

  var enableStats = null;
  var viewing = null;
  var minimumVisiblePercentage = 0.6;

  $scope.projects = null;
  $scope.skills = null;

  $scope.currentPage = 0;
  $scope.pageSize = 0;
  $scope.numberOfPages = 0;

  $scope.moveToHomePage = function () {
    $scope.projects = null;

    $timeout(function () {
      stateTransitionService.transition('home');
    }, 200);
  };

  $scope.moveTo404Page = function () {
    stateTransitionService.transition('404');
  };

  $scope.changePage = function (next) {
    $scope.currentPage += next ? 1 : -1;
  };

  $scope.viewProject = function (project) {
    $('html, body').animate({
      scrollTop: $('#' + project.id).offset().top
    });
  };

  $scope.scrollToTop = function () {
    $('html, body').animate({
      scrollTop: 0
    });
  };

  function getPageSize() {
    if ($(window).width < 768) {
      return 6;
    }

    return 12;
  }

  function startStatistics() {
    if (enableStats) {
      var windowHeight = $(window).height();
      var windowOffsetTop = $(window).scrollTop();
      var project = null;

      $('.project').each(function (index, element) {
        var percentageVisible = Math.max(0, (windowOffsetTop + windowHeight - $(element).offset().top) / windowHeight);

        if (percentageVisible > minimumVisiblePercentage) {
          project = $scope.projects[index];
        }
      });

      if (project) {
        if (viewing && project.id === viewing.project) {
          viewing.count++;
        } else {
          viewing = {
            count: 1,
            project: project.id
          };
        }

        // Viewed for at least 3 seconds
        if (viewing.count >= 3) {
          projectFactory.viewed(viewing.project);
        }
      }

      $timeout(startStatistics, 1000);
    }
  }

  function setup() {
    websiteService.maintenance().then(function (response) {
      if (response) {
        stateTransitionService.transition('home');
      } else {
        websiteService.load().then(function () {
          $scope.projects = projectFactory.getAll().map(function (project) {
            project.description = marked(project.description);
            return project;
          });
          $scope.pageSize = $(window).width() < 768 ? 6 : 12;
          $scope.numberOfPages = Math.ceil($scope.projects.length / $scope.pageSize);

          $scope.skills = skillFactory.getAll();

          websiteService.enableStats().then(function (response) {
            enableStats = response;
            if (response) {
              websiteService.viewed();
              startStatistics();
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

  $scope.$on('$stateChangeStart', function () {
    enableStats = false;
  });

  $(window).resize(function () {
    if ($scope.projects) {
      $scope.$apply(function () {
        $scope.pageSize = $(window).width() < 768 ? 6 : 12;
        $scope.numberOfPages = Math.ceil($scope.projects.length / $scope.pageSize);

        if ($scope.currentPage >= $scope.numberOfPages) {
          $scope.currentPage = $scope.numberOfPages - 1;
        }
      });
    }
  });

  setup();

});

angular.module('altonApp').filter('startFrom', function () {
  return function (input, start) {
    start = +start; //parse to int
    return input.slice(start);
  };
});
