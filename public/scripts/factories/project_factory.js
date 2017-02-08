/*
 * Author: Alton Lau
 * Date: February 8, 2017
 * File: project_factory.js
 * Description: Project model
 */

angular.module('altonApp').factory('projectFactory', function ($q, apiService) {

  var projects = [];

  var Project = function (id, name, description, images, skills, views) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.images = images;
    this.skills = skills;
    this.views = views;
  };

  function loadProjects() {
    var defer = $q.defer();

    projects = [];
    apiService.get(null, apiService.endpoints.GET.PROJECT).then(function (response) {
      response.data.forEach(function (data) {
        projects.push(new Project(data.id, data.name, data.description, data.images, data.skills, data.views));
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
