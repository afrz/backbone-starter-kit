'use strict';

var View = require('views/base/view');
var session = require('models/session');

//top level view layout
module.exports = View.extend({

  //hook into html entry point
  el: '#app-container',

  initialize: function (options) {
    //listen to session's change
    this.listenTo(session, 'change:auth', this.update);
    this.update();
  },

  //update the view
  update: function () {

    var viewName = session.isLogged() ? 'home' : 'login';

    var MainView = require('./' + viewName);
    this.setView(new MainView());
    this.renderViews();
    return this;
  }

});
