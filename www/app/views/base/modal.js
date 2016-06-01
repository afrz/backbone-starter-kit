'use strict';

var View = require('./view');

//abstract modal view
module.exports = View.extend({

  initialize: function (options) {
    //juste listen one time because it's a modal view
    this.listenToOnce(this.collection, 'sync', this.render);
    _.bindAll(this, 'refresh');
  },

  afterRender: function () {
    //force show modal after rendering
    this.open();
  },

  cleanup: function () {
    //ensure modal is closed when view change
    this.close();
  },

  //pops the modal up
  open: function () {
    //pops modal
    this.$('.modal').modal({
      backdrop: true
    });
  },

  //close the modal
  close: function () {
    this.$('.modal').modal('hide');
  },

  //reopen modal with up-to-date info
  refresh: function () {

    this.close();
    if (this.collection) {
      var self = this;
      //reload data and then render
      this.collection.reload().done(function () {
        self.render();
      });
    }
  }

});
