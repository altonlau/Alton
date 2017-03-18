/*
 * Author: Alton Lau
 * Date: March 17, 2017
 * File: project_controller.js
 * Description: Project controller
 */

angular.module('altonApp').controller('ProjectController', function ($scope, $state, $timeout, projectFactory, skillFactory, websiteService) {

  $scope.projects = null;
  $scope.skills = null;

  $scope.moveToHomePage = function () {
    $scope.projects = null;

    $timeout(function () {
      $state.go('home');
    }, 200);
  };

  $scope.viewProject = function (project) {
    $('html, body').animate({
      scrollTop: $('#' + project.id).offset().top
    });
  };

  function setup() {
    websiteService.maintenance().then(function (response) {
      if (response) {
        $state.go('home');
      } else {
        websiteService.load().then(function () {
          $scope.projects = projectFactory.getAll().map(function (project) {
            project.description = marked(project.description);
            return project;
          });

          $scope.skills = skillFactory.getAll();
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
