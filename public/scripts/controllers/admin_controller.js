/*
 * Author: Alton Lau
 * Date: February 6, 2017
 * File: admin_controller.js
 * Description: Admin controller
 */

angular.module('altonApp').controller('AdminController', function ($scope, $state, accountService) {

  $scope.isLoggedIn = accountService.isLoggedIn();
  $scope.currentState = $state.current.name;

  $scope.loginForm = {
    name: null,
    password: null,
    error: ''
  };

  $scope.login = function () {
    var name = $scope.loginForm.name;
    var password = $scope.loginForm.password;

    if (name && password) {
      accountService.login(name, password).then(function () {
        $scope.isLoggedIn = accountService.isLoggedIn();
        if ($state.current.name === 'admin') {
          $state.go('admin.dashboard');
        }
      }, function (error) {
        $scope.loginForm.error = error;
      });
    } else {
      if (!name && !password) {
        $scope.loginForm.error = 'You\'re missing a Username and Password!';
      } else if (!name) {
        $scope.loginForm.error = 'You\'re missing a Username!';
      } else {
        $scope.loginForm.error = 'You\'re missing a Password!';
      }
    }
  };

  $scope.logout = function () {
    accountService.logout();
    $scope.loginForm = {
      name: null,
      password: null,
      error: ''
    };
    $scope.isLoggedIn = accountService.isLoggedIn();
    $state.go('admin');
  };

  function setup() {
    if ($scope.isLoggedIn && $state.is('admin')) {
      $state.go('admin.dashboard');
    }
  }

  $scope.$on('$stateChangeSuccess', function() {
    setup();
  });

  setup();

});
