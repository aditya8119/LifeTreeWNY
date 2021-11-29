/**
 * @author Bartlomiej Karmilowicz
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.quickbooks', ['ui.bootstrap'])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('quickbooks', {
          url: '/quickbooks',
          templateUrl: 'app/pages/quickbooks/quickbooks.html',
          controller: 'QuickbooksPageCtrl',
          title: 'Quickbooks',
          sidebarMeta: {
            icon: 'ion-grid',
            order: 100,
          },
        });
  }

})();
