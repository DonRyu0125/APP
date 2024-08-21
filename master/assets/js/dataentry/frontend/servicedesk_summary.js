// define request status values
const kw_collection_point        = "Collection Point";
const kw_user                    = "User";
const kw_returned                = "Returned";
const kw_keep_out                = "Kept out for user";
const kw_image_n_design          = "Image and Design";
const kw_conservation            = "Conservation";
const kw_not_on_file             = "DPQ - not on shelf";
const kw_incorrect_ref           = "DPQ - incorrect ref";
const kw_other                   = "DPQ - other";
const kw_shelf                   = "Shelf";
const kw_requested               = "Requested";
const returned_id                = "returned";
const dpq_incorrect_ref_id       = "dpq_incorrect_ref";
const dpq_not_on_file_id         = "dpq_not_on_file";
const dpq_other_id               = "dpq_other";
const collection_point_id        = "collection_point"
const HOLD_PERIOD                = 5;
const ok_key_name                = 'ok';
const hold_until_key_name        = 'hold_util';
const loan_period_key_name       = 'loan_period';

// request button parsmeters
var request_button =
{
  "status" :
  [
    { "value"  : kw_shelf,
      "id"     : "shelf",
      "enable" : "collection_point,image_n_design,conservation,dpq_not_on_file,dpq_incorrect_ref,dpq_other"
    },
    { "value"  : kw_requested,
      "id"     : "requested",
      "enable" : "collection_point,image_n_design,conservation,dpq_not_on_file,dpq_incorrect_ref,dpq_other"
    },
    { "value"  : kw_collection_point,
      "id"     : collection_point_id,
      "enable" : "user,returned"
    },
    { "value"  : kw_user,
      "id"     : "user",
      "enable" : "keep_out,returned"
    },
    { "value"  : kw_returned,
      "id"     : returned_id,
      "enable" : "image_n_design,conservation,collection_point"
    },
    { "value"  : kw_keep_out,
      "id"     : "keep_out",
      "enable" : "user,returned,collection_point"
    },
    { "value"  : kw_image_n_design,
      "id"     : "image_n_design",
      "enable" : "returned,collection_point"
    },
    { "value"  : kw_conservation,
      "id"     : "conservation",
      "enable" : "image_n_design,returned,collection_point"
    },
    { "value"  : kw_not_on_file,
      "id"     : dpq_not_on_file_id,
      "enable" : ""
    },
    { "value"  : kw_incorrect_ref,
      "id"     : dpq_incorrect_ref_id,
      "enable" : ""
    },
    { "value"  : kw_other,
      "id"     : dpq_other_id,
      "enable" : ""
    }
  ]
};

$(document).ready(function(){
  active_interface = new ApplicationInterface(new ServiceDeskSummaryRecord('#MY_XML'));
  active_interaction = new ApplicationInteraction(active_interface);

  init(active_interaction.populateForm);

  // Handle Page Loading:
  $('nav#worksheet_nav a').off().on('click', function(e) { e.preventDefault(); loadForm($(this).attr('href')); });
  updateDatabaseActionLinks();
  generateRecordSavingForm('normal');

  // bind handler to "status_button" class
  $("a.status_button").on("click", function (e) {
    e.preventDefault();
    handle_status_button( $(this) );
  });

  // initialize button state if $tmp_cost_summary variable is not defined.
  // $tmp_cost_summary is set in the checkSelection function
  if ( parent != null && typeof parent.$tmp_cost_summary === 'undefined' ) {
    set_button_state();
  }
});

// function sets the inital state of status button
function set_button_state()
{
  var ix = 0;

  // get request status
  var record = currentAppInterface.app_record;
  var request_status = '';
  var reproduction = false;
  var conservation = false;
  var reproduction_done = false;
  var conservation_done = false;
  var field_value = '';

  if ( record != null && record.getElement('REQ_REPRO', 0, null) != false ) {
    field_value = record.getElement('REQ_REPRO', 0, null).text();
    if ( typeof field_value !== 'undefined' && field_value != null && field_value == 'Y' ) {
      reproduction = true;
    }
  }

  if ( record != null && record.getElement('REQ_REPROD_DONE', 0, null) != false ) {
    field_value = record.getElement('REQ_REPROD_DONE', 0, null).text();
    if ( typeof field_value !== 'undefined' && field_value != null && field_value == 'Y' ) {
      reproduction_done = true;
    }
  }

  if ( record != null ) {
    conservation = true;
  }

  if ( record != null && record.getElement('REQ_CONSERVE_DON', 0, null) != false ) {
    field_value = record.getElement('REQ_CONSERVE_DON', 0, null).text();
    if ( typeof field_value !== 'undefined' && field_value != null && field_value == 'Y' ) {
      conservation_done = true;
    }
  }

  if ( record != null && record.getElement('REQ_STATUS', 0, null) != false ) {
    request_status = record.getElement('REQ_STATUS', 0, null).text();
    if ( typeof request_status == 'undefined' || request_status == null ) {
      request_status = '';
    }
  }

  if ( request_status != '' ) {
    // search request_button table
    var enable_list = "returned";
    var button_id = "";
    var status_found = false;
    for ( ix = 0 ; ix < request_button.status.length ; ix++ ) {
      if ( request_button.status[ix].value == request_status ) {
        enable_list = request_button.status[ix].enable;
        button_id = request_button.status[ix].id;
        status_found = true;
        break;
      }
    }

    // disable request buttons by adding 'disable' class
    for ( ix = 0 ; ix < request_button.status.length ; ix++ ) {
      if ( $('#'+request_button.status[ix].id).length > 0 ) {
        $('#'+request_button.status[ix].id).addClass('disabled');
      }
    }

    // if entry is found, parse the "enable" field list
    if ( status_found ) {
      var activate_button;
      var enable_button = enable_list.split(',');

      // for each entry of the 'enable' field list
      for ( ix = 0 ; ix < enable_button.length ; ix++ ) {
        activate_button = true;

        if ( request_status == kw_requested || request_status == kw_returned ) {
          if ( enable_button[ix] == 'collection_point' ) {
            if ( reproduction && !reproduction_done ) {
              activate_button = false;
            }
          }
          if ( enable_button[ix] == 'conservation' ) {
            if ( !conservation || conservation_done ) {
              activate_button = false;
            }
          }
          if ( enable_button[ix] == 'image_n_design' ) {
            if ( !reproduction || reproduction_done ) {
              activate_button = false;
            }
          }
        }

        if ( activate_button ) {
          // remove 'disabled' class
          if ( $('#'+enable_button[ix]).length > 0 ) {
            $('#'+enable_button[ix]).removeClass('disabled');
          }
        }
      }
    }
  }
}

// function handles clicking the status button
function handle_status_button(caller)
{
  var ix = 0;
  var req_appl_name = '';
  var req_item_id = '';
  var req_order_num = '';
  var result = {};
  var record_field;
  var record_field_value;

  result.itemQueued = false;
  result.orderNum = '';

  var button_id = $(caller).attr('id');
  if ( typeof button_id == 'undefined' || button_id == null ) {
    button_id = '';
  }

  // search request_button table
  var status_found = false;
  var request_status = '';
  if ( button_id != '' ) {
    for ( ix = 0 ; ix < request_button.status.length ; ix++ ) {
      if ( request_button.status[ix].id == button_id ) {
        request_status = request_button.status[ix].value;
        status_found = true;
        break;
      }
    }
  }

  if ( status_found ) {
    if ( request_status == kw_conservation ) {
      // If conversion button is click, set REQ_CONSERVE_DON field to Y
      setXmlRecordFieldValue ( 'REQ_CONSERVE_DON', 'Y', 0 );
    }
    else if ( request_status == kw_image_n_design ) {
      // If reproduction button is clicked, set REQ_REPROD_DONE field to Y
      setXmlRecordFieldValue ( 'REQ_REPROD_DONE', 'Y', 0 );
    }

    // get order number
    var record = currentAppInterface.app_record;
    req_order_num = record.getElement('REQ_ORDER_NUM', 0, null).text();
    if ( typeof req_order_num == 'undefined' || req_order_num == null ) {
      req_order_num = '';
    }
    req_appl_name = record.getElement('REQ_DB_NAME', 0, null).text();
    if ( typeof req_appl_name == 'undefined' || req_appl_name == null ) {
      req_appl_name = '';
    }
    req_item_id = record.getElement('REQ_ITEM_ID', 0, null).text();
    if ( typeof req_item_id == 'undefined' || req_item_id == null ) {
      req_item_id = '';
    }
    if ( req_order_num != '' ) {
      // set REQ_STATUS field
      setXmlRecordFieldValue ( 'REQ_STATUS', request_status, 0 );
      // set REQ_STATUS_DATE field
      setXmlRecordFieldValue ( 'REQ_STATUS_DATE', '++6', 0 );
      // set REC_STATUS field
      switch ( button_id ) {
        case returned_id:
          setXmlRecordFieldValue ( 'REC_STATUS', 'Release', 0 );
          break;
        case dpq_incorrect_ref_id:
        case dpq_not_on_file_id:
        case dpq_other_id:
          setXmlRecordFieldValue ( 'REC_STATUS', 'Close', 0 );
          break;
      }

      result = isItemQueued( req_appl_name, req_item_id, true );

      if ( request_status == kw_returned && first_come_first_served ) {
        // if first-come-first-served, pop first member of queue and promote it as booked item candidate
        setXmlRecordFieldValue ( 'REQ_ITEM_RETURN', 'X', 0 );
        setXmlRecordFieldValue ( 'REQ_HOLD_EMAIL', 'X', 0 );
      }

      var callback_data = {};
      callback_data.req_appl_name = req_appl_name;
      callback_data.req_item_id = req_item_id;
      callback_data.req_order_num = req_order_num;
      callback_data.button_id = button_id;
      callback_data.send_email = false;
      callback_data.patron_email = '';
      callback_data.patron_name = '';
      callback_data.item_title = '';
      if ( button_id == collection_point_id ) {
        record_field = record.getElement('REQ_ITEM_TITLE', 0, null);
        if ( record_field != false ) {
          callback_data.item_title = record_field.text();
        }
        record_field = record.getElement('REQ_PATRON_EMAIL', 0, null);
        if ( record_field != false ) {
          callback_data.patron_email = record_field.text();
        }
        record_field = record.getElement('REQ_EMAIL_SENT', 0, null);
        if ( record_field == false ) {
          record_field_value = '';
        }
        else {
          record_field_value = record_field.text();
        }
        if ( record_field_value != 'X' ) {
          callback_data.send_email = true;
          setXmlRecordFieldValue ( 'REQ_EMAIL_SENT', 'X', 0 );
        }
        record_field = record.getElement('REQ_PATRON_NAME', 0, null);
        if ( record_field != false ) {
          callback_data.patron_name = record_field.text();
        }
      }
      callback_data.item_queued = result.itemQueued;
      callback_data.queuedOrderNum = result.orderNum;
      callback_data.request_status = request_status;
      var callback_func = function (html_response, data) {statusPostPrcoessing(html_response, data);}

      // change request status and record status
      var field_handle = $('#dba_save').find('a');
      if ( field_handle.length > 0 ) {
        var form_action = $(field_handle).data('form-action');
        var form = $('#submission_form');

        if ( form_action === undefined || form_action == null || form.length <= 0 ) {
          alert ( "Form is not found." );
        }
        else {
          submitFormAndCallback ( form_action, form, callback_func, callback_data, false );
        }
      }
    }
  }
}

// function changes the request status to hold the request record.
function holdRequestRecord ( order_num, result )
{
  // prepeare transaction to update request record
  var form_data = '<?xml version="1.0" encoding="UTF-8"?>\n<RECORD>\n';

  // set REQ_STATUS field
  form_data = form_data.concat('<REQ_STATUS>Hold</REQ_STATUS>\n');

  // set REQ_HOLD_UTIL field
  form_data = form_data.concat('<REQ_HOLD_UTIL>' + result.hold_util + '</REQ_HOLD_UTIL>\n');

  // set REQ_NEXT_COLLECT field
  form_data = form_data.concat('<REQ_NEXT_COLLECT>X</REQ_NEXT_COLLECT>\n');

  // set REQ_STATUS_DATE field to today's date
  form_data = form_data.concat('<REQ_STATUS_DATE>++6</REQ_STATUS_DATE>\n');

  // prepare URL
  var url = getHomeSessId() + "?MANIPXMLRECORD&DATABASE=REQUEST_INFO&KEY=REQ_ORDER_NUM&VALUE=" + order_num;

  // update request record
  $.ajax({
    async: true,
    type: "POST",
    dataType: "xml",
    url: url,
    data: form_data,
    processData: false,
    cache: false,
    timeout: 300000,
    success: function (data) {
      if ( jQuery.isXMLDoc(data) ) {
        var xml_value = getXmlFieldValue (data, "error");
        if ( xml_value != '' && parseInt(xml_value, 10) != 0 ) {
          alert ( "Error " + xml_value + " encountered while updating request record." );
        }
      }
    },
    error: function (xhr, status, error) {
      alert ( "Unable to send command to update request record because of " + error + "." );
    }
  });
}

// function extracts the client email from the request and send email notification to client.
function sendHoldEmail ( html_response, queuedOrderNum )
{
   // prepare url
   var url =  getHomeSessId() + "?MANIPXMLRECORD&DATABASE=REQUEST_INFO&READ=Y&KEY=REQ_ORDER_NUM&VALUE=" + escapeUrlchars(queuedOrderNum);

   var patronEmail = '';
   var reqItemID = '';
   var itemTitle = '';
   var patronName = '';

   // read request record
   $.ajax({
     async: false,
     type: "GET",
     dataType: "xml",
     url: url,
     timeout: 300000,
     success: function (data) {
       if ( jQuery.isXMLDoc(data) ) {
         var xml_value = getXmlFieldValue (data, "error");
         if ( xml_value != '' ) {
           var ecode = parseInt(xml_value, 10);
           // Is record found?
           if ( ecode == 0 ) {
             // extract client email
             patronEmail = getXmlFieldValue (data, "REQ_PATRON_EMAIL");

             // extract item ID
             reqItemID = getXmlFieldValue (data, "REQ_ITEM_ID");

             // extract item title
             itemTitle = getXmlFieldValue (data, "REQ_ITEM_TITLE");

             // extract patron name
             patronName = getXmlFieldValue (data, "REQ_PATRON_NAME");

             // send email
             if ( patronEmail != '' ) {
               sendReadyEmail( queuedOrderNum, patronEmail, reqItemID, itemTitle, patronName );
             }
           }
         }
       }
     },
     error: function (xhr, status, error) {
     }
   });
}


// function schedules next request if item requests are queued.
function statusPostPrcoessing( html_response, callback_data )
{
  var return_code = false;

  var parser = new DOMParser();
  var doc1 = parser.parseFromString(html_response, "text/html");
  var mwi_error = doc1.getElementById('MWI-error');
  var fieldValue = '';

  var req_selected = false;
  var num_occ = 0;
  var order_num = '';
  var hold_util = '';
  var loan_day = 0;

  var requestQueueXml = null;
  var queueRecordNode = null;
  var queue_group_nodes = null;

  var requestRecordXml = null;
  var requestRecordNode = null;

  // Is it a error message ?
  if ( typeof mwi_error == 'undefined' || mwi_error == null ) {
    // no, proceed processing

    // update request status of table row of request summary
    // $tmp_status_td variable is set in the checkSelection function
    if ( typeof parent.$tmp_status_td !== 'undefined' && parent.$tmp_status_td != null ) {
      $(parent.$tmp_status_td).text(callback_data.request_status);
    }

    if ( callback_data.button_id == returned_id ) {
      if ( first_come_first_served ) {
        if ( callback_data.queuedOrderNum != '' ) {
          // sendHoldEmail ( html_response, callback_data.queuedOrderNum );
          var ok = true;
        }
      }
      else if ( callback_data.item_queued ) {
        // read request queue record
        requestQueueXml = readRequestQueueRecord( callback_data.req_appl_name, callback_data.req_item_id );
        if ( typeof requestQueueXml !== 'boolean' ) {
          queueRecordNode = requestQueueXml.getElementsByTagName("record")[0].cloneNode(true);
          queue_group_nodes = queueRecordNode.getElementsByTagName("QUEUE_GROUP");

          // count number occurrences of QUEUE_GROUP field
          num_occ = queue_group_nodes.length;

          // for each group occrurence
          if ( num_occ > 0 ) {
            // extract order number
            order_num = getXmlFieldValue (queue_group_nodes[0], "QUE_ORDER_NUM");

            // read request record
            requestRecordXml = readRequestRecord( order_num );
            if ( typeof requestRecordXml !== 'boolean' ) {
              requestRecordNode = requestRecordXml.getElementsByTagName("record")[0].cloneNode(true);

              fieldValue = getXmlFieldValue (requestRecordNode, "REQ_TIME_UNITS");
              if ( fieldValue == '' ) {
                fieldValue = '1';
              }
              loan_day = parseInt(fieldValue, 10);

              // check requested item availability
              var hold_result = checkRequestAvailability ( callback_data.req_appl_name,
                callback_data.req_item_id, "", "", loan_day, HOLD_PERIOD );
              if ( hold_result.ok ) {
                // prepare transaction to delete selected occurrence of QUEUE_GROUP
                var url = getHomeSessId() + "?MANIPXMLRECORD&DATABASE=REQUEST_QUEUE&KEY=QUEUE_KEY" +
                  "&VALUE=" + callback_data.req_appl_name + "-" + callback_data.req_item_id;

                var form_data = '<?xml version="1.0" encoding="UTF-8"?>\n<RECORD>\n';

                // set ACTIVE_ORDER_NUM field
                form_data = form_data.concat('<ACTIVE_ORDER_NUM>' + order_num + '</ACTIVE_ORDER_NUM>\n');

                // delete QUEUE_GROUP field
                form_data = form_data.concat('<QUEUE_GROUP op="del" occ="1"></QUEUE_GROUP>');

                form_data = form_data.concat('</RECORD>');

                // update request queue record
                $.ajax({
                  async: true,
                  type: "POST",
                  dataType: "xml",
                  url: url,
                  data: form_data,
                  processData: false,
                  cache: false,
                  timeout: 300000,
                  success: function (data) {
                    if ( jQuery.isXMLDoc(data) ) {
                      var xml_value = getXmlFieldValue (data, "error");
                      if ( xml_value != '' && parseInt(xml_value, 10) != 0 ) {
                        alert ( "Error " + xml_value + " encountered while updating request queue record." );
                      }
                      else {
                        // hold request record
                        holdRequestRecord ( order_num, hold_result );
                      }
                    }
                  },
                  error: function (xhr, status, error) {
                    alert ( "Unable to send command to update request queue record because of " + error + "." );
                  }
                });
              }
            }
          }
        }
      }
    }
    else if ( callback_data.button_id == collection_point_id && callback_data.send_email ) {
      sendReadyEmail( callback_data.req_order_num, callback_data.patron_email,
        callback_data.req_item_id, callback_data.item_title, callback_data.patron_name );
    }
  }
}


// fuction to call MWI to update payment of requests
function updatePayment( form_id )
{
  // enable waiting icon
  var wait_icon_id = "process-waiting";

  var payment_form = $('#'+form_id);
  if ( $(payment_form).length > 0 ) {
    var form_data = $(payment_form).serialize();
    var url = $(payment_form).attr('action');

    document.getElementById(wait_icon_id).style.display = "block";

    $.ajax({
      async: true,
      type: "POST",
      dataType: "xml",
      url: url,
      data: form_data,
      success: function (data) {
        document.getElementById(wait_icon_id).style.display = "none";

        var xml_value = getXmlFieldValue (data, "error");
        if ( xml_value != '' && parseInt(xml_value, 10) == 0 ) {
          // close colorbox
          if ( typeof parent.$.colorbox.close == 'function' ) {
            parent.$.colorbox.close();
          }
        }
        else {
          alert ( "Error " + xml_value + " encountered while updating request records." );
        }
      },
      error: function (xhr, status, error) {
        document.getElementById(wait_icon_id).style.display = "none";
        alert ( "Unable to update request record because of " + error + "." );
      }
    });
  }
}

// function checks the availability of requested item.  Teh load period includes
// number of loan days plus hold period.
function checkRequestAvailability ( appl_name, item_id, req_date, req_time, loan_day, hold_period )
{
  var return_result = { ok_key_name: false, hold_until_key_name: '', end_tm_key_value: '' };

  var url = getHomeSessId() + "?CHECKLOANOPERIOD&DATABASE=REQUEST_INFO";
  url = url.concat('&APPL=' + appl_name);
  url = url.concat('&ITEM=' + item_id);
  if ( req_date != '' ) {
    url = url.concat('&DATE=' + req_date);
  }
  if ( req_time != '' ) {
    url = url.concat('&TIME=' + req_time);
  }
  url = url.concat('&LOAN=' + loan_day);
  if ( hold_period > 0 ) {
    url = url.concat('&HOLD=' + hold_period);
  }

  // send command to server
  $.ajax({
    async: false,
    type: "GET",
    dataType: "xml",
    url: url,
    timeout: 300000,
    success: function (data) {
      if ( jQuery.isXMLDoc(data) ) {
        var xml_value = getXmlFieldValue (data, "error");
        if ( xml_value != '' ) {
          var ecode = parseInt(xml_value, 10);
          if ( ecode == 0 ) {
            return_result[ok_key_name] = true;
            xml_value = getXmlFieldValue (data, hold_until_key_name);
            if ( xml_value != '' ) {
              return_result[hold_until_key_name] = xml_value;
            }
            xml_value = getXmlFieldValue (data, loan_period_key_name);
            if ( xml_value != '' ) {
              return_result[loan_period_key_name] = xml_value;
            }
          }
          else {
            switch ( ecode ) {
              case 2001:
                alert ( "Requested date is unavailable." );
                break;
              case 2002:
                alert ( "Requested date is closed." );
                break;
              default:
                alert ( "Error " + ecode + " encountered while verifying requested date." );
                break;
            }
          }
        }
      }
    },
    error: function (xhr, status, error) {
      alert ( "Unable to send command to read request record because of " + error + "." );
    }
  });


  return return_result;
}