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
  active_interface = new ApplicationInterface(new ClientRecord('#MY_XML'));
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
});

// function sends the client confirmation email.
function sendNewClientEmail(html_response, data)
{
  // prepare URL
  var url = getCookie('HOME_SESSID') + "?SAVE_MAIL_FORM&XML=Y";
            + "&FROM_DEFAULT=" + data.from
            + "&TO=" + data.to
            + "&SUBJECT_DEFAULT=" + data.subject;

  // prepare email body text
  var email_body = '';
  email_body = email_body.concat("Your recent request to set up an account to use with the Archives of Ontario has been SUCCESSFUL.\n");
  email_body = email_body.concat("WELCOME TO THE CAMS ONLINE PORTAL for the ARCHIVES of ONTARIO\n\n");
  email_body = email_body.concat("Your account or Client Identification ID is:  '" + data.client_id + "'\n");
  email_body = email_body.concat("Please note your ID number, as it is your way to log into the site when you return to https://m2auat.minisisinc.com/144\n");

  // prepare form data
  var formData = new FormData();
  formData.append("SENDER", data.from);
  formData.append("RECEIVER", data.to);
  formData.append("SUBJECT", data.subject);
  formData.append("MAILBODY", email_body);
  formData.append("ATTACH", data.attachment);

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
      var show_error = false;
      var first_child;
      var node_value;

      if ( jQuery.isXMLDoc( data ) ) {
        var nodes = data.getElementsByTagName("error")[0];
        if ( nodes.length > 0 ) {
          first_child = nodes.childNodes[0];
          node_value = parseInt(first_child.nodeValue, 10);
          if ( node_value != 0 ) {
            alert ( "Unable to SEND EMAIL because of error " + node_value );
          }
        }
      }
    },
    error: function (xhr, status, error) {
      alert ( "Send email error " + '\n' + "xhr: " + xhr + '\n' + "status: " + status + '\n' + "error: " + error);
    }
  });
}

// function handles the approval of the client.
function approveClient (calling_field)
{
  // mandatory field checking
  var rc = checkMandatoryField();
  if ( rc == false ) {
    // if missing mandatory field, exit function
    return;
  }

  // set C_REG_STATUS to APPROVED
  setXmlRecordFieldValue ( 'C_REG_STATUS', 'APPROVED', 0 );

  // set C_APPROVED_ON to today's date
  setXmlRecordFieldValue ( 'C_APPROVED_ON', '++1', 0 );

  // set C_APPROVED_BY to current user name
  setXmlRecordFieldValue ( 'C_APPROVED_BY', '++2', 0 );

  // get client ID
  var client_id = getXmLRecordFieldValue( "C_CLIENT_NUMBER", null );

  // get client email
  var client_email = getXmLRecordFieldValue( "C_EMAIL", null );

  var callback_func = null;
  var callback_data  = {};
  if ( client_email != '' ) {
    callback_func = function (html_response, callback_data) { sendNewClientEmail(html_response, callback_data); };
    callback_data.client_id = client_id;
    callback_data.to = client_email;
    callback_data.from = "ao@ontario.ca";
    callback_data.subject = "Welcome to CAMS portal";
    callback_data.attachment = "[m2a_email_template]welcome-aims.pdf";
  }

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

// function renews the client password expiry date.
function renewPassword (calling_field)
{
  // set password expiry date
  setRelativeDate(calling_field);
}

// function renews the client expiry date.
function renewClient (calling_field)
{
  // set client expiry date
  setRelativeDate(calling_field);
}

// function performs record wrapup processing.
function wrapupClient ( calling_field )
{
  var return_code = true;

  // extract C_REG_STATUS
  var status = getXmLRecordFieldValue ( 'C_REG_STATUS', null );

  // if C_REQ_STATUS is NEW, change it to PENDING
  if ( status == 'NEW' ) {
    setXmlRecordFieldValue ( 'C_REG_STATUS', 'PENDING', 0 );
  }

  return return_code;
}