var Torso = require('torso');
var _ = require('underscore');
var ChildView = require('../child/ChildView');

module.exports = new (Torso.View.extend({
  template: require('./home-template.hbs'),
  className: 'home',

  events: {
    'click .next': 'next',
    'click .back': 'back',
    'click .render': 'render',
    'click .popup': 'popup'
  },

  initialize: function() {
    this.myChildViews= [
      new ChildView({color: 'red'}),
      new ChildView({color: 'blue'}),
      new ChildView({color: 'green'}),
      new ChildView({color: 'purple'}),
      new ChildView({color: 'orange'})
    ];
    this.popupChildView = new ChildView({color: 'black', modal: true});
    this.set('current', 0);
    this.set('previous', -1);
    this.listenTo(this.viewState, 'change:current', this.render);
    this.listenTo(this.popupChildView, 'closed', this.popupClosed);
  },

  render: function() {
    var view = this;
    if (this.transitionPromise && this.transitionPromise.state() != 'resolved') {
      this.transitionPromise.done(function() {
        view.render();
      })
    } else {
      Torso.View.prototype.render.call(this);
      this.transitionPromise = this.injectView('current', this.myChildViews[this.get('current')], {
        transitionType: this.get('current') > this.get('previous') ? 'forward' : 'backwards',
        useTransition: true
      });
      if (this.get('popup-open')) {
        this.injectView('popup', this.popupChildView);
      }
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
  },

  popup: function() {
    if (this.get('popup-open')) {
      this.popupChildView.close();
      this.set('popup-open', false);
    } else {
      this.transitionInView(this.$('[inject="popup"]'), this.popupChildView);
      this.set('popup-open', true);
    }
  },

  popupClosed: function() {
    this.set('popup-open', false);
  }


}))();
