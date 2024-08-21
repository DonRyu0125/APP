// RL-2021-06-21
// comments search expression
var search_title = '';

$(document).ready(function(){
  // reset search form
  $('a.refresh_search').on('click', function(e) {
    search_summary_records(true);
  });

  // override default 'search submit' handler
  $('a.submit_search').off().on('click', function (e) {
    if ( $('div.linemode').is(':visible') ) {
      search_title = '';
    }
    else {
      buildExpression(true);
    }
    setupSearchCall(e, $('.database_search, .gc_search'), search_title);
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

  if ( typeof auto_search_off == 'undefined' || auto_search_off === true ) {
    // make search automatically
    search_summary_records (true);
  }

}); // document function end


// handle clicking of "NEW_COMMENT" link
$('#NEW_COMMENT').change(function(e) {
  $('#PENDING_COMMENT').attr('checked', false);

  // refresh search expression
  buildExpression(true);
});

// handle changing of "PENDING_COMMENT" field
$('#PENDING_COMMENT').change(function(e) {
  $('#NEW_COMMENT').attr('checked', false);

  // refresh search expression
  buildExpression(true);
});

// function builds search expression for request summary
function buildExpression(show_all)
{
  // get current date/time stamp
  var new_comment = false;
  var pending_comment = false;
  var search_exp = "";

  search_title = '';

  if ($('#NEW_COMMENT').is(":checked")) {
    new_comment = true;
    search_title = 'New Comments';
    search_exp = "COMMENTS_ACTION NEW";
  }
  else if ($('#PENDING_COMMENT').is(":checked")) {
    pending_client = true;
    search_title = 'Pending comments';
    search_exp = "COMMENTS_ACTION REVIEW";
  }

  // set line-mode search line
  var search_line = $('#query_expression');
  if ( $(search_line).length > 0 ) {
    $(search_line).val(search_exp);
  }
}

// search request_info database for summary report
function search_summary_records(show_all)
{
  // set search expression
  buildExpression(show_all);

  // set line-mode search line - line-mode search line has id "query_expression"
  var search_line = $('#query_expression');
  if ( $(search_line).length > 0 ) {
    // search request_info database
    var search_form = $('.database_search');
    if ( $(search_form).length > 0 ) {
      setupSearchCall (null, $(search_form), search_title);
    }
    else {
      alert ( "search form is not found" );
    }
  }
  else {
    alert ( 'Input tag with id "query_expression" is not found.' );
  }
}
