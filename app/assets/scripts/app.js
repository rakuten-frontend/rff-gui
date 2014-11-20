(function (window) {
  'use strict';

  var angular = window.angular;

  angular

    .module('app', [
      'ui.router',
      'ngAnimate',
      'app.controllers.main',
      'app.controllers.menu',
      'app.controllers.generate',
      'app.controllers.build',
      'app.controllers.library',
      'app.controllers.libraryList',
      'app.controllers.develop',
      'app.controllers.console'
    ])

    .config(function ($stateProvider, $urlRouterProvider, $compileProvider) {

      // Redirect
      $urlRouterProvider.otherwise('/generate');

      // Routes
      $stateProvider
        .state('generate', {
          url: '/generate',
          templateUrl: '/assets/templates/generate.html',
          controller: 'GenerateController'
        })
        .state('build', {
          url: '/build',
          templateUrl: '/assets/templates/build.html',
          controller: 'BuildController'
        })
        .state('library', {
          url: '/library',
          templateUrl: '/assets/templates/library.html',
          controller: 'LibraryController'
        })
        .state('library.list', {
          url: '/list',
          templateUrl: '/assets/templates/library-list.html',
          controller: 'LibraryListController'
        })
        .state('develop', {
          url: '/develop',
          templateUrl: '/assets/templates/develop.html',
          controller: 'DevelopController'
        });

      // Prevent unsafe href of 'app://'
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|app):/);

    });

}(window));
