// user routine parameter block
var schedule_parm = {
  'propose_to_active' : [
                          'P_SCHEDULE_NO=SCHEDULE_NO',
                          'P_SCHED_NAME=SCHEDULE_NAME',
                          '+*P_RECSERIES=RECSERIES',
                          'P_RECSERIES_ID=RECSERIES_ID',
                          'P_RECSERIES_TIT=RECSERIES_TITLE',
                          '-P_RECSERIES=RECSERIES',
                          'P_RECSERIES_DESC=RECSERIES_DESC',
                          'P_RECSERIES_CUTF=RECSERIES_CUTOFF',
                          'P_RETENT_ORGAGY=RETENT_ORGAGENCY',
                          'P_RETENT_SRC=RETENT_SRC',
                          'P_TOTAL_RETENT=TOTAL_RETENTION',
                          'P_FINAL_DISPOST=FINAL_DISPOSITN',
                          'P_COMMENTS=COMMENTS',
                          'P_SPECIAL_INSTRU=SPECIAL_INSTRUCT',
                          'P_ADOPTED_DATE=ADOPTED_DATE',
                          'P_EFFECTIVE_DATE=EFFECTIVE_DATE'
                        ]
};

const PROPOSED_SCHED_TAG  = "PROPOSED_SCHED";
const P_SCHEDULE_NO_TAG   = "P_SCHEDULE_NO";
const P_SCHEDULE_NAME_TAG = "P_SCHED_NAME"
const SCHEDULE_STATUS_ID  = "SCHEDULE_STATUS";
const PRINT_BUTTON_NAME   = "print_agreement";
const ACTIVE_STATUS_VALUE = 'Active';
const APPROVE_BUTTON_NAME = 'APPROVED_BUTTON';
const P_REQ_APPROVE_TAG   = 'P_REQ_APPROVE';
const REQUESTED_STATUS    = 'Requested';


/* **********************************************************************************
  setupWorksheetHandler()

  This function sets up the event handler of record schedule worksheet.
************************************************************************************ */

var setupWorksheetHandler = function ()
{
  $('a.duplicate_occ_exit').on('click', function (e) { duplicateOccurrence($(this), 1); });
}

/* **********************************************************************************
  exitController()

  This function is the controller of user routines. User routine is called
  from Online application core after either HTML field is touched or form is loaded.
************************************************************************************ */

function exitController(calling_field)
{
  var proceedProcessing = true;
  var exitResult;

  // set default schedule no and schedule name of new record schedule
  if ( $(calling_field).hasClass('set_default_shcedule_no') ) {
    setDefaultScheduleNo(calling_field);
  }

  // toggle "transfer agreement" print button
  if ( $(calling_field).hasClass('toggle_print_button') ) {
    togglePrintButton();
  }

  // setup "approve and set active" button
  if ( $(calling_field).hasClass('setup_status_button') ) {
    setupStatusButton();
  }

  // toggle "approve and set active" button
  if ( $(calling_field).hasClass('toggle_status_button') ) {
    toggleStatusButton();
  }

  return proceedProcessing;
}


/* ********************************************************************************
  This following code performs the initialization of web page.
********************************************************************************* */

$(document).ready(function(){
  active_interface = new ApplicationInterface(new SchedulesRecord('#MY_XML'));
  active_interaction = new ApplicationInteraction(active_interface);

  // setup application event handler
  active_interface.appWorksheetHandler = setupWorksheetHandler;

  init(active_interaction.populateForm);
  $('span.check i').each(function() {
    populateCheckBoxes($(this));
  });

  // Handle Page Loading:
  $('nav#worksheet_nav a').off().on('click', function(e) { e.preventDefault(); loadForm($(this).attr('href')); });
  updateDatabaseActionLinks();
  generateRecordSavingForm('normal');

  var h_div;

  var schedule_picked = getXmLRecordFieldValue ( 'SCHEDULE_PICKED', null );
  if ( schedule_picked == 'Y' ) {
    // show active rcord schedule
    h_div = document.getElementById('active_schedule');
    if ( h_div != null ) {
      h_div.style.display = "block";
    }
  }
  else {
    // hide active record schedule
    h_div = document.getElementById('active_schedule');
    if ( h_div != null ) {
      h_div.style.display = "none";
    }

    // show proposed record schedule
    h_div = document.getElementById('proposed_schedule');
    if ( h_div != null ) {
      h_div.style.display = "block";
    }
  }
});

// function approves the record schedule request. It sets the approved date, approved person and
// record status and saves the record schedule record.
function approveRecordSchedule ( calling_field )
{
  // count number of PROPOSED_SCHED field
  var record = currentAppInterface.app_record;
  var numOcc = record.getOccurrenceCount(PROPOSED_SCHED_TAG, null);
  var currentOcc = currentAppInterface.getCurrentOccurrence(PROPOSED_SCHED_TAG);
  var field_value = 'Addition';
  var i;

  // mandatory field checking
  var rc = checkMandatoryField();
  if ( rc == false ) {
    // if missing mandatory field, exit function
    return;
  }

  field_value = getXmLRecordFieldValueEx ( PROPOSED_SCHED_TAG, currentOcc, SCHEDULE_STATUS_ID, 1, null );

  if ( field_value == 'Addition'
  ||   field_value == 'Adoption'
  ||   field_value == 'Revision' ) {
    // map proposal schedule fields to active schedule fields
    mapScheduleField( calling_field, PROPOSED_SCHED_TAG, null, schedule_parm.propose_to_active );

    // set SCHEDULE_PICKED to Y
    setXmlRecordFieldValue ( 'SCHEDULE_PICKED', 'Y', 0 );


    // walk through each proposed record schedule
    for ( i = 1 ; i <= numOcc ; i++ ) {
      if ( i == currentOcc ) {
        // if active entry, update status to active
        setXmlRecordFieldValueEx ( PROPOSED_SCHED_TAG, i, SCHEDULE_STATUS_ID, ACTIVE_STATUS_VALUE, 1, null );

        // set SCH_APPROVED_ON to today's date
        setXmlRecordFieldValueEx ( PROPOSED_SCHED_TAG, i, 'SCH_APPROVED_ON', '++1', 1, null );

        // set SCH_APPROVED_BY to current user name
        setXmlRecordFieldValueEx ( PROPOSED_SCHED_TAG, i, 'SCH_APPROVED_BY', '++2', 1, null );
      }
      else {
        field_value = getXmLRecordFieldValueEx ( PROPOSED_SCHED_TAG, i, SCHEDULE_STATUS_ID, 1, null );
        if ( field_value != null && field_value == ACTIVE_STATUS_VALUE ) {
          // siwtich 'active' status to "non active' status
          setXmlRecordFieldValueEx ( PROPOSED_SCHED_TAG, i, SCHEDULE_STATUS_ID, 'Non Active', 1, null );
        }
      }
    }
  }

  var callback_func = null;
  var callback_data  = null;
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

// functions maps the proposed schedule fields to active schedule fields
function mapScheduleField( calling_field, souce_group_id, target_field_id, field_list )
{
  // call copyOccField function to map fields.  copyOccField function is defined in forntend_util.js
  copyOccField ( field_list, calling_field, souce_group_id, target_field_id );
}

// function sets the record schedule no of new proposed record schedule
function setDefaultScheduleNo(calling_field)
{
  var h_field;
  var default_value;

  // is default shcedule no defined?
  default_value = getXmLRecordFieldValue ( P_SCHEDULE_NO_TAG, PROPOSED_SCHED_TAG );
  if ( default_value != '' ) {
    // yes, check existence of shcedule no of proposed record schedule
    h_field = $('#'+P_SCHEDULE_NO_TAG);
    if ( h_field.length > 0 && $(h_field).val() == '' ) {
      // no, set shcedule no of proposed record schedule
      $(h_field).val(default_value);

      // remove class to bypass unique key checking
      $(h_field).removeClass('unique_key_check');

      $(h_field).change();

      // add 'unique key check' class
      $(h_field).addClass('unique_key_check');
    }
  }

  // is default shcedule name defined?
  default_value = getXmLRecordFieldValue ( P_SCHEDULE_NAME_TAG, PROPOSED_SCHED_TAG );
  if ( default_value != '' ) {
    // yes, check existence of shcedule name of proposed record schedule
    h_field = $('#'+P_SCHEDULE_NAME_TAG);
    if ( h_field.length > 0 && $(h_field).val() == '' ) {
      // no, set shcedule name of proposed record schedule
      $(h_field).val(default_value);
      $(h_field).change();
    }
  }
}

// function prints transfer agreement.
function printTransferAgreement( calling_field )
{
  alert ( 'Transfer Agreement' );
}

// function enables the "transfer agreement" print button according to the status value.
function togglePrintButton()
{
  // extract SCHEDULE_STATUS field
  var h_field = $('#'+SCHEDULE_STATUS_ID);

  // Is it "active" status?
  if ( h_field.length > 0 && $(h_field).val() == ACTIVE_STATUS_VALUE ) {
    // yes, get handle of "print_agreement" button
    var h_print_button = $('#'+PRINT_BUTTON_NAME);
    if ( h_print_button.length > 0 ) {
      // disable "print_agreement" button
      $(h_print_button).addClass('disabled');
    }
  }
}

// function sets default field vales of proposed record shcedule occurrence and
// enables the "approve and set active" button according to the status value.
function setupStatusButton()
{
  var currentOcc = currentAppInterface.getCurrentOccurrence(PROPOSED_SCHED_TAG);
  var field_value = getXmLRecordFieldValueEx ( PROPOSED_SCHED_TAG, currentOcc, SCHEDULE_STATUS_ID, 1, null );

  // if status is active, protect "approve" button
  if ( field_value != null && field_value == ACTIVE_STATUS_VALUE ) {
    $('#'+APPROVE_BUTTON_NAME).addClass('disabled');
  }
  else {
    if ( field_value == null || field_value == '' ) {
      // if empty status field, default it to Under Negotiation
      setXmlRecordFieldValueEx ( PROPOSED_SCHED_TAG, currentOcc, SCHEDULE_STATUS_ID, "Under Negotiation", 1, null );
    }

    $('#'+APPROVE_BUTTON_NAME).removeClass('disabled');
  }

  // set button state
  toggleStatusButton();
}

// function either enables or disables the 'approve' button according to the schedule status.
function toggleStatusButton()
{

  // extract SCHEDULE_STATUS field
  var h_field = $('#'+SCHEDULE_STATUS_ID);

  // get handle of "APPROVED_BUTTON" button
  var h_status_button = $('#'+APPROVE_BUTTON_NAME);
  if ( h_field.length > 0 && h_status_button.length > 0 ) {
    // if found, check status
    var fld_value = $(h_field).val();
    if ( fld_value == ACTIVE_STATUS_VALUE ) {
      // disable "APPROVED_BUTTON" button
      if ( !$(h_status_button).hasClass('disabled') ) {
        $(h_status_button).addClass('disabled');
      }
    }
    else {
      // enable "APPROVED_BUTTON" button
      if ( $(h_status_button).hasClass('disabled') ) {
        $(h_status_button).removeClass('disabled');
      }
    }
  }
}

/* ************************************************************************ */
// function handles the request approval flag of record schedule.
function toggleScheduleRequest (calling_field)
{

  var approve_ok = false;

  var approve_status = $('#'+P_REQ_APPROVE_TAG).val();
  if ( approve_status == null ) {
    approve_status = '';
  }

  if ( approve_status == '' || approve_status == 'Pending' ) {
    var currentOcc = currentAppInterface.getCurrentOccurrence(PROPOSED_SCHED_TAG);

    // set P_REQ_APPROVE_BY to ++2
    setXmlRecordFieldValueEx ( PROPOSED_SCHED_TAG, currentOcc, 'P_REQ_APPROVE_BY', "++2", 1, null );

    // set P_REQ_APPROVE_ON to ++1
    setXmlRecordFieldValueEx ( PROPOSED_SCHED_TAG, currentOcc, 'P_REQ_APPROVE_ON', "++1", 1, null );

    // set RS_STATUS field to Requested
    setXmlRecordFieldValueEx ( PROPOSED_SCHED_TAG, currentOcc, P_REQ_APPROVE_TAG, REQUESTED_STATUS, 1, null );

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
