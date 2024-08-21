function CollectionsInterface(record, params) {
  ApplicationInterface.call(this, record, params);
  var app_interface = this;

  app_interface.setImageAttr('m_im_ref_grp', 'm_im_access'); // RL-20220131

  var component_params = {
    'component_save_form' : '#components_submission_form',
    'component_mnemonics' : ['child_sisn', 'child_acc_num','child_title','child_obj_name','child_early'],
    'component_container' : 'table.components tbody',
    'new_component_url' : function(sisn) {
      return app_interface.interface_params.sessid + '/?CHANGESINGLERECORD&DATABASE=COLLECTION_COMPONENT&EXP=SISN+' + replaceAll(sisn, ' ', '%20') + '&COPYRECORD=Y&NEW=Y&EXCLUDE=LAST_MODIFIED+CHILD_LINK&DE_FORM=[CAMS_APP]/mylang/dataentry%2fcomponents.html';
    },
    'component_edit_url' : function(sisn) {
      return app_interface.interface_params.sessid + '/?CHANGESINGLERECORD&DATABASE=COLLECTION_COMPONENT&EXP=SISN+' + replaceAll(sisn, ' ', '%20') + '&DE_FORM=[CAMS_APP]/mylang/dataentry%2fcom_edit.html';
    }
  };

  // This is done to allow for extending `ApplicationInterface`s populateForm method.
  var superPopulateForm = this.populateForm;


  /*****
  **
  **  populateForm : Performs the same function as ApplicationInterface.populateForm, but also performs collections record specific interface handling
  **
  **  notes:
  **    - This will check if the currently loaded page is "Components", and if so, will populate the components page
  **
   *****/
  this.populateForm = function() {
    if ($(component_params.component_container).length > 0) {
      app_interface.populateComponents();
    }
    superPopulateForm();
  };


  /*****
  **
  **  componentHasData : Checks to see if the current component occurrence actually contains data and is not an empty (ie. deleted) occurrence
  **
  **  params:
  **    - component : An XML copy of a specific component occurrence
  **
   *****/
  this.componentHasData = function(component) {
    for (var i=0; i < component.children().length; i++) {
      if (component.children().eq(i).text().length > 0) {
        return true;
      }
    }

    return false;
  };



  /*****
  **
  **  populateComponents : populates the "Components" page of the collections data entry screens
  **
  **  notes:
  **    - Generates a table populated with every available component occurrence for the currently loaded record
  **    - If no components are found, the form will be populated with a message saying "No Components Found"
  **
   *****/
  this.populateComponents = function() {
    function generateCellHTML(occurrence, mnemonic) {
      if (occurrence.find(mnemonic)) {
        return $("<td>" + occurrence.find(mnemonic).text() + "</td>");
      } else {
        return $("<td/>");
      }
    }

    $(component_params.component_container).find('tr').remove();

    if (record.hasComponents()) {
      var components = record.getComponents();

      $(components).children().each(function(){
        if (app_interface.componentHasData($(this))) {
            var occurrence = $(this);
            var newOcc = occurrence.attr('occ');
            var occurrence_html = $("<tr />");
            occurrence_html.append($('<td>' + newOcc + '</td>'));
            for (var i=1; i < component_params.component_mnemonics.length; i++) {
              var mnemonic = component_params.component_mnemonics[i];
              var cellHTML = generateCellHTML(occurrence, mnemonic);
              occurrence_html.append(cellHTML);
            $(component_params.component_container).append(occurrence_html);
          }
        }
      });
    } else {
      $(component_params.component_container).append('<tr id="tmp_com"><td colspan="5">No components found</td></tr>');
    }
  };


  /*****
  **
  **  selectComponent : attaches a class and some visual cues for the user that a component has been selected
  **
  **  params:
  **    - calling_field : The javascript object that this function was called from (will be the currently clicked occurrence table row in this case)
  **
  **  notes:
  **    - Actual interaction is handled by the application_interactions.js file for how this is called
  **    - If any occurrence is clicked, all other occurrences will have the "selected" class removed to ensure only one occurrence is selected
  **    - If an occurrence is selected, and clicked again, the selected class will be removed, thus 'deselecting' the occurrence
  **
   *****/
  this.selectComponent = function(calling_field) {
    if ($(calling_field).attr('id') === 'tmp_com') { return false; }

    if ($(calling_field).hasClass('selected')) {
      $(component_params.component_container + ' tr').removeClass('selected');
    } else {
      $(component_params.component_container + ' tr').removeClass('selected');
      $(calling_field).addClass('selected');
    }
  };


  /*****
  **
  **  addComponent : loads up the appropriate data entry form for adding a component to the currently loaded record
  **
  **  notes:
  **    - Actual interaction is handled by the application_interactions.js file for how this is called
  **    - BUG FIX: Line 134-136 adds a dummy component when no components are present so there is at least 1 occurrence when adding a new comp. Component gets removed in cleanup function
   *****/
  this.addComponent = function() {
    if($('#MY_XML')[0].getElementsByTagName('child_link').length == 0){
      $('#MY_XML')[0].getElementsByTagName('record')[0].innerHTML += '<child_link><child_link_occurrence occ="1"></child_link_occurrence></child_link>';
    }
    var record_sisn = record.getElement('sisn', 0).text();
    var lightbox_params = {
      'edit_url' : component_params.new_component_url(record_sisn),
      'new_or_edit' : 'new'
    };
    app_interface.componentLightbox(lightbox_params);
  };

  /*****
  **
  **  saveComponent : Utilizes the record saving scripts, but passes the appropriate save form
  **
  **  notes:
  **    - Actual interaction is handled by the application_interactions.js file for how this is called
  **    - removed the update and remove element functions becuase this is being handled elsewhere
   *****/


  this.saveComponent = function(form_action, form) {
    if (typeof form_action == 'undefined') { return false; }
    form = (typeof form !== 'undefined') ? form : $(component_params.component_save_form);
    // var original_accession_number = record.getElement('accession_number', 0).text();
    // var accession_number_addition = record.getElement('accession_number_2', 0).text();
    // record.updateElement(record.getElement('accession_number', 0), original_accession_number + '.' + accession_number_addition);
    // record.removeElement(record.getElement('accession_number_2', 0));
    app_interface.saveRecord(form_action, form);
  };


  /*****
  **
  **  editComponent : loads up the appropriate data entry form for editing a component in the currently loaded record
  **
  **  params:
  **    - occurrence_number : An integer of the occurrence number that is to be edited
  **
  **  notes:
  **    - Actual interaction is handled by the application_interactions.js file for how this is called
  **
   *****/
// $.colorbox.close();
  this.editComponent = function(occurrence_number) {
    var component_occurrence = record.getComponent(occurrence_number);
    var component_sisn = component_occurrence.find('child_sisn').text();
    var lightbox_params = {
      'edit_url' : component_params.component_edit_url(component_sisn),
      'new_or_edit' : 'edit',
      'occurrence' : occurrence_number
    };
    app_interface.componentLightbox(lightbox_params);

  };



  /*****
  **
  **  removeComponent : removes a selected component from the currently loaded record
  **
  **  notes:
  **    - Actual interaction is handled by the application_interactions.js file for how this is called
  **    - If no component is selected, an alert is displayed asking the user to select a component to remove
  **
   *****/
  this.removeComponent = function() {
    var selected_component = $(component_params.component_container + ' tr.selected').first();

    if (selected_component.length === 0) {
      alert('You must select an occurrence to remove to remove an occurrence');
    } else {
      var selected_occurrence = selected_component.find('td').eq(0).text();
      var occurrence = record.getComponent(selected_occurrence);

      if (confirm("Are you sure you want to remove the selected component?")) {
        record.removeGroupOccurrence(occurrence);
        app_interface.populateComponents();
        alert('Occurrence has been successfully removed');
      }
    }
  };


  /*****
  **
  **  componentLightbox : handles making calls for adding and editing components to the lightbox data entry forms
  **
  **  params:
  **    - lightbox_params : A javascript object containing:
  **      - edit_url : A string with the URL to load into the lightbox
  **      - new_or_edit : A string with either "new" or "edit" depending on which lightbox needs to be called
  **      - occurrence : An integer with the occurrence to edit if `new_or_edit` is `edit`.
  **
  **  notes:
  **    - Actual interaction is handled by the application_interactions.js file for how this is called
  **    - `cleanup` contains the function to be called when the user closes the lightbox
  **      - If the user has saved the record, the "Record Saved" confirmation report (WEB_COMPONENT_CONFIRMATION in default cases)
  **        contains a call to automatically close the lightbox, which will start the call to the `cleanup` function
  **      - `cleanup` works a *bit* like remapping, in that it's going to search the component XML for appropriate mnemonics, and
  **        it will create the appropriate elements to attach back to the parent record.
  **    - Line 248 - 250 removes teh dummyc component that gets added in the add component function.
   *****/
  this.componentLightbox = function(lightbox_params) {
    var cleanup = function(new_or_edit, occurrence) {
      if ($('iframe').contents().find('xml#saved_component').length == 0) {
        return false;
      } else {
        var lightbox_component = $('iframe').contents().find('xml#saved_component').clone().find('record');
      }
      var component_count = record.componentCount();
      var components = record.getComponents() || $('<child_link/>');
      var component = $("<child_link_occurrence/>");
      if (typeof occurrence !== 'undefined') { component.attr('occ', occurrence); }

      if(components[0].children[0].children.length == 0){
        components[0].children[0].remove();
      }

      record.remap(lightbox_component, record.params.maps.components, component);

      // This next block is a shim to get one of the fields to conform to the database structure.
      if (component.find('child_obj_name').children().length > 0) {
        var child_obj_name = component.find('child_obj_name').children().first().text();
        component.find('child_obj_name').remove();
        component.append($("<child_obj_name>"+child_obj_name+"</child_obj_name>"));
      }

      if (new_or_edit === 'edit' && typeof occurrence != 'undefined') {
        var old_occurrence = record.getComponent(occurrence);
        old_occurrence.replaceWith(component);
      } else {
        components.append(component);
        record.sortOccurrences('child_link');
      }
    };

    // determine component screen size - RL-20220504
    var dialog_width = window.innerWidth - 8; // leave spaces in left and right margin
    var dialog_height = window.innerHeight - 13;  // leave spaces in top and bottom margin

    $.colorbox({
      href: lightbox_params.edit_url,
      iframe: true,
      width: dialog_width,  // RL-20220504
      height: dialog_height,  // RL-20220504
      onCleanup: function() { cleanup(lightbox_params.new_or_edit, lightbox_params.occurrence) },
      onClosed: function() { app_interface.populateComponents() }
    });
  };


  this.handleNomenclature = function(calling_field) {
    // RL-2021-04-26
    $record = record;
    $map = null;
    $parent_group_id = '';
    $tmp_data = [];
    $is_done = false;
    // RL-2021-03-28 - this var indciates authority record is added dynamically.
    // It is set by the javascript code in the dataentry confirmation page
    $added_record = false;
    $.colorbox({
      href: app_interface.interface_params.base_url + '/M2A_NOMENCLATURE?DIRECTSEARCH&KEEP_HOME_SESS=Y',
      iframe: true,
      width: '900px',
      height: '600px',
      onCleanup: function() {
        if (typeof $tmp_data !== 'undefined') {
          app_interface.updateNomenclature($tmp_data[0]);
        } else {
          console.log("Nomenclature error: $tmp_data was not set");
        }
      },
      onClosed: function() {
        app_interface.populateField('CATEGORY', 1, null, false);
        app_interface.populateField('CLASSIFICATION', 1, null, false);
        app_interface.populateField('SUB_CLASSIFY', 1, null, false);
        app_interface.populateField('PRIMARY', 1, null, false);
        app_interface.populateField('SECONDARY', 1, null, false);
        app_interface.populateField('TERTIARY', 1, null, false);
        delete $record;
        delete $map;
        delete $parent_group_id;
        delete $tmp_data;
        delete $is_done;
        delete $added_record;   // RL-2021-03-28
      }
    });
  };


  this.updateNomenclature = function(new_val) {
    var nomenclature_group = $(new_val).find('record').first();
    record.remap(nomenclature_group, record.params.maps.nomenclature);
  };
};