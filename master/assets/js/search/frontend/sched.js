// RL-2021-09016
// record schedule search expression
var search_title = '';

$(document).ready(function(){
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
    if ( $('#TODO_LIST').length > 0 ) {
      // if "todo list" checkbox is defined, do search
      search_summary_records (true);
    }
  }

}); // document function end

// handle clicking of "TODO_LIST" link
$('#TODO_LIST').change(function(e) {
  $('#NEGOTIATED_SCHEDULE').attr('checked', false);

  // refresh search expression
  buildExpression(true);
});

// handle clicking of "NEGOTIATED_SCHEDULE" field
$('#NEGOTIATED_SCHEDULE').change(function(e) {
  $('#TODO_LIST').attr('checked', false);

  // refresh search expression
  buildExpression(true);
});

// function builds search expression for request summary
function buildExpression(show_all)
{
  var search_exp = "";

  search_title = '';

  if ($('#TODO_LIST').is(":checked")) {
    search_title = 'Todo List';
    search_exp = "P_REQ_APPROVE REQUESTED * SCHEDULE_STATUS <> ACTIVE";
  }
  else if ($('#NEGOTIATED_SCHEDULE').is(":checked")) {
    search_title = 'Negotiated Record Schedule';
    search_exp = "SCHEDULE_STATUS UNDER NEGOTIATION";
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
