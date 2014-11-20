(function (window) {
  'use strict';

  var _ = require('lodash');
  var angular = window.angular;

  angular

    .module('app.services.build', [
      'ngStorage',
      'app.services.content'
    ])

    .factory('BuildModel', function (ContentModel) {

      var model = _.cloneDeep(ContentModel);
      return model;

    })

    .factory('BuildStorage', function ($localStorage) {

      var storage = $localStorage.$default({
        build: {
          workingDir: ''
        }
      });
      return storage;

    });

}(window));
