'use strict';

var context = require('models/context');
var utils = require('helpers/utils');
var app = require('application');

module.exports = Backbone.Collection.extend({

  //indicates that loading indicator shall be triggered
  waitIndicator: true,

  //compute web api endpoint location
  url: function () {
    var endpoint = this.api;
    if (_.isFunction(endpoint)) {
      //compute endpoint from current user
      endpoint = endpoint.call(this, app.session.get('user'));
    }
    return app.getApiUrl(endpoint);
  },

  //reload the list from webservice. returns promise.
  reload: function () {
    //start waiting
    if (this.waitIndicator) {
      context.wait(true);
    }

    //launch query
    var promise = this.fetch({
      reset: true
    });
    promise.fail(utils.failback('Unexpected error.'));
    promise.fail(function (xhr) {
      //check if unauthorized
      if (xhr.status === 401) {
        utils.throwMessage('Session has been ended. Please log again.', 'warning');
        require('router').login();
      }
    });

    //end of waiting
    if (this.waitIndicator) {
      promise.always(function () {
        context.wait(false);
      });
    }
    return promise;
  },

  initialize: function (options) {},

  //generate a new model based on attributes hash
  newModel: function (attributes) {
    var options = {};
    options.collection = this;
    return new this.model(attributes || {}, options);
  }

});
