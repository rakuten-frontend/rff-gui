(function (window) {
  'use strict';

  var path = require('path');
  var fs = require('fs');
  var _ = require('lodash');
  var angular = window.angular;

  angular

    .module('app.services.library', [
      'ngStorage',
      'app.services.content'
    ])

    .factory('LibraryModel', function (ContentModel, BuildStorage) {

      var model = _.cloneDeep(ContentModel);

      model.bower = {
        dependencies: []
      };

      model.loadBowerJson = function () {
        var json;
        try {
          var buffer = fs.readFileSync(path.join(BuildStorage.build.workingDir, 'bower.json'));
          json = JSON.parse(buffer);
        } catch (e) {
          json = {};
        }
        model.bower = json;
      };

      return model;

    })

    .factory('LibraryStorage', function ($localStorage) {

      var storage = $localStorage.$default({
        library: {
          workingDir: ''
        }
      });
      return storage;

    });

}(window));
