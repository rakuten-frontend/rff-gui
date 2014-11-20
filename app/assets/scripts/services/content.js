(function (window) {
  'use strict';

  var angular = window.angular;

  angular

    .module('app.services.content', [
      'ngStorage'
    ])

    .factory('ContentModel', function () {

      var model = {
        commandQueue: [],
        workers: [],
        notification: {
          show: false,
          message: '',
          status: ''
        }
      };
      return model;

    });

}(window));
