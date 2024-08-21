
/* ********************************************************************************
  This following code performs the initialization of web page.
********************************************************************************* */

$(document).ready(function(){
  // set event handler for class db_import_marc and db_import_download
  $('a.db_import_marc').on('click', function (e) { e.preventDefault(); import_marc_record($(this)); });
  $('a.db_import_download').on('click', function (e) { e.preventDefault(); import_marc_download($(this)); });
});


/*
  import_marc_record()

  This function prompts user to select a MARC record and import the selected
  MARC record to the MINISIS Catalogue database.   It shows the z39.50 query
  form in modal dialog and let use to brwose through records of the search
  result.
*/

function import_marc_record(calling_field)
{
  // extract href attribute
  var url = $(calling_field).attr('href');
  if ( url != null && url != "" ) {
    var dialog_width = window.innerWidth - 8; // leave spaces in left and right margin
    var dialog_height = window.innerHeight - 13;  // leave spaces in top and bottom margin

    $.colorbox({
      iframe: true,
      href: url,
      width: dialog_width,
      height: dialog_height,
      fastIframe: true,
      transition: "elastic",
      overlayClose: false,
      onCleanup: function () {
        $.colorbox.close();
      },
      onClosed: function () {
        if (typeof parent.$tmp_url != 'undefined') {
          parent.location = parent.$tmp_url;
        }
      }
    });
  }
}


/*
  import_marc_download()

  This function prompts user to select a MARC download file and import
  MARC records to the MINISIS Catalogue database.
*/

function import_marc_download(calling_field)
{
  // extract href attribute
  var url = $(calling_field).attr('href');
  if ( url != null && url != "" ) {
    var dialog_width = window.innerWidth - 8; // leave spaces in left and right margin
    var dialog_height = window.innerHeight - 13;  // leave spaces in top and bottom margin

    $.colorbox({
      iframe: true,
      href: url,
      width: dialog_width,
      height: dialog_height,
      fastIframe: true,
      transition: "elastic",
      overlayClose: false,
      onCleanup: function () {
        $.colorbox.close();
      },
    });
  }
}


/*
  import_download_file()

  This function imports MARC records to the MINISIS Catalogue database. It is called
  form the sumbission event of the donwload file selection form.
*/

function import_download_file(form_id)
{
  // enable wiating icon
  var waiting_icon = document.getElementById("upload-waiting");
  if ( waiting_icon != null ) {
    waiting_icon.style.display = "block";
  }

  // Create an FormData object
  var form = $('#' + form_id)[0];
  var form_data = new FormData(form);

  // extact form action
  var form_action = document.getElementById(form_id).action;

  // upload downloaded MARC file
  $.ajax({
    async: true,
    type: "POST",
    enctype: 'multipart/form-data',
    url: form_action,
    data: form_data,
    processData: false,
    contentType: false,
    cache: false,
    timeout: 600000,
    success: function (data) {
      // disable wiating icon
      if ( waiting_icon != null ) {
        waiting_icon.style.display = "none";
      }

      if ( jQuery.isXMLDoc( data ) ) {
        var nodes = data.getElementsByTagName("error")[0];
        if ( nodes != null ) {
          first_child = nodes.childNodes[0];
          node_value = parseInt(first_child.nodeValue, 10);
          if ( node_value != 0 ) {
            if ( node_value == 668 ) {
              alert ( "No record is found in the file." );
            }
            else {
              alert ( "Unable to import records because of error " + node_value );
            }
            parent.$.colorbox.close();
          }
          else {
            nodes = data.getElementsByTagName("status_report")[0];
            if ( nodes != null ) {
              first_child = nodes.childNodes[0];
              var url = getCookie("HOME_SESSID") + "?VIEWTEXTFILE&file=" + encodeURIComponent(first_child.nodeValue);
              window.location = url;
            }
            else {
              parent.$.colorbox.close();
            }
          }
        }
      }
    },
    error: function (e) {
      // disable wiating icon
      if ( waiting_icon != null ) {
        waiting_icon.style.display = "none";
      }

      // write error to console log
      console.log("ERROR : ", e);

      alert ( "Error is encountered while imprting MARC downloaded file." );
    }
  });

  return false;
}
