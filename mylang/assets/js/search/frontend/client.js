// RL-2021-06-21
// descriptive search expression
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

// handle clicking of "NEW_CLIENT" link
$('#NEW_CLIENT').change(function(e) {
  $('#PENDING_CLIENT').attr('checked', false);

  // refresh search expression
  buildExpression(true);
});

// handle changing of "PENDING_CLIENT" field
$('#PENDING_CLIENT').change(function(e) {
  $('#NEW_CLIENT').attr('checked', false);

  // refresh search expression
  buildExpression(true);
});

// function builds search expression for request summary
function buildExpression(show_all)
{
  // get current date/time stamp
  var new_client = false;
  var pending_client = false;
  var my_slection = false;
  var search_exp = "";

  search_title = '';

  if ($('#NEW_CLIENT').is(":checked")) {
    new_client = true;
    search_title = 'New Client';
    search_exp = "C_REG_STATUS NEW";
  }
  else if ($('#PENDING_CLIENT').is(":checked")) {
    pending_client = true;
    search_title = 'Pending Client';
    search_exp = "C_REG_STATUS PENDING";
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

  // set line-mode search line - line-mode search line has id "question_expression"
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
