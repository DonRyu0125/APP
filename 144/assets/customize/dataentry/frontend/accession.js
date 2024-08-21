
/* **********************************************************************************
  setupWorksheetHandler()

  This function sets up the event handler of catalogue worksheet.
************************************************************************************ */

var setupWorksheetHandler = function ()
{
  $('a.duplicate_occ_exit').on('click', function (e) { duplicateOccurrence($(this)); });
}

/* ********************************************************************************
  This following code performs the initialization of web page.
********************************************************************************* */

$(document).ready(function(){
  active_interface = new ApplicationInterface(new AccessionRecord('#MY_XML'));
  active_interaction = new ApplicationInteraction(active_interface);

  // setup application event handler
  active_interface.appWorksheetHandler = setupWorksheetHandler;

  init(active_interaction.populateForm);

  // Handle Page Loading:
  $('nav#worksheet_nav a').off().on('click', function(e) { e.preventDefault(); loadForm($(this).attr('href')); });
  updateDatabaseActionLinks();
  generateRecordSavingForm('normal');
});


// function imports container list to the LOCATION_GROUP of the ACCESSION database.
function importData(calling_field)
{
  // Is th downloaded file specified
  var file_path = $('#BOXLIST').val();
  if ( file_path == null || file_path == '' ) {
    alert ( "Container file path is missing." );
  }
  else {
    alert ( "Import container list." );
  }
}

// function sets flag for transfer approval.  Staff selects transfer record by searching
// the TR_STATUS with the value "Under Negotiation".
function toggleTransferRequest(calling_field)
{
  // set TR_REQ_APPROVE to active
  setXmlRecordFieldValue ( 'TR_REQ_APPROVE', 'Active', 0 );

  // set TR_REQ_APPROV_BY to ++2
  setXmlRecordFieldValue ( 'TR_REQ_APPROV_BY', '++2', 0 );

  // set TR_REQ_APPROV_ON to ++1
  setXmlRecordFieldValue ( 'TR_REQ_APPROV_ON', '++1', 0 );

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

// function approves the transfer request. It generate the transfer ID after transfer is
// approved.
function approveTransferRequest(calling_field)
{
  // set TR_STATUS to active
  setXmlRecordFieldValue ( 'TR_STATUS', 'Active', 0 );

  // set TR_APPROVED_BY to ++2
  setXmlRecordFieldValue ( 'TR_APPROVED_BY', '++2', 0 );

  // set TR_APPROVED_ON to ++1
  setXmlRecordFieldValue ( 'TR_APPROVED_ON', '++1', 0 );

  // add transfer ID
  getAiValue(calling_field);

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


/* ************************************************************************ */
// This function manipulates the accession container group list.
function accessionGroupFieldHanler ( table_id, op, occnum )
{
  // check existence of mandatory fields
  if ( !checkAccessionMantoryField() ) {
    return false;
  }

  switch ( op ) {
    case 'A':   // add row
      break;
    case 'C':   // edit row
      // check mandatory if reproduction
      break;
    case 'D':   // delete row
      break;
  }

  var return_code = handleGroupOccDataEntry ( table_id, op, occnum );

  return return_code;
}

// function checkes the mandatory fields of the accession record.
function checkAccessionMantoryField()
{
  var return_code = true;
  var mnemonic = '';
  var absent_mnemonic = '';

  // check ACCNO field
  mnemonic = 'ACCNO';
  var sourceField = getXmLRecordFieldValue( mnemonic, null );
  if ( sourceField == null || sourceField == '' ) {
    return_code = false;
    absent_mnemonic = mnemonic;
  }

  if ( absent_mnemonic != '' ) {
    alert ( "Field " + absent_mnemonic + " is absent." );
  }

  return return_code;
}