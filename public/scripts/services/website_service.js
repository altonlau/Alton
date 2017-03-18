/*
 * Author: Alton Lau
 * Date: February 7, 2017
 * File: api_router_service.js
 * Description: API URL and endpoints service
 */

angular.module('altonApp').service('websiteService', function ($cookies, $q, $rootScope, aboutFactory, projectFactory, skillFactory, accountService, apiService) {

  this.maintenance = function (value) {
    var defer = $q.defer();

    if (value === undefined) {
      apiService.get(null, apiService.endpoints.GET.WEBSITE_MAINTENANCE).then(function (response) {
        defer.resolve(response.data);
      }, function (response) {
        defer.reject(response.data.message);
      });
    } else {
      var data = {
        value: value
      };
      apiService.post(data, apiService.endpoints.POST.WEBSITE_MAINTENANCE, accountService.getToken()).then(function (response) {
        defer.resolve(response.data.message);
      }, function (response) {
        defer.reject(response.data.message);
      });
    }

    return defer.promise;
  };

  this.load = function (force) {
    var defer = $q.defer();
    var aboutLoaded = false;
    var skillLoaded = false;
    var projectLoaded = false;
    var aboutCount = 10;
    var skillCount = 10;
    var projectCount = 10;

    if ($rootScope.websiteLoaded && !force) {
      defer.resolve();
    } else {
      $rootScope.websiteLoaded = false;
      loadObjects();
    }

    function loadObjects() {
      if (!aboutLoaded && aboutCount) {
        aboutFactory.load().then(function () {
          aboutLoaded = true;
          loaded();
        }, function () {
          aboutCount--;

          if (!aboutCount) {
            loaded();
          } else {
            loadObjects();
          }
        });
      }

      if (!skillLoaded && skillCount) {
        skillFactory.load().then(function () {
          skillLoaded = true;
          loaded();
        }, function () {
          skillCount--;

          if (!skillCount) {
            loaded();
          } else {
            loadObjects();
          }
        });
      }

      if (!projectLoaded && projectCount) {
        projectFactory.load().then(function () {
          projectLoaded = true;
          loaded();
        }, function () {
          projectCount--;

          if (!projectCount) {
            loaded();
          } else {
            loadObjects();
          }
        });
      }
    }

    function loaded() {
      if (aboutLoaded && skillLoaded && projectLoaded) {
        $rootScope.websiteLoaded = true;
        defer.resolve();
      } else if (!aboutCount && !skillCount && !projectCount) {
        defer.reject('Unable to load website.');
      }
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
