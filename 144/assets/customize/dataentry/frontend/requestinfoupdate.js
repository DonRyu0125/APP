/* ********************************************************************************
  This following code performs the initialization of web page.
********************************************************************************* */

$(document).ready(function(){
  if ($('#MY_XML').length > 0) {
    active_interface = new ApplicationInterface(new RequestInfoUpdateRecord('#MY_XML'));
    active_interaction = new ApplicationInteraction(active_interface);

    init(active_interaction.populateForm);

    $('span.check i').each(function() {
      populateCheckBoxes($(this));
    });
  }

  // Handle Page Loading:
  $('nav#worksheet_nav a').off().on('click', function(e) { e.preventDefault(); loadForm($(this).attr('href')); });

  updateDatabaseActionLinks();
  generateRecordSavingForm('normal');
});
