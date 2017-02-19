/*
 * Author: Alton Lau
 * Date: February 8, 2017
 * File: skill_factory.js
 * Description: Skill model
 */

angular.module('altonApp').factory('skillFactory', function ($q, accountService, apiService) {

  var skills = [];

  var Skill = function (id, name, level, views) {
    this.id = id;
    this.name = name;
    this.level = level;
    this.views = views;
  };

  function loadSkills() {
    var defer = $q.defer();

    skills = [];
    apiService.get(null, apiService.endpoints.GET.SKILL).then(function (response) {
      response.data.forEach(function (data) {
        skills.push(new Skill(data.id, data.name, data.level, data.views));
      });
      defer.resolve();
    }, function (response) {
      defer.reject(response.data.message);
    });

    return defer.promise;
  }

  function saveSkill(skill) {
    var defer = $q.defer();

    if (skill.id) {
      apiService.put({
        id: skill.id,
        name: skill.name,
        level: skill.level
      }, apiService.endpoints.PUT.SKILL, accountService.getToken()).then(function (response) {
        defer.resolve(response.data.message);
      }, function (response) {
        defer.reject(response.data.message);
      });
    } else {
      // TODO: Save skill
    }

    return defer.promise;
  }

  function deleteSkill(skill) {
    var defer = $q.defer();

    apiService.delete({
      id: skill.id
    }, apiService.endpoints.PUT.SKILL, accountService.getToken()).then(function (response) {
      defer.resolve(response.data.message);
    }, function (response) {
      defer.reject(response.data.message);
    });

    return defer.promise;
  }

  return {
    getAll: function () {
      return skills;
    },
    load: loadSkills,
    save: saveSkill,
    delete: deleteSkill
  };

});
