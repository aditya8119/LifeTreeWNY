/**
 * @author Susmitha Ainampudi
 */

 (function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.employee')
      .controller('NotesModalCtrl', NotesModalCtrl);
  
  
    /** @ngInject */
    function NotesModalCtrl($scope, $uibModalInstance, dataResource) {
      var item  = $scope.$resolve.item
      var primaryId =  item.primaryId
      var selectedStatus = $scope.$resolve.primaryId
      $scope.selectedStatus = selectedStatus;
      var prevMsg  = item.employee_notes
      $scope.jobStatuses = [
        { statusname: 'Fix' },
        { statusname: 'Complete' },
        { statusname: 'Pending' },
      ];
      $scope.ok = function () {
        var appendedMsg = getMsg();
        console.log(appendedMsg)
        var newItem = item;
        newItem.employee_notes = $scope.msg;
    //     $scope.isSyncingWithRoutzy = true;
        dataResource.updateInvoice(primaryId, newItem).then(function success(response) {
          $uibModalInstance.close(appendedMsg); 
        }, function error(err) {
          console.log(error);
          $uibModalInstance.close()
        });
      };
      
    function getMsg() {
        var joinmsg = prevMsg ? prevMsg + '. '  + $scope.msg : $scope.msg;
        return joinmsg;
      };
    }
  
  })();
  
  
  