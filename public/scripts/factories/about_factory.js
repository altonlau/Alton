/*
 * Author: Alton Lau
 * Date: March 7, 2017
 * File: about_factory.js
 * Description: About model
 */

angular.module('altonApp').factory('aboutFactory', function ($q, accountService, apiService) {

  var abouts = [];

  var About = function (id, name, description, icon) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.icon = icon;
  };

  function loadAbouts() {
    var defer = $q.defer();

    abouts = [];
    apiService.get(null, apiService.endpoints.GET.ABOUT).then(function (response) {
      response.data.forEach(function (data) {
        abouts.push(new About(data.id, data.name, data.description, data.icon));
      });
      defer.resolve();
    }, function (response) {
      defer.reject(response.data.message);
    });

    return defer.promise;
  }

  function saveAbout(about) {
    var defer = $q.defer();
    var data = new FormData();

    if (about.name) {
      data.append('name', about.name);
    }
    if (about.description) {
      data.append('description', about.description);
    }
    if (about.icon && typeof about.icon === 'object') {
      data.append('icon', about.icon);
    }

    if (about.id) {
      data.append('id', about.id);

      apiService.put(data, apiService.endpoints.PUT.ABOUT, accountService.getToken()).then(function (response) {
        defer.resolve(response.data.message);
      }, function (response) {
        defer.reject(response.data.message);
      });
    } else {
      apiService.post(data, apiService.endpoints.POST.ABOUT, accountService.getToken()).then(function (response) {
        defer.resolve(response.data.message);
      }, function (response) {
        defer.reject(response.data.message);
      });
    }

    return defer.promise;
  }

  function deleteAbout(about) {
    var defer = $q.defer();

    apiService.delete({
      id: about.id
    }, apiService.endpoints.DELETE.ABOUT, accountService.getToken()).then(function (response) {
      defer.resolve(response.data.message);
    }, function (response) {
      defer.reject(response.data.message);
    });

    return defer.promise;
  }

  return {
    getAll: function () {
      return abouts;
    },
    load: loadAbouts,
    save: saveAbout,
    delete: deleteAbout
  };

});
