(function (window) {
  'use strict';

  var path = require('path');
  var fs = require('fs');
  var open = require('open');
  var mkdirp = require('mkdirp');
  var _ = require('lodash');
  var angular = window.angular;

  angular

    .module('app.controllers.generate', [
      'app.controllers.content',
      'app.services.generate',
      'app.services.main'
    ])

    .controller('GenerateController', function ($scope, $controller, GenerateModel, GenerateStorage, AppService) {

      // Inheritance
      $controller('ContentController', {
        $scope: $scope
      });

      // Properties
      $scope.contentId = 'generate';
      $scope.model = GenerateModel;
      $scope.storage = GenerateStorage.generate;

      // Parse settings to generator answers
      // options: {a: true, b: true, ...} -> options: ['a', 'b', ...]
      $scope.parseSettings = function (settings) {
        var answers = _.cloneDeep(settings);
        answers.options = [];
        _.forEach(settings.options, function (val, key) {
          if (val) {
            answers.options.push(key);
          }
        });
        return answers;
      };

      // Execute generator
      $scope.generate = function () {
        var dir = $scope.storage.workingDir;
        if (!AppService.isAbsolutePath(dir)) {
          window.alert('Set absolute path into "Project Folder" field.');
          return;
        }
        if (AppService.isNonEmptyDir(dir)) {
          if (window.confirm('Target folder is not empty.\nAre you sure you want to extract files into the folder?')) {
            $scope.generateConfig();
            $scope.generateProject(true);
          }
        }
        else if (!AppService.isExistDir(dir)) {
          mkdirp(dir, function () {
            $scope.generateConfig();
            $scope.generateProject();
          });
        }
        else {
          $scope.generateConfig();
          $scope.generateProject();
        }
      };

      // Generate .yo-rc.json
      $scope.generateConfig = function () {
        var config = {};
        var json;
        config[$scope.storage.generatorName] = $scope.parseSettings($scope.storage.settings);
        json = JSON.stringify(config, null, 2);
        console.log('.yo-rc.json:\n' + json);
        fs.writeFileSync(path.join($scope.storage.workingDir, '.yo-rc.json'), json);
      };

      // Generate project files
      $scope.generateProject = function (force) {
        // TODO: Remove `--force` option and support interactive prompt.
        var skipInstallOption = !$scope.storage.install ? ' --skip-install' : '';
        var forceOption = force ? ' --force' : '';
        var child = $scope.registerCommand('yo rff --no-insight --skip-welcome-message' + skipInstallOption + forceOption, 'generate');
        child.on('exit', function (code) {
          if (code === 0) {
            open($scope.storage.workingDir);
          }
        });
      };

    });

}(window));
