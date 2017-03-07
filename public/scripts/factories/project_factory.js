/*
 * Author: Alton Lau
 * Date: February 8, 2017
 * File: project_factory.js
 * Description: Project model
 */

angular.module('altonApp').factory('projectFactory', function ($q, imagePreloader, accountService, apiService) {

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
      var images = [];
      response.data.forEach(function (data) {
        projects.push(new Project(data.id, data.name, data.description, data.images, data.skills, data.views));
        images = images.concat(data.images);
      });

      imagePreloader.preload(images).then(function () {
        defer.resolve();
      }, function () {
        defer.resolve();
      });
    }, function (response) {
      defer.reject(response.data.message);
    });

    return defer.promise;
  }

  function saveProject(project) {
    var defer = $q.defer();
    var data = new FormData();

    if (project.name) {
      data.append('name', project.name);
    }
    if (project.description) {
      data.append('description', project.description);
    }
    if (project.newImages) {
      for (var i = 0; i < project.newImages.length; i++) {
        data.append('images', project.newImages[i]);
      }
    }
    if (project.skills && project.skills.length) {
      data.append('skills', JSON.stringify(project.skills));
    }

    if (project.id) {
      data.append('id', project.id);

      if (project.images && project.images.length) {
        data.append('existingImages', JSON.stringify(project.images));
      }

      apiService.put(data, apiService.endpoints.PUT.PROJECT, accountService.getToken()).then(function (response) {
        defer.resolve(response.data.message);
      }, function (response) {
        defer.reject(response.data.message);
      });
    } else {
      apiService.post(data, apiService.endpoints.POST.PROJECT, accountService.getToken()).then(function (response) {
        defer.resolve(response.data.message);
      }, function (response) {
        defer.reject(response.data.message);
      });
    }

    return defer.promise;
  }

  function deleteProject(project) {
    var defer = $q.defer();

    apiService.delete({
      id: project.id
    }, apiService.endpoints.DELETE.PROJECT, accountService.getToken()).then(function (response) {
      defer.resolve(response.data.message);
    }, function (response) {
      defer.reject(response.data.message);
    });

    return defer.promise;
  }

  return {
    getAll: function () {
      return projects;
    },
    load: loadProjects,
    save: saveProject,
    delete: deleteProject
  };

});
