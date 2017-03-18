/*
 * Author: Alton Lau
 * Date: February 20, 2017
 * File: admin_project_controller.js
 * Description: Admin project controller
 */

angular.module('altonApp').controller('AdminProjectController', function ($q, $scope, $timeout, projectFactory, skillFactory, websiteService, systemMessageService) {

  $scope.projects = null;
  $scope.skills = null;

  $scope.toggleMenu = function (event) {
    event.stopPropagation();

    var menu = $($(event.currentTarget).siblings('.card-menu')[0]);

    if (!menu.hasClass('active')) {
      $('.card-menu').removeClass('active');
      menu.addClass('active');
    } else {
      $('.card-menu').removeClass('active');
    }
  };

  $scope.toggleEdit = function (project) {
    project.edit = true;
    $('.card-menu').removeClass('active');
  };

  $scope.newProjectClicked = function () {
    var project = {
      edit: true
    };
    $scope.projects.unshift(project);
  };

  // Project Editing Handlers

  $scope.filesSelected = function (element) {
    var index = parseInt(element.id.replace('file-', ''));
    $scope.projects[index].newImages = element.files;
  };

  $scope.deleteImage = function (index, project) {
    project.images.splice(index, 1);
  };

  // Project States Handlers

  $scope.deleteProject = function (project) {
    $('.card-menu').removeClass('active');

    projectFactory.delete(project).then(function (response) {
      systemMessageService.showSuccessMessage(response);
      loadWebsite(true);
    }, function (response) {
      systemMessageService.showErrorMessage(response);
    });
  };

  $scope.saveProject = function (event, project) {
    var projectSkills = $($(event.currentTarget).siblings('.project-skills')[0]);
    var selectedSkills = [];

    projectSkills.children('button').each(function (index, button) {
      if ($(button).hasClass('active')) {
        selectedSkills.push($scope.skills[index].id);
      }
    });

    project.skills = selectedSkills;

    projectFactory.save(project).then(function (response) {
      project.edit = false;
      systemMessageService.showSuccessMessage(response);
      loadWebsite(true);
    }, function (response) {
      systemMessageService.showErrorMessage(response);
    });
  };

  function loadWebsite(force) {
    websiteService.load(force).then(function () {
      $scope.projects = projectFactory.getAll().map(function (project) {
        project.views = projectFactory.views().filter(function (view) {
          return view.projectId === project.id;
        }).length;
        project.marked = marked(project.description);
        return project;
      });
      $scope.skills = skillFactory.getAll();
    }, function (response) {
      systemMessageService.showErrorMessage(response);
    });
  }

  function setup() {
    loadWebsite();
  }

  $(document).on('click', function (event) {
    if (!$(event.target).hasClass('card-menu') && !$(event.target).parents('.card-menu').length) {
      $('.card-menu').removeClass('active');
    }
  });

  setup();

});
