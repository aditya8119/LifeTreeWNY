/**
 * @author bkarmilowicz
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.login')
    .controller('LoginPageCtrl', LoginPageCtrl);

  /** @ngInject */
  function LoginPageCtrl() {
    sessionStorage.setItem('loggingMode', true);
  }

})();