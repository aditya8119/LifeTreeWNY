/**
 * @author Bartlomiej Karmilowicz
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.formSubmissions', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('formSubmissions', {
          url: '/formSubmissions',
          templateUrl: 'app/pages/formSubmissions/formSubmissions.html',
          controller: 'FormSubmissionsPageCtrl',
          title: 'Contact Form',
          sidebarMeta: {
            icon: 'ion-grid',
            order: 100
          },
        });
  }

})();
