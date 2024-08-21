const REQ_NEW_TAG              = "REQ_NEW";
const ACTIVE_ORDER_NUM_TAG     = "ACTIVE_ORDER_NUM";
const QUEUE_GROUP_TAG          = "QUEUE_GROUP";
const RECORD_TAG               = "record";
const QUE_ORDER_NUM_TAG        = "QUE_ORDER_NUM";
const QUE_TITLE_TAG            = "QUE_TITLE";
const QUE_PATRON_NAME_TAG      = "QUE_PATRON_NAME";
const DEFAULT_START_TIME       = '9:00';
const COPYRIGHT_TOPIC          = "Copyright Services";
const DEFAULT_FROM_EMAIL       = "ao@ontario.ca";
const MWI_SCRIPT_DLL           = 'mwimain.dll';

/* first-come-first-serve flag */
var first_come_first_served = true;

/* ************************************************************************ */
// function checks the request queue is empty or not.
function isItemQueued( appl_name, item_id, check_queue_only )
{
  var read_error = false;

  var result = {};
  result.itemQueued = true;
  result.orderNum = '';

  var url = getHomeSessId() + "?MANIPXMLRECORD&DATABASE=REQUEST_QUEUE&READ=Y&KEY=QUEUE_KEY" +
            "&VALUE=" + appl_name + "-" + item_id;

  // send HTTP request by ajax
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
            // check existence of ACIVE_ORDER_NUM field
            var num_occ = 0;
            if ( !check_queue_only ) {
              num_occ = countXmlTag ( data, ACTIVE_ORDER_NUM_TAG );
            }
            if ( num_occ <= 0 ) {
              // if no actiive order, check number of occurrence of QUEUE_GROUP field
              num_occ = countXmlTag ( data, "QUEUE_GROUP" );
              if ( num_occ == 0 ) {
                result.itemQueued = false;
              }
              else {
                // get first order number from the queue
                var queue_group = getXmlFieldGroup( data, "QUEUE_GROUP" );
                if ( queue_group != null &&  queue_group.length > 0 ) {
                  result.orderNum = getXmlFieldValue( queue_group[0], "QUE_ORDER_NUM" );
                }
              }
            }
          }
          else if ( ecode == 644 ) {  // 644 means record not found
            result.itemQueued = false;
          }
        }
      }
    },
    error: function (xhr, status, error) {
      alert ( "Unable to read request queue record because of " + error + "." );
      read_error = true;
    }
  });

  if ( !result.itemQueued && !read_error ) {
    // does item have outstanding request?

  }

  return result;
}

// function reads a request queue record using the application anme and itenm ID.
function readRequestQueueRecord( appl_name, item_id)
{
  var record = false;

  var url = getHomeSessId() + "?MANIPXMLRECORD&DATABASE=REQUEST_QUEUE&READ=Y&KEY=QUEUE_KEY" +
            "&VALUE=" + appl_name + "-" + item_id;

  // send HTTP request by ajax
  $.ajax({
    async: false,
    type: "GET",
    dataType: "xml",
    url: url,
    timeout: 300000,
    success: function (data) {
      if ( jQuery.isXMLDoc(data) ) {
        var xml_value = getXmlFieldValue (data, "error");
        if ( xml_value != '' && parseInt(xml_value, 10) == 0 ) {
          record = data;
        }
      }
    },
    error: function (xhr, status, error) {
      alert ( "Unable to send command to read request queue record because of " + error + "." );
    }
  });

  return record;
}

// function reads a request record using the order number.
function readRequestRecord( order_number )
{
  var record = false;

  var url = getHomeSessId() + "?MANIPXMLRECORD&DATABASE=REQUEST_INFO&READ=Y&KEY=REQ_ORDER_NUM" +
            "&VALUE=" + order_number;

  // send HTTP request by ajax
  $.ajax({
    async: false,
    type: "GET",
    dataType: "xml",
    url: url,
    timeout: 300000,
    success: function (data) {
      if ( jQuery.isXMLDoc(data) ) {
        var xml_value = getXmlFieldValue (data, "error");
        if ( xml_value != '' && parseInt(xml_value, 10) == 0 ) {
          record = data;
        }
      }
    },
    error: function (xhr, status, error) {
      alert ( "Unable to send command to read request record because of " + error + "." );
    }
  });

  return record;
}

// function sets the availability of the request record.  It changes request status and
// sets the request loan period.
function setRequestReady ( e, sisn, reqDate, reqTime, numUnits, readyState, dateSelected, showMessage,
                           order_num, patronEmail, itemID, itemTitle, req_reproduction )
{
  var result = false;

  var url = getHomeSessId() + "?MANIPXMLRECORD&DATABASE=REQUEST_INFO&KEY=SISN&VALUE=" + sisn;

  // build XML record transactions
  var form_data = '<?xml version="1.0" encoding="UTF-8"?>\n<RECORD>\n';

  if ( !dateSelected && !first_come_first_served ) {
    form_data = form_data.concat('<REQ_NEXT_AVAIL></REQ_NEXT_AVAIL>\n');
    form_data = form_data.concat('<REQ_NEXT_COLLECT></REQ_NEXT_COLLECT>\n');
    form_data = form_data.concat('<DATE_NEEDED></DATE_NEEDED>\n');
    form_data = form_data.concat('<TIME_NEEDED></TIME_NEEDED>\n');
    form_data = form_data.concat('<REQ_SELECTED></REQ_SELECTED>\n');
  }
  if ( readyState ) {
    if ( !dateSelected ) {
      if ( first_come_first_served ) {
        form_data = form_data.concat('<TIME_NEEDED>' + reqTime + '</TIME_NEEDED>\n');
        form_data = form_data.concat('<DATE_NEEDED>' + reqDate + '</DATE_NEEDED>\n');
      }
      else if ( reqDate == '' ) {
        form_data = form_data.concat('<REQ_NEXT_COLLECT>X</REQ_NEXT_COLLECT>\n');
        form_data = form_data.concat('<REQ_SELECTED>X</REQ_SELECTED>\n');
      }
      else {
        form_data = form_data.concat('<TIME_NEEDED>' + reqTime + '</TIME_NEEDED>\n');
        form_data = form_data.concat('<DATE_NEEDED>' + reqDate + '</DATE_NEEDED>\n');
      }
      form_data = form_data.concat('<LOAN_DAY>' + numUnits + '</LOAN_DAY>\n');
    }
    if ( req_reproduction == 'Y' ) {
      form_data = form_data.concat('<REQ_STATUS>Image and Design</REQ_STATUS>\n');
    }
    else {
      form_data = form_data.concat('<REQ_STATUS>Requested</REQ_STATUS>\n');
    }
    form_data = form_data.concat('<REC_STATUS>Active</REC_STATUS>\n');
  }
  else {
    if ( !dateSelected && !first_come_first_served ) {
      form_data = form_data.concat('<LOAN_DAY></LOAN_DAY>\n');
    }
    form_data = form_data.concat('<REQ_STATUS>Retrieve</REQ_STATUS>\n');
    form_data = form_data.concat('<REC_STATUS>Active</REC_STATUS>\n');
  }
  form_data = form_data.concat('</RECORD>');

  // update request status of REQUEST_INFO record
  $.ajax({
    async: false,
    type: "POST",
    url: url,
    contentType: "text/xml",
    dataType: "xml",
    data: form_data,
    processData: false,
    cache: false,
    timeout: 300000,
    success: function (data) {
      if ( jQuery.isXMLDoc(data) ) {
        var xml_value = getXmlFieldValue (data, "error");
        if ( xml_value == '' || parseInt(xml_value, 10) != 0 ) {
          if ( e != null ) {
            e.preventDefault();
          }
          alert ( "Error " + xml_value + " encountered while changing request status." );
        }
        else {
          if ( showMessage ) {
            if ( readyState ) {
              // alert ( 'Request "' + order_num + '" is ready for view/pickup.' );
              result = true;
            }
            else {
              alert ( 'Request "' + order_num + '" is unselected as request candidate.' );
            }
          }

          result = true;
        }
      }
      else {
        if ( e != null ) {
          e.preventDefault();
        }
        alert ( "Error is encountered while changing request status." );
      }
    },
    error: function (e) {
      if ( e != null ) {
        e.preventDefault();
      }
      alert ( "Error is encountered while changing request status." );
    }
  });

  return result;
}

// function changes the record status of request record to "close".  The return date is set to
// today's date.
function closeRequest ( order_num )
{
  var result = false;

  var url = getHomeSessId() + "?MANIPXMLRECORD&DATABASE=REQUEST_INFO&KEY=REQ_ORDER_NUM&VALUE=" + order_num;

  // build XML record transactions
  var form_data = '<?xml version="1.0" encoding="UTF-8"?>\n<RECORD>\n';
  form_data = form_data.concat('<REC_STATUS>Close</REC_STATUS>\n');
  form_data = form_data.concat('<REQ_STATUS>Shelf</REQ_STATUS>\n');
  form_data = form_data.concat('<REQ_RETURN_DATE>++1</REQ_RETURN_DATE>\n');
  form_data = form_data.concat('</RECORD>');

  // update request status of REQUEST_INFO record
  $.ajax({
    async: true,
    type: "POST",
    url: url,
    contentType: "text/xml",
    dataType: "xml",
    data: form_data,
    processData: false,
    cache: false,
    timeout: 300000,
    success: function (data) {
      if ( jQuery.isXMLDoc(data) ) {
        var xml_value = getXmlFieldValue (data, "error");
        if ( xml_value == '' || parseInt(xml_value, 10) != 0 ) {
          alert ( "Error " + xml_value + " encountered while changing request status." );
        }
        else {
          result = true;
        }
      }
      else {
        alert ( "Error is encountered while changing request status." );
      }
    },
    error: function () {
      alert ( "Error is encountered while changing request status." );
    }
  });

  return result;
}

/* ************************************************************************ */
// function updates request status
function updatRequestStatus ( status_value, callback_func, callback_data )
{
  var return_code = true;

  // update REQ_STATUS field
  var field_handle = $('#REQ_STATUS');
  if ( field_handle.length > 0 ) {
    $(field_handle).val(status_value).change();
  }

  // set approved date
  field_handle = $('#REQ_PROCESS_DATE');
  if ( field_handle.length > 0 ) {
    var today = new Date();
    $(field_handle).val(today.toISOString().substring(0, 10)).change();
  }

  // clear loan-period
  field_handle = $('#LOAN_PERIOD');
  if ( field_handle.length > 0 ) {
    $(field_handle).val('').change();
  }

  // delete COLLECTION_TIME field
  var record = currentAppInterface.app_record;
  var collection_time = record.getElement('COLLECTION_TIME');
  if ( collection_time !== false ) {
    record.removeElement(collection_time);
  }

  // send HTTP request to commit record change
  field_handle = $('#dba_save').find('a');
  if ( field_handle.length > 0 ) {
    var form_action = $(field_handle).data('form-action');
    var form = $('#submission_form');

    if ( form_action === undefined || form_action == null || form.length <= 0 ) {
      alert ( "Form is not found." );
      return_code = false;
    }
    else {
      return_code = submitFormAndCallback ( form_action, form, callback_func, callback_data, false );
    }
  }

  return return_code;
}

/* ************************************************************************ */
// function adds active order number to request_queue record
function setActiveOrderNo( html_response, data )
{
  // extract xml record and save it in parent window
  extractXmlRecord ( html_response );

  if ( data.req_topoc != COPYRIGHT_TOPIC ) {
    // Is it a error message
    var parser = new DOMParser();
    var doc1 = parser.parseFromString(html_response, "text/html");
    var mwi_error = doc1.getElementById('MWI-error');

    // Is it a error message?
    if ( typeof mwi_error == 'undefined' || mwi_error == null ) {
      if ( data.new_record ) {
        // create record according to req_topic field value
      }
      else if ( !first_come_first_served ) {
        // if first_come_first_served, the REQUEST_UPDATE_QUEUE user routien updates request queue record
        var req_appl_name = data.req_appl_name;
        var req_item_id = data.req_item_id;
        var req_order_num = data.req_order_num;
        var req_patron_id = data.req_patron_id;

        // prepare update record URL
        var url = getHomeSessId() + "?MANIPXMLRECORD&DATABASE=REQUEST_QUEUE&CREATE=Y&KEY=QUEUE_KEY" +
                  "&VALUE=" + req_appl_name + "-" + req_item_id;

        // prepare record transactions
        var form_data = '<?xml version="1.0" encoding="UTF-8"?>\n<RECORD>\n';
        form_data = form_data.concat('<QUE_ITEM_ID>' + req_item_id + '</QUE_ITEM_ID>\n');
        form_data = form_data.concat('<QUE_DB_NAME>' + req_appl_name + '</QUE_DB_NAME>\n');
        form_data = form_data.concat('<ACTIVE_ORDER_NUM>' + req_order_num + '</ACTIVE_ORDER_NUM>\n');
        form_data = form_data.concat('</RECORD>');

        // send HTTP request by ajax to create/update request queue record
        $.ajax({
          async: false,
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
    }
  }
}

/* ************************************************************************ */
// function adds the DATE_NEEDED field, the TIME_NEED filed and the LOAN_DAY
// field to the XML record.
function setLoanPeriodFields(source_dbname, item_id, req_topic)
{
  var approve_ok = true;
  var record = currentAppInterface.app_record;
  var xml_field;

  // extract ITEM_REQ_DATE field
  var date_needed;
  var loan_day;
  var time_needed;
  var end_date_needed;

  var date_present = false;
  xml_field = record.getElement('ITEM_REQ_DATE', 0, null);
  if ( xml_field !== false ) {
    date_present = true;
  }

  if ( first_come_first_served && !date_present) {
    date_needed = '';
    time_needed = '';
  }
  else {
    xml_field = record.getElement('ITEM_REQ_DATE', 0, null);
    if ( xml_field == false ) {
      date_needed = '';
      time_needed = '';
    }
    else {
      date_needed = xml_field.text();

      // extract ITEM_REQ_TIME field
      xml_field = record.getElement('ITEM_REQ_TIME', 0, null);
      if ( xml_field == false ) {
        time_needed = DEFAULT_START_TIME;
      }
      else {
        time_needed = xml_field.text();
      }
    }
  }

  // extract END_DATE_NEEDED field
  xml_field = record.getElement('END_DATE_NEEDED', 0, null);
  if ( xml_field !== false ) {
    end_date_needed = xml_field.text();
    loan_day = null;
  }
  else {
    end_date_needed = null;

    // extract REQ_TIME_UNITS field
    xml_field = record.getElement('REQ_TIME_UNITS', 0, null);
    if ( xml_field == false ) {
      loan_day = '1';
    }
    else {
      loan_day = xml_field.text();
    }
  }

  if ( first_come_first_served && !date_present) {
    approve_ok = true;
  }
  else {
    if ( req_topic == COPYRIGHT_TOPIC ) {
      approve_ok = true;
    }
    else {
      approve_ok = verifyCollectionTime ( source_dbname, item_id, date_needed, time_needed, loan_day, end_date_needed );
    }
  }
  if ( approve_ok ) {
    if ( loan_day != null ) {
      setXmlRecordFieldValue ( 'LOAN_DAY', loan_day, 0 );
    }

    if ( first_come_first_served && !date_present) {
      setXmlRecordFieldValue ( 'REQ_QUEUE', 'X', 0 );
      setXmlRecordFieldValue ( 'REQ_SELECTED', 'X', 0 );
      setXmlRecordFieldValue ( 'REC_STATUS', 'Active', 0 );
    }
    else if ( date_needed == '' ) {
      setXmlRecordFieldValue ( 'REQ_SELECTED', 'X', 0 );
      setXmlRecordFieldValue ( 'REQ_NEXT_COLLECT', 'X', 0 );
    }
    else {
      setXmlRecordFieldValue ( 'DATE_NEEDED', date_needed, 0 );
      setXmlRecordFieldValue ( 'TIME_NEEDED', time_needed, 0 );
    }
  }

  return approve_ok;
}


/* ************************************************************************ */
// function checks to see the item is available for loan or not at the specified time.
function verifyCollectionTime ( source_dbname, item_id, date_needed, time_needed, loan_day, end_date_needed )
{
  var  item_available = true;

  return item_available;
}


/* ************************************************************************ */
// function sets the request status to "Retrieve" value and determine the request
// date and request time.
function setActiveRequest(req_appl_name, req_item_id, req_order_num, new_record, req_topic, req_patron_id)
{
  // add request date, request time and loan day to the XML record
  var approve_ok = setLoanPeriodFields(req_appl_name, req_item_id,  req_topic);

  if ( !approve_ok ) {
    alert ( "Item is unavailable at the specifed date/time." );
  }
  else {
    var callback_data = {};
    callback_data.req_appl_name = req_appl_name;
    callback_data.req_item_id = req_item_id;
    callback_data.req_order_num = req_order_num;
    callback_data.new_record = new_record;
    callback_data.req_topic = req_topic;
    callback_data.req_patron_id = req_patron_id;
    var callback_func = function (html_response, callback_data) { setActiveOrderNo(html_response, callback_data); };

    // update request record with "retrieve" status
    var status = 'Retrieve';
    if ( req_topic == COPYRIGHT_TOPIC ) {
      status = 'Requested';
    }
    else {
      if ( !first_come_first_served ) {
        if ( typeof req_item_id == 'string' && req_item_id == '' ) {
          status = 'Approved No Action';
        }
      }
    }
    approve_ok = updatRequestStatus ( status, callback_func, callback_data );
  }

  return approve_ok;
}


/* ************************************************************************ */
// function updates request queue record after request record is saved successfully.
function setWaitStatus(html_response, callback_data)
{
  // extract xml record and save it in parent window
  extractXmlRecord ( html_response );

  // if request record status is changed successfully, set update request queue record URL
  var url = getHomeSessId() + "?MANIPXMLRECORD&DATABASE=REQUEST_QUEUE&CREATE=Y&KEY=QUEUE_KEY" +
            "&VALUE=" + callback_data.req_appl_name + "-" + callback_data.req_item_id;

  // prepare record transactions
  var form_data = '<?xml version="1.0" encoding="UTF-8"?>\n<RECORD>\n';
  form_data = form_data.concat('<QUE_ITEM_ID>' + callback_data.req_item_id + '</QUE_ITEM_ID>\n');
  form_data = form_data.concat('<QUE_DB_NAME>' + callback_data.req_appl_name + '</QUE_DB_NAME>\n');
  form_data = form_data.concat('<QUEUE_GROUP>\n');
  form_data = form_data.concat('<QUE_ORDER_NUM>' + callback_data.req_order_num + '</QUE_ORDER_NUM>\n');
  if ( callback_data.req_patron_name != '' ) {
    form_data = form_data.concat('<QUE_PATRON_NAME>' + callback_data.req_patron_name + '</QUE_PATRON_NAME>\n');
  }
  if ( callback_data.req_title != '' ) {
    form_data = form_data.concat('<QUE_TITLE>' + callback_data.req_title + '</QUE_TITLE>\n');
  }
  if ( callback_data.req_patron_id != '' ) {
    form_data = form_data.concat('<QUE_PATRON_ID>' + callback_data.req_patron_id + '</QUE_PATRON_ID>\n');
  }
  form_data = form_data.concat('</QUEUE_GROUP>\n');
  form_data = form_data.concat('</RECORD>');

  // send HTTP request by ajax to create/update request queue record
  $.ajax({
    async: false,
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
      }
    },
    error: function (xhr, status, error) {
      alert ( "Unable to send command to update request queue record because of " + error + "." );
    }
  });
}

/* ************************************************************************ */
// function handles the approval of the request.
function approveRequest (calling_field)
{
  // mandatory field checking
  var rc = checkMandatoryField();
  if ( rc == false ) {
    // if missing mandatory field, exit function
    return;
  }

  var restricted = $('#REQ_RESTR_ITEM').val();
  if ( restricted != null && restricted == 'Y' ) {
    alert ( 'Apprival is denied because item is restricted.' );
    return;
  }

  var approve_ok = false;

  // reset REQ_NEW field to N
  var record = currentAppInterface.app_record;
  var req_new_field = record.getElement(REQ_NEW_TAG);
  if ( req_new_field !== false ) {
    req_new_value = req_new_field.text();
    if ( req_new_value === 'Y' ) {
      record.updateElement(req_new_field, 'N');
    }
  }

  // extract REQ_ORDER_NUM field
  var req_order_num = $('#REQ_ORDER_NUM').val();
  if ( req_order_num === undefined || req_order_num == null ) {
    req_order_num = '';
  }

  // extract REQ_ITEM_ID field
  var req_item_id = $('#REQ_ITEM_ID').val();
  if ( req_item_id === undefined || req_item_id == null ) {
    req_item_id = '';
  }

  // extract REQ_DB_NAME field
  var req_appl_name = $('#REQ_DB_NAME').val();
  if ( req_appl_name === undefined || req_appl_name == null ) {
    req_appl_name = '';
  }

  // extract REQ_PATRON_NAME field
  var req_patron_name = $('#REQ_PATRON_NAME').val();
  if ( req_patron_name === undefined || req_patron_name == null ) {
    req_patron_name = '';
  }

  // extract REQ_TITLE field
  var req_title = $('#REQ_TITLE').val();
  if ( req_title === undefined || req_title == null ) {
    req_title = '';
  }

  // extract ITEM_REQ_DATE field
  var item_req_date = $('#ITEM_REQ_DATE').val();
  if ( item_req_date === undefined || item_req_date == null ) {
    item_req_date = '';
  }

  // extract REQ_TIME field
  var item_req_time = $('#ITEM_REQ_TIME').val();
  if ( item_req_time === undefined || item_req_time == null ) {
    item_req_time = DEFAULT_START_TIME;
  }

  // extract REQ_TOPIC field
  var req_topic = $('#REQ_TOPIC').val();
  if ( req_topic === undefined || req_topic == null ) {
    req_topic = '';
  }

  // extract REQ_ADD_RECORD field
  var add_record = $('#REQ_ADD_RECORD').val();
  if ( add_record === undefined || add_record == null ) {
    add_record = false;
  }
  else {
    if ( add_record == 'Y' ) {
      add_record = true;
    }
    else {
      add_record = false;
    }
  }

  // extract REQ_PATRON_ID field
  var req_patron_id = $('#REQ_PATRON_ID').val();
  if ( req_patron_id === undefined || req_patron_id == null ) {
    req_patron_id = '';
  }

  if ( (req_item_id != '' && req_appl_name == '') || req_order_num == '' ) {
    alert ( "Either Order number or Item source is missing." );
  }
  else if ( add_record && req_appl_name == '' ) {
    alert ( "Item source is missing." );
  }
  else {
    // Is item already queued?
    var result = {};
    result.itemQueued = false;
    if ( !add_record ) {
      if ( req_topic != COPYRIGHT_TOPIC ) {
        result = isItemQueued( req_appl_name, req_item_id, false );
      }
    }

    var callback_data = {};
    callback_data.req_appl_name = req_appl_name;
    callback_data.req_item_id = req_item_id;
    callback_data.req_order_num = req_order_num;
    callback_data.req_patron_name = req_patron_name;
    callback_data.req_title = req_title;
    callback_data.new_record = add_record;
    callback_data.req_topic = req_topic;
    callback_data.req_patron_id = req_patron_id;
    var callback_func = function (html_response, callback_data) { setWaitStatus(html_response, callback_data); };

    if ( !result.itemQueued && !first_come_first_served ) {
      // update request record with "retrieve" status
      approve_ok = setActiveRequest(req_appl_name, req_item_id, req_order_num, add_record, req_topic, req_patron_id);
    }
    else {
      if ( first_come_first_served || item_req_date != '' ) {
        // add DATE_NEEDED field and TIME_NEEDED field
        approve_ok = setLoanPeriodFields(req_appl_name, req_item_id, req_topic);
        if ( !approve_ok ) {
          alert ( "Item is unavailable at the specified date/time." );
        }
        else {
          approve_ok = updatRequestStatus('Retrieve', null, null);
        }
      }
      else {
        if ( req_item_id == '' ) {
          approve_ok = updatRequestStatus('Aprroved with No Action', null, null);
        }
        else {
          // update request record with "Wait" status
          approve_ok = updatRequestStatus('Wait', callback_func, callback_data);
        }
      }
    }
  }

  // colorbox is closed in either confirmation report or close_form.html file
  // if ( approve_ok ) {
  //   if ( popupWindow() ) {
  //     parent.$.colorbox.close();
  //   }
  // }
}

/* ************************************************************************ */
// function loads queue table from a REQUEST_QUEUE record
function loadQueueTable (calling_field)
{
  var table_id = $(calling_field).data('table');
  if ( table_id === undefined || table_id == null ) {
    table_id = '';
  }

  var record = currentAppInterface.app_record;
  var field_handle = null;
  var field_name = "";

  // extract REQ_DB_NAME field
  var req_appl_name = "";
  field_name = "REQ_DB_NAME".toLowerCase();
  field_handle = record.getElement(field_name, 0, null);
  if ( field_handle !== false ) {
    req_appl_name = field_handle.text();

    // show application name in queue form
    $('#QUE_DB_NAME').val(req_appl_name);
  }

  // extract REQ_ITEM_ID field
  var req_item_id = "";
  field_name = "REQ_ITEM_ID".toLowerCase();
  field_handle = record.getElement(field_name, 0, null);
  if ( field_handle !== false ) {
    req_item_id = field_handle.text();

    // show item ID in queue form
    $('#QUE_ITEM_ID').val(req_item_id);
  }

  if ( table_id != '' ) {
    if ( req_item_id == '' || req_appl_name == '' ) {
      alert ( "Either Item ID or Item source is missing." );
    }
    else {
      // prepare read record url
      var url = getHomeSessId() + "?MANIPXMLRECORD&DATABASE=REQUEST_QUEUE&READ=Y&KEY=QUEUE_KEY" +
        "&VALUE=" + req_appl_name + "-" + req_item_id;

      // send HTTP request by ajax
      $.ajax({
        async: true,
        type: "GET",
        dataType: "xml",
        url: url,
        processData: false,
        cache: false,
        timeout: 300000,
        success: function (data) {
          if ( jQuery.isXMLDoc(data) ) {
            var xml_value = getXmlFieldValue (data, "error");
            if ( xml_value != '' ) {
              var ecode = parseInt(xml_value, 10);
              if ( ecode == 0 ) {
                // populate queue group list
                poulateQueueTable ( calling_field, table_id, data );
              }
              else {
                if ( ecode != 644 ) { // 644 means record not found
                  alert ( "Error " + xml_value + " encountered while reading request queue record." );
                }
              }
            }
          }
        },
        error: function (xhr, status, error) {
          alert ( "Unable to send command to read request queue record because of " + error + "." );
        }
      });
    }
  }
}

/* ************************************************************************ */
// function populates the request queue table.
function poulateQueueTable ( calling_field, table_id, queue_record )
{
  // find RECORD tag
  var record_node = queue_record.getElementsByTagName(RECORD_TAG)[0].cloneNode(true);

  // extract ACTIVE_ORDER_NUM field
  var active_order_num = "";
  var xml_field = record_node.getElementsByTagName(ACTIVE_ORDER_NUM_TAG);
  if ( xml_field.length > 0 ) {
    active_order_num = getXmlFieldValue (record_node, ACTIVE_ORDER_NUM_TAG);
  }
  if ( active_order_num !== '' ) {
    // show application name in queue form
    $('#ACTIVE_ORDER_NUM').val(active_order_num);
  }

  // get # of children of QUEUE_GROUP tag
  var numocc = 0;
  var queue_group_nodes = null;
  if ( typeof record_node != 'undefined' && record_node != null ) {
    queue_group_nodes = record_node.getElementsByTagName(QUEUE_GROUP_TAG);
    if ( typeof queue_group_nodes == 'undefined' || queue_group_nodes == null ) {
      queue_group_nodes = null;
    }
    else {
      numocc = queue_group_nodes.length;
    }
  }

  if ( numocc > 0  ) {
    var table_tag = $('#'+table_id);
    if ( table_tag.length > 0 ) {
      if ( emptyTable(table_id) ) {
        // if empty table, remove dummy row
        removeTableRow ( table_id, 0 );
      }
    }

    var row_data = [];
    var ix = 0;
    for ( ix = 1 ; ix <= numocc ; ix++ ) {
      row_data = [];
      row_data.push(ix.toString());   // occ number
      var order_num = getXmlFieldValue (queue_group_nodes[ix-1], QUE_ORDER_NUM_TAG);
      row_data.push(order_num);       // order number
      var patron_name = getXmlFieldValue (queue_group_nodes[ix-1], QUE_PATRON_NAME_TAG);
      row_data.push(patron_name);     // patron_name
      var item_title = getXmlFieldValue (queue_group_nodes[ix-1], QUE_TITLE_TAG);
      row_data.push(item_title);      // item_title
      insertTableRow ( table_id, -1, row_data );
    }
  }
}

/* ************************************************************************ */
// handle to move current table row up by one row.
function moveUpOccurrence( calling_field, e )
{
  e.preventDefault();

  var table_id = "";
  var selected_row = true;
  table_id = $(calling_field).data('table');

  if ( typeof table_id == 'undefined' || table_id == '' ) {
    selected_row = false;
  }
  else {
    var selected_row_id = '#' + table_id + ' tr.selected';
    if ($(selected_row_id).length <= 0 ) {
      selected_row = false;
    }
  }
  if ( !selected_row ) {
    alert ("You need to select (click on) an occurrence to move.");
  }
  else {
    var occnum = getSelectedRowNumber ( table_id );
    var rowData;
    if ( occnum > 1 ) {
      rowData = extractRowData ( table_id, occnum );
      removeTableRow ( table_id, occnum );  // remove selected row
      insertTableRow ( table_id, occnum-1, rowData );  // insert selected row
      selectTableRow ( table_id, occnum-1 ); // select row
      resequenceTableRows ( table_id );  // resequence table row numbers
    }
  }
}

/* ************************************************************************ */
// handle to move current table row down by one row.
function moveDownOccurrence( calling_field, e )
{
  e.preventDefault();

  var table_id = "";
  var selected_row = true;
  table_id = $(calling_field).data('table');

  if ( typeof table_id == 'undefined' || table_id == '' ) {
    selected_row = false;
  }
  else {
    var selected_row_id = '#' + table_id + ' tr.selected';
    if ($(selected_row_id).length <= 0 ) {
      selected_row = false;
    }
  }
  if ( !selected_row ) {
    alert ("You need to select (click on) an occurrence to move.");
  }
  else {
    var numRow = countTableRow ( table_id );
    var occnum = getSelectedRowNumber ( table_id );
    var rowData;
    if ( occnum < numRow ) {
      rowData = extractRowData ( table_id, occnum );
      removeTableRow ( table_id, occnum );  // remove selected row
      if ( occnum == numRow-1 ) {
        occnum = numRow;
        insertTableRow ( table_id, -1, rowData );  // insert selected row to end
      }
      else {
        occnum++;
        insertTableRow ( table_id, occnum, rowData );  // insert selected row to end
      }
      selectTableRow ( table_id, occnum ); // select row
      resequenceTableRows ( table_id );  // resequence table row numbers
    }
  }
}

/* ************************************************************************ */
// handle to save request queue record to database.
function saveQueue ( calling_field, e )
{
  e.preventDefault();

  var table_id = $(calling_field).data('table');
  if ( table_id === undefined || table_id == null ) {
    table_id = '';
  }

  var record = currentAppInterface.app_record;
  var field_handle = null;
  var field_name = "";

  // extract REQ_DB_NAME field
  var req_appl_name = "";
  field_name = "REQ_DB_NAME".toLowerCase();
  field_handle = record.getElement(field_name, 0, null);
  if ( field_handle !== false ) {
    req_appl_name = field_handle.text();
  }

  // extract REQ_ITEM_ID field
  var req_item_id = "";
  field_name = "REQ_ITEM_ID".toLowerCase();
  field_handle = record.getElement(field_name, 0, null);
  if ( field_handle !== false ) {
    req_item_id = field_handle.text();
  }

  // extract REQ_ADD_RECORD field
  var add_record = false;
  field_name = "REQ_AD_RECORD".toLowerCase();
  field_handle = record.getElement(field_name, 0, null);
  if ( field_handle !== false ) {
    if ( field_handle.text() == 'Y' ) {
      add_record = true;
    }
  }

  if ( table_id != '' ) {
    if ( (!add_record && req_item_id == '') || req_appl_name == '' ) {
      alert ( "Either Item ID or Item source is missing." );
    }
    else {
      // prepare read record url
      var url = getHomeSessId() + "?MANIPXMLRECORD&DATABASE=REQUEST_QUEUE&KEY=QUEUE_KEY" +
        "&VALUE=" + req_appl_name + "-" + req_item_id;

      var numRows = countTableRow ( table_id );
      var i = 0;
      var ix = 0;
      var tag_name = '';
      var row_data = [];

      // prepare update transactions
      var form_data = '<?xml version="1.0" encoding="UTF-8"?>\n<RECORD>\n';

      // generate transactions to update QUEUE_GROUP field
      for ( i = 1; i <= numRows ; i++ ) {
        form_data = form_data.concat('<QUEUE_GROUP op="CHG" occ="' + i + '">\n');
        row_data = extractRowData ( table_id, i );
        for ( ix = 1 ; ix < row_data.length ; ix++ ) {
          switch ( ix ) {
            case 1:
              tag_name = QUE_ORDER_NUM_TAG;
              break;
            case 2:
              tag_name = QUE_PATRON_NAME_TAG;
              break;
            case 3:
              tag_name = QUE_TITLE_TAG;
              break;
            default:
              tag_name = '';
              break;
          }
          if ( tag_name != '' ) {
            form_data = form_data.concat('<' + tag_name + '>' + row_data[ix] + '</' + tag_name + '>\n');
          }
        }
        form_data = form_data.concat('</QUEUE_GROUP>\n');
      }
      form_data = form_data.concat('</RECORD>');

      // send HTTP request by ajax
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
            if ( xml_value == '' || parseInt(xml_value, 10) != 0 ) {
              alert ( "Error " + xml_value + " encountered while saving request queue record." );
            }
          }
        },
        error: function (xhr, status, error) {
          alert ( "Unable to send command to save request queue record because of " + error + "." );
        }
      });
    }
  }
}


/* ************************************************************************ */
// this function extracts xml record tag form the HTML response and saves the
// XML dom node in the parent.$tmp.xml_record.
function extractXmlRecord ( html_response )
{
  if ( parent != null ) {
    var parser = new DOMParser();
    var doc1 = parser.parseFromString(html_response, "text/html");
    var xml_tag = doc1.getElementById('saved_xml_record');
    if ( xml_tag != null ) {
      var request_record = $(xml_tag).find('record').first();
      parent.$tmp_xml_record = request_record;
    }
  }
}

// function loads the email body form the template file on the server.
function loadEmailBody ( template_file )
{
  var email_body = '';

  // make ajax call to fetch template file contents
  var url = getCookie("HOME_SESSID") + "?GET&FILE=" + template_file;
  $.ajax({
    async: false,
    type: "GET",
    dataType: "text",
    url: url,
    success: function (data) {
      if ( data != null && data != "" ) {
        email_body = data;
      }
    },
    error: function (xhr, status, error) {
    }
  });

  return email_body;
}



// function sends email to client after held item is checked in.
function sendReadyEmail( order_num, patronEmail, reqItemID, itemTitle, patronName )
{
  if ( patronEmail != null && patronEmail != '' ) {
    // prepare URL
    var url = getCookie('HOME_SESSID') + "?SAVE_MAIL_FORM&XML=Y";

    var editrecord_url = '';
    var ix = url.toLowerCase().indexOf(MWI_SCRIPT_DLL);
    if ( ix >= 0 ) {
      editrecord_url = url.substring(0, ix+MWI_SCRIPT_DLL.length);
    }

    editrecord_url = editrecord_url + '?CHANGESINGLERECORD' +
      encodeURIComponent('&APPLICATION=ADD_REQ_INFO&LANGUAGE=$lang&rid=request-booking&EXP=REQ_ORDER_NUM+' + order_num);

    var email_body = loadEmailBody ( "[m2aonline]assets%5chtml%5ctemplate%5citem_ready.html" );

    // replace {4} with paron name
    email_body = email_body.replace('{4}', patronName );

    // replac {9} with order number
    email_body = email_body.replace('{9}', order_num );

    // prepare form data
    var formData = new FormData();
    formData.append("SENDER", DEFAULT_FROM_EMAIL);
    formData.append("RECEIVER", patronEmail);
    formData.append("SUBJECT", "Request order " + order_num);
    formData.append("MAILBODY", email_body);

    // sned ajax call to send email
    $.ajax({
      async: false,
      type: "POST",
      dataType: "xml",
      url: url,
      data: formData,
      processData: false,
      contentType: false,
      success: function (data) {
        var first_child;
        var node_value;

        if ( jQuery.isXMLDoc( data ) ) {
          var nodes = data.getElementsByTagName("error")[0];
          if ( nodes.length > 0 ) {
            first_child = nodes.childNodes[0];
            node_value = parseInt(first_child.nodeValue, 10);
            if ( node_value != 0 ) {
              alert ( "Unable to send EMAIL because of error " + node_value );
            }
          }
        }
      },
      error: function (xhr, status, error) {
        alert ( "Send email error " + '\n' + "xhr: " + xhr + '\n' + "status: " + status + '\n' + "error: " + error);
      }
    });
  }
}

// function signs off the reproduction job
function CompleteReproduction( calling_field ) {
  alert ( "Reproduction Completed" );
}

// function prints the cover page of the copyright request
function PrintCoverPageon( calling_field )
{
  alert ( "Print Cover Page of Certification" );
}

// if container has parent, read parent record. Otherwise, read container record.
// copy monitor flag, loation type and wait time from container record to
// reuqest record.
function lookupContainer(calling_field)
{
  var open_item = true;

  // extract container ID (REQ_CHILD_ID)
  var container_id = $(calling_field).val();
  if ( container_id != null && container_id != '' ) {
    // prepare URL to read container record
    var url_root = getHomeSessId() + "?MANIPXMLRECORD&DATABASE=CONTAINER&READ=Y&KEY=CONTAINER_ID&VALUE=";
    var url = url_root + escapeUrlchars(container_id);
    var parent_container_id = '';
    var xml_data = null;
    var xml_value;
    var ecode;

    // read container record
    $.ajax({
      async: false,
      type: "GET",
      dataType: "xml",
      url: url,
      timeout: 10000,
      success: function (data) {
        if ( jQuery.isXMLDoc(data) ) {
          xml_value = getXmlFieldValue (data, "error");
          if ( xml_value != '' ) {
            ecode = parseInt(xml_value, 10);
            // Is record found?
            if ( ecode == 0 ) {
              // Is parent container ID defined?
              xml_value = getXmlFieldValue (data, "CON_P_BARCODE");
              if ( xml_value != null && xml_value != '' ) {
                parent_container_id = xml_value;
              }
              else {
                xml_data = data;
              }
            }
          }
        }
      },
      error: function (xhr, status, error) {
      }
    });

    if ( parent_container_id != '' ) {
      // if container has parent ID, read container record
      url = url_root + escapeUrlchars(parent_container_id);

      // read parent container record
      $.ajax({
        async: false,
        type: "GET",
        dataType: "xml",
        url: url,
        timeout: 10000,
        success: function (data) {
          if ( jQuery.isXMLDoc(data) ) {
            xml_value = getXmlFieldValue (data, "error");
            if ( xml_value != null && xml_value != '' ) {
              ecode = parseInt(xml_value, 10);
              // Is record found?
              if ( ecode == 0 ) {
                xml_data = data;
              }
            }
          }
        },
        error: function (xhr, status, error) {
        }
      });
    }
    else {
      parent_container_id = container_id;
    }

    if ( xml_data != null ) {
      // set REQ_ITEM_ID to container parent ID
      setFieldValue ( calling_field, "REQ_ITEM_ID", parent_container_id );

      // extract CON_MONITOR and save it in REQ_MONITOR_FLAG field
      xml_value = getXmlFieldValue (xml_data, "CON_MONITOR");
      if ( xml_value == null || xml_value == '' ) {
        xml_value = 'N';
      }
      setFieldValue ( calling_field, "REQ_MONITOR_FLAG", xml_value );

      // extract CON_AONE_LOC and save it in REQ_LOC_TYPE field
      xml_value = getXmlFieldValue (xml_data, "CON_HOME_LOC");
      if ( xml_value == null || xml_value == '' ) {
        xml_value = getXmlFieldValue (xml_data, "CON_AONE_LOC");
        if ( xml_value == null || xml_value == '' ) {
          xml_value = getXmlFieldValue (xml_data, "CON_LAST_LOC");
        }
      }

      var onsite_item = false;
      if ( xml_value == null || xml_value == '' ) {
        xml_value = 'OFFSITESTD';
      }
      else {
        if ( xml_value != 'OFFSITESTD'
        &&   xml_value != 'OFFSITECOLD'
        &&   xml_value != 'OFFSITECOOL' ) {
          onsite_item = true;
        }
      }
      if ( onsite_item ) {
        setFieldValue ( calling_field, "REQ_LOC_TYPE", 'Onsite' );
        setFieldValue ( calling_field, "REQ_HOLD_CENTRE", xml_value );
      }
      else {
        setFieldValue ( calling_field, "REQ_LOC_TYPE", xml_value );
      }

      // extract CON_RESTRICT_COD field
      var open = false;
      var i = 0;
      var xml_list = getXmlFieldGroup( xml_data, "CON_RESTRICT_COD" );
      if ( xml_list != null ) {
        for ( i = 0 ; i < xml_list.length ; i++ ) {
          xml_value = decodeHtml(xml_list[i].textContent);
          if ( xml_value != null && xml_value == 'OPEN' ) {
            open = true;
            break;
          }
        }
      }
      else {
        open = true;
      }

      // if restriction code is not OPEN, say item is restricted
      if ( !open ) {
        setFieldValue ( calling_field, "REQ_RESTR_ITEM", 'Y' );
        open_item = false;
      }
      else {
        setFieldValue ( calling_field, "REQ_RESTR_ITEM", '' );
      }
    }
  }

  return open_item;
}

// RL-20220913
// reads the biblio record using the barcode and extreact isue # and call number from
// the item_info group field.

function getItemInfo(calling_field)
{
  // extract field value ( BARCODE field)
  var barcode = $(calling_field).val();

  // extract databas name (REQ_DB_NAME field)
  var dbname = $('#REQ_DB_NAME').val();

  // is database LIBRARY?
  if ( dbname == 'LIBRARY' ) {
    // yes, read BBILIO record
    // search ITEM_INFO group for barcode
    // if barcode is found, extract issue#/copy# and caller number
    // save copy# in REQ_ISSUE_ID
    // save call number in REQ_CALL_NUMBER
  }
}