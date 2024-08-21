/// RL-2021-06-21
// descriptive search expression
var search_title = '';

$(document).ready(function(){
  // clear search form
  $('a.reset_search').on('click', function(e) {
    e.preventDefault();

    var objs = $(body).find('.database_search');
    if ( objs.length > 0 ) {
      objs[0].reset();
    }
  });

  // reset search form
  $('a.refresh_search').on('click', function(e) {
    e.preventDefault();
    search_hold_records();
  });

  // override default 'search submit' handler
  $('a.submit_search').off().on('click', function (e) {
    setupSearchCall(e, $('.database_search, .gc_search'), search_title);
  })

  // bind handle to "hold_item" class
  $('body').on('click', '.hold_item', function(e) {
    hold_item ( e, $(this) );
  });

  // make search automatically
  search_hold_records();
}); //document function end

// perform search on request_info database
function search_hold_records()
{
  // set search expression
  var search_exp = 'REQ_STATUS RETRIEVE + REQ_STATUS IN TRANSIT';
  search_title = 'Next Storage Pickup';

  // set line-mode search line
  var search_line = $('#query_expression');
  if ( $(search_line).length > 0 ) {
    $(search_line).val(search_exp);

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

// change request status of request record to "Requested" and
// set load period
function hold_item ( e, calling_field )
{
  var date_selected = false;
  var tempValue = '';
  var numUnits = 0;
  var order_num = '';
  var on_state = false;

  // get order number which is stored in the second column of table row
  var tr_tds = $(calling_field).parents('tr').children('td');
  order_num = $(tr_tds[1]).text();

  var reqItemTitle = $(tr_tds[5]).text();
  if ( reqItemTitle === undefined || reqItemTitle == null ) {
    reqItemTitle = '';
  }

  tempValue = $(tr_tds[9]).text();
  if ( tempValue !== undefined && tempValue != '' ) {
    numUnits = parseInt( tempValue, 10 );
  }
  if ( isNaN(numUnits) || numUnits == 0 ) {
    numUnits = 1;
  }

  var reqDate = $(tr_tds[12]).text();
  if ( reqDate === undefined || reqDate == null ) {
    reqDate = '';
  }

  var dateSelected = $(tr_tds[13]).text();
  if ( dateSelected !== undefined && dateSelected == 'Y' ) {
    date_selected = true;
  }

  var reqTime = $(tr_tds[14]).text();
  if ( reqTime === undefined || reqTime == null ) {
    reqTime = '9:00';
  }

  var reqPatronEmail = $(tr_tds[15]).text();
  if ( reqPatronEmail === undefined || reqPatronEmail == null ) {
    reqPatronEmail = '';
  }

  var reqItemID = $(tr_tds[16]).text();
  if ( reqItemID === undefined || reqItemID == null ) {
    reqItemID = '';
  }

  var req_reproduction = $(tr_tds[17]).text();
  if ( req_reproduction === undefined || req_reproduction == null ) {
    req_reproduction = 'N';
  }

  var on_state = false;
  if ( $(calling_field).prop("checked") == true ) {
    on_state = true;
  }

  var sisn = $(calling_field).val();
  if ( sisn !== undefined && sisn != '' ) {
    setRequestReady ( e, sisn, reqDate, reqTime, numUnits, on_state, date_selected, true, order_num,
      reqPatronEmail, reqItemID, reqItemTitle, req_reproduction );
  }
  else {
    e.preventDefault();
    alert ( "SISN is not set in the table column cell." );
  }
}

// get today date in YYYY-MM-DD format
function getTodayDate()
{
  // get current date/time stamp
  var today = new Date();
  var year = (today.getFullYear()).toString();
  var month = (today.getMonth()+1).toString();
  var day = (today.getDate()).toString();
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
