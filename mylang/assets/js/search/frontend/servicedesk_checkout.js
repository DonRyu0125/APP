const CHECKOUT_SEARCH_CLASS         = "database_checkout_search";
const SEARCH_CLUSTER_ID             = "id_cluster";
const CHECKOUT_TABLE_ID             = "checkout_table";

var num_checkout_items = 0;

/* *********************************************************************** */
$(document).ready(function(){
  // disable binding which is set in the frontend.js file
  $('.query_form input').off('keypress');
  $('a.submit_search').off('click');
  $('.database_search').off('submit');

  var cluster = $('#' + SEARCH_CLUSTER_ID);

  // set customized 'keypress' handler
  $(cluster).on('keydown', function (e) {
    if ( e.which == 13 || e.which == 9 ) {  // handle CR or TAB
      e.preventDefault();
      search_checkout_item();
      $(cluster).focus();
    }
  });
}); //document function end

/* *********************************************************************** */
// function extract the DOM tag value
function extractTagValue ( parent_tag, tag_name )
{
  var return_value = '';
  var fieldTags = parent_tag.getElementsByTagName(tag_name);

  if ( fieldTags.length > 0 ) {
    return_value = fieldTags[0].innerHTML;
  }

  return return_value;
}

/* *********************************************************************** */
// fuction updates the request status of request record
function updateRequestRecord(html_response)
{
  var num_records = 0;
  var records = null;
  var record_list = html_response.getElementById('record_list');
  if ( record_list != null ) {
    records = record_list.children;
    num_records = records.length;
  }

  if ( num_records > 0 ) {
    // extract field values
    var record = records[0];
    var sisn = extractTagValue(record, "sisn");
    var req_order_num = extractTagValue(record, "REQ_ORDER_NUM");
    var req_item_id = extractTagValue(record, "REQ_ITEM_ID");
    var req_item_title = extractTagValue(record, "REQ_ITEM_TITLE");
    var req_loc_code = extractTagValue(record, "REQ_LOC_CODE");

    // set record status to close request
    if ( sisn != '' ) {
      if ( closeRequest(order_num) ) {
        // update group list
        if ( num_checkout_items == 0 && countTableRow(CHECKOUT_TABLE_ID) > 0 ) {
          // clear HTML table
          clearTable ( CHECKOUT_TABLE_ID );
        }

        num_checkout_items++;

        // prepare new checkin table row
        var row_data = [];
        row_data.push(num_checkout_items.toString());
        row_data.push(req_order_num);
        row_data.push(req_loc_code);
        row_data.push(req_item_id);
        row_data.push(req_item_title);

        // insert new checkin table row
        insertTableRow ( CHECKOUT_TABLE_ID, -1, row_data );
      }
    }
  }
}

/* *********************************************************************** */
// function seaches the returned items and changes the record status of requested
// record to "close".
function search_checkout_item()
{
  var cluster_keyvalue = $('#' + SEARCH_CLUSTER_ID).val();
  if ( cluster_keyvalue == undefined || cluster_keyvalue == null ) {
    cluster_keyvalue = '';
  }

  // Is continer ID / item ID entered?
  if ( cluster_keyvalue != '' ) {
    // yes, search and update request record
    var filter_exp = 'REQ_STATUS RETURNED';

    // set line-mode search line
    var search_line = $('#query_expression');
    if ( $(search_line).length > 0 ) {
      $(search_line).val(filter_exp);
    }

    // search request_info database
    var search_form = $('.' + CHECKOUT_SEARCH_CLASS);
    if ( $(search_form).length > 0 ) {
      var query_data = $(search_form).serialize();
      var url = $(search_form).attr('action');

      // search database
      $.ajax({
        async: true,
        type: "POST",
        dataType: "html",
        url: url,
        data: query_data,
        processData: false,
        cache: false,
        timeout: 300000,
        success: function (data) {
          // clear field value
          $('#' + SEARCH_CLUSTER_ID).val('');

          var parser = new DOMParser();
          var html_response = parser.parseFromString(data, "text/html");
          var mwi_error = html_response.getElementById('MWI-error');
          if ( typeof mwi_error == 'undefined' || mwi_error == null ) {
            // update request record
            updateRequestRecord(html_response);
          }
          else {
            if ( parseInt(mwi_error.value, 10) == 212 ) {
              alert ( "Order No/Item ID/Container ID is unknwon." );
            }
            else {
              alert ( 'Error encountered while searching the Code/ID "' + cluster_keyvalue + '".' );
            }
          }
        },
        error: function (xhr, status, error) {
          // clear field value
          $('#' + SEARCH_CLUSTER_ID).val('');

          alert ( "Unable to send command to read request record because of " + error + "." );
        }
      });
    }
    else {
      // clear field value
      $('#' + SEARCH_CLUSTER_ID).val('');

      alert ( "search form is not found" );
    }
  }
}
