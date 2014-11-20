(function (window) {
  'use strict';

  var _ = require('lodash');
  var angular = window.angular;

  angular

    .module('app.services.libraryList', [
      'app.services.content'
    ])

    .factory('LibraryListModel', function ($http, ContentModel) {

      var model = _.cloneDeep(ContentModel);
      var api = 'https://bower-component-list.herokuapp.com/';
      var ignore = require('./assets/scripts/config/ignore');
      var whitelist = require('./assets/scripts/config/whitelist');

      model.components = [];
      model.list = [];
      model.results = [];
      model.searching = false;
      model.loaded = false;
      model.loadingError = false;
      model.page = 1;
      model.count = 0;
      model.pageCount = 1;
      model.limit = 30;
      model.sortField = '';
      model.sortReverse = false;
      model.query = '';

      model.loadComponents = function () {
        model.searching = true;
        model.loadingError = false;
        model.getComponents().success(function (data) {
          model.components = data;
          model.list = model.components;
          model.loaded = true;
          model.resetResults();
        });
      };

      model.resetResults = function () {
        model.sortField = 'stars';
        model.sortReverse = true;
        model.query = '';
        model.search();
      };

      model.getComponents = function () {
        return $http.get(api)
          .success(function (res) {
            model.searching = false;
            return res.data;
          })
          .error(function () {
            model.searching = false;
            model.loadingError = true;
            return false;
          });
      };

      model.updateResults = function () {
        var from = (model.page - 1) * model.limit;
        var to = from + model.limit;
        model.results = model.list.slice(from, to);
      };

      model.goPrev = function () {
        if (model.hasPrev()) {
          model.page--;
          model.updateResults();
        }
      };

      model.goNext = function () {
        if (model.hasNext()) {
          model.page++;
          model.updateResults();
        }
      };

      model.hasPrev = function () {
        return model.page > 1;
      };

      model.hasNext = function () {
        return model.page < model.pageCount;
      };

      model.sort = function () {
        var list = _.sortBy(model.list, function (item) {
          return item[model.sortField];
        });
        if (model.sortReverse) {
          list = list.reverse();
        }
        model.list = list;
      };

      model.sortBy = function (field) {
        if (field === model.sortField) {
          model.sortReverse = !model.sortReverse;
        }
        else {
          model.sortField = field;
          model.sortReverse = false;
        }
        model.sort();
        model.updateResults();
      };

      model.search = function () {
        var query = model.query;
        var list = _.filter(model.components, function (item) {
          if (ignore.indexOf(item.name) !== -1) {
            return false;
          }
          if (_.isString(item.website) && typeof whitelist[item.website] !== 'undefined') {
            if (item.name !== whitelist[item.website]) {
              return false;
            }
          }
          if (query === '') {
            return true;
          }
          if (item.name.indexOf(query.toLowerCase()) !== -1 ||
                   (item.description && item.description.indexOf(query.toLowerCase()) !== -1) ||
                   item.owner.indexOf(query.toLowerCase()) !== -1) {
            return true;
          }
          return false;
        });
        model.list = list;
        model.page = 1;
        model.count = model.list.length;
        model.pageCount = Math.ceil(model.count / model.limit);
        model.sort();
        model.updateResults();
      };

      return model;

    });

}(window));
