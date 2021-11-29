/**
 * @author Bartlomiej Karmilowicz
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.formSubmissions')
      .controller('FormSubmissionsPageCtrl', FormSubmissionsPageCtrl);


  /** @ngInject */
  function FormSubmissionsPageCtrl($scope, $filter, editableOptions, editableThemes, dataResource, AuthService) {
    $scope.smartTablePageSize = 20;
    $scope.peopleTableData = [];
    sessionStorage.setItem('loggingMode', false);
    dataResource.fetchFormData().then(function success(response) {
      console.log(response);
      $scope.peopleTableData = response.data;
    }, function error(err) {
      console.log('err');
      console.log(err);
    });
  }

})();
