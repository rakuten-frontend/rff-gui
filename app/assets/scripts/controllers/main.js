(function (window) {
  'use strict';

  var gui = require('nw.gui');
  var angular = window.angular;

  angular

    .module('app.controllers.main', [
      'app.services.main'
    ])

    .controller('MainController', function ($scope, $timeout, $state, AppService, AppStorage) {

      var unbindInitializeWatch;

      $scope.service = AppService;

      // Show application window when initialized
      unbindInitializeWatch = $scope.$watch(function () { return AppService.initialized; }, function (initialized) {
        if (initialized) {
          unbindInitializeWatch();
          $timeout(function () {
            var win = gui.Window.get();
            win.show();
            win.focus();  // Trigger focus method for some platforms
          }, 0);
        }
      });

      // Go to saved state
      $scope.storage = AppStorage.main;
      $timeout(function () {
        $state.go($scope.storage.state);
      }, 0);

      // Sync state with storage
      $scope.$on('$stateChangeSuccess', function (event, toState) {
        $scope.storage.state = toState.name.split('.')[0];
      });

    });

}(window));
