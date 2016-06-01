'use strict';

module.exports = {

  //configuration settings
  settings: {
    //path shortcuts
    paths: {
      templates: "templates/",
      iconography: "./iconography/"
    }
  },

  //top application view
  overview: null,
  //main application router
  router: null,
  //user session
  session: null,

  //gets the full URL for ZEN web API
  getApiUrl: function (url) {

    var tkn = this.session.getToken();
    //each query shall sent a renewed token
    //return this.config.webAPI + url + '/?token=' + tkn;
    //TODO use JSON instead real API
    return this.config.webAPI + url + '.json?token=';
  },

  //gets the relative path to instance iconography
  getIcoPath: function () {
    return this.settings.paths.iconography + this.session.get('instance') + '/';
  },

  //launch app
  launch: function () {

    //create main app container
    var AppView = require("views/common/app");
    this.overview = new AppView();

    this.router = require('router');
    Backbone.history.start({});
  }
};
