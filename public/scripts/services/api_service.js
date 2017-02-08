/*
 * Author: Alton Lau
 * Date: February 7, 2017
 * File: api_router_service.js
 * Description: API URL and endpoints service
 */

angular.module('altonApp').service('apiService', function ($http, $location, $q) {

  var host = $location.protocol() + '://' + $location.host() + ':' + $location.port();

  this.endpoints = {
    GET: {
      ABOUT: '/api/about',
      PROJECT: '/api/project',
      SKILL: '/api/skill',
      USER: '/api/user'
    },
    POST: {
      ABOUT: '/api/about',
      AUTHENTICATE: '/api/authenticate',
      PROJECT: '/api/project',
      SKILL: '/api/skill',
      USER: '/api/user'
    },
    PUT: {
      ABOUT: '/api/about',
      PROJECT: '/api/project',
      SKILL: '/api/skill',
      USER: '/api/user'
    },
    DELETE: {
      ABOUT: '/api/about',
      PROJECT: '/api/project',
      SKILL: '/api/skill',
      USER: '/api/user'
    },
  };

  this.get = function (data, endpoint, token) {
    if (hasEndpoint(this.endpoints.GET, endpoint)) {
      return performRequest(data, endpoint, 'GET', 'application/json', token);
    }

    return null;
  };

  this.post = function (data, endpoint, token) {
    var defer = $q.defer();

    if (hasEndpoint(this.endpoints.POST, endpoint)) {
      if (endpoint === this.endpoints.POST.PROJECT) {
        return performRequest(data, endpoint, 'POST', null, token);
      } else {
        return performRequest(data, endpoint, 'POST', 'application/json', token);
      }
    }

    return defer.promise;
  };

  this.put = function (data, endpoint) {
    var defer = $q.defer();

    if (hasEndpoint(this.endpoints.PUT, endpoint)) {
      if (endpoint === this.endpoints.PUT.PROJECT) {
        return performRequest(data, endpoint, 'PUT', null, token);
      } else {
        return performRequest(data, endpoint, 'PUT', 'application/json', token);
      }
    }

    return defer.promise;
  };

  this.delete = function (data, endpoint) {
    var defer = $q.defer();

    if (hasEndpoint(this.endpoints.DELETE, endpoint)) {
      return performRequest(data, endpoint, 'DELETE', 'application/json', token);
    }

    return defer.promise;
  };

  function hasEndpoint(endpoints, endpoint) {
    var exists = false;

    for (var key in endpoints) {
      if (endpoints[key] === endpoint) {
        exists = true;
        break;
      }
    }

    return exists;
  }

  function performRequest(data, endpoint, requestType, contentType, token) {
    var defer = $q.defer();

    $http({
      headers: {
        'Authorization': token,
        'Content-Type': contentType
      },
      method: requestType,
      data: requestType !== 'GET' ? data : undefined,
      params: requestType === 'GET' ? data : undefined,
      url: host + endpoint
    }).then(function (response) {
      defer.resolve(response);
    }, function (response) {
      defer.reject(response);
    });

    return defer.promise;
  }

});
