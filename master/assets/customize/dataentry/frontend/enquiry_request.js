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



// main line of enquiry request form
$(document).ready(function(){
  if ($('#MY_XML').length > 0) {
    active_interface = new ApplicationInterface(new ServiceDeskRecord('#MY_XML'));
    active_interaction = new ApplicationInteraction(active_interface);

    // setup application event handler
    active_interface.appWorksheetHandler = setupWorksheetHandler;

    init(active_interaction.populateForm);

    $('span.check i').each(function() {
      populateCheckBoxes($(this));
    });
  }

  // handle move up table row
  $('body').on('click', 'a.move_up_occ', function (e) {
    moveUpOccurrence( $(this), e );
  });

  // handle move down table row
  $('body').on('click', 'a.move_down_occ', function (e) {
    moveDownOccurrence( $(this), e );
  });

  // bind this functon to <a> tag which is defined in servicedesk_queue.html file
  $('body').on('click', 'a.save_queue', function(e) {
    saveQueue ( $(this), e );
  });

  // Handle Page Loading:
  $('nav#worksheet_nav a').off().on('click', function(e) { e.preventDefault(); loadForm($(this).attr('href')); });
  updateDatabaseActionLinks();
  generateRecordSavingForm('normal');

  if ( parent != null && typeof parent.$pageType != 'undefined' && parent.$pageType == 'enquiry' ) {
    var h_req_topic = $('#REQ_TOPIC');

    var requestTopicType = getXmLRecordFieldValue( 'REQ_TOPIC', null );
    if ( typeof parent.$enquiryTopicType != 'undfined' && parent.$enquiryTopicType != ''
    &&   parent.$enquiryTopicType != requestTopicType ) {
      // update request topic
      if ( $(h_req_topic).length > 0 ) {
        $(h_req_topic).val(parent.$enquiryTopicType);
        $(h_req_topic).change();
      }
    }

    // if request is launched from enquiry, protect REQ_TOPIC field
    $(h_req_topic).prop('disabled', true );
  }
});


/* ************************************************************************ */
// function updates the associated request list in the data entry form and updates
// the fields of associated request grouo occurrence in the enquiry XML record object.
// It is called from the javascript codes in the WEB_ENQ_REQ_LINK report specification.
function updateEnquiryGroupList( form_id, enquiry_record, occnum, xml_request_record )
{
  // copy feilds from request record to enquiry record

  // update table row
}


/* ************************************************************************ */
// function adds the request fields to the assoicated request list in the enquiry record
// and updates the associated request group list in the data entry form.
function updateEnquiryRecord ( enquiry_record, form_id, occnum, params, request_rowdata )
{
  var return_code = false;

  return return_code;
}

// function performs record wrapup processing.
function wrapupRequest ( calling_field )
{
  var return_code = true;

  return return_code;
}