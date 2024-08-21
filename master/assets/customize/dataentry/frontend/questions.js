/* **********************************************************************************
  setupWorksheetHandler()

  This function sets up the event handler of worksheet. It is called after form is loaded.
************************************************************************************ */

var setupWorksheetHandler = function ()
{
  // bind user routine by class names
  $('a.set_date_exit').on('click', function() { setRelativeDate($(this)); });
  $('a.get_ai_value_exit').on('click', function() { getAiValue($(this)); });
  $('a.get_index_value_exit').on('click', function() { selectIndexKey($(this)); });
}


/* ********************************************************************************
  This following code performs the initialization of web page.
********************************************************************************* */

$(document).ready(function(){
  active_interface = new ApplicationInterface(new QuestionsRecord('#MY_XML'));
  active_interaction = new ApplicationInteraction(active_interface);

  // setup application event handler
  active_interface.appWorksheetHandler = setupWorksheetHandler;

  init(active_interaction.populateForm);

  // Handle Page Loading:
  $('nav#worksheet_nav a').off().on('click', function(e) { e.preventDefault(); loadForm($(this).attr('href')); });

  if (!$('body').hasClass('validated_record')) {
    updateDatabaseActionLinks();
    generateRecordSavingForm('normal');
  } else {
    generateRecordSavingForm('validated_record');
  }

  // is creator already inputted?
  var creator = getXmLRecordFieldValue ( 'Q_CREATED_BY', null );
  if ( creator == '' ) {
    // default creator to current user
    var username = getCookie("USERNAME");
    setXmlRecordFieldValue ( 'Q_CREATED_BY', username, 0 );
  }
});

// function performs record wrapup processing.
function wrapupQuestions ( calling_field )
{
  var return_code = true;

  // extract Q_STATUS
  var status = getXmLRecordFieldValue ( 'Q_STATUS', null );

  // if Q_STATUS is NEW, change it to REVIEW
  if ( status == 'NEW' ) {
    setXmlRecordFieldValue ( 'Q_STATUS', 'REVIEW', 0 );
  }

  return return_code;
}

// function handles the approval of the comments.
function approveQuestions (calling_field)
{
  // mandatory field checking
  var rc = checkMandatoryField();
  if ( rc == false ) {
    // if missing mandatory field, exit function
    return;
  }

  // set Q_STATUS to APPROVED
  setXmlRecordFieldValue ( 'Q_STATUS', 'APPROVED', 0 );

  // set Q_APPROVED_ON to today's date
  setXmlRecordFieldValue ( 'Q_APPROVED_ON', '++1', 0 );

  // set Q_APPROVED_BY to current user name
  setXmlRecordFieldValue ( 'Q_APPROVED_BY', '++2', 0 );

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
