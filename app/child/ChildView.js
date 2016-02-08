var Torso = require('torso');
var _ = require('underscore');
var $ = require('jquery');
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

  transitionOut: function(detach, done, options) {
    var view = this;
    this.set('transitionClass', options.transitionType == 'forward' ? 'leave-left' : 'leave-right');
    setTimeout(function() {
      detach();
      done();
    }, 500);
  },

  transitionIn: function(attach, done, options) {
    var view = this;
    var transitionClass = (options.transitionType == 'forward') ? 'in-from-right' : 'in-from-left';
    this.set('transitionClass', transitionClass);
    attach();
    setTimeout(function() {
      view.set('transitionClass', '');
      done();
    }, 500);
  },
});
