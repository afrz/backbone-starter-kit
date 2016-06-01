'use strict';

var View = require('views/base/view');
var context = require('models/context');

module.exports = View.extend({

  el: '#wait-container',
  template: 'wait',

  initialize: function (options) {
    //first and last render
    this.render();
    //listen for state change
    this.listenTo(context, 'change:state', this.spin);
  },

  //manage spin display
  spin: function () {

    var spinner = this.$('.wait');
    if (context.get('state') === 'wait') {
      spinner.show();
    } else {
      spinner.hide();
    }
  }

});
