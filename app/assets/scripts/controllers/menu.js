(function (window) {
  'use strict';

  var angular = window.angular;

  angular

    .module('app.controllers.menu', [
      'ui.router',
      'app.services.main'
    ])

    .controller('MenuController', function ($scope, $location, $state, AppService) {

      // Properties
      $scope.templateUrl = '/assets/templates/menu.html';
      $scope.menus = [
        {
          id: 'generate',
          title: 'New Project'
        },
        {
          id: 'build',
          title: 'Build'
        },
        {
          id: 'library',
          title: 'Libraries'
        },
        {
          id: 'develop',
          title: 'Console'
        }
      ];
      $scope.$state = $state;
      $scope.processing = AppService.processing;

    });

}(window));
