/**
 * @author Bartlomiej Karmilowicz
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.quickbooks')
    .controller('QuickbooksPageCtrl', QuickbooksPageCtrl);

  /** @ngInject */
  function QuickbooksPageCtrl($scope, $filter, $timeout, editableOptions, editableThemes, dataResource) {
    loadQueue();
    $scope.hideExported = true;
    
    function loadQueue() {
      dataResource.fetchQBQueue().then(function success(response) {
        //change field names to more usable
        response.data.forEach(function (item, index) {
          Object.keys(item).map(function (key, index) {
            if (key.includes(' ')) {
              var newKey = key.split(' ').join('_').toLowerCase();
              item[newKey] = item[key];
              delete item[key];
            }
          });
        });
        $scope.invoicesTableData = response.data;
      }, function error(err) {
        console.log(err);
      });
    }

    $scope.deleteFromQueue = function (id) {
      dataResource.deleteFromQBQueue({proposal_id : id}).then(function success() {
        console.log('job: ' + id + ' deleted');
        loadQueue();
      });
    };

    $scope.requeueJob = function (id) {
      dataResource.enqueue([{proposal_id : id}]).then(function success() {
        console.log('job: ' + id +  ' requeued');
        loadQueue();
      });
    };
  }

})();
