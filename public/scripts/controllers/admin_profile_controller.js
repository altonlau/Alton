/*
 * Author: Alton Lau
 * Date: March 3, 2017
 * File: admin_profile_controller.js
 * Description: Admin profile controller
 */

angular.module('altonApp').controller('AdminProfileController', function ($sce, $scope, aboutFactory, accountService, systemMessageService) {

  $scope.abouts = null;
  $scope.profile = null;

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

  $scope.toggleEdit = function (about) {
    about.edit = true;
    $('.card-menu').removeClass('active');
  };

  $scope.newAboutClicked = function () {
    var about = {
      edit: true
    };
    $scope.abouts.unshift(about);
  };

  // About Editing Handlers

  $scope.fileSelected = function (element) {
    var index = parseInt(element.id.replace('file-', ''));

    if (element.files && element.files.length) {
      var url = URL.createObjectURL(element.files[0]);

      $scope.abouts[index].icon = element.files[0];
      $scope.$apply($scope.abouts[index].newIcon = $sce.trustAsResourceUrl(url));
    }
  };

  // About States Handlers

  $scope.deleteAbout = function (about) {
    $('.card-menu').removeClass('active');

    aboutFactory.delete(about).then(function (response) {
      systemMessageService.showSuccessMessage(response);
      loadAbouts();
    }, function (response) {
      systemMessageService.showErrorMessage(response);
    });
  };

  $scope.saveAbout = function (event, about) {
    aboutFactory.save(about).then(function (response) {
      about.edit = false;
      systemMessageService.showSuccessMessage(response);
      loadAbouts();
    }, function (response) {
      systemMessageService.showErrorMessage(response);
    });
  };

  $scope.saveProfile = function () {
    accountService.updateProfile($scope.profile.firstName, $scope.profile.lastName).then(function (response) {
      loadProfile();
      systemMessageService.showSuccessMessage(response);
    }, function (response) {
      systemMessageService.showErrorMessage(response);
    });
  };

  function loadAbouts() {
    aboutFactory.load().then(function () {
      $scope.abouts = aboutFactory.getAll().map(function (about) {
        about.marked = marked(about.description);
        return about;
      });
    }, function (response) {
      systemMessageService.showErrorMessage(response);
    });
  }

  function loadProfile() {
    $scope.profile = accountService.getProfile();
  }

  function setup() {
    loadAbouts();
    loadProfile();
  }

  setup();

});
