'use strict';

var View = require('views/base/view');
var app = require('application');

module.exports = View.extend({

  template: 'login',

  initialize: function (options) {},

  events: {
    "shown.bs.modal .modal": "onShown",
    "keypress": "onKeyPressed",
    "click #auth": "tryLogin",
  },

  serialize: function () {
    var instances = require('models/instance-list');
    return {
      current: app.session.get('instance'),
      instances: instances.toJSON()
    };
  },

  afterRender: function () {
    //pops modal
    this.$('.modal').modal({
      backdrop: false,
      keyboard: false
    });

    if (_.result(app.config.instance, 'lock')) {
      this.$('#server').hide();
    }
  },

  //when modal is shown
  onShown: function () {
    //set and focus login input
    var input = this.$('#login');
    input.val(app.session.get('user'));
    input.focus();
  },

  //when key is pressed
  onKeyPressed: function (e) {
    //reset hint
    this.hint('');

    if (e.keyCode === 13) {
      //on ENTER
      e.stopPropagation();
      this.tryLogin();
    }
  },

  //close the modal
  close: function () {
    this.$('.modal').modal('hide');
  },

  //displays hint
  hint: function (value) {
    this.$('#hint').html(value);
  },

  //attempts to authenticate user
  tryLogin: function () {
    var creds = {
      user: this.$('#login').val().toUpperCase(),
      password: this.$('#password').val(),
      instance: this.$('#server').val()
    };
    if (creds.user) {
      var self = this;
      var utils = require('helpers/utils');
      app.session.login(creds, function (auth, message) {
        //afterwards authentication : closes modal or warns user
        if (auth) {
          //clean message first
          utils.throwMessage('');
          self.close();
        } else {
          self.hint(message);
        }
      });
    }
  }

});
