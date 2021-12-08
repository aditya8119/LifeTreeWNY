(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.maps',[])
        .config(routeConfig);
  
    /** @ngInject */
    function routeConfig($stateProvider) {
      $stateProvider
          .state('maps', {
            url: '/maps',
            templateUrl: 'app/pages/maps/maps.html',
            controller: 'MapPageCtrl',
            title: 'Maps',
            sidebarMeta: {
              icon: 'ion-ios-location-outline',
              order: 500,
            },
          })
    }
  })();