'use strict';

var View = require('views/base/view');
var context = require('models/context');
var session = require('models/session');

module.exports = View.extend({

  template: 'navbar',

  initialize: function (options) {},

  afterRender: function () {
    //active menu corresponding to current view
    var viewName = context.get('view');
    this.$("#menuBar a[href*='" + viewName + "']").parent("li").addClass("active");

    //set user name
    this.$(".username").html(session.get('user'));
  }

});
