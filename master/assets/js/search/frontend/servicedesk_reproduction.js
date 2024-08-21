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


// handle clicking of "recent reproduction" link
$('#RECENT_REPRODUCTION').change(function(e) {
  $('#REPROD_JOB').attr('checked', false);
  $('#CS_JOB').attr('checked', false);
  $('#MY_JOB').attr('checked', false);

  // refresh search expression
  buildExpression(true);
});

// handle changing of "reproduction department job" field
$('#REPROD_JOB').change(function(e) {
  $('#RECENT_REPRODUCTION').attr('checked', false);
  $('#CS_JOB').attr('checked', false);
  $('#MY_JOB').attr('checked', false);

  // refresh search expression
  buildExpression(true);
});

// handle changing of "custom service job" field
$('#CS_JOB').change(function(e) {
  $('#RECENT_REPRODUCTION').attr('checked', false);
  $('#REPROD_JOB').attr('checked', false);
  $('#MY_JOB').attr('checked', false);

  // refresh search expression
  buildExpression(true);
});

// handle changing of "my job" field
$('#MY_JOB').change(function(e) {
  $('#RECENT_REPRODUCTION').attr('checked', false);
  $('#REPROD_JOB').attr('checked', false);
  $('#CS_JOB').attr('checked', false);

  // refresh search expression
  buildExpression(true);
});

// function builds search expression for request summary
function buildExpression(show_all)
{
  // get current date/time stamp
  var recent_reproduction = false;
  var reprod_job = false;
  var cs_job = false;
  var my_job = false;
  var access_token = readUserRole();

  search_title = '';

  if ($('#RECENT_REPRODUCTION').is(":checked")) {
    recent_reproduction = true;
    search_title = 'Recent Reproduction Jobs';
  }
  else if ($('#REPROD_JOB').is(":checked")) {
    reprod_job = true;
    search_title = "Reproduction Department's Job";
  }
  else if ($('#CS_JOB').is(":checked")) {
    cs_job = true;
    search_title = "Custom Service's Job";
  }
  else if ($('#MY_JOB').is(":checked")) {
    my_job = true;
    search_title = "My Job";
  }

  // set filter expression
  var filter_exp = '(REQ_STATUS "Image and Design")';
  if ( reprod_job ) {
    filter_exp = filter_exp + ' * REQ_USER_GROUP Reproduction';
  }
  else if ( cs_job ) {
    filter_exp = filter_exp + ' * REQ_USER_GROUP Custom Service';
  }
  else if ( my_job ) {
    var username = getCookie("USERNAME");
    filter_exp = filter_exp + ' * HANDLED_BY "' + username + '")';
  }

  // assemble search expression
  var search_exp = "(REC_STATUS ACTIVE) * (" + filter_exp + ")";

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
