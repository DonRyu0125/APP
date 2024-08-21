const RS_REQ_APPROVE_TAG         = 'RS_REQ_APPROVE';
const REQUESTED_STATUS           = 'Requested';
const APPROVED_STATUS            = 'Approved';
const RS_STATUS_NAME             = 'RS_STATUS';
const ACTIVE_STATUS              = 'Active';


/* **********************************************************************************
  exitController()

  This function is the controller of user routines. User routine is called
  from Online application core after either HTML field is touched or form is loaded.
************************************************************************************ */

function exitController(calling_field)
{
  var proceedProcessing = true;
  var exitResult;

  // show "request for approval" checkbox
  if ( $(calling_field).hasClass('show_request_approval') ) {
    showRequestApproval();
  }

  // load series record tree
  if ( $(calling_field).hasClass('init_series_record_tree') ) {
    loadSeriesTree(calling_field);
  }

  return proceedProcessing;
}


/* ********************************************************************************
  This following code performs the initialization of web page.
********************************************************************************* */

$(document).ready(function(){
  active_interface = new ApplicationInterface(new RecordSeriesRecord('#MY_XML'));
  active_interaction = new ApplicationInteraction(active_interface);

  init(active_interaction.populateForm);

  // Handle Page Loading:
  $('nav#worksheet_nav a').off().on('click', function(e) { e.preventDefault(); loadForm($(this).attr('href')); });
  updateDatabaseActionLinks();
  generateRecordSavingForm('normal');
});


/* ************************************************************************ */
// function handles the approval of the record series.
function approveRecordSeries (calling_field)
{
  // mandatory field checking
  var rc = checkMandatoryField();
  if ( rc == false ) {
    // if missing mandatory field, exit function
    return;
  }

  var approve_ok = false;

  // set RS_REQ_APPROVE field to Requested
  setXmlRecordFieldValue ( RS_REQ_APPROVE_TAG, APPROVED_STATUS, 0 );

  // set RS_STATUS fied to Active
  setXmlRecordFieldValue ( RS_STATUS_NAME, ACTIVE_STATUS, 0 );

  // set APPROVED_BY to ++2
  setXmlRecordFieldValue ( 'APPROVED_BY', '++2', 0 );

  // set APPROVED_ON to ++2
  setXmlRecordFieldValue ( 'APPROVED_ON', '++1', 0 );

  var callback_func = null;
  var callback_data  = {};
  callback_func = function (html_response, callback_data) {
    // if update is successful, close clorbox
    if ( popupWindow() ) {
      parent.$.colorbox.close();
    }
  };

  var return_code;

  // send HTTP request to commit record change
  var field_handle = $('#dba_save').find('a');
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
}


/* ************************************************************************ */
// function handles the request approval flag.
function toggleRequest (calling_field)
{

  var approve_ok = false;

  var approve_status = $('#'+RS_REQ_APPROVE_TAG).val();
  if ( approve_status == null ) {
    approve_status = '';
  }

  if ( approve_status == '' || approve_status == 'Pending' ) {
    // set REQ_APPROVE_BY to ++2
    setXmlRecordFieldValue ( 'REQ_APPROVE_BY', '++2', 0 );

    // set REQ_APPROVE_ON to ++1
    setXmlRecordFieldValue ( 'REQ_APPROVE_ON', '++1', 0 );

    // set RS_STATUS fieldd to Requested
    setXmlRecordFieldValue ( RS_REQ_APPROVE_TAG, REQUESTED_STATUS, 0 );

    var callback_func = null;
    var callback_data  = {};
    callback_func = function (html_response, callback_data) {
      // if update is successful, close clorbox
      if ( popupWindow() ) {
        parent.$.colorbox.close();
      }
    };

    var return_code;

    // send HTTP request to commit record change
    var field_handle = $('#dba_save').find('a');
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
  }
}

// function shows the "request for approval" flag if the RS_REQ_PARROVE is set to "requested".
function showRequestApproval()
{
  var status_flag = getXmLRecordFieldValue ( RS_STATUS_NAME, null );
  var request_flag = getXmLRecordFieldValue ( RS_REQ_APPROVE_TAG, null );
  if ( status_flag == null || status_flag != ACTIVE_STATUS ) {
    if ( request_flag != null && request_flag == REQUESTED_STATUS ) {
      // show "request for approval" checkbox
      var h_field = $('#request_approval_flag');
      if ( h_field.length > 0 ) {
        $(h_field).css("display", "block");
      }
    }
  }
}

// function inializes and load the top level series record tree
function loadSeriesTree(calling_field)
{

  $('#jstree_display').jstree({ 'core' : {
      'data' : [
         { "id" : "ajson1", "parent" : "#", "text" : "Record series #1" },
         { "id" : "ajson2", "parent" : "ajson1", "text" : "Record Schedule #1.1" },
         { "id" : "ajson3", "parent" : "ajson2", "text" : "Transfer #1.1.1" },
         { "id" : "ajson3.1", "parent" : "ajson3", "text" : "Container #1.1.1.1" },
         { "id" : "ajson3.1.1", "parent" : "ajson3.1", "text" : "File/Item #1.1.1.1.1" },
         { "id" : "ajson3.1.2", "parent" : "ajson3.1", "text" : "File/Item #1.1.1.1.2" },
         { "id" : "ajson3.1.3", "parent" : "ajson3.1", "text" : "File/Item #1.1.1.1.3" },
         { "id" : "ajson3.2", "parent" : "ajson3", "text" : "Container #1.1.1.2" },
         { "id" : "ajson3.2.1", "parent" : "ajson3.2", "text" : "File/Item #1.1.1.2.1" },
         { "id" : "ajson3.2.2", "parent" : "ajson3.2", "text" : "File/Item #1.1.1.2.2" },
         { "id" : "ajson3.2.3", "parent" : "ajson3.2", "text" : "File/Item #1.1.1.2.3" },
         { "id" : "ajson3.3", "parent" : "ajson3", "text" : "Container #1.1.1.3" },
         { "id" : "ajson4", "parent" : "ajson2", "text" : "Transfer #1.1.2" },
         { "id" : "ajson4.1", "parent" : "ajson4", "text" : "Container #1.1.2.1" },
         { "id" : "ajson4.2", "parent" : "ajson4", "text" : "Container #1.1.2.2" },
         { "id" : "ajson4.3", "parent" : "ajson4", "text" : "Container #1.1.2.3" },
         { "id" : "ajson5", "parent" : "ajson1", "text" : "Record Schedule #1.2" },
         { "id" : "ajson6", "parent" : "ajson5", "text" : "Transfer #1.2.1" },
         { "id" : "ajson6.1", "parent" : "ajson6", "text" : "Container #1.2.1.1" },
         { "id" : "ajson6.2", "parent" : "ajson6", "text" : "Container #1.2.1.2" },
         { "id" : "ajson7", "parent" : "ajson5", "text" : "Transfer #1.2.2" },
         { "id" : "ajson7.1", "parent" : "ajson7", "text" : "Container #1.2.2.1" },
         { "id" : "ajson7.2", "parent" : "ajson7", "text" : "Container #1.2.2.2" },
         { "id" : "ajson7.3", "parent" : "ajson7", "text" : "Container #1.2.2.3" },
      ]}
  })

  $('#jstree_display').bind('loaded.jstree', function(e, data) {
    // show top-level nodes after root node of jstree has loaded
    var root_node = $('#jstree_display').jstree(true).get_node('ajson1');
    $('#jstree_display').jstree(true).open_node( root_node );
  });
}
