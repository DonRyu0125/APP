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



/* **********************************************************************************
  exitController()

  This function is the controller of user routines. User routine is called
  from Online application core after either HTML field is touched or form is loaded.
************************************************************************************ */

function exitController(calling_field)
{
  var proceedProcessing = true;
  var exitResult;

  // call 'servicedesk_load_queue' class user routine
  if ( $(calling_field).hasClass('servicedesk_load_queue') ) {
    loadQueueTable(calling_field);
  }

  // call "compute_repro_amount" user routine to calculate reproduction cost

  return proceedProcessing;
}


/* ********************************************************************************
  This following code performs the initialization of web page.
********************************************************************************* */

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
});

// function performs record wrapup processing.
function wrapupRequest ( calling_field )
{
  var return_code = true;

  return return_code;
}