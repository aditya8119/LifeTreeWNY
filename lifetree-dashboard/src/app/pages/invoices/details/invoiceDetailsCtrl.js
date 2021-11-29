/**
 * @author b.karmilowicz
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.invoices')
    .controller('InvoiceDetailsCtrl', InvoiceDetailsCtrl);

  /** @ngInject */
  function InvoiceDetailsCtrl($scope, $stateParams, dataResource) {
    $scope.invoiceId = $stateParams.id;
    fetchInvoice($scope.invoiceId);


    function fetchInvoice(id) {
      if (id !== '' && id !== undefined) {
        dataResource.fetchInvoice($scope.invoiceId).then(function success(response) {
          // extract invoice
          if (response.data.invoice && response.data.invoice.length > 0) {
            pruneInvoiceResponse(response.data.invoice);
            $scope.invoiceData = response.data.invoice[0];
          }
          // extract items
          if (response.data.items && response.data.items.length > 0) {
            pruneInvoiceResponse(response.data.items);
            $scope.invoiceItemsData = response.data.items;
          }
        }, function error(err) {
          console.log(err);
        });
      } else {
        console.error('INVALID: empty id');
      }
    }

    function pruneInvoiceResponse(invoice) {
      //change field names to more usable
      invoice.forEach(function (item, index) {
        Object.keys(item).map(function (key, index) {
          var newKey = key.split(' ').join('_').toLowerCase();
          item[newKey] = item[key];
          delete item[key];
        });
      });
    }


  }

})();