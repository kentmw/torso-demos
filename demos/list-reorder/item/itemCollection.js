var Torso = require('backbone-torso');
var Item = require('./Item');
var _ = require('underscore');

var items = module.exports = new (Torso.Collection.extend({
  model: Item,
  comparator: 'order'
}))();

_.times(5, function(n) {
  items.add(new Item({order: n}));
});
