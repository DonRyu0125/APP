const CHECKIN_SEARCH_CLASS          = "database_checkin_search";
const SEARCH_CLUSTER_ID             = "id_cluster";
const CHECKIN_TABLE_ID              = "checkin_table";

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
      search_checkin_item();
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
    return_value = decodeHtml(fieldTags[0].innerHTML);
  }

  return return_value;
}

/* *********************************************************************** */
// fuction updates the current location of container record.
function updateContainerLocation ( req_item_id, onsite_location )
{
  var xml_value;

  // prepare parameter to read container record
  var url = getHomeSessId() + "?MANIPXMLRECORD&DATABASE=CONTAINER&READ=Y&KEY=CONTAINER_ID&VALUE=" + encodeURIComponent(req_item_id);

  var update_error = true;

  // read container record
  $.ajax({
    async: false,
    type: "GET",
    dataType: "xml",
    url: url,
    timeout: 300000,
    success: function (data) {
      if ( jQuery.isXMLDoc(data) ) {
        xml_value = getXmlFieldValue (data, "error");
        if ( xml_value != '' && parseInt(xml_value, 10) == 0 ) {
          // build XML record transactions
          var form_data = '<?xml version="1.0" encoding="UTF-8"?>\n<RECORD>\n';

          // if current location is defined, set last location to current location
          xml_value = getXmlFieldValue (data, "CON_CURRENT_LOC");
          if ( xml_value != '' ) {
            // move current location to last location
            form_data = form_data.concat('<CON_LAST_LOC>' + xml_value + '</CON_LAST_LOC>\n');
          }

          // set up transaction to set current location to onisite location
          form_data = form_data.concat('<CON_CURRENT_LOC>' + onsite_location + '</CON_CURRENT_LOC>\n');

          form_data = form_data.concat('</RECORD>');

          // prepare uodate URL
          var update_url = getHomeSessId() + "?MANIPXMLRECORD&DATABASE=CONTAINER&KEY=CONTAINER_ID&VALUE=" + encodeURIComponent(req_item_id);

          // update container record
          $.ajax({
            async: false,
            type: "POST",
            url: update_url,
            contentType: "text/xml",
            dataType: "xml",
            data: form_data,
            processData: false,
            cache: false,
            timeout: 300000,
            success: function (data) {
              if ( jQuery.isXMLDoc(data) ) {
                xml_value = getXmlFieldValue (data, "error");
                if ( xml_value != '' && parseInt(xml_value, 10) == 0 ) {
                  update_error = false;
                }
              }
            },
            error: function (e) {
            }
          });
        }
      }
    },
    error: function (xhr, status, error) {
    }
  });

  if ( update_error ) {
    alert ( 'Error encountered while updating container record.' );
  }
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
    var req_loc_type = extractTagValue(record, "REQ_LOC_TYPE");
    var req_item_id = extractTagValue(record, "REQ_ITEM_ID");
    var req_item_title = extractTagValue(record, "REQ_ITEM_TITLE");
    var req_loc_code = (req_loc_type == 'Onsite') ? extractTagValue(record, "REQ_HOLD_CENTRE") : extractTagValue(record, "REQ_LOC_CODE");
    var item_req_date = extractTagValue(record, "ITEM_REQ_DATE");
    var item_req_time = extractTagValue(record, "ITEM_REQ_TIME");
    var client_email = extractTagValue(record, "REQ_PATRON_EMAIL");
    var req_db_name = extractTagValue(record, "REQ_DB_NAME");
    if ( item_req_date != '' && item_req_time == '' ) {
      item_req_time = '9:00';
    }
    var req_reproduction = extractTagValue(record, "REQ_REPRO");
    var req_time_units = extractTagValue(record, "REQ_TIME_UNITS");
    if ( req_time_units == '' ) {
      req_time_units = 1;
    }
    var req_call_number = extractTagValue(record, "REQ_CALL_NUMBER");
    var req_volume = extractTagValue(record, "REQ_VOLUME_ID");
    var date_selected = false;
    if ( item_req_date != '' ) {
      date_selected = true;
    }

    // set request record ready for viewing
    if ( sisn != '' ) {
      if ( setRequestReady(null, sisn, item_req_date, item_req_time, req_time_units, true, date_selected, true, req_order_num, client_email, req_item_id, req_item_title, req_reproduction) ) {
        if ( req_db_name == 'CONTAINER' || req_db_name == 'DESCRIPTION' ) {
          // extract onsite location
          var onsite_location = $('#onsite_loc_code').val();
          if ( onsite_location != null && onsite_location != '' ) {
            // update container location
            updateContainerLocation ( req_item_id, onsite_location );
          }
        }

        // update group list
        if ( num_checkout_items == 0 && countTableRow(CHECKIN_TABLE_ID) > 0 ) {
          // clear HTML table
          clearTable ( CHECKIN_TABLE_ID );

          num_checkout_items++;

          // prepare new checkin table row
          var row_data = [];
          row_data.push(num_checkout_items.toString());
          row_data.push(req_order_num);
          row_data.push(req_loc_code);
          row_data.push(req_item_id);
          row_data.push(req_item_title);
          row_data.push(req_call_number);
          row_data.push(req_volume);

          // insert new checkin table row
          insertTableRow ( CHECKIN_TABLE_ID, -1, row_data );
        }
      }
    }
  }
}

/* *********************************************************************** */
// function searches for the retrieved items and sets the request status of retrieved
// items to "requested".
function search_checkin_item()
{
  var cluster_keyvalue = $('#' + SEARCH_CLUSTER_ID).val();
  if ( cluster_keyvalue == undefined || cluster_keyvalue == null ) {
    cluster_keyvalue = '';
  }

  // Is item ID or container ID entered?
  if ( cluster_keyvalue != '' ) {
    // yes, search and update request record
    var filter_exp = 'REQ_STATUS RETRIEVE';

    // set line-mode search line
    var search_line = $('#query_expression');
    if ( $(search_line).length > 0 ) {
      $(search_line).val(filter_exp);
    }

    // search request_info database
    var search_form = $('.' + CHECKIN_SEARCH_CLASS);
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
