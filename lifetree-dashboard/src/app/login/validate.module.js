/**
 * @author bkarmilowicz
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.validate', ['ui.router'])
    .config(routeConfig)
    .controller('ValidateCtrl', ValidateCtrl);

  function ValidateCtrl($location, AuthService) {
    console.log('redirecting through validate...');
    if (!AuthService.isAuthenticated()) {
      console.log('ValidateCtrl : Redirecting to Login');
      $location.path('/login');
    } else {
      $location.path('/invoices');
      console.log('ALLOW');
    }
  }

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('/validate', {
        url: '/validate',
        views: {
          'loginView': {
            controller: 'ValidateCtrl',
            template: '<p>Redirecting...</p>',
          }
        }
      });
  }

})();