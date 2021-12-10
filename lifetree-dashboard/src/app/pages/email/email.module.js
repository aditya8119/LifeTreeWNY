(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.email',[])
        .config(routeConfig);
  
    /** @ngInject */
    function routeConfig($stateProvider) {
      $stateProvider
          .state('email', {
            url: '/email',
            templateUrl: 'app/pages/email/email.html',
            controller: 'EmailPageCtrl',
            title: 'Email',
            sidebarMeta: {
              icon: 'ion-ios-email-outline',
              order: 600,
            },
          })
    }
  
  })();