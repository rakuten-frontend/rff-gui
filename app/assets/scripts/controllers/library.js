(function (window) {
  'use strict';

  var path = require('path');
  var angular = window.angular;

  angular

    .module('app.controllers.library', [
      'app.services.library',
      'app.services.build',
      'app.services.main',
      'app.controllers.content'
    ])

    .controller('LibraryController', function ($scope, $controller, LibraryModel, BuildStorage, AppService) {

      // Inheritance
      $controller('ContentController', {
        $scope: $scope
      });

      // Properties
      $scope.contentId = 'library';
      $scope.model = LibraryModel;
      $scope.storage = BuildStorage.build;  // TODO: Provide directory setting field in the view.

      // State
      $scope.hasValidBower = function () {
        return AppService.isExistFile(path.join($scope.storage.workingDir, 'bower.json'));
      };

      // Refresh with bower.json data
      $scope.refresh = function () {
        $scope.model.loadBowerJson();
        $scope.$apply();
      };

      // Uninstall a Bower component
      $scope.uninstall = function (name) {
        $scope.registerCommand('bower uninstall ' + name + ' --save', 'uninstall-' + name, $scope.refresh);
      };

      // Initialize
      $scope.model.loadBowerJson();

    });

}(window));
