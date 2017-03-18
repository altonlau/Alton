/*
 * Author: Alton Lau
 * Date: February 8, 2017
 * File: project_factory.js
 * Description: Project model
 */

angular.module('altonApp').factory('projectFactory', function ($q, imagePreloader, accountService, apiService) {

  var projects = [];
  var projectViews = [];
  var viewedProjects = [];

  var Project = function (id, name, description, images, skills) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.images = images;
    this.skills = skills;
  };

  function load() {
    var defer = $q.defer();

    loadProjects().then(function () {
      loadViews().then(function () {
        defer.resolve();
      }, function () {
        defer.reject();
      });
    }, function (response) {
      defer.reject(response);
    });

    return defer.promise;
  }

  function loadProjects() {
    var defer = $q.defer();

    projects = [];
    apiService.get(null, apiService.endpoints.GET.PROJECT).then(function (response) {
      var images = [];
      response.data.forEach(function (data) {
        projects.push(new Project(data.id, data.name, data.description, data.images, data.skills));
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

  function loadViews() {
    var defer = $q.defer();

    if (accountService.getToken()) {
      apiService.get(null, apiService.endpoints.GET.PROJECT_VIEWS, accountService.getToken()).then(function (response) {
        projectViews = response.data;
        defer.resolve();
      }, function (response) {
        defer.reject(response.data.message);
      });
    } else {
      defer.resolve();
    }

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

  function viewedProject(id) {
    if (viewedProjects.indexOf(id) < 0) {
      viewedProjects.push(id);

      apiService.post({
        id: id
      }, apiService.endpoints.POST.PROJECT_VIEWED).then({}, function () {
        viewedProjects.splice(viewedProjects.indexOf(id), 1);
      });
    }
  }

  return {
    getAll: function () {
      return projects;
    },
    load: load,
    save: saveProject,
    delete: deleteProject,
    viewed: viewedProject,
    views: function() {
      return projectViews;
    }
  };

});
