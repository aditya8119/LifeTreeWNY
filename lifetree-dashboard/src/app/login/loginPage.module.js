/**
 * @author bkarmilowicz
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.login', ['ui.router'])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        views: {
          'loginView': {
            templateUrl: 'app/login/login.html',
            controller: 'LoginPageCtrl'
          }
        }

      });
  }

})();