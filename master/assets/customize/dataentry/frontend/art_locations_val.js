$(document).ready(function(){
  active_interface = new ApplicationInterface(new ArtLocationsRecord('#validated_record'));
  active_interaction = new ApplicationInteraction(active_interface);

  init(active_interaction.populateForm);

  // Handle Page Loading:
  $('nav#worksheet_nav a').off().on('click', function(e) { e.preventDefault(); loadForm($(this).attr('href')); });

  if (!$('body').hasClass('validated_record')) {
    updateDatabaseActionLinks();
    generateRecordSavingForm('normal');
  } else {
    generateRecordSavingForm('validated_record');
  }

  $('#dba_cancel a').on('click', function(e) {
    e.preventDefault();

    // If a user cancels the edit, close the record and close the lightbox
    // The actual response from MINISIS doesn't matter here.  It might be an error
    // if the component is new, but that doesn't matter.  Basically we just want any
    // opened records to be closed so they don't get locked.
    $.get($(this).attr('href'), function(data) {
      $.colorbox.close();
    });
  });
});