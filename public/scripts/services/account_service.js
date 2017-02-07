/*
 * Author: Alton Lau
 * Date: February 6, 2017
 * File: account_service.js
 * Description: Account service
 */

angular.module('altonApp').service('accountService', function ($cookies, $http, $location, $q, routeConstant) {

  var cookiesTokenKey = 'authToken';
  var defaultContentType = 'application/json';
  var host = $location.protocol() + '://' + $location.host() + ':' + $location.port();

  this.login = function (name, password) {
    var defer = $q.defer();

    $http({
      method: 'POST',
      url: host + routeConstant.ENDPOINT.AUTHENTICATE,
      data: {
        name: name,
        password: password
      }
    }).then(function (response) {
      var token = response.data.token;
      var date = new Date();
      date.setDate(date.getDate() + 1);
      $cookies.put(cookiesTokenKey, token, {
        expires: date
      });
      defer.resolve();
    }, function (response) {
      defer.reject(response.data.message);
    });

    return defer.promise;
  };

  this.logout = function () {
    $cookies.remove(cookiesTokenKey);
  };

  this.isLoggedIn = function () {
    var token = $cookies.get(cookiesTokenKey);
    return !!token;
  };

});
