'use strict';


var Collection = require('models/base/collection');

module.exports = Collection.extend({

  waitIndicator: false,

  api: function (user) {
    return '/dashboard';
  },

  initialize: function (models, opts) {}

});
