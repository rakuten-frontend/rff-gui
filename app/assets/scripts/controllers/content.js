(function (window) {
  'use strict';

  var open = require('open');
  var _ = require('lodash');
  var angular = window.angular;
  var LZADialog = window.LZADialog;

  angular

    .module('app.controllers.content', [
      'app.services.main',
      'app.services.content',
      'app.services.console'
    ])

    .controller('ContentController', function ($scope, $rootScope, $timeout, AppService, ContentModel, ConsoleService) {

      // Properties
      $scope.contentId = '';
      $scope.model = ContentModel;
      $scope.storage = null;

      // Events
      $scope.$on('$viewContentLoaded', function () {
        AppService.initialized = true;
      });

      // Directory select dialog
      $scope.selectDir = function (target) {
        LZADialog.selectDir({
          workingdir: AppService.isExistDir($scope.storage[target]) ? $scope.storage[target] : AppService.homeDir
        }, function (dir) {
          $scope.storage[target] = dir.path;
          $scope.$apply();
        });
      };

      // Open directory or file
      $scope.open = function (path) {
        open(path);
      };

      // Register command to execution queue
      $scope.registerCommand = function (command, id, callback) {
        // Multiple commands
        if (_.isArray(command)) {
          command.forEach(function (cmd, index) {
            if (index === command.length - 1 && typeof callback === 'function') {
              $scope.registerCommand(cmd, id, callback);
            }
            else {
              $scope.registerCommand(cmd, id);
            }
          });
          return;
        }
        // Single command
        $scope.model.commandQueue.push({command: command, id: id, callback: callback});
        if ($scope.model.commandQueue.length === 1) {
          $scope.executeQueueCommand();
        }
      };

      // Execute command
      $scope.execute = function (command, id, callback) {
        var child = ConsoleService.executeStdin(command, {cwd: $scope.storage.workingDir});
        $scope.model.workers.push({command: command, id: id, callback: callback, child: child});
        child.on('exit', function (code) {
          switch (code) {
            case 0:
              $scope.showNotification('Success', 'success');
              break;
            default:
              $scope.showNotification('Error', 'danger');
              break;
          }
          if (typeof callback === 'function') {
            callback();
          }
          $scope.model.workers = _.reject($scope.model.workers, {id: id});
          $scope.$apply();
        });
        return child;
      };

      // Execute command in queue
      $scope.executeQueueCommand = function () {
        var next = $scope.model.commandQueue[0];
        var child = next.callback ?
                    $scope.execute(next.command, next.id, next.callback) :
                    $scope.execute(next.command, next.id);
        child.on('exit', function () {
          $scope.model.commandQueue.shift();
          if ($scope.model.commandQueue.length !== 0) {
            $scope.executeQueueCommand();
            $scope.$apply();
          }
        });
      };

      // Kill process
      $scope.kill = function (id) {
        var workers = _.filter($scope.model.workers, {id: id});
        workers.forEach(function (worker) {
          ConsoleService.killProcessTree(worker.child);
        });
      };

      // Check entry of queue/workers
      $scope.isProcessing = function () {
        return $scope.model.commandQueue.length !== 0 || $scope.model.workers.length !== 0;
      };

      // Check entry in queue
      $scope.isInCommandQueue = function (id) {
        return _.filter($scope.model.commandQueue, {id: id}).length !== 0;
      };

      // Check entry in workers
      $scope.isInWorkers = function (id) {
        return _.filter($scope.model.workers, {id: id}).length !== 0;
      };

      // Show notification
      $scope.showNotification = function (message, status, autoHide) {
        autoHide = typeof autoHide === 'undefined' ? true : autoHide;
        $scope.model.notification.message = message;
        $scope.model.notification.status = status;
        $scope.model.notification.show = true;
        if (autoHide) {
          $timeout(function () {
            $scope.hideNotification();
          }, 2000);
        }
      };

      // Hide notification
      $scope.hideNotification = function () {
        $scope.model.notification.show = false;
      };

      $scope.$watch('isProcessing()', function (processing) {
        AppService.processing[$scope.contentId] = processing;
      });

    });

}(window));
