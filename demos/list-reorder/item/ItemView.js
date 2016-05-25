var Torso = require('torso');
var _ = require('underscore');
var $ = require('jquery');
var itemCollection = require('./itemCollection');

module.exports = Torso.View.extend({
  tagName: 'li',
  template: require('./item-template.hbs'),

  events: {
    'click .make-first': 'makeFirst'
  },

  makeFirst: function() {
    this.model.set('order', itemCollection.min(function(model) {return model.get('order');}).get('order') - 1);
    itemCollection.itemMoving = this.model;
    itemCollection.sort();
  }
});
