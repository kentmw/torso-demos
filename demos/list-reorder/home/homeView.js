var Torso = require('torso');
var _ = require('underscore');
var ItemView = require('../item/ItemView');
var itemCollection = require('../item/itemCollection');

module.exports = new (Torso.ListView.extend({
  className: 'home',
  tagName: 'ul',
  itemView: ItemView,
  collection: itemCollection,

  reorder: function() {
    var firstItemView, sameOrder,
      elements = [],
      models = this.modelsToRender(),
      newOrderOfIds = _.pluck(models, this.__modelId),
      sizeOfNewModels = _.size(newOrderOfIds),
      sizeOfOldModels = _.size(this.__orderedModelIdList),
      sameSize = sizeOfNewModels === sizeOfOldModels;

    //////////// NEW CODE ///////////
    if (this.collection.itemMoving) {
      this.animateReorder();
      this.__updateOrderedModelIdList(newOrderOfIds);
      this.trigger('reorder-complete');
      return;
    }
    /////////////////////////////////

    if (sameSize) {
      // is order the same?
      sameOrder = _.reduce(this.__orderedModelIdList, function(result, oldId, index) {
        return result && newOrderOfIds[index] == oldId;
      }, true);
    } else {
      throw 'Reorder should not be invoked if the number of models have changed';
    }
    if (!sizeOfNewModels || sameOrder) {
      // stop early if there are no models to reorder or the models are the same
      return;
    }
    _.each(models, function(model, index) {
      var itemView = this.getItemViewFromModel(model);
      if (itemView) {
        elements.push(itemView.$el);
      }
      if (index === 0) {
        firstItemView = itemView;
      }
    }, this);
    // elements that are already connected to the DOM will be moved instead of re-attached
    // meaning that detach, delegate events, and attach are not needed
    if (!this.itemContainer) {
      this.$el.append(elements);
    } else if (firstItemView) {
      var injectionSite = $("<span>");
      firstItemView.$el.before(injectionSite);
      injectionSite.after(elements);
      injectionSite.remove();
    }
    this.__updateOrderedModelIdList(newOrderOfIds);
    this.trigger('reorder-complete');
  },

  ///////// NEW METHOD /////////
  animateReorder: function() {
    // the clicked LI
    var clicked = this.getItemViewFromModel(this.collection.itemMoving).$el;
    this.collection.itemMoving = undefined;

    // all the LIs above the clicked one
    var previousAll = clicked.prevAll();

    // only proceed if it's not already on top (no previous siblings)
    if(previousAll.length > 0) {
      // top LI
      var top = $(previousAll[previousAll.length - 1]);

      // immediately previous LI
      var previous = $(previousAll[0]);

      // how far up do we need to move the clicked LI?
      var moveUp = clicked.offset().top - top.offset().top;

      // how far down do we need to move the previous siblings?
      var moveDown = (clicked.offset().top + clicked.outerHeight()) - (previous.offset().top + previous.outerHeight());
      // let's move stuff
      clicked.css('position', 'relative');
      previousAll.css('position', 'relative');
      clicked.animate({'top': -moveUp});
      previousAll.animate({'top': moveDown}, {complete: function() {
        // rearrange the DOM and restore positioning when we're done moving
        clicked.parent().prepend(clicked);
        clicked.css({'position': 'static', 'top': 0});
        previousAll.css({'position': 'static', 'top': 0});
      }});
    }
  }
  ///////////////////////////////
}))();

