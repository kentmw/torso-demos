var Torso = require('torso');
var counter = 0;

module.exports = Torso.View.extend({
  template: require('./child-template.hbs'),

  initialize: function(args) {
    this.set('color', args.color);
    this.set('id', ++counter);
  }
});
