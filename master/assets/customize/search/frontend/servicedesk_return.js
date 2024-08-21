// RL-2021-06-21
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

  // override default 'search submit' handler
  $('a.submit_search').off().on('click', function (e) {
    setupSearchCall(e, $('.database_search, .gc_search'), search_title);
  })

  // reset search form
  $('a.refresh_search').on('click', function(e) {
    e.preventDefault();
    search_return_records();
  });

  // bind handle to "return_item" class
  $('body').on('click', '.return_item', function(e) {
    return_item ( e, $(this) );
  });

  // make search automatically
  search_return_records();
}); //document function end

// perform search on request_info database
function search_return_records()
{
  // set search expression
  var search_exp = 'REQ_STATUS RETURNED';
  search_title = 'All Returned Items';

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

// change request record status of request record to "Close"\
function return_item ( e, calling_field )
{
  // e.preventDefault();

  var order_num = '';
  var result = false;

  // get order number which is stored in the second column of table row
  var tr_tds = $(calling_field).parents('tr').children('td');
  order_num = $(tr_tds[1]).text();

  if ( order_num == null || order_num == '' ) {
    alert ( "Order nUmber is not found." );
  }
  else {
    result = closeRequest ( order_num );
  }
}
