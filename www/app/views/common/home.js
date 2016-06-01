'use strict';

var View = require('views/base/view');
var context = require('models/context');

var Navbar = require('./navbar');

module.exports = View.extend({

  template: 'home',
  endpoint: null,

  views: {
    "#navbar-holder": new Navbar()
  },

  initialize: function (options) {
    //listen to context's current view
    this.listenTo(context, 'change:view', this.render);
  },

  beforeRender: function () {
    this.setWorkSpace();
  },

  afterRender: function () {
    //eventually fetch data from webservice
    if (this.endpoint) {
      this.endpoint.reload();
    }
  },

  //compose a new working view from matching route
  compose: function (viewName, collectionName, options) {
    var List = require('models/workspace/' + collectionName);
    var webservice = new List(null, options || {});

    var WorkView = require('views/workspace/' + viewName);
    return new WorkView({
      collection: webservice
    });
  },

  //set the view for workspace container
  setWorkSpace: function () {

    this.endpoint = null;
    var viewName = context.get('view');
    var workView = null;

    if (viewName === 'dashboard') {
      workView = this.compose(viewName, 'dashboard');

    } else {
      //unexpected match
      var NotFound = require('./404');
      workView = new NotFound();
    }

    if (workView) {
      //inject view, subview render will be done once associated webservice is synced
      this.setView("#workspace-holder", workView);
    }

    if (workView && workView.collection) {
      //store webservice to be called after layout has rendered
      this.endpoint = workView.collection;
    }
    return this;
  }

});
