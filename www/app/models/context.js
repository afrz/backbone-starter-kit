'use strict';

var Model = require('models/base/model');

var Context = Model.extend({

  defaults: {
    //current displayed view
    view: 'dashboard',
    //current displayed content identifier
    content: null,
    //message gravity level
    level: 'info',
    //current displayed message
    message: '',
    //current app state
    state: null
  },

  //activate or not the pending state
  wait: function (wait) {
    this.set('state', wait ? 'wait' : 'idle');
  }

});

module.exports = new Context();
