/*
 * Author: Alton Lau
 * Date: February 7, 2017
 * File: api_router_service.js
 * Description: API URL and endpoints service
 */

angular.module('altonApp').service('websiteService', function ($q, accountService, apiService) {

  this.maintenance = function (value) {
    var defer = $q.defer();

    if (value === undefined) {
      apiService.get(null, apiService.endpoints.GET.WEBSITE_MAINTENANCE).then(function (response) {
        defer.resolve(response.data);
      }, function (response) {
        defer.reject(response.data.message);
      });
    } else {
      apiService.post(value, apiService.endpoints.POST.WEBSITE_MAINTENANCE, accountService.getToken()).then(function (response) {
        defer.resolve(response.data.message);
      }, function(response) {
        defer.reject(response.data.message);
      });
    }

    return defer.promise;
  };

  this.viewed = function () {
    apiService.post(null, apiService.endpoints.POST.WEBSITE_VIEWED);
  };

  this.views = function () {
    var defer = $q.defer();

    apiService.get(null, apiService.endpoints.GET.WEBSITE_VIEWS, accountService.getToken()).then(function (response) {
      defer.resolve(response.data);
    }, function (response) {
      defer.reject(response.data.message);
    });

    return defer.promise;
  };

});
