/**
 * @author Susmitha Ainampudi
 */

 (function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.employee')
        .controller('PaymentModalCtrl', PaymentModalCtrl);
  
  
    /** @ngInject */
    function PaymentModalCtrl($scope, $uibModalInstance, dataResource) {
      var params = $scope.$resolve.params
      var item  = $scope.$resolve.item
      var primaryId =  item.primaryId
      $scope.msg = params.totalAmount;
      $scope.example = {
        value: 0
      };
      $scope.submit = function (DueAmount, dismiss) {
        var newItem = item;
        newItem.total = DueAmount;
        // $scope.isSyncingWithRoutzy = true;
        dataResource.updateInvoice(primaryId, newItem).then(function success(response) {
          $uibModalInstance.close(); 
        }, function error(err) {
          console.log(error);
          $uibModalInstance.close()
        });
      };
    }
  
  })();


