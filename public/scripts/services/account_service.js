/*
 * Author: Alton Lau
 * Date: February 6, 2017
 * File: account_service.js
 * Description: Account service
 */

angular.module('altonApp').service('accountService', function ($cookies, $q, apiService) {

  var cookieToken = 'token';

  this.login = function (name, password) {
    var defer = $q.defer();
    var data = {
      name: name,
      password: password
    };

    apiService.post(data, apiService.endpoints.POST.AUTHENTICATE).then(function (response) {
      var token = response.data.token;
      var date = new Date();
      date.setDate(date.getDate() + 1);
      $cookies.put(cookieToken, token, {
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

  this.getToken = function () {
    return $cookies.get(cookieToken);
  };

});
