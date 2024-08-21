// rl-2020-09-29

// functionn for closing colorbox window
var alert_ok_callback = function() {
  if ( parent != null && parent.$.colorbox != null ) {
    parent.$.colorbox.close();
  }
}


// function for checking status of planned movement API
function handle_plan_ok ( data )
{
  var msg = "";

  if ( jQuery.isXMLDoc( data ) ) {
    var xml_value = getXmlFieldValue (data, "error_code");
    if ( xml_value != "0" ) {
       window.alert ( "Unable to execute global add because of error " + xml_value );
    }
    else {
      // extract record count
      xml_value = getXmlFieldValue (data, "record-count");
      if ( parseInt(xml_value, 10) == 0 ) {
        msg = "No record has been selected.";
      }
      else {
        msg = xml_value + " record(s) are updated.";
      }
      window.alert (msg);
      if ( parent.$.colorbox != null ) {
        setTimeout(alert_ok_callback, 5);
      }

      // window.close();
    }
  }
  else {
    msg = "Unable to execute global add because result is malformed XML response.";
    if ( data == null ) {
       window.alert ( msg );
    }
    else {
       window.alert ( msg + "\n" + data );
    }
  }
}

/*****
 **
 ** This function sends ajax call to add planned event.
 **
***/

function run_plan_movement ( caller, progress_holder )
{
  // get form action
  var action_url = $(caller).attr("action");
  var form_id = $(caller).attr("id");
  var form_data = new FormData(document.getElementById(form_id));

  var input_count = 0;
  for(var pair of form_data.entries()) {
    if ( pair[0] != "" ) {
      input_count++;
    }
  }
  if ( input_count == 0 ) {
     window.alert ( "empty input form." );
  }

  $.ajax({
    async: true,
    type: "POST",
    dataType: "xml",
    url: action_url,
    data: form_data,
    processData: false,
    contentType: false,
    cache: false,
    timeout: 600000,
    success: function (data) {
      if ( progress_holder != null ) {
        progress_holder.style.display = "none";
        setTimeout(function() {handle_plan_ok( data );}, 200);
      }
      else {
        handle_plan_ok( data );
      }
    },
    error: function (xhr, status, error) {
      var  msg = "Unable to execute global add" + "\n" + "xhr: " + xhr + '\n' + "status: " + status + '\n' + "error: " + error;
      if ( progress_holder != null ) {
        progress_holder.style.display = "none";
        setTimeout(function() { window.alert( msg );}, 200);
      }
      else {
         window.alert ( msg );
      }
    }
  });
}

/*****
 **
 **  plan_movement
 **
 **  params:
 **    - caller - is planned movement form ID
 **
 **  notes:
 **    - This handles when a user clicks on the submit button in a planned movement form.
 **
 *****/
var plan_movement = function ( e, caller ) {
  // e.preventDefault();

  // get progress container handle
  var  progress_holder = document.getElementById("progress_container");

  if ( progress_holder != null ) {
    progress_holder.style.display = "block";
    setTimeout(function() {
      run_plan_movement(caller, progress_holder);
    }, 200);
  }
  else {
    run_plan_movement ( caller, null );
  }
}

$(document).ready(function(){
  active_interface = new ApplicationInterface(new LocationsRecord('#MY_XML'));
  active_interaction = new ApplicationInteraction(active_interface, true);

  init(active_interaction.populateForm);

  // rl-2020-09-29
  $('#plan_move').on('submit', function(e) {
    e.preventDefault();

    var loc_code = document.getElementById("LOC1");
    var retCode = true;
    if ( loc_code == null || loc_code.value == "" ) {
       window.alert( "Location code is missing." );
      retCode = false;   // cancel submit
    }
    else {
      plan_movement(e, $('#plan_move'));
    }
    return retCode;
  });

  $('#ACTION_DATE').on('change', function(e) {
    var today = new Date();
    var numSeconds = today.getHours() * 3600 + today.getMinutes() * 60 + today.getSeconds();
    var move_ref_no = document.getElementById("LOC11");
    if ( move_ref_no != null ) {
      var ref_no = $(this).val() + "-" + numSeconds.toString();
      move_ref_no.value = ref_no;
    }
  });
});