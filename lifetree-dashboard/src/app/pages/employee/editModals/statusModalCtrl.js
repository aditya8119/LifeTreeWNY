/**
 * @author Susmitha Ainampudi
 */

(function () {
  'use strict';

  angular.module('BlurAdmin.pages.employee')
    .controller('StatusModalCtrl', StatusModalCtrl);


  /** @ngInject */
  function StatusModalCtrl($scope, $uibModalInstance, dataResource) {
    var selectedStatus = $scope.$resolve.selectedStatus
    var item  = $scope.$resolve.item
    var primaryId =  item.primaryId
    $scope.selectedStatus = selectedStatus;
    $scope.msg = "Lorem ipsum dolor sit amet erat volutpat";
    $scope.jobStatuses = [
      { statusname: 'Fix' },
      { statusname: 'Complete' },
      { statusname: 'Pending' },
    ];
    $scope.saveStatus = function () {
      var newItem = item;
      newItem.job_status = $scope.selectedStatus;
      dataResource.updateInvoice(primaryId, newItem).then(function success(response) {
        $uibModalInstance.close(selectedStatus); 
      }, function error(err) {
        console.log(error);
        $uibModalInstance.close()
      });
    };
    
  }

})();


