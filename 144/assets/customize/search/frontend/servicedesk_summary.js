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

  if ( typeof auto_search_off == 'undefined' || auto_search_off === true ) {
    // make search automatically
    search_summary_records (true);
  }

}); // document function end


// handle clicking of "RECENT collection" link
$('#RECENT_COLLECTION').change(function(e) {
  $('#NEXT_COLLECTION').attr('checked', false);
  $('#DATE_NEEDED').val('');
  $('#TIME_NEEDED').val('');
  $('#PICKUP_ITEMS').attr('checked', false);
  $('#PAY_BALANCE').attr('checked', false);
  $('#VIEW_ITEMS').attr('checked', false);
  $('#MY_WORK').attr('checked', false);

  // refresh search expression
  buildExpression(true);

  // if uncheck, set ttile to empty
  if ( !($(this).prop('checked')) ) {
    search_title = '';
  }
});

// handle clicking of "active collection" link
$('#NEXT_COLLECTION').change(function(e) {
  $('#RECENT_COLLECTION').attr('checked', false);
  $('#DATE_NEEDED').val('');
  $('#TIME_NEEDED').val('');
  $('#PICKUP_ITEMS').attr('checked', false);
  $('#PAY_BALANCE').attr('checked', false);
  $('#VIEW_ITEMS').attr('checked', false);
  $('#MY_WORK').attr('checked', false);

  // refresh search expression
  buildExpression(true);

  // if uncheck, set ttile to empty
  if ( !($(this).prop('checked')) ) {
    search_title = '';
  }
});

// handle clicking of "view items" link
$('#VIEW_ITEMS').change(function(e) {
  $('#RECENT_COLLECTION').attr('checked', false);
  $('#DATE_NEEDED').val('');
  $('#TIME_NEEDED').val('');
  $('#PICKUP_ITEMS').attr('checked', false);
  $('#PAY_BALANCE').attr('checked', false);
  $('#NEXT_COLLECTION').attr('checked', false);
  $('#MY_WORK').attr('checked', false);

  // refresh search expression
  buildExpression(true);

  // if uncheck, set ttile to empty
  if ( !($(this).prop('checked')) ) {
    search_title = '';
  }
});

// handle clicking of "picked up items" link
$('#PICKUP_ITEMS').change(function(e) {
  $('#RECENT_COLLECTION').attr('checked', false);
  $('#DATE_NEEDED').val('');
  $('#TIME_NEEDED').val('');
  $('#NEXT_COLLECTION').attr('checked', false);
  $('#PAY_BALANCE').attr('checked', false);
  $('#VIEW_ITEMS').attr('checked', false);
  $('#MY_WORK').attr('checked', false);

  // refresh search expression
  buildExpression(true);

  // if uncheck, set ttile to empty
  if ( !($(this).prop('checked')) ) {
    search_title = '';
  }
});

// handle clicking of "pay balance" link
$('#PAY_BALANCE').change(function(e) {
  $('#RECENT_COLLECTION').attr('checked', false);
  $('#DATE_NEEDED').val('');
  $('#TIME_NEEDED').val('');
  $('#NEXT_COLLECTION').attr('checked', false);
  $('#PICKUP_ITEMS').attr('checked', false);
  $('#VIEW_ITEMS').attr('checked', false);
  $('#MY_WORK').attr('checked', false);

  // refresh search expression
  buildExpression(true);

  // if uncheck, set ttile to empty
  if ( !($(this).prop('checked')) ) {
    search_title = '';
  }
});

// handle changing of "collection date" field
$('#DATE_NEEDED').change(function(e) {
  $('#NEXT_COLLECTION').attr('checked', false);
  $('#PICKUP_ITEMS').attr('checked', false);
  $('#PAY_BALANCE').attr('checked', false);
  $('#VIEW_ITEMS').attr('checked', false);
  $('#MY_WORK').attr('checked', false);

  // refresh search expression
  buildExpression(true);
});

// handle changing of "collection time" field
$('#TIME_NEEDED').change(function(e) {
  if ($(this).val() != '' ) {
    $('#NEXT_COLLECTION').attr('checked', false);
    $('#NEXT_COLLECTION').attr('checked', false);
    $('#PICKUP_ITEMS').attr('checked', false);
    $('#PAY_BALANCE').attr('checked', false);
    $('#VIEW_ITEMS').attr('checked', false);
    $('#MY_WORK').attr('checked', false);
  }

  // refresh search expression
  buildExpression(true);
});

// handle changing of "REQ_TOPIC" field
$('#MY_WORK').change(function(e) {
  $('#RECENT_COLLECTION').attr('checked', false);
  $('#NEXT_COLLECTION').attr('checked', false);
  $('#DATE_NEEDED').val('');
  $('#TIME_NEEDED').val('');
  $('#NEXT_COLLECTION').attr('checked', false);
  $('#PICKUP_ITEMS').attr('checked', false);
  $('#PAY_BALANCE').attr('checked', false);
  $('#VIEW_ITEMS').attr('checked', false);

  // refresh search expression
  buildExpression(true);

  // if uncheck, set ttile to empty
  if ( !($(this).prop('checked')) ) {
    search_title = '';
  }
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
  var request_date = '';
  var request_time = '';
  var req_patron_name = '';
  var pickup_items = false;
  var pay_balance = false;
  var current_collection = false;
  var view_items = false;
  var my_work = false;
  var recent_collection = false;
  var access_token = readUserRole();

  search_title = '';

  if ($('#RECENT_COLLECTION').is(":checked")) {
    request_time = '';
    recent_collection = true;
  }
  else if ($('#NEXT_COLLECTION').is(":checked")) {
    request_time = '';
    current_collection = true;
  }
  else if ($('#VIEW_ITEMS').is(":checked")) {
    view_items = true;
  }
  else if ($('#PICKUP_ITEMS').is(":checked")) {
    pickup_items = true;
  }
  else if ($('#PAY_BALANCE').is(":checked")) {
    pay_balance = true;
  }
  else if ($('#MY_WORK').is(":checked")) {
    my_work = true;
    search_timestamp = '';
  }
  else {
    queryField = $('#DATE_NEEDED');
    if ( queryField.length > 0 ) {
      request_date = $(queryField).val();
      if ( request_date == null ) {
        request_date = '';
      }
    }
    queryField = $('#TIME_NEEDED');
    if ( queryField.length > 0 ) {
      request_time = $(queryField).val();
      if ( request_time == null ) {
        request_time = '';
      }
    }
  }

  if ( !pickup_items && !pay_balance ) {
    queryField = $('#REQ_PATRON_NAME');
    if ( queryField.length > 0 ) {
      req_patron_name = $(queryField).val();
      if ( req_patron_name == null ) {
        req_patron_name = '';
      }
    }

    if ( !my_work && request_date != '' ) {
      search_timestamp = request_date;
      if ( request_time == '' ) {
        search_timestamp = search_timestamp + " " + "09:00";
      }
      else {
        search_timestamp = search_timestamp + " " + request_time;
      }
    }
  }

  // set filter expression
  var filter_exp = 'REQ_STATUS REQUESTED';
  if ( recent_collection ) {
    filter_exp = 'REQ_PROCESS_DATE >= ++1-15D * (REQ_STATUS HOLD + REQ_STATUS REQUESTED + REQ_STATUS "KEPT OUT FOR USER" + REQ_STATUS "COLLECTION POINT" + REQ_STATUS USER + REQ_STATUS PICKUP READY + REQ_STATUS PICKED UP + REQ_STATUS CONSERVATION + REQ_STATUS "IMAGE AND DESIGN")';
    search_title = 'Last 15-days Collection';
  }
  else if ( pickup_items ) {
    filter_exp = 'REQ_STATUS "PICKUP READY"';
    search_title = 'Picked Up Items';
  }
  else if ( pay_balance ) {
    filter_exp = 'REQ_STATUS "PICKUP READY" + (REQ_STATUS "PICKED UP" * (REQ_PAID N + REQ_PAID P))';
    search_title = 'Pay Balance';
  }
  else if ( view_items ) {
    filter_exp = 'REQ_STATUS HOLD + REQ_STATUS REQUESTED + REQ_STATUS "KEPT OUT FOR USER" + REQ_STATUS "COLLECTION POINT" + REQ_STATUS USER + REQ_STATUS CONSERVATION + REQ_STATUS "IMAGE AND DESIGN"';
    search_title = 'View Items';
  }
  else if ( my_work ) {
    search_title = 'My Work';
    if ( access_token == '' ) {
      filter_exp = '++@';
    }
    else {
      filter_exp = lookupRecordSelector(access_token, 'request', 'REQ_USER_GROUP');
    }
  }
  else {
    if ( current_collection ) {
      search_title = 'Current Collection';
    }
    if ( !current_collection && req_patron_name != '' ) {
      filter_exp = 'REQ_STATUS HOLD + REQ_STATUS REQUESTED + REQ_STATUS "KEPT OUT FOR USER" + REQ_STATUS "COLLECTION POINT" + REQ_STATUS USER + REQ_STATUS PICKUP READY + REQ_STATUS PICKED UP + REQ_STATUS CONSERVATION + REQ_STATUS "IMAGE AND DESIGN"';
    }
    else {
      if ( show_all ) {
        filter_exp = 'REQ_STATUS HOLD + REQ_STATUS REQUESTED + REQ_STATUS "KEPT OUT FOR USER" + REQ_STATUS "COLLECTION POINT" + REQ_STATUS USER + REQ_STATUS "PICKUP READY" + (REQ_STATUS "PICKED UP" * (REQ_PAID N + REQ_PAID P)) + REQ_STATUS CONSERVATION + REQ_STATUS "IMAGE AND DESIGN"';
      }
    }
  }

  // assemble search expression
  var search_exp = "REC_STATUS ACTIVE";

  if ( !current_collection && !view_items && !pickup_items && !pay_balance && !my_work && !recent_collection ) {
    filter_exp = '';
  }
  else {
    if ( my_work ) {
      var username = getCookie("USERNAME");
      search_exp = search_exp + ' * (' + filter_exp + ') * (HANDLED_BY ANYONE + HANDLED_BY "' + username + '")';
    }
    else if ( pickup_items || pay_balance ) {
      search_exp = search_exp + " * (" + filter_exp + ")";
    }
    else {
      if ( search_timestamp != '' ) {
        if ( view_items || current_collection ) {
          search_exp = search_exp + " * LOAN_PERIOD " + search_timestamp;
        }
      }
      search_exp = search_exp + " * " + "(" + filter_exp + ")";
    }
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

// check to see whether user wants to change request status or make payment
function checkSelection ( calling_field, detailed_record_url )
{
  var default_action = true;
  var detailed_record_url = $(calling_field).attr('href');

  // delete parameter variable - $tmp_status_td
  delete $tmp_status_td;

  var tr_tag = $(calling_field).parents('tr');
  if ( $(tr_tag).length > 0 ) {

    var td_tags = $(tr_tag).children();
    if ( $(td_tags).length >= 8 ) {
      // set $tmp_status_td to request status td cell. It is accessed by the statusPostPrcoessing function
      // in /144/assets/customize/dataentry/frontend/servicedesk_summary.js file
      $tmp_status_td = $(td_tags)[3];

      var reproduction = false;
      if ( $(td_tags).length >= 9 && $(td_tags)[8].innerHTML == 'Y' ) {
        reproduction = true;
      }

      if ( !reproduction ) {
        var paid_flag = $(td_tags)[6].innerHTML;
        var client_id = $(td_tags)[7].innerHTML;
        if ( paid_flag != 'Y' ) {
          default_action = false;
          $tmp_cost_summary = true;

          // prepare cost summary URL
          var url = getHomeSessId() + "?SEARCH&RESET=Y&CLEAR_LAST=Y&SHOW_LIMIT=5000" +
                    "&SHOWSINGLE=Y&REPORT=WEB_SD_COST_SUM_REP" +
                    '&EXP=REQ_PATRON_ID%20"' + client_id + '"%20*%20' +
                    '(REQ_PAID%20P%20%2b%20REQ_PAID%20N)%20*%20' +
                    '(REQ_FREE%20N)';

          // show cost summary in colorbox
          $.colorbox({
            iframe: true,
            href: url,
            width: '1200px',
            height: '800px',
            fastframe: true,
            overlayClose: false,
            onCleanup: function () {
              // refresh summary report
              parent.search_summary_records(true);
            },
            onClosed: function () {
              delete $tmp_cost_summary;
            }
          });
        }
      }
    }
  }

  return default_action;
}