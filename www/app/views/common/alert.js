'use strict';

var View = require('views/base/view');
var context = require('models/context');

module.exports = View.extend({

  el: '#alert-container',
  template: 'alert',

  initialize: function (options) {
    //listen to context's throw message
    this.listenTo(context, 'change:message', this.render);
  },

  serialize: function () {
    return {
      level: context.get('level'),
      message: context.get('message')
    };
  },

  afterRender: function () {
    var alertbox = this.$('#zen-alert-box');
    if (context.get('message')) {
      alertbox.show();
    } else {
      alertbox.hide();
    }
  }

});
