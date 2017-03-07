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
      USER: '/api/user',
      WEBSITE_MAINTENANCE: '/api/website/maintenance',
      WEBSITE_VIEWS: '/api/website/views'
    },
    POST: {
      ABOUT: '/api/about',
      AUTHENTICATE: '/api/authenticate',
      PROJECT: '/api/project',
      SKILL: '/api/skill',
      USER: '/api/user',
      PROJECT_VIEWED: '/api/project/viewed',
      SKILL_VIEWED: '/api/skill/viewed',
      WEBSITE_MAINTENANCE: '/api/website/maintenance',
      WEBSITE_VIEWED: '/api/website/viewed'
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
      if ([this.endpoints.POST.PROJECT, this.endpoints.POST.ABOUT].indexOf(endpoint) >= 0) {
        return performRequest(data, endpoint, 'POST', undefined, token);
      } else {
        return performRequest(data, endpoint, 'POST', 'application/json', token);
      }
    }

    return defer.promise;
  };

  this.put = function (data, endpoint, token) {
    var defer = $q.defer();

    if (hasEndpoint(this.endpoints.PUT, endpoint)) {
      if ([this.endpoints.PUT.PROJECT, this.endpoints.PUT.ABOUT].indexOf(endpoint) >= 0) {
        return performRequest(data, endpoint, 'PUT', undefined, token);
      } else {
        return performRequest(data, endpoint, 'PUT', 'application/json', token);
      }
    }

    return defer.promise;
  };

  this.delete = function (data, endpoint, token) {
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
