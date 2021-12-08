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
        value: Math.round(0 * 100) / 100
      };
      $scope.paidAmount = Math.round(($scope.example.value)* 100) / 100
      $scope.dueAmount = Math.round(($scope.msg - $scope.example.value)* 100) / 100
      $scope.evaluateChange = function () {
        $scope.paidAmount = Math.round(($scope.example.value)* 100) / 100
        $scope.dueAmount = Math.round(($scope.msg - $scope.example.value)* 100) / 100
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


