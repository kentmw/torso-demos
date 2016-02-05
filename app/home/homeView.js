var Torso = require('torso');
var _ = require('underscore');
var ChildView = require('../child/ChildView');

module.exports = new (Torso.View.extend({
  template: require('./home-template.hbs'),
  className: 'home',

  events: {
    'click .next': 'next',
    'click .back': 'back'
  },

  initialize: function() {
    this.redChild = new ChildView({color: 'red'});
    this.blueChild = new ChildView({color: 'blue'});
    this.myChildViewMap = {
      red: this.redChild,
      blue: this.blueChild
    };
    this.set('current', 'red');
    this.listenTo(this.viewState, 'change:current', this.render);
  },

  render: function() {
    Torso.View.prototype.render.call(this);
    var newChildView = this.myChildViewMap[this.get('current')];
    var previousChildView = this.myChildViewMap[this.get('previous')];
    if (!previousChildView) {
      this.injectView('current', newChildView);
    } else {
      this.transitionView('current', newChildView, previousChildView);
    }
  },

  next: function() {
    this.set('previous', this.get('current'));
    this.set('current', 'blue');
  },

  back: function() {
    this.set('previous', this.get('current'));
    this.set('current', 'red');
  }


}))();
