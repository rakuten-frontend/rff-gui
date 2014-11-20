(function (window) {
  'use strict';

  var angular = window.angular;

  angular

    .module('app.controllers.develop', [
      'app.services.develop',
      'app.services.build',
      'app.services.console',
      'app.controllers.content'
    ])

    .controller('DevelopController', function ($scope, $controller, DevelopModel, BuildStorage, ConsoleService) {

      // Inheritance
      $controller('ContentController', {
        $scope: $scope
      });

      // Properties
      $scope.contentId = 'develop';
      $scope.model = DevelopModel;
      $scope.storage = BuildStorage.build;  // TODO: Provide directory setting field in the view.

      // Execute command
      $scope.submit = function () {
        if (!$scope.hasChildProcess()) {  // TODO: This conditional should NOT be needed.
          $scope.registerCommand($scope.model.command, 'input');
          $scope.model.command = '';
        }
      };

      // Check child process
      $scope.hasChildProcess = function () {
        return ConsoleService.processing;
      };

      // Kill processes
      $scope.quit = function () {
        ConsoleService.killAll();
      };

    });

}(window));
