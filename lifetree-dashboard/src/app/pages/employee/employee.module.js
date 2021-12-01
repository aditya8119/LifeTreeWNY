/**
 * @author Bartlomiej Karmilowicz
 */
 (function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.employee', [])
      .config(routeConfig);
  
    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('employee', {
            url: '/employee',
            templateUrl: 'app/pages/employee/employee.html',
            controller: 'EmployeePageCtrl',
            title: 'Employee Tab',
            sidebarMeta: {
              icon: 'ion-grid',
              order: 100
            },
          });
    }
  
  })();
  