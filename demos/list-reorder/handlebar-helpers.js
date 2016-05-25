var _ = require('underscore');

module.exports = function(Handlebars) {
  Handlebars.registerHelper('times', function(n, block) {
    var accum = '';
    for (var i = 0; i < n; ++i) {
      block.data.index = i;
      block.data.time = i + 1;
      accum += block.fn(i);
    }
    return accum;
  });

  Handlebars.registerHelper('contains', function(v1, v2, options) {
    if (_.has(v1, v2)) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper('size', function(v1, options) {
    return _.size(v1);
  });

  Handlebars.registerHelper('sizeIs', function(v1, v2, options) {
    return _.size(v1) == Number(v2);
  });

  Handlebars.registerHelper('isNotEmpty', function(v1, options) {
    if (!_.isEmpty(v1)) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper('sum', function(v1, prop, options) {
    return _.reduce(v1, function(memo, num) {
      if (_.isString(prop)) {
        return memo + num[prop];
      } else {
        return memo + num;
      }
    }, 0);
  });

  Handlebars.registerHelper('ifCond', function(v1, operator, v2, options) {
      switch (operator) {
          case '==':
              return (v1 == v2) ? options.fn(this) : options.inverse(this);
          case '===':
              return (v1 === v2) ? options.fn(this) : options.inverse(this);
          case '!==':
              return (v1 !== v2) ? options.fn(this) : options.inverse(this);
          case '<':
              return (v1 < v2) ? options.fn(this) : options.inverse(this);
          case '<=':
              return (v1 <= v2) ? options.fn(this) : options.inverse(this);
          case '>':
              return (v1 > v2) ? options.fn(this) : options.inverse(this);
          case '>=':
              return (v1 >= v2) ? options.fn(this) : options.inverse(this);
          case '&&':
              return (v1 && v2) ? options.fn(this) : options.inverse(this);
          case '||':
              return (v1 || v2) ? options.fn(this) : options.inverse(this);
          default:
              return options.inverse(this);
      }
  });

  Handlebars.registerHelper("forEach",function(arr,options) {
      if(options.inverse && !arr.length)
          return options.inverse(this);

      return arr.map(function(item,index) {
          item.$index = index;
          item.$first = index === 0;
          item.$last  = index === arr.length-1;
          return options.fn(item);
      }).join('');
  });
}

