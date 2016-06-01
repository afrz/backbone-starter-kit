'use strict';

module.exports = {

  //display a passive UI alert
  throwMessage: function (message, level) {

    var context = require('models/context');
    context.set('level', level || 'info');
    context.reset('message', message);
  },

  //failure handler for asynchronous promise
  failback: function (message) {

    var self = this;
    //IIFE method to be invoked when promise fails
    return function (xhr, status, error) {
      var msg = message;
      msg += '<br/>' + xhr.status + ' ' + xhr.statusText + ' ' + error;
      //msg += '<br/>' + xhr.responseText;
      self.throwMessage(msg, 'danger');
    };
  }

};
