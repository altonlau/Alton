/*
 * Author: Alton Lau
 * Date: February 6, 2017
 * File: route_constant.js
 * Description: URL and endpoints
 */

angular.module('altonApp').constant('routeConstant', {
  DEV: {
    HOST: 'http://localhost:3000'
  },
  PROD: {
    HOST: 'http://104.131.177.192'
  },
  ENDPOINT: {
    AUTHENTICATE: '/api/authenticate',
    ABOUT: '/api/about',
    PROJECT: '/api/project',
    SKILL: '/api/skill',
    USER: '/api/user'
  }
});
