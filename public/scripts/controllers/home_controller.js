/*
 * Author: Alton Lau
 * Date: February 4, 2017
 * File: home_controller.js
 * Description: Home controller
 */

angular.module('altonApp').controller('HomeController', function ($cookies, $scope, $state, $timeout, stateTransitionService, websiteService) {

  var cookieMute = 'mute_alton';
  var disableClick = false;
  var speechList = [{
    text: 'Hello! I\'m Alton Lau!',
    next: 1
  }, {
    text: 'Click any button including me!',
    next: null,
  }, {
    text: 'How is your day today?',
    next: null
  }, {
    text: 'I\'m a mobile developer.',
    next: null
  }];
  var prevSpeech = null;

  $scope.maintenance = null;
  $scope.speech = null;
  $scope.mute = JSON.parse($cookies.get(cookieMute) || false);

  $scope.buttonHovered = function (event, over) {
    if (!$scope.mobile()) {
      var title = $($(event.currentTarget).siblings('.button-title')[0]);
      title.css('opacity', over ? 1 : 0);
    }
  };

  $scope.moveToAboutPage = function (event) {
    if (!disableClick) {
      disableClick = !disableClick;
      stateTransitionService.fadeTransition(event.currentTarget.parentNode, 'about');
    }
  };

  $scope.moveToProjectPage = function (event) {
    if (!disableClick) {
      disableClick = !disableClick;
      stateTransitionService.circularTransition(event.currentTarget, 'project');
    }
  };

  $scope.moveToSkillPage = function (event) {
    if (!disableClick) {
      disableClick = !disableClick;
      stateTransitionService.circularTransition(event.currentTarget, 'skill');
    }
  };

  $scope.moveTo404Page = function () {
    stateTransitionService.transition('404');
  };

  $scope.toggleMute = function () {
    $scope.mute = !$scope.mute;
    $cookies.put(cookieMute, JSON.stringify($scope.mute));

    if ($scope.mute) {
      $scope.speech = null;
    } else {
      cycleSpeech();
    }
  };

  function cycleSpeech() {
    var delay;

    if (!$scope.mute && $state.is('home')) {
      if ($scope.speech) {
        delay = $scope.speech.next ? 500 : randomNumber(5000, 10000);
        prevSpeech = $scope.speech;
        $scope.speech = null;
      } else {
        delay = 5000;
        $scope.speech = speechList[prevSpeech ? prevSpeech.next || randomNumber(1, speechList.length) : 0];
      }

      $timeout(function () {
        cycleSpeech();
      }, delay);
    }
  }

  function randomNumber(min, max) {
    return Math.floor(Math.random() * max) + min;
  }

  function loadWebsite() {
    websiteService.maintenance().then(function (response) {
      $scope.maintenance = response;

      if (!$scope.maintenance) {
        websiteService.enableStats().then(function (response) {
          if (response) {
            websiteService.viewed();
          }
        }, {});
        websiteService.load().then(function () {
          $timeout(function () {
            cycleSpeech();
          }, 2000);
          $timeout(function () {
            $scope.canStopTalking = true;
          }, 60000);
        }, function () {
          $scope.moveTo404Page();
        });
      }
    }, function () {
      $scope.maintenance = true;
    });
  }

  function setup() {
    loadWebsite();
  }

  setup();

});
