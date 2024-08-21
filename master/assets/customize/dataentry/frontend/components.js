$(document).ready(function(){
  if ($('xml#component').length > 0) {
    parentAccNum($('xml#component').html());
    m3_interface = new CollectionsInterface(new CollectionsRecord('xml#component'));
    m3 = new ApplicationInteraction(m3_interface);
    init(m3.populateForm);

  }

  // Handle Page Loading:
  $('nav#worksheet_nav a').off().on('click', function(e) { e.preventDefault(); loadForm($(this).attr('href')); });

  if (!$('body').hasClass('components')) { 
    updateDatabaseActionLinks();
    generateRecordSavingForm('normal');
  } else {
    generateRecordSavingForm('component');
  }

  $('#dba_cancel a').on('click', function(e) {
    e.preventDefault();
    var sisn = $('xml#component').find('sisn')[0].textContent;
    var mwicommand = $(this)[0].href;
    mwicommand = mwicommand.replace("sisn", sisn);
    $(this)[0].href = mwicommand;
    // If a user cancels the edit, close the record and close the lightbox
    // The actual response from MINISIS doesn't matter here.  It might be an error
    // if the component is new, but that doesn't matter.  Basically we just want any
    // opened records to be closed so they don't get locked.
    $.get($(this).attr('href'), function(data) {
      parent.$.colorbox.close();
    });
  });
    console.log('here')
  function parentAccNum(xmlString){

    var pos = xmlString.search("<accession_number>");
    var poss = xmlString.search("<parent_acc_num>");
    var pos2 = xmlString.search("</accession_number");
    var accNum = xmlString.substring(pos + 18,pos2);
    if (!(xmlString.indexOf("<parent_acc_num>") >= 0)){
      var newComp = xmlString.replace('</record>', '<parent_acc_num>' + accNum + '</parent_acc_num>\n</record>');
    }
    $('xml#component').html(newComp);
  }  
});