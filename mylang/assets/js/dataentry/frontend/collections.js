
$(document).ready(function(){
  if ($('#MY_XML').length > 0) {
    var m3_record = new CollectionsRecord('#MY_XML');
    m3_interface = new CollectionsInterface(m3_record);
    active_interaction = new ApplicationInteraction(m3_interface);

    init(active_interaction.populateForm);
    $('span.check i').each(function(){ populateCheckBoxes($(this)); });

    if (m3_record.getElement('collection_type')) {
      switch (m3_record.getElement('collection_type').text()) {
        case 'Museum':
          m3_interface.toggleMenu('primary_worksheet_museum_nav');
          $('#primary_worksheet_museum_nav').find('a').first().click();
          break;
        case 'Archives':
          m3_interface.toggleMenu('primary_worksheet_archives_nav');
          $('#primary_worksheet_archives_nav').find('a').first().click();
          break;
        case 'Library':
          m3_interface.toggleMenu('primary_worksheet_library_nav');
          $('#primary_worksheet_library_nav').find('a').first().click();
          break;
        default:
          break;
      }

    $('#COLLECTION_TYPE').attr('disabled','disabled').addClass('disabled');
    }
  } else {
    // Probably a component:
    component_interface = new CollectionsInterface(new CollectionsRecord('xml#component'));
    m3_component = new ApplicationInteraction(component_interface);

    init(m3_component);
  }

  // Handle Page Loading:
  $('nav#worksheet_nav a').off().on('click', function(e) {
    e.preventDefault();
    loadForm($(this).attr('href'));
    $('span.check i').each(function(){ populateCheckBoxes($(this)); });
  });

  $('#COLLECTION_TYPE').off().on('change', function(){
    if ($(this).val() === '' || $(this).val() === 'Archives') {
      m3_interface.toggleMenu('primary_worksheet_archives_nav');
      $('#primary_worksheet_archives_nav').find('a').first().click();
    } else if ($(this).val() === 'Museum') {
      m3_interface.toggleMenu('primary_worksheet_museum_nav');
      $('#primary_worksheet_museum_nav').find('a').first().click();
    } else if ($(this).val() === 'Library') {
      m3_interface.toggleMenu('primary_worksheet_library_nav');
      $('#primary_worksheet_library_nav').find('a').first().click();
    }
  });

  if (!$('body').hasClass('components')) {
    updateDatabaseActionLinks();
    generateRecordSavingForm('normal');
  } else {
    generateRecordSavingForm('component');
  }
});

// rl-2020-09-29
// Set readonly default values for Accession and Discipline Fields.
$(document).ready(function () {
  window.onload = function () {
    // exit function to bypass following codes
    return;

    if (document.getElementById('ACCESSION_NUMBER').value === '') {
      $('#ACCESSION_NUMBER').val(autoGeneratedAccessionNumber());
    }
    temp = $('#ACCESSION_NUMBER').val();
    if (document.getElementById('MY_XML') !== undefined) {
      var text = document.getElementById('MY_XML');
      var filters = text.getElementsByTagName('record');
      if(document.getElementsByTagName('accession_number').length == 0)
      {
        $(filters).append('<accession_number>' +  temp + '</accession_number>');
      }
    }

    //Set readonly default value for Discipline Field
    if (document.getElementById('DISCIPLINE').value === '') {
      $('#DISCIPLINE').val("p"); // <-- Set value here.
    }
    temp = $('#DISCIPLINE').val();
    if (document.getElementById('MY_XML') !== undefined) {
      var text = document.getElementById('MY_XML');
      var filters = text.getElementsByTagName('record');
      if(document.getElementsByTagName('DISCIPLINE').length == 0)
      {
        $(filters).append('<discipline>' +  temp + '</discipline>');
      }
    }
  }
});
