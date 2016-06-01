'use strict';

var app = require('application');
var utils = require('helpers/utils');

$(function () {

  //retrieve configuration file
  var cfg = $.getJSON("config.json");
  cfg.fail(utils.failback('Can not read configuration file.'));
  cfg.done(function (data) {
    //add to global namespace
    _.extend(app, data);
    //init process
    wireComponents();
    start();
  });

  //register third party components
  function wireComponents() {

    //TODO : MOCK for Backbone sync
    var _syncer = Backbone.sync;
    Backbone.sync = function (method, model, options) {

      if (method === 'create' || method === 'update' || method === 'patch') {
        //returns resolved promise
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
      }
      //for GET, will look through JSON
      return _syncer.apply(this, [method, model, options]);
    };

    //initialize layout manager
    Backbone.Layout.configure({
      //install container/layout view over backbone view
      manage: true,

      //base name for template location
      prefix: app.settings.paths.templates,

      //method will check for prebuilt templates
      fetchTemplate: function (path) {
        return require(path);
      }
    });
  }

  //initialize app
  function start() {

    //create static error view
    var AlertView = require("views/common/alert");
    new AlertView();

    //create static waiting view
    var WaitView = require("views/common/wait");
    new WaitView();

    //create session
    app.session = require("models/session");
    app.session.restore();

    /* TODO API test and start
    //create instances
    var instances = require("models/instance-list");

    //asynchronous ping and instances loading
    var preload = $.when(app.session.ping(), instances.reload());
    preload.fail(utils.failback('Failure during preloading.'));
    preload.done(app.launch);
    */
    app.launch();
  }
});
