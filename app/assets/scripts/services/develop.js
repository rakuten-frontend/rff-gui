(function (window) {
  'use strict';

  var _ = require('lodash');
  var angular = window.angular;

  angular

    .module('app.services.develop', [
      'ngStorage',
      'app.services.content'
    ])

    .factory('DevelopModel', function (ContentModel) {

      var model = _.cloneDeep(ContentModel);
      model.command = '';
      return model;

    })

    .factory('DevelopStorage', function ($localStorage) {

      var storage = $localStorage.$default({
        develop: {
          workingDir: ''
        }
      });
      return storage;

    });

}(window));
