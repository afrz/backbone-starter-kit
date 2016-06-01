'use strict';

var session = require('models/session');
var context = require('models/context');

var Router = Backbone.Router.extend({

  //defines routes
  routes: {
    "login": "login",
    "content/:id": "content",
    "*view": "gotoView",
  },

  //update URL address bar and fire route optionnaly
  nav: function (path, fire) {

    this.navigate(path || '', {
      trigger: fire,
      replace: !fire //history replace only when route is not trigger by code
    });
  },

  //go to default location
  gotoDefault: function () {
    this.nav('dashboard', true);
    return true;
  },

  //handle event on route matching
  execute: function (callback, args, name) {
    if (!session.isLogged()) {
      this.login();
      return false;
    }
    if (callback) callback.apply(this, args);
  },

  //disconnect user and prompt for credentials
  login: function () {
    this.nav('login', false);

    if (session.isLogged()) {
      session.revokeAccess();
    }
  },

  //display workspace view
  gotoView: function (view) {
    if (null === view) {
      return this.gotoDefault();
    }
    //reset context view to reached one
    context.reset('view', view);
  },

  //display entity content (URL -> MV)
  content: function (id) {

    context.set('content', id);
    context.reset('view', 'content');
  }
});

module.exports = new Router();
