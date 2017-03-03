/*
 * Author: Alton Lau
 * Date: February 6, 2017
 * File: account_service.js
 * Description: Account service
 */

angular.module('altonApp').service('accountService', function ($cookies, $q, apiService) {

  var cookieUser = 'user';
  var cookieToken = 'token';

  this.login = function (name, password) {
    var defer = $q.defer();
    var data = {
      name: name,
      password: password
    };

    apiService.post(data, apiService.endpoints.POST.AUTHENTICATE).then(function (response) {
      var token = response.data.token;
      var user = response.data.user;
      var date = new Date();
      date.setDate(date.getDate() + 1);
      $cookies.put(cookieToken, token, {
        expires: date
      });
      $cookies.put(cookieUser, JSON.stringify(user), {
        expires: date
      });
      defer.resolve();
    }, function (response) {
      defer.reject(response.data.message);
    });

    return defer.promise;
  };

  this.logout = function () {
    $cookies.remove(cookieToken);
  };

  this.isLoggedIn = function () {
    var token = $cookies.get(cookieToken);
    return !!token;
  };

  this.updateProfile = function (firstName, lastName) {
    var defer = $q.defer();
    var data = {
      id: this.getProfile().id,
      firstName: firstName,
      lastName: lastName
    };

    apiService.put(data, apiService.endpoints.PUT.USER, this.getToken()).then(function (response) {
      var date = new Date();
      date.setDate(date.getDate() + 1);
      $cookies.put(cookieUser, JSON.stringify(data), {
        expires: date
      });
      defer.resolve(response.data.message);
    }, function (response) {
      defer.reject(response.data.message);
    });

    return defer.promise;
  };

  this.getProfile = function () {
    return JSON.parse($cookies.get(cookieUser));
  };

  this.getToken = function () {
    return $cookies.get(cookieToken);
  };

});
