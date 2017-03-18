/*
 * Author: Alton Lau
 * Date: March 8, 2017
 * File: skill_controller.js
 * Description: Skill controller
 */

angular.module('altonApp').controller('SkillController', function ($scope, $state, $timeout, skillFactory, websiteService) {

  var enableStats = null;

  $scope.skills = null;
  $scope.viewSkill = null;

  $scope.moveToHomePage = function () {
    $scope.skills = null;

    $timeout(function () {
      $state.go('home');
    }, 200);
  };

  $scope.toggleSkill = function (skill) {
    if ($scope.viewSkill === skill) {
      $scope.viewSkill = null;
    } else {
      $scope.viewSkill = skill;
      $scope.viewSkill.description = marked(skill.description);
      $('html, body').animate({
        scrollTop: 0
      });

      if (enableStats) {
        skillFactory.viewed(skill.id);
      }
    }
  };

  function setup() {
    websiteService.maintenance().then(function (response) {
      if (response) {
        $state.go('home');
      } else {
        websiteService.load().then(function () {
          $timeout(function () {
            $scope.skills = skillFactory.getAll();
            $scope.skills.forEach(function (skill, index) {
              $timeout(function () {
                skill.levelStyle = {
                  'width': skill.level * 100 + '%'
                };
              }, 500 * (index + 1));
            });
          }, 200);

          websiteService.enableStats().then(function (response) {
            enableStats = response;
            if (response) {
              websiteService.viewed();
            }
          }, {});
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
