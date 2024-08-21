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

  // RL-20231102
  // get handle of LEVEL_DESC field
  var level_desc = $('#LEVEL_DESC');
  if ( level_desc != null ) {
    var level_value = $(level_desc).val();
    if ( typeof level_value == 'string' && level_value != '' ) {
      var level_stack = [];
      var level_found = false;

      // examine each option value
      $('#LEVEL_DESC option').each(function() {
        if ( $(this).val() == level_value ) {
          level_stack.push(level_value);
          level_found = true;
        }
        else {
          if ( level_found ) {
            level_stack.push($(this).val());
          }
        }
      });
      if ( level_stack.length > 0 ) {
        // clear select options
        $('#LEVEL_DESC').empty();

        // create dynaamic options
        for ( var i = 0 ; i < level_stack.length ; i++ ) {
          var option_object = {};
          option_object.value = level_stack[i];
          option_object.text = level_stack[i];
          $('#LEVEL_DESC').append($('<option>', option_object));
        }
      }
    }
  }

});//document function end
