/**
 * @author Bartlomiej Karmilowicz
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.invoices', ['ui.bootstrap'])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('invoices', {
          url: '/invoices',
          templateUrl: 'app/pages/invoices/invoices.html',
          controller: 'InvoicesPageCtrl',
          title: 'Invoices',
          sidebarMeta: {
            icon: 'ion-grid',
            order: 100,
          },
        }).state('details', {
          url: '/details/:id',
          templateUrl: 'app/pages/invoices/details/details.html',
          title: 'Invoice Details',
          controller: 'InvoiceDetailsCtrl'
        });
  }

})();
