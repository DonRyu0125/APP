$(document).ready(function(){
  active_interface = new ApplicationInterface(new ValuserRecord('#MY_XML'));
  active_interaction = new ApplicationInteraction(active_interface);

  init(active_interaction.populateForm);

  // Handle Page Loading:
  $('nav#worksheet_nav a').off().on('click', function(e) { e.preventDefault(); loadForm($(this).attr('href')); });
  updateDatabaseActionLinks();
  generateRecordSavingForm('normal');
});