'use strict';

var Model = require('models/base/model');
var app = require('application');

var Session = Model.extend({

  api: '/authentication',

  defaults: {
    //indicates if user is authentified
    auth: false,
    //user name
    user: '',
    //connected domain server
    instance: '',
    //authentification token
    token: null
  },

  initialize: function (options) {
    //security manager for access control
    this.policy = require('helpers/security');
  },

  //restore session from local storage
  restore: function () {
    var storage = this.policy;
    if (storage) {
      //reload from local storage
      this.set('user', storage.userId);
      //preset instance from configuration file
      this.set('instance', storage.instanceId || _.result(app.config.instance, 'code'));

      //check if already authentified once
      if (storage.authorized()) {
        this.reset('auth', true);
      }
    }
  },

  //indicates if user is successfully logged
  isLogged: function () {
    return this.get('auth') === true;
  },

  //retrieve token
  getToken: function () {
    return this.policy.renewToken();
  },

  //authenticate user with credentials
  login: function (creds, callback) {
    //generate new token
    var token = this.policy.generateToken(creds.instance, creds.user, creds.password);

    var self = this;
    this.save({
        'user': creds.user,
        'instance': creds.instance,
        'token': token
      }, {
        wait: true,
        success: function (data, status) {
          if (callback) callback(true, status);
        }
      })
      .fail(function (xhr, status) {
        if (callback) callback(false, xhr.responseText);
      })
      .done(function () {
        //do not store token anymore
        self.reset('token');
        //grant access and open default location
        self.reset('auth', true);

        var router = require('router');
        router.gotoDefault();
      });
  },

  //remove access
  revokeAccess: function () {
    this.policy.logout(false);
    this.reset('token');
    this.reset('auth', false);
  },

  //allow to ping WEB API. returns promise.
  ping: function () {
    var self = this;
    //get back our own @IP from server
    var promise = $.get(app.getApiUrl('/ip'), function (data) {
      self.policy.ip = data;
    });
    return promise;
  }
});

//singleton export
module.exports = new Session();
