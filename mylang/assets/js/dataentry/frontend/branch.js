
/* ********************************************************************************
  This following code performs the initialization of web page.
********************************************************************************* */

$(document).ready(function(){
  active_interface = new ApplicationInterface(new BranchRecord('#MY_XML'));
  active_interaction = new ApplicationInteraction(active_interface);

  // setup application event handler
  active_interface.appWorksheetHandler = null;

  init(active_interaction.populateForm);

  // Handle Page Loading:
  $('nav#worksheet_nav a').off().on('click', function(e) { e.preventDefault(); loadForm($(this).attr('href')); });

  if (!$('body').hasClass('validated_record')) {
    updateDatabaseActionLinks();
    generateRecordSavingForm('normal');
  }
  else {
    generateRecordSavingForm('validated_record');
  }
});
