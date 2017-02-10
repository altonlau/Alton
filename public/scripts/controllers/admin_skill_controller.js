/*
 * Author: Alton Lau
 * Date: February 9, 2017
 * File: admin_skill_controller.js
 * Description: Admin skill controller
 */

angular.module('altonApp').controller('AdminSkillController', function ($scope, $timeout, skillFactory, systemMessageService) {

  var skillBallCount = 10;

  $scope.skills = null;

  $scope.adjustSkillLevel = function (skill, adjust) {
    skill.level = Math.round((skill.level + adjust) * 100) / 100;
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

  setup();

});
