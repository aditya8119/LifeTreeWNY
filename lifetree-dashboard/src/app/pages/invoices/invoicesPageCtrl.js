/**
 * @author Bartlomiej Karmilowicz
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.invoices')
    .controller('InvoicesPageCtrl', InvoicesPageCtrl);

  /** @ngInject */
  function InvoicesPageCtrl($scope, $filter, $timeout, editableOptions, editableThemes, dataResource) {
    $scope.invoicesTableData = [];
    $scope.invoiceFilter = {};
    $scope.invoices = [];
    $scope.itemsPerPage = 10;
    $scope.isAlertOpen = false;
    $scope.isSuccessMessageReady = false;
    $scope.isErrorMessageReady = false;
    $scope.isSyncingWithRoutzy = false;

    fetchInvoices();

    $scope.selectedCount = function (selection) {
      if (!selection) {
        return 0;
      }
      var count = 0;
      selection.forEach(function (item) {
        if (item.isSelected) {
          count++;
        }
      });
      return count;
    }

    function fetchInvoices() {
      dataResource.fetchInvoices().then(function success(response) {
        //change field names to more usable
        response.data.forEach(function (item, index) {
          Object.keys(item).map(function (key, index) {
            var newKey = key.split(' ').join('_').toLowerCase();
            item[newKey] = item[key];
            delete item[key];
          });
        });
        $scope.invoicesTableData = response.data;
      }, function error(err) {
        console.log(err);
      });
  
    }

    function filterSelection(obj) {
      return obj !== undefined && obj.hasOwnProperty('isSelected') && obj.isSelected;
    }

    function resetSelection(selection) {
      selection.forEach(function (item) {
        item.isSelected = false;
      });
    }

    $scope.selectAll = function (selection, isAllSelected) {
      if (isAllSelected) {
        selection.forEach(function (item) {
          item.isSelected = true;
        });
      } else {
        resetSelection(selection);
      }
    }

    $scope.showAlert = function () {
      return $scope.isAlertOpen;
    }

    $scope.showSuccessImport = function () {
      return $scope.isSuccessMessageReady;
    }

    $scope.showErrorImport = function () {
      return $scope.isErrorMessageReady;
    }

    $scope.toggleAlert = function () {
      $scope.isAlertOpen = !$scope.isAlertOpen;
    }

    $scope.displaySuccessAlert = function () {
      $scope.isSuccessMessageReady = !$scope.isSuccessMessageReady;
      $timeout(function () {
        $scope.isSuccessMessageReady = !$scope.isSuccessMessageReady;
      }, 3000);
    }

    $scope.displayErrorAlert = function () {
      $scope.isErrorMessageReady = !$scope.isErrorMessageReady;
      $timeout(function () {
        $scope.isErrorMessageReady = !$scope.isErrorMessageReady;
      }, 3000);
    }

    $scope.enqueue = function (selection) {
      $scope.toggleAlert();
      var selectedItems = selection.filter(filterSelection);
      dataResource.enqueue(selectedItems).then(function success(response) {
        resetSelection(selection);
        $scope.displaySuccessAlert();
      }, function error(err) {
        $scope.displayErrorAlert();
        console.log(err);
      });
    }

    $scope.syncProposals = function () {
      $scope.isSyncingWithRoutzy = true;
      dataResource.syncProposals().then(function success(response) {
        fetchInvoices();
        $scope.isSyncingWithRoutzy = false;
        console.log(response);
      }, function error(err) {
        console.log(error);
      });
    }

    $scope.filterInvoices = function (toggle, selection) {
      //resetSelection(selection);
      if (toggle) {
        $scope.invoiceFilter.proposal_type = 'Invoice';
      } else {
        delete $scope.invoiceFilter['proposal_type'];
      }
      console.log($scope.invoiceFilter);
    }

    $scope.filterNonExported = function (toggle, selection) {
      //resetSelection(selection);
      if (toggle) {
        $scope.invoiceFilter.qb_exported = 0;
      } else {
        delete $scope.invoiceFilter['qb_exported'];
      }
      console.log($scope.invoiceFilter);
    }

    //date picker
    $scope.startDate = new Date();
    $scope.endDate = new Date($scope.startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  }

})();
