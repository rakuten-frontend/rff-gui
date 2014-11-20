(function (window) {
  'use strict';

  var path = require('path');
  var fs = require('fs');
  var _ = require('lodash');
  var angular = window.angular;

  angular

    .module('app.services.main', [
      'ngStorage'
    ])

    .factory('AppService', function () {

      var pkg = require('./package.json');

      // Service
      var service = {

        // Application or user data
        name: pkg.name,
        version: pkg.version,
        isWin: process.platform === 'win32',
        isMac: process.platform === 'darwin',
        appDir: path.resolve('.'),
        homeDir: process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'],
        initialized: false,
        processing: {
          generate: false,
          build: false,
          library: false,
          libraryList : false,
          develop: false
        },

        // Utilities
        isAbsolutePath: function (p) {
          return path.normalize(p) === path.resolve(p);
        },
        isExistDir: function (p) {
          return service.isAbsolutePath(p) && fs.existsSync(p) && fs.lstatSync(p).isDirectory();
        },
        isExistFile: function (p) {
          return service.isAbsolutePath(p) && fs.existsSync(p) && fs.lstatSync(p).isFile();
        },
        isNonEmptyDir: function (p) {
          var isNonEmptyDir = false;
          var files;
          if (service.isExistDir(p)) {
            files = fs.readdirSync(p);
            if (service.isMac) {
              files = _.without(files, '.DS_Store');
            }
            if (files.length > 0) {
              isNonEmptyDir = true;
            }
          }
          return isNonEmptyDir;
        }

      };
      return service;

    })

    .factory('AppStorage', function ($localStorage) {

      var storage = $localStorage.$default({
        main: {
          state: 'generate'
        }
      });
      return storage;

    });

}(window));
