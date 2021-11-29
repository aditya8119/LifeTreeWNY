/**
 * @author Bartlomiej Karmilowicz
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages', [
      'ui.router',
      'BlurAdmin.pages.formSubmissions',
      'BlurAdmin.pages.invoices',
      'BlurAdmin.pages.quickbooks',
      'auth0.auth0',
      'angular-jwt'
    ])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider, $stateProvider,
    $locationProvider, angularAuth0Provider, jwtOptionsProvider, $provide, $httpProvider) {

    // Initialization for the angular-auth0 library
    angularAuth0Provider.init({
      clientID: 'ifkbnJmKfK10u8Am3kASINeHCKSCqYoD', // Your Default Client ID
      domain: 'dev-s001fnzy.us.auth0.com', // Your Auth0 Domain
      responseType: 'token id_token',
      redirectUri: 'http://137.184.136.1/#/validate'
    });

    // Configure a tokenGetter so that the isAuthenticated
    // method from angular-jwt can be used
    jwtOptionsProvider.config({
      tokenGetter: function() {
        return localStorage.getItem('id_token');
      }
    });

    function redirect($q, $rootScope, $injector, $location) {
      return {
        responseError: function(rejection) {
          console.log('interceptor redirect on 401');
          if (rejection.status === 401) {
            $rootScope.auth.logout();
          }
          return $q.reject(rejection);
        }
      }
    }

    $provide.factory('redirect', redirect);
    $httpProvider.interceptors.push('redirect');
    $httpProvider.interceptors.push('jwtInterceptor');

    $urlRouterProvider.otherwise('/invoices');
    // Remove the ! from the hash so that
    // auth0.js can properly parse it
    $locationProvider.hashPrefix('');
  }

})();
