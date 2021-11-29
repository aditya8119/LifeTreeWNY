// app.run.js
(function () {

  'use strict';

  angular
    .module('BlurAdmin')
    .run(function ($rootScope, $timeout, $location, AuthService) {

      // Put the authService on $rootScope so its methods
      // can be accessed from the nav bar
      $rootScope.auth = AuthService;

      // Process the auth token if it exists and fetch the profile
      AuthService.handleParseHash();

      $rootScope.$on('$locationChangeStart', function (event, next, current) {
        //don't redirect on authentication - auth0 taking longer to authenticate
        if (!sessionStorage.getItem('loggingMode')) {
          if (!AuthService.isAuthenticated()) {
            console.log('unauthorized - redirecting to /login');
            $location.path('/login');
          } else {
            console.log('ALLOW');
          }
        }
      });

      $rootScope.$on('$destroy', function () {
        localStorage.removeItem('loggingMode')
      });

    });

})();