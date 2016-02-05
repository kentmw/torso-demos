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
    this.myChildViews= [
      new ChildView({color: 'red'}),
      new ChildView({color: 'blue'}),
      new ChildView({color: 'green'}),
      new ChildView({color: 'purple'}),
      new ChildView({color: 'orange'})
    ];
    this.set('current', 0);
    this.listenTo(this.viewState, 'change:current', this.render);
    this.listenTo()
  },

  render: function() {
    Torso.View.prototype.render.call(this);
    var newChildView = this.myChildViews[this.get('current')];
    if (this.get('previous') == undefined) {
      this.injectView('current', newChildView);
    } else {
      var previousChildView = this.myChildViews[this.get('previous')];
      this.transitionPromise = this.transitionView('current', newChildView, previousChildView, {
        transitionType: this.get('current') > this.get('previous') ? 'forward' : 'backwards'
      });
    }
  },

  prepare: function() {
    var context = Torso.View.prototype.prepare.call(this);
    context.maxIndexOfChildViews = _.size(this.myChildViews) - 1;
    return context;
  },

  next: function() {
    this.move(true);
  },

  back: function() {
    this.move(false);
  },

  move: function(forward) {
    var view = this;
    var current = this.get('current');
    if (this.transitionPromise && this.transitionPromise.state() != 'resolved') {
      this.transitionPromise.done(function() {
        view.move(forward);
      })
    } else if ((forward && current < (_.size(this.myChildViews) - 1)) || (!forward && current > 0)) {
      this.set('previous', current);
      this.set('current', current + (forward ? 1 : -1));
    }
  }


}))();
