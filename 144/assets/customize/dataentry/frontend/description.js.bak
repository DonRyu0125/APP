$(document).ready(function(){
      active_interface = new ApplicationInterface(new DescriptionRecord('#MY_XML'));
      active_interaction = new ApplicationInteraction(active_interface);

      init(active_interaction.populateForm);

    // Handle Page Loading:
    $('nav#worksheet_nav a').off().on('click', function(e) { e.preventDefault(); loadForm($(this).attr('href')); });
    updateDatabaseActionLinks();
    generateRecordSavingForm('normal');


    const title = document.getElementById("TITLE");

    console.log(title);
    title.addEventListener("input", function(event) {
      if(title == "")
      {
        title.setCustomValidity("TITLE field must not be empty");
      }
      else
      {
        title.setCustomValidity("");
      }
    });



});//document function end