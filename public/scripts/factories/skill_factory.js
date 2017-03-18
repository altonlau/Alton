/*
 * Author: Alton Lau
 * Date: February 8, 2017
 * File: skill_factory.js
 * Description: Skill model
 */

angular.module('altonApp').factory('skillFactory', function ($q, accountService, apiService) {

  var skills = [];
  var skillViews = [];

  var Skill = function (id, name, level, description) {
    this.id = id;
    this.name = name;
    this.level = level;
    this.description = description;
  };

  function load() {
    var defer = $q.defer();

    loadSkills().then(function () {
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

  function loadSkills() {
    var defer = $q.defer();

    skills = [];
    apiService.get(null, apiService.endpoints.GET.SKILL).then(function (response) {
      response.data.forEach(function (data) {
        skills.push(new Skill(data.id, data.name, data.level, data.description));
      });
      defer.resolve();
    }, function (response) {
      defer.reject(response.data.message);
    });

    return defer.promise;
  }

  function loadViews() {
    var defer = $q.defer();

    if (accountService.getToken()) {
      apiService.get(null, apiService.endpoints.GET.SKILL_VIEWS, accountService.getToken()).then(function (response) {
        skillViews = response.data;
        defer.resolve();
      }, function (response) {
        defer.reject(response.data.message);
      });
    } else {
      defer.resolve();
    }

    return defer.promise;
  }

  function saveSkill(skill) {
    var defer = $q.defer();

    if (skill.id) {
      apiService.put({
        id: skill.id,
        name: skill.name,
        level: skill.level,
        description: skill.description
      }, apiService.endpoints.PUT.SKILL, accountService.getToken()).then(function (response) {
        defer.resolve(response.data.message);
      }, function (response) {
        defer.reject(response.data.message);
      });
    } else {
      apiService.post({
        name: skill.name,
        level: skill.level,
        description: skill.description
      }, apiService.endpoints.POST.SKILL, accountService.getToken()).then(function (response) {
        defer.resolve(response.data.message);
      }, function (response) {
        defer.reject(response.data.message);
      });
    }

    return defer.promise;
  }

  function deleteSkill(skill) {
    var defer = $q.defer();

    apiService.delete({
      id: skill.id
    }, apiService.endpoints.DELETE.SKILL, accountService.getToken()).then(function (response) {
      defer.resolve(response.data.message);
    }, function (response) {
      defer.reject(response.data.message);
    });

    return defer.promise;
  }

  function viewedSkill(id) {
    if (viewedSkills.indexOf(id) < 0) {
      viewedSkills.push(id);

      apiService.post({
        id: id
      }, apiService.endpoints.POST.SKILL_VIEWED).then({}, function () {
        viewedSkills.splice(viewedSkills.indexOf(id), 1);
      });
    }
  }

  return {
    getAll: function () {
      return skills;
    },
    load: load,
    save: saveSkill,
    delete: deleteSkill,
    viewed: viewedSkill,
    views: function () {
      return skillViews;
    }
  };

});
