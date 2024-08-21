// rl changed-20200511
// declare constants
const modal_body_id   = "upload-form-body";
const TDR_SEARCH_URL  = "";

// declare global variables
var upload_done = false;
var error_message = "";
var start_time = 0;
var interval_id = 0;
var file = "";
var currentpage = null; // for codes defined in single_search_javascript.txt
var marker_var = null;  // for codes defined in single_search_javascript.txt
var form_var = null;    // for codes defined in single_search_javascript.txt

// show TDR search page
function tdr_search ( )  {
  if ( parent != null ) {
    parent.$tmp = "$browse_TDR_items";
    parent.$.colorbox.close();
  }
}

// begin uploading file
function start_async_ajax ( upload_url, form_data ) {
  // upload file
  $.ajax({
    async: true,
    type: "POST",
    enctype: 'multipart/form-data',
    url: upload_url,
    data: form_data,
    processData: false,
    contentType: false,
    cache: false,
    timeout: 600000,
    success: function (data) {
      upload_done = true;

      var mydate2 = new Date();
      var end_time = mydate2.getTime();
      var diff = (end_time - start_time) / 1000;
      console.log ( "Upload time is ", diff, " seconds." );

      // check ajax return code
      if ( jQuery.isXMLDoc( data ) ) {
        var filename = data.getElementsByTagName("path")[0];
        if ( filename != null ) {
          file = filename.childNodes[0].nodeValue;
        }

        if ( file == "" ) {
          error_message = "No file is found in the upload file response.";
        }
      }
      else {
        error_message = "Unknown upload file response.";
      }
    },
    error: function (e) {
      upload_done = true;

      // write error to console log
      console.log("ERROR : ", e);

      error_message = "Error is encountered while uploading file.";
    }
  });
}

// wrapup uploading file
function wrapup_async_ajax ( ) {
  if ( upload_done ) {
    // cancel interval handler
    clearInterval(interval_id);

     if ( file != "" ) {
       // return file name to $tmp variable in parent object
       if ( parent != window ) {
         parent.$tmp = file;
       }
     }

     // disable waiting icon
     document.getElementById("upload-waiting").style.display = "none";

     // check return message from the start_async_ajax function
     if ( error_message == "" ) {
       // if no error message, exit colorbox
       if ( parent != window ) {
         parent.$.colorbox.close();
       }
     }
     else {
       // show warning message
       alert ( error_message );
       $("#btnSubmit").prop("disabled", false);
     }
   }
 }

 // upload media file to web server
 function m2a_upload_file ( submit_button, home_sessid ) {
   // initialize global variables
   error_message = "";
   upload_done = false;
   var mydate1 = new Date();
   start_time = mydate1.getTime();
   file = "";

   // enable waiting icon
   document.getElementById("upload-waiting").style.display = "block";

   // Create an FormData object
   var form = $('#fileUploadForm')[0];
   var form_data = new FormData(form);

   // get target and prefix value
   var parm1 = '';
   var parm2 = '';
   if ( $(submit_button).data('parm1') != null ) {
     parm1 = $(submit_button).data('parm1');
   }
   if ( $(submit_button).data('parm2') != null ) {
     parm2 = $(submit_button).data('parm2');
   }

   // make asynchronous ajax call to send file
   var upload_url = home_sessid + "?upload&target=" + parm2 + "&prefix=" + parm1;
   start_async_ajax ( upload_url, form_data );

   // wait until uploading is done
   interval_id = setInterval ( wrapup_async_ajax, 1000 );
 }

 // set up event handler
 $(document).ready(function() {
   $('#btnSubmit').prop('disabled', false);

   $('#btnSubmit').click(function(event) {
     // stop submit the form, we will post it manually.
     event.preventDefault()

     // disabled the submit button
     $('#btnSubmit').prop('disabled', true)

     // upload media file
     var home_sessid = getMyCookie('HOME_SESSID')
     if (home_sessid != '') {
       m2a_upload_file($(this), home_sessid);
     } else {
       alert('File is not uploaded because MWI session is absent.')
       $('#btnSubmit').prop('disabled', false)
     }
   })
})
