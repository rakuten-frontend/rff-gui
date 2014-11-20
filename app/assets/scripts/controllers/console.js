(function (window) {
  'use strict';

  var angular = window.angular;

  angular

    .module('app.controllers.console', [
      'ui.router',
      'duScroll',
      'app.services.console',
      'app.services.main'
    ])

    .controller('ConsoleController', function ($scope, $rootScope, $element, $timeout, $sce, $state, ConsoleService, AppService) {

      // Properties
      $scope.templateUrl = '/assets/templates/console.html';
      $scope.log = $sce.trustAsHtml(ConsoleService.log());
      $scope.element = null;
      $scope.container = null;
      $scope.oneline = true;

      // Auto scroll to bottom
      // TODO: Improve manipulation. This code is complicated.
      $scope.included = function () {
        $scope.element = $element.next();
        $scope.container = $scope.element.find('pre');
        $scope.$watch(function () { return $scope.container.prop('scrollHeight'); }, function () {
          $scope.scrollToBottom();
        });
      };
      $scope.scrollToBottom = function () {
        $scope.container.scrollTop($scope.container.prop('scrollHeight') - $scope.container.prop('offsetHeight'));
      };

      // Sync log with service
      $scope.$watch(function () { return ConsoleService.log(); }, function () {
        $scope.log = $sce.trustAsHtml(ConsoleService.log());
      });

      // Switch view style (one-line or pane)
      $rootScope.$on('$stateChangeSuccess', function (event, toState) {
        if (toState.name === 'develop') {
          $scope.oneline = false;
        }
        else {
          $scope.oneline = true;
        }
        $timeout(function () {
          $scope.scrollToBottom();
        }, 0);
      });

      // Initial message
      ConsoleService.push('Welcome to ' + AppService.name + ' v' + AppService.version + '.\n');

    });

}(window));
