'use strict';

var Model = require('models/base/model');

var Instance = Model.extend({

  defaults: {
    Id: '',
    DisplayLabel: '',
    Server: '',
    Engine: ''
  }

});


var Collection = require('models/base/collection');

var InstanceList = Collection.extend({

  model: Instance,

  api: "/instances",

  initialize: function (options) {}

});

module.exports = new InstanceList();
