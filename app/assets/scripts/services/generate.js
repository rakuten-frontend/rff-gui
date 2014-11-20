(function (window) {
  'use strict';

  var _ = require('lodash');
  var angular = window.angular;

  angular

    .module('app.services.generate', [
      'ngStorage',
      'app.services.content'
    ])

    .factory('GenerateModel', function (ContentModel) {

      var model = _.cloneDeep(ContentModel);
      return model;

    })

    .factory('GenerateStorage', function ($localStorage) {

      var storage = $localStorage.$default({
        generate: {
          workingDir: '',
          generatorName: 'generator-rff',
          install: true,
          settings: {
            name: '',
            markup: 'html',
            style: 'sass',
            script: 'js',
            testFramework: 'mocha',
            options: {
              cssmin: true,
              uglify: true,
              autoprefixer: true,
              rev: true,
              ssi: false
            }
          }
        }
      });

      // Force to activate `--skip-install` option.
      // TODO: Support install option again.
      storage.generate.install = false;

      return storage;

    });

}(window));
