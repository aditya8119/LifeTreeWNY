/**
 * @author b.karmilowicz
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.services', [])
    .service('dataResource', dataResource);

  /** @ngInject */
  function dataResource($http, $q) {
    return {
      sayHello: function () {
        return 'hello world';
      },
      fetchAddress: function (id) {
        return $http({
          method: 'GET',
          url: '/api/dashboard/proposals/address'
        }).then(function callback(response) {
          return response;
        });
      },
      fetchFormData: function () {
        return $http({
          method: 'GET',
          url: '/api/dashboard/formData/'
        }).then(function callback(response) {
          return response;
        });
      },
      fetchInvoices: function () {
        return $http({
          method: 'GET',
          url: '/api/dashboard/proposals/all'
        }).then(function callback(response) {
          return response;
        });
      },
      fetchInvoice: function (id) {
        return $http({
          method: 'GET',
          url: '/api/dashboard/proposals/' + id
        }).then(function callback(response) {
          return response;
        });
      },
      syncProposals: function (selection) {
        return $http({
          method: 'GET',
          url: '/api/dashboard/routzy/sync/',
        }).then(function callback(response) {
          return response;
        });
      },
      fetchQBQueue: function () {
        return $http({
          method: 'GET',
          url: '/api/dashboard/quickbooks/queue/'
        }).then(function callback(response) {
          return response;
        });
      },
      enqueue: function (selection) {
        return $http({
          method: 'POST',
          url: '/api/dashboard/quickbooks/queue/enqueue/',
          headers: {
            'Content-Type': 'application/json'
          },
          data: selection
        }).then(function callback(response) {
          return response;
        });
      },
      deleteFromQBQueue: function (selection) {
        return $http({
          method: 'POST',
          url: '/api/dashboard/quickbooks/queue/delete',
          headers: {
            'Content-Type': 'application/json'
          },
          data: selection
        }).then(function callback(response) {
          return response;
        });
      },
      updateInvoice: function (id, item) {
        return $http({
          method: 'POST',
          url: '/api/dashboard/proposals/update',
          headers: {
            'Content-Type': 'application/json'
          },
          data: item
        }).then(function callback(response) {
          return response;
        });
      },
    }
  }
})();
