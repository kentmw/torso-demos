var Torso = require('torso');
var ChildView = require('../child/ChildView');

module.exports = new (Torso.View.extend({
  template: require('./home-template.hbs'),

  events: {
    'click .next': 'next',
    'click .back': 'back'
  },

  initialize: function() {
    this.redChild = new ChildView({color: 'red'});
    this.blueChild = new ChildView({color: 'blue'});
    this.listenTo(this.viewState, 'change:current', this.render);
    this.set('current', 'red');
  },

  render: function() {
    Torso.View.prototype.render.call(this);
    this.injectView('current', this.get('current') == 'red' ? this.redChild : this.blueChild);
  },

  next: function() {
    this.set('current', 'blue');
  },

  back: function() {
    this.set('current', 'red');
  }


}))();
