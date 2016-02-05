var $ = require('jquery');
require('./handlebar-helpers')(require('hbsfy/runtime'));

// Expose some globals
window.$ = $;
window.jQuery = $;

$(window).ready(function () {
  /**
   * The application router object
   */
  var router = require('./router');
  router.start();
  window.app = router;
});

