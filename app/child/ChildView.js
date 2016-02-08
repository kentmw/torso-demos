var Torso = require('torso');
var _ = require('underscore');
var $ = require('jquery');
var counter = 0;

module.exports = Torso.View.extend({
  template: require('./child-template.hbs'),
  className: function() {
    return 'child-view ' + this.get('color') + ' ' + this.get('transitionClass');
  },

  events: {
    'click .close': 'close'
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

  transitionOut: function(done, options) {
    var view = this;
    if (options.modal) {
      this.set('transitionClass', 'leave-top');
    } else {
      this.set('transitionClass', options.transitionType == 'forward' ? 'leave-left' : 'leave-right');
    }
    setTimeout(function() {
      view.detach();
      done();
    }, 500);
  },

  transitionIn: function(attach, done, options) {
    var view = this;
    var transitionClass;
    if (options.modal) {
      transitionClass = 'in-from-top';
    } else if (options.previousView) {
      transitionClass = (options.transitionType == 'forward') ? 'in-from-right' : 'in-from-left';
    } else {
      transitionClass = 'in-from-top';
    }
    this.set('transitionClass', transitionClass);
    attach();
    setTimeout(function() {
      view.set('transitionClass', '');
      done();
    }, 500);
  },

  close: function() {
    var deferred = $.Deferred();
    this.transitionOut(deferred.resolve, {modal: true});
    this.trigger('closed');
    return deferred.promise();
  }
});
