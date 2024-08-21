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


// handle clicking of "active enquiry" link
$('#RECENT_ENQUIRIES').change(function(e) {
  $('#PRE_OVERDUE_ENQUIRIES').attr('checked', false);
  $('#OVERDUE_ENQUIRIES').attr('checked', false);
  $('#MY_WORK').attr('checked', false);

  // refresh search expression
  buildExpression(true);
});

// handle changing of "pre-overdue enquiry" field
$('#PRE_OVERDUE_ENQUIRIES').change(function(e) {
  $('#RECENT_ENQUIRIES').attr('checked', false);
  $('#OVERDUE_ENQUIRIES').attr('checked', false);
  $('#MY_WORK').attr('checked', false);

  // refresh search expression
  buildExpression(true);
});

// handle changing of "overdue enquiry" field
$('#OVERDUE_ENQUIRIES').change(function(e) {
  $('#RECENT_ENQUIRIES').attr('checked', false);
  $('#PRE_OVERDUE_ENQUIRIES').attr('checked', false);
  $('#MY_WORK').attr('checked', false);

  // refresh search expression
  buildExpression(true);
});

// handle changing of "my work" field
$('#MY_WORK').change(function(e) {
  $('#RECENT_ENQUIRIES').attr('checked', false);
  $('#PRE_OVERDUE_ENQUIRIES').attr('checked', false);
  $('#OVERDUE_ENQUIRIES').attr('checked', false);
  $('#MY_SELECTION').attr('checked', false);

  // refresh search expression
  buildExpression(true);
});

// zero pad date stamp
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

  return year + "-" + month + "-" + day;
}

// function builds search expression for request summary
function buildExpression(show_all)
{
  // get current date/time stamp
  var search_date = padded_today_datestamp();
  var recent_enquiry = false;
  var pre_overdue_enquiry = false;
  var overdue_enquiry = false;
  var my_work = false;
  var no_predefined = false;
  var access_token = readUserRole();
  var accessList = lookupRecordSelector(access_token, 'enq', 'ENQ_USER_GROUP');

  search_title = '';

  if ($('#RECENT_ENQUIRIES').is(":checked")) {
    recent_enquiry = true;
  }
  else if ($('#PRE_OVERDUE_ENQUIRIES').is(":checked")) {
    pre_overdue_enquiry = true;
  }
  else if ($('#OVERDUE_ENQUIRIES').is(":checked")) {
    overdue_enquiry = true;
  }
  else if ($('#MY_WORK').is(":checked")) {
    my_work = true;
  }

  // set filter expression
  var filter_exp = '';
  if ( recent_enquiry ) {
    filter_exp = 'ENQ_NEW Y';
    search_title = 'Active Inquiries';
  }
  else if ( pre_overdue_enquiry ) {
    var start_date = expandSymbol('++1+1D');
    var end_date = expandSymbol('++1+3D');
    // select enquiries which is due 3 days from today
    filter_exp = 'ENQ_DUE_DATE ' + start_date + '//' + end_date;
    search_title = 'Prev Overdue Inquiries';
  }
  else if ( overdue_enquiry ) {
    filter_exp = 'ENQ_DUE_DATE <= ' + search_date;
    search_title = 'Overdue Inquiries';
  }
  else if ( my_work ) {
    search_title = 'My work';
    if ( access_token == '' || access_token != '' ) {
      var username = getCookie("USERNAME");

      filter_exp = '++@';
      filter_exp = filter_exp + ' * (ENQ_HANDLED_BY "' + username + '")';
    }
    else {
      filter_exp = accessList;
    }
  }
  else {
    no_predefined = true;
  }

  // assemble search expression
  var search_exp = "";
  if ( !no_predefined ) {
    search_exp = "(ENQ_STATUS ACTIVE + ENQ_STATUS REQUEST) * (" + filter_exp + ")";
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
