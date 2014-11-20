(function (window) {
  'use strict';

  var path = require('path');
  var angular = window.angular;

  angular

    .module('app.controllers.build', [
      'app.controllers.content',
      'app.services.build',
      'app.services.main'
    ])

    .controller('BuildController', function ($scope, $controller, BuildModel, BuildStorage, AppService) {

      // Inheritance
      $controller('ContentController', {
        $scope: $scope
      });

      // Properties
      $scope.contentId = 'build';
      $scope.model = BuildModel;
      $scope.storage = BuildStorage.build;

      // State
      $scope.hasValidDir = function () {
        return AppService.isExistDir($scope.storage.workingDir);
      };
      $scope.hasValidPackage = function () {
        return AppService.isExistFile(path.join($scope.storage.workingDir, 'package.json'));
      };
      $scope.hasValidConfig = function () {
        return AppService.isExistFile(path.join($scope.storage.workingDir, 'Gruntfile.js')) &&
               AppService.isExistDir(path.join($scope.storage.workingDir, 'node_modules'));
      };

    });

}(window));
