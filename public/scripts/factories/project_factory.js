/*
 * Author: Alton Lau
 * Date: February 8, 2017
 * File: project_factory.js
 * Description: Project model
 */

angular.module('altonApp').factory('projectFactory', function ($q, apiService) {

  var projects = [];

  var Project = function (name, description, images, skills) {
    this.name = name;
    this.description = description;
    this.images = images;
    this.skills = skills;
  };

  function loadProjects() {
    var defer = $q.defer();

    projects = [];
    apiService.get(null, apiService.endpoints.GET.PROJECT).then(function (response) {
      response.data.forEach(function (data) {
        projects.push(new Project(data.name, data.description, data.images, data.skills));
      });
      defer.resolve();
    }, function (response) {
      defer.reject(response.data.message);
    });

    return defer.promise;
  }

  return {
    getAll: function() {
      return projects;
    },
    load: loadProjects
  };

});
