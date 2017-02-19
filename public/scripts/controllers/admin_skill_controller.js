/*
 * Author: Alton Lau
 * Date: February 9, 2017
 * File: admin_skill_controller.js
 * Description: Admin skill controller
 */

angular.module('altonApp').controller('AdminSkillController', function ($scope, $timeout, skillFactory, systemMessageService) {

  var skillBallCount = 10;

  $scope.skills = null;

  $scope.toggleMenu = function (event) {
    event.stopPropagation();

    var menu = $($(event.currentTarget).siblings('.card-menu')[0]);
    $('.card-menu').removeClass('active');
    menu.toggleClass('active');
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

    skillFactory.delete(skill).then(function (response) {
      systemMessageService.showSuccessMessage(response);
      loadSkills();
    }, function (response) {
      systemMessageService.showErrorMessage(response);
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

  function loadSkills() {
    skillFactory.load().then(function () {
      $scope.skills = skillFactory.getAll();
    }, function (response) {
      systemMessageService.showErrorMessage(response);
    });
  }

  function setup() {
    loadSkills();
  }

  $(document).on('click', function (event) {
    if (!$(event.target).hasClass('card-menu') && !$(event.target).parents('.card-menu').length) {
      $('.card-menu').removeClass('active');
    }
  });

  setup();

});
