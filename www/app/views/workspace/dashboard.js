'use strict';

var View = require('views/base/view');

module.exports = View.extend({

  className: 'dashboard',
  template: 'dashboard',

  initialize: function (options) {
    this.listenTo(this.collection, 'sync', this.render);
  },

  serialize: function () {
    return {
      board: this.collection.toJSON()
    };
  }

});
