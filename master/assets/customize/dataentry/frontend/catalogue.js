
/* **********************************************************************************
  setupWorksheetHandler()

  This function sets up the event handler of catalogue worksheet.
************************************************************************************ */

var setupWorksheetHandler = function ()
{
  $('a.set_date_exit').on('click', function() { setRelativeDate($(this)); });
  $('a.get_ai_value_exit').on('click', function() { getAiValue($(this)); });
  $('a.get_index_value_exit').on('click', function() { selectIndexKey($(this)); });
  $('a.duplicate_occ_exit').on('click', function (e) { duplicateOccurrence($(this)); });

  $('#print_label').on('click', function (e) { printLabel(e, $(this)); });
}


/* ********************************************************************************
  This following code performs the initialization of web page.
********************************************************************************* */

$(document).ready(function(){
  if ($('#MY_XML').length > 0) {
    var active_record = new CatalogueRecord('#MY_XML');
    active_interface = new CatalogueInterface(active_record);
    active_interaction = new ApplicationInteraction(active_interface);

    // setup application event handler
    active_interface.appWorksheetHandler = setupWorksheetHandler;

    init(active_interaction.populateForm);
    $('span.check i').each(function() {
      populateCheckBoxes($(this));
    });
  }

  // protect import function
  $('li#dba_import a').addClass('disabled');

  // Handle Page Loading:
  $('nav#worksheet_nav a').off().on('click', function(e) {
    e.preventDefault();
    loadForm($(this).attr('href'));
    $('span.check i').each(function(){
      populateCheckBoxes($(this));
    })
  })
  updateDatabaseActionLinks();
  generateRecordSavingForm('normal');
});
