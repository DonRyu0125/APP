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
    toggleLineMode();
  });

  if ( typeof auto_search_off == 'undefined' || auto_search_off === true ) {
    // make search automatically
    search_summary_records (true);
  }

}); // document function end


// handle clicking of "active requests" link
$('#RECENT_REQUEST').change(function(e) {
  $('#LAST_APPROVED_REQUEST').attr('checked', false);
  $('#MY_WORK').attr('checked', false);
  $('#APPROVED_REQUEST').attr('checked', false);
  $('#REJECTED_LIST').attr('checked', false);

  // refresh search expression
  buildExpression(true);
});

// handle clicking of "recent approved requests" link
$('#LAST_APPROVED_REQUEST').change(function(e) {
  $('#RECENT_REQUEST').attr('checked', false);
  $('#MY_WORK').attr('checked', false);
  $('#APPROVED_REQUEST').attr('checked', false);
  $('#REJECTED_LIST').attr('checked', false);

  // refresh search expression
  buildExpression(true);
});

// handle changing of "approved requests" field
$('#APPROVED_REQUEST').change(function(e) {
  $('#RECENT_REQUEST').attr('checked', false);
  $('#LAST_APPROVED_REQUEST').attr('checked', false);
  $('#MY_WORK').attr('checked', false);
  $('#REJECTED_LIST').attr('checked', false);

  // refresh search expression
  buildExpression(true);
});

// handle changing of "my work" field
$('#MY_WORK').change(function(e) {
  $('#RECENT_REQUEST').attr('checked', false);
  $('#LAST_APPROVED_REQUEST').attr('checked', false);
  $('#APPROVED_REQUEST').attr('checked', false);
  $('#REJECTED_LIST').attr('checked', false);

  // refresh search expression
  buildExpression(true);
});

// handle changing of "Unfinished AOne Transactions" field
$('#REJECTED_LIST').change(function(e) {
  $('#RECENT_REQUEST').attr('checked', false);
  $('#LAST_APPROVED_REQUEST').attr('checked', false);
  $('#APPROVED_REQUEST').attr('checked', false);
  $('#MY_WORK').attr('checked', false);

  // refresh search expression
  buildExpression(true);
});


// function builds search expression for request summary
function buildExpression(show_all)
{
  // get current date/time stamp
  var recent_request = false;
  var approved_request = false;
  var recent_approved_request = false;
  var my_work = false;
  var rejected_list = false;
  var access_token = readUserRole();

  search_title = '';

  if ($('#RECENT_REQUEST').is(":checked")) {
    recent_request = true;
    search_title = 'Active Requests';
  }
  else if ($('#LAST_APPROVED_REQUEST').is(":checked")) {
    recent_approved_request = true;
    search_title = 'Last 3-days Approved Requests';
  }
  else if ($('#APPROVED_REQUEST').is(":checked")) {
    approved_request = true;
    search_title = 'Approved Requests';
  }
  else if ($('#MY_WORK').is(":checked")) {
    my_work = true;
    search_title = 'My Work';
  }
  else if ($('#REJECTED_LIST').is(":checked")) {
    rejected_list = true;
    search_title = 'Unfinished AOne Transactions';
  }

  // set filter expression
  var filter_exp = '(REQ_NEW Y + REQ_STATUS PREPARE)';
  if ( recent_approved_request ) {
    filter_exp = 'REQ_STATUS <> PREPARE * REQ_PROCESS_DATE >= ++1-3D';
  }
  else if ( approved_request ) {
    filter_exp = 'REQ_STATUS <> PREPARE';
  }
  else if ( rejected_list ) {
    filter_exp = "(REQ_AONE_STATUS REJECTED + REQ_AONE_STATUS UNDELIVERED + REQ_AONE_STATUS NOT ACCEPTED)";
  }
  else if ( my_work ) {
    if ( access_token == '' || access_token != '' ) {
      filter_exp = '++@';

      var username = getCookie("USERNAME");
      filter_exp = filter_exp + ' * (HANDLED_BY "' + username + '")';
    }
    else {
      filter_exp = lookupRecordSelector(access_token, 'request', 'REQ_USER_GROUP');
    }
  }

  // assemble search expression
  var search_exp = "(REC_STATUS ACTIVE + REC_STATUS REQUEST)";

  if ( !recent_request && !approved_request && !my_work && !rejected_list && !recent_approved_request ) {
    filter_exp = '';
  }
  else {
    if ( my_work ) {
      search_exp = filter_exp;
    }
    else if ( rejected_list ) {
      search_exp = '(REC_STATUS REQUEST + REC_STATUS ACTIVE)' + " * (" + filter_exp + ")";
    }
    else {
      search_exp = search_exp + " * (" + filter_exp + ")";
    }
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
