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


// handle clicking of "todo list" link
$('#TODO_LIST').change(function(e) {
  $('#CONSERV_LIST').attr('checked', false);
  $('#MONITOR_LIST').attr('checked', false);
  $('#REJECTED_LIST').attr('checked', false);

  // refresh search expression
  buildExpression(true);
});


// handle changing of "conservation list" field
$('#CONSERV_LIST').change(function(e) {
  $('#TODO_LIST').attr('checked', false);
  $('#MONITOR_LIST').attr('checked', false);
  $('#REJECTED_LIST').attr('checked', false);

  // refresh search expression
  buildExpression(true);
});

// handle changing of "monitor list" field
$('#MONITOR_LIST').change(function(e) {
  $('#TODO_LIST').attr('checked', false);
  $('#CONSERV_LIST').attr('checked', false);
  $('#REJECTED_LIST').attr('checked', false);

  // refresh search expression
  buildExpression(true);
});

// handle changing of "rejected list" field
$('#REJECTED_LIST').change(function(e) {
  $('#TODO_LIST').attr('checked', false);
  $('#CONSERV_LIST').attr('checked', false);
  $('#MONITOR_LIST').attr('checked', false);

  // refresh search expression
  buildExpression(true);
});


// function builds search expression for current requests
function buildExpression(show_all)
{
  var todo_list = false;
  var conservation_list = false;
  var monitor_list = false;
  var rejected_list = false;
  var access_token = readUserRole();

  search_title = '';
  if ($('#TODO_LIST').is(":checked")) {
    todo_list = true;
  }
  else if ($('#CONSERV_LIST').is(":checked")) {
    conservation_list = true;
  }
  else if ($('#MONITOR_LIST').is(":checked")) {
    monitor_list = true;
  }
  else if ($('#REJECTED_LIST').is(":checked")) {
    rejected_list = true;
  }

  var search_exp = '';
  var filter_exp = '';

  if ( todo_list || conservation_list || monitor_list || rejected_list ) {
    // set filter expression
    if ( todo_list ) {
      search_title = 'To-Do List';
    }
    else if ( conservation_list ) {
      search_title = 'Conservation List';
    }
    else if ( monitor_list ) {
      search_title = 'Monitor List';
    }
    else if ( rejected_list ) {
      search_title = 'Unfinished AOne Transactions';
    }

    // assemble search expression
    search_exp = "CON_STATUS ACTIVE";
    if ( todo_list ) {
      search_exp = "CON_STATUS PREPARE";
    }
    else {
      if ( conservation_list ) {
        filter_exp = "CON_CONSERV_FLAG Y + CON_MOULD Y + CON_PEST Y";
      }
      else if ( monitor_list ) {
        filter_exp = "CON_MONITOR Y";
      }
      else if ( rejected_list ) {
        search_exp = "(CON_STATUS PREPARE + CON_STATUS ACTIVE)";
        filter_exp = "CON_AONE_STATUS REJECTED + CON_AONE_STATUS UNDELIVERED + CON_AONE_STATUS NOT ACCEPTED";
      }
      if ( filter_exp != '' ) {
        search_exp = search_exp + " * (" + filter_exp + ")";
      }
    }
  }

  // set line-mode search line
  var search_line = $('#query_expression');
  if ( $(search_line).length > 0 ) {
    $(search_line).val(search_exp);
  }
}


// search container database for summary report
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
      alert ( "Search form is not found" );
    }
  }
  else {
    alert ( 'Input tag with id "query_expression" is not found.' );
  }
}
