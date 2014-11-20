(function (window) {
  'use strict';

  var _ = require('lodash');
  var moment = require('moment');
  var gui = require('nw.gui');
  var angular = window.angular;

  angular

    .module('app.controllers.libraryList', [
      'duScroll',
      'app.services.library',
      'app.services.libraryList',
      'app.services.build',
      'app.services.main',
      'app.controllers.content'
    ])

    .controller('LibraryListController', function ($scope, $controller, $timeout, LibraryModel, LibraryListModel, BuildStorage) {

      var timer;

      // Inheritance
      $controller('ContentController', {
        $scope: $scope
      });

      // Properties
      $scope.contentId = 'libraryList';
      $scope.model = LibraryListModel;
      $scope.storage = BuildStorage.build;  // TODO: Provide directory setting field in the view.
      $scope.resultsContainer = angular.element(document.getElementById('results-container'));
      $scope.query = $scope.model.query;

      // Refresh view
      $scope.refresh = function () {
        $scope.$parent.refresh();
        $scope.$apply();
      };

      // Open URL with browser
      $scope.openUrl = function (url) {
        gui.Shell.openExternal(url);
      };

      // Check installation
      $scope.isInstalled = function (name) {
        return _.has(LibraryModel.bower.dependencies, name);
      };

      // Get installed version
      $scope.getVersion = function (name) {
        return LibraryModel.bower.dependencies[name];
      };

      // Install a Bower component
      $scope.install = function (name, version) {
        var target = name;
        if (typeof version !== 'undefined' && version !== '') {
          target = target + '#' + version;
        }
        $scope.registerCommand('bower install ' + target + ' --save', 'install-' + name, $scope.refresh);
      };

      // Uninstall a Bower component
      $scope.uninstall = function (name) {
        $scope.registerCommand('bower uninstall ' + name + ' --save', 'uninstall-' + name, $scope.refresh);
      };

      // Formant date
      $scope.timeago = function (date) {
        return moment(date).fromNow();
      };

      // Prev page
      $scope.goPrev = function () {
        $scope.model.goPrev();
        $scope.resultsContainer.scrollTop(0);
      };

      // Next page
      $scope.goNext = function () {
        $scope.model.goNext();
        $scope.resultsContainer.scrollTop(0);
      };

      $scope.getSortedClass = function (field) {
        var className = '';
        if ($scope.model.sortField === field) {
          className = $scope.model.sortReverse ? 'sort-descend' : 'sort-ascend';
        }
        return className;
      };

      $scope.sortBy = function (field) {
        if ($scope.model.loaded) {
          $scope.model.sortBy(field);
        }
      };

      $scope.$watch('model.query', function () {
        $scope.query = $scope.model.query;
      });

      $scope.$watch('query', function () {
        if (timer) {
          $timeout.cancel(timer);
        }
        timer = $timeout(function () {
          $scope.model.query = $scope.query;
          $scope.model.search();
          $scope.resultsContainer.scrollTop(0);
        }, 300);
      });

      // Initialize
      if (!$scope.model.loaded) {
        $scope.model.loadComponents();
      }
      else {
        $scope.model.resetResults();
      }

    });

}(window));
