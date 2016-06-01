'use strict';

var app = require('application');

module.exports = Backbone.Model.extend({

  //map backbone ID to web API identifier
  idAttribute: "Id",

  url: function () {
    var url = Backbone.Model.prototype.url.call(this);
    return app.getApiUrl(url);
  },

  //compute web api endpoint location
  urlRoot: function () {
    var session = require('models/session');

    var endpoint = this.api;
    if (_.isFunction(endpoint)) {
      //compute endpoint from current user
      endpoint = endpoint.call(this, session.get('user'));

    } else if (!endpoint) {
      //if no endpoint overriden on model, use collection's one...
      endpoint = this.collection.api(session.get('user'));
    }
    return endpoint;
  },

  initialize: function (attributes, options) {},

  //reset property value
  reset: function (property, value) {
    //silent clear first
    this.unset(property, {
      silent: true
    });
    //set if value provided
    if (!_.isUndefined(value)) {
      this.set(property, value);
    }
  },

  //load/fetch the model from webservice. returns xhr/promise.
  load: function () {
    var promise = this.fetch({});
    return promise;
  },

  //save the model to the server. returns xhr/promise.
  store: function (attributes, options) {
    var hash = attributes || {};
    var opts = options || {};
    opts.wait = true;
    return this.save(hash, opts);
  },

  //delete the model from the server. returns xhr/promise.
  drop: function () {
    var promise = this.destroy({
      wait: true
    });
    return promise;
  }

});
