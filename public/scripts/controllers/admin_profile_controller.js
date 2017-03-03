/*
 * Author: Alton Lau
 * Date: March 3, 2017
 * File: admin_profile_controller.js
 * Description: Admin profile controller
 */

angular.module('altonApp').controller('AdminProfileController', function ($scope, accountService, systemMessageService) {

  $scope.profile = null;

  $scope.saveProfile = function () {
    accountService.updateProfile($scope.profile.firstName, $scope.profile.lastName).then(function (response) {
      updateProfile();
      systemMessageService.showSuccessMessage(response);
    }, function (response) {
      systemMessageService.showErrorMessage(response);
    });
  };

  function updateProfile() {
    $scope.profile = accountService.getProfile();
  }

  function setup() {
    updateProfile();
  }

  setup();

});
