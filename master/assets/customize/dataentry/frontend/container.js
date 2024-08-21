
/* **********************************************************************************
  setupWorksheetHandler()

  This function sets up the event handler of catalogue worksheet.
************************************************************************************ */

var setupWorksheetHandler = function ()
{
  $('a.get_index_value_exit').on('click', function() { selectIndexKey($(this)); });
}



/* **********************************************************************************
  exitController()

  This function is the controller of user routines. User routine is called
  after either HTML field is touched or form is loaded.
************************************************************************************ */

function exitController(calling_field)
{
  var proceedProcessing = true;

  if ( $(calling_field).hasClass('permout_value') ) {
    proceedProcessing = verify_permout_value ( calling_field );
  }

  return proceedProcessing;
}

/* ********************************************************************************
  This following code performs the initialization of web page.
********************************************************************************* */

$(document).ready(function(){
  active_interface = new ApplicationInterface(new ContainerRecord('#MY_XML'));
  active_interaction = new ApplicationInteraction(active_interface);

  // setup application event handler
  active_interface.appWorksheetHandler = setupWorksheetHandler;

  init(active_interaction.populateForm);

  // Handle Page Loading:
  $('nav#worksheet_nav a').off().on('click', function(e) { e.preventDefault(); loadForm($(this).attr('href')); });
  updateDatabaseActionLinks();
  generateRecordSavingForm('normal');

  if ( active_interface.readonly_record ) {
    const myTimeout = setTimeout(warnReadonlyMode, 1000);
  }
});

// show popup message to warn user that he/she is in the readonly data entry mode
function warnReadonlyMode()
{
  alert ( "Record is accessed in the readonly mode because it is being updated by the Aone system." );
}


// function handles the approval of the container.
function approveContainer (calling_field)
{
  // mandatory field checking
  var rc = checkMandatoryField();
  if ( rc == false ) {
    // if missing mandatory field, exit function
    return;
  }

  // extract CON_STATUS value
  var fieldValue = getXmLRecordFieldValue ( "CON_STATUS", null );

  // Is the action valid?
  if ( fieldValue == null || fieldValue != 'Prepare' ) {
    // no, container is not in Prepare status
    alert ( "Action is denied because container is not in the 'Prepare' status." );
  }
  else {
    // set CON_APPROVE_NOW to Y
    setXmlRecordFieldValue ( 'CON_APPROVE_NOW', 'Y', 0 );

    // set CON_STATUS to Active
    setXmlRecordFieldValue ( 'CON_STATUS', 'Active', 0 );

    // set CON_APPROVED_ON to ++1
    setXmlRecordFieldValue ( 'CON_APPROVED_ON', '++1', 0 );

    // set CON_APPROVED_BY to current user name(++2)
    setXmlRecordFieldValue ( 'CON_APPROVED_BY', '++2', 0 );

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
}


// function handles the approval of disposing container.
function destroyContainer (calling_field)
{
  var proceed_processing = true;
  var destroy_type = '';
  var destroyed = false;
  var retrieved = false;
  var approved = false;

  // mandatory field checking
  var rc = checkMandatoryField();
  if ( rc == false ) {
    // if missing mandatory field, exit function
    return;
  }

  // extract CON_STATUS value
  var fieldValue = getXmLRecordFieldValue ( "CON_STATUS", null );

  // Is the action valid?
  if ( fieldValue == null || fieldValue != 'Active' ) {
    // no, container is not in Prepare status
    alert ( "Action is denied because container is not in the 'Active' status." );
    proceed_processing = false;
  }
  else {
    // Is destroy type selected?
    fieldValue = getXmLRecordFieldValue ( "CON_PERMOUT_ACTN", null );
    if ( fieldValue == null || fieldValue == '' ) {
      // no, action is not yet selected
      alert ( "Action is denied because destroy type is not yet selected." );
      proceed_processing = false;
    }
    else {
      destroy_type = fieldValue;

      fieldValue = getXmLRecordFieldValue ( "CON_APPROVE_DONE", null );
      if ( fieldValue != null && fieldValue == 'Y' ) {
        approved = true;
      }

      fieldValue = getXmLRecordFieldValue ( "CON_DESTROYED", null );
      if ( fieldValue != null && fieldValue == 'Y' ) {
        destroyed = true;
      }

      fieldValue = getXmLRecordFieldValue ( "CON_RETRIEVED", null );
      if ( fieldValue != null && fieldValue == 'Y' ) {
        retrieved = true;
      }

      if ( !approved ) {
        alert ( 'Container has not approved yet.' );
        proceed_processing = false;
      }
      else if ( destroy_type == 'Perm out' ) {
        if ( destroyed ) {
          alert ( 'Container is already in the "Perm out" status.' );
          proceed_processing = false;
        }
        else {
          if ( !retrieved ) {
            alert ( 'Action is denied because container is not yet retrieved.' );
            proceed_processing = false;
          }
        }
      }
      else if ( destroy_type == 'Perm out and destroy' || destroy_type == 'Perm out and return' ) {
        if ( destroyed ) {
          alert ( 'Container is already in the "Perm out" state.' );
          proceed_processing = false;
        }
        else {
          if ( retrieved ) {
            alert ( 'Action is denied because container is already retrieved.' );
            proceed_processing = false;
          }
        }
      }
    }

    if ( proceed_processing ) {
      // set CON_PERMOUT_NOW field to Y
      setXmlRecordFieldValue ( 'CON_PERMOUT_NOW', 'Y', 0 );

      // set CON_DESTROYED_ON to ++1
      setXmlRecordFieldValue ( 'CON_DESTROYED_ON', '++1', 0 );

      // set CON_DESTROYED_BY to current user name(++2)
      setXmlRecordFieldValue ( 'CON_DESTROYED_BY', '++2', 0 );

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
  }
}


// function ensure item is already retrieved if value is PERM-OUT.
function verify_permout_value ( calling_field )
{
  var proceedProcessing = true;

  // extract destroy type (CON_PERMOUT_ACTN)
  var type = $(calling_field).val();
  if ( type != null && type == 'Perm out' ) {
    var fieldValue;
    var con_approved_done = getXmLRecordFieldValue ( "CON_APPROVE_DONE", null );
    if ( con_approved_done == null ) {
      con_approved_done = '';
    }

    // if old record or approved record, continue
    if ( con_approved_done == 'Y' ) {
      if ( type == 'Perm out' ) {
        // extract CON_RETRIEVED field
        fieldValue = getXmLRecordFieldValue ( "CON_RETRIEVED", null );
        if ( fieldValue == null || fieldValue != 'Y' ) {
          alert ( 'Action is not accepted because item is not retrieved yet.' );

          proceedProcessing = false;  // skip update

          // if error, restore old value
          fieldValue = getXmLRecordFieldValue ( "CON_PERMOUT_ACTN", null );
          if ( fieldValue != null ) {
            $(calling_field).val(fieldValue);
          }
        }
      }
    }
    else {
      proceedProcessing = false;  // skip update

      // if error, restore old value
      fieldValue = getXmLRecordFieldValue ( "CON_PERMOUT_ACTN", null );
      if ( fieldValue != null ) {
        $(calling_field).val(fieldValue);
      }
    }
  }

  return proceedProcessing;
}

