var Torso = require('torso');
var _ = require('underscore');
var counter = 0;

module.exports = Torso.View.extend({
  template: require('./child-template.hbs'),
  className: function() {
    return 'child-view ' + this.get('color') + ' ' + this.get('transitionClass');
  },

  initialize: function(args) {
    this.set('color', args.color);
    this.set('id', ++counter);
    this.listenTo(this.viewState, 'change:transitionClass change:color', this.refreshClass);
  },

  render: function() {
    Torso.View.prototype.render.call(this);
    this.refreshClass();
  },

  refreshClass: function() {
    this.$el.attr('class', _.result(this, 'className'));
  },

  transitionOut: function(detach) {
    var view = this;
    this.set('transitionClass', 'transition-out');
    setTimeout(function() {
      detach();
      view.set('transitionClass', '');
    }, 1000);
  },

  transitionIn: function(attach) {
    var view = this;
    this.set('transitionClass', 'transition-in');
    attach();
    _.defer(function() {
      setTimeout(function() {
        view.set('transitionClass', '');
      }, 1000);
    });
  },
});
