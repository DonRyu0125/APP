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

  // make search automatically
  search_summary_records (true);

}); // document function end


// handle clicking of "to-do list" link
$('#TODO_LIST').change(function(e) {
  $('#MY_WORK').attr('checked', false);

  // refresh search expression
  buildExpression(true);
});

// handle changing of "REQ_TOPIC" field
$('#MY_WORK').change(function(e) {
  $('#TODO_LIST').attr('checked', false);

  // refresh search expression
  buildExpression(true);
});


// zero pad date/time stamp
function padded_today_datestamp()
{
  // get current date/time stamp
  var today = new Date();
  var year = (today.getFullYear()).toString();
  var month = (today.getMonth()+1).toString();
  var day = (today.getDate()).toString();
  var hour = (today.getHours()).toString();
  var minute = (today.getMinutes()).toString();
  if ( today.getFullYear() < 10 ) {
    year = "000" + year;
  }
  else if ( today.getFullYear() < 100 ) {
    year = "00" + year;
  }
  else if ( today.getFullYear() < 1000 ) {
    year = "0" + year;
  }
  if ( today.getMonth()+1 < 10 ) {
    month = "0" + month;
  }
  if ( today.getDate() < 10 ) {
    day = "0" + day;
  }
  if ( today.getHours() < 10 ) {
    hour = "0" + hour;
  }
  if ( today.getMinutes() < 10 ) {
    minute = "0" + minute;
  }

  return year + "-" + month + "-" + day + " " + hour + ":" + minute;
}

// function builds search expression for current requests
function buildExpression(show_all)
{
  // get current date/time stamp
  var search_timestamp = padded_today_datestamp();
  var todo_list = false;
  var my_work = false;
  var access_token = readUserRole();

  search_title = '';

  if ($('#TODO_LIST').is(":checked")) {
    todo_list = true;
  }
  else if ($('#MY_WORK').is(":checked")) {
    my_work = true;
  }

  // set filter expression
  var filter_exp = '';
  if ( todo_list ) {
    search_title = 'To-Do List';
  }
  else if ( my_work ) {
    search_title = 'My Work';
  }

  // assemble search expression
  var search_exp = "REC_STATUS ACTIVE";
  if ( my_work ) {
    var username = getCookie("USERNAME");
    search_exp = search_exp + ' * (' + filter_exp + ') * (HANDLED_BY ANYONE + HANDLED_BY "' + username + '")';
  }
  else if ( todo_list ) {
    search_exp = search_exp + " * (" + filter_exp + ")";
  }

  // set line-mode search line
  var search_line = $('#query_expression');
  if ( $(search_line).length > 0 ) {
    $(search_line).val(search_exp);
  }
}

// search request_info database for "summary" report
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
}
