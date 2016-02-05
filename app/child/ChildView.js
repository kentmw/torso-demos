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

  transitionOut: function(detach, options) {
    var view = this;
    this.set('transitionClass', options.transitionType == 'forward' ? 'leave-left' : 'leave-right');
    setTimeout(function() {
      detach();
      view.set('transitionClass', '');
    }, 500);
  },

  transitionIn: function(attach, options) {
    var view = this;
    var deferred = $.Deferred();
    this.set('transitionClass', options.transitionType == 'forward' ? 'in-from-right' : 'in-from-left');
    attach();
    setTimeout(function() {
      view.set('transitionClass', '');
      deferred.resolve();
    }, 500);
    return deferred.promise();
  },
});
