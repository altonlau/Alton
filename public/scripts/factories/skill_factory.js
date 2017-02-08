/*
 * Author: Alton Lau
 * Date: February 8, 2017
 * File: skill_factory.js
 * Description: Skill model
 */

angular.module('altonApp').factory('skillFactory', function ($q, apiService) {

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

  return {
    getAll: function() {
      return skills;
    },
    load: loadSkills
  };

});
