// RL-2021-06-21
// comments search expression
var search_title = '';

$(document).ready(function(){
  // override default 'search submit' handler
  $('a.submit_search').off().on('click', function (e) {
    setupSearchCall(e, $('.database_search, .gc_search'), null);
  })

  $('a.line_search').off().on('click', function ()
  {
    var search_line = $('#query_expression');
    if ( $(search_line).length > 0 ) {
      $(search_line).val('');
    }
    search_title = '';

    var objs = $(body).find('.database_search');
    if ( objs.length > 0 ) {
      objs[0].reset();
    }

    toggleLineMode();
  });
}); // document function end

