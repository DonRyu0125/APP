$(document).ready(function(){
  active_interface = new ApplicationInterface(new emailTemplateRecord('#MY_XML'));
  active_interaction = new ApplicationInteraction(active_interface);

  init(active_interaction.populateForm);

  // Handle Page Loading:
  $('nav#worksheet_nav a').off().on('click', function(e) { e.preventDefault(); loadForm($(this).attr('href')); });
  updateDatabaseActionLinks();
  generateRecordSavingForm('normal');
});

// This function uploads email template to server
function uploadTemplateFile( target_id )
{
  var url = getCookie("HOME_SESSID") + "?get&file=[CAMS_APP]/144/uploadtemplate.html&parm1=M&parm2=[M2A_EMAIL_TEMPLATE]";
  var dialog_width = 600;
  var dialog_height = 400;

  $tmp = '';

  $.colorbox({
    href: url,
    transition: "elastic",
    iframe: true,
    width: dialog_width,
    height: dialog_height,
    onClosed: function() {
      if ( $tmp != '' ) {
        var target = $('#'+target_id);
        if ( target.length > 0 ) {
          $(target).val($tmp);
          $(target).change();
        }
      }
      delete $tmp;
    }
  });
}


// This function views the email template file contents.
function viewTemplateFile( target_id )
{
  var target = $('#'+target_id);
  var target_filepath = '';
  if ( target.length <= 0 || $(target).val() == '' ) {
    alert ( "Template file path is empty." );
  }
  else {
    target_filepath = $(target).val();

     var url = getCookie("HOME_SESSID") + "?get&FILE=" + target_filepath;

    // make ajax call to load file contents
    $.ajax({
      async: false,
      type: "GET",
      dataType: "text",
      url: url,
      success: function (data) {
        if ( data != null && data != "" ) {
          // enclose file contents with <pre> tag
          var html_string = '<pre>' + data + '</pre>';

          // show file contents in colorbox
          $.colorbox({
            html: html_string,
            width: "900px",
            height: "600px",
            title: '<b>' + target_filepath + '</b>'
          });
        }
      },
      error: function (xhr, status, error) {
        if ( xhr.status != 404 ) {
          alert ( "Unable to fetch email template file contents. (HTTP status " + xhr.status + ")" );
        }
      }
    });
  }
}