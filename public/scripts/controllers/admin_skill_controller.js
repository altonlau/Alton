/*
 * Author: Alton Lau
 * Date: February 9, 2017
 * File: admin_skill_controller.js
 * Description: Admin skill controller
 */

angular.module('altonApp').controller('AdminSkillController', function ($q, $scope, $timeout, projectFactory, skillFactory, systemMessageService) {

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

  $scope.toggleEdit = function (skill) {
    skill.edit = true;
    $('.card-menu').removeClass('active');
  };

  $scope.newSkillClicked = function () {
    var skill = {
      edit: true,
      level: 0
    };
    $scope.skills.unshift(skill);
  };

  $scope.deleteSkill = function (skill) {
    $('.card-menu').removeClass('active');

    var promises = [];
    projectFactory.getAll().forEach(function (project) {
      var index = project.skills.indexOf(skill.id);
      if (index >= 0) {
        project.skills.splice(index, 1);
        promises.push(projectFactory.save(project));
      }
    });

    // Delete skills from the projects first
    $q.all(promises).then(function (responses) {
      skillFactory.delete(skill).then(function (response) {
        systemMessageService.showSuccessMessage(response);
        loadSkills();
      }, function (response) {
        systemMessageService.showErrorMessage(response);
      });
    }, function (responses) {
      systemMessageService.showErrorMessage(responses[0]);
    });
  };

  $scope.saveSkill = function (skill) {
    skillFactory.save(skill).then(function (response) {
      skill.edit = false;
      systemMessageService.showSuccessMessage(response);
      loadSkills();
    }, function (response) {
      systemMessageService.showErrorMessage(response);
    });
  };

  function loadProjects() {
    projectFactory.load().then({}, function (response) {
      systemMessageService.showErrorMessage(response);
    });
  }

  function loadSkills() {
    skillFactory.load().then(function () {
      $scope.skills = skillFactory.getAll().map(function (skill) {
        skill.marked = marked(skill.description);
        return skill;
      });
    }, function (response) {
      systemMessageService.showErrorMessage(response);
    });
  }

  function setup() {
    loadProjects();
    loadSkills();
  }

  $(document).on('click', function (event) {
    if (!$(event.target).hasClass('card-menu') && !$(event.target).parents('.card-menu').length) {
      $('.card-menu').removeClass('active');
    }
  });

  setup();

});
