function AcquisitionInterface(record, params) {
  ApplicationInterface.call(this, record, params);
  var app_interface = this;

  var doc_interface_params = {
    'regdoc_group' : 'reg_document_grp',
    'regdoc_container' : 'table.regdoc tbody',
    'regdoc_mnemonics' : ['reg_doc_type', 'reg_doc_path', 'reg_doc_ocr', 'reg_doc_sent', 'reg_doc_received', 'reg_doc_number', 'reg_doc_notes'],
    'regdoc_data_entry_form' : '#document_data_entry',
    'dmnemonics_to_ignore' : /regdoc_/
  };

  var superUpdateField = this.updateField;
  var superPopulateForm = this.populateForm;

  /*****
  **
  **  updateField : updates a field in the record when a form field in the HTML is changed
  **
  **  params:
  **    - calling_field : The javascript object that this function was called from (will be the last edited form element in this case)
  **
  **  notes:
  **    - Actual interaction is handled by the application_interactions.js file for how this is called
  **    - Will be handled exactly as it is in `core_interface_handling.js` *unless* the field's ID contains a string that matches
  **      the `mnemonics_to_ignore` regular expression (which gets around issues with adding costs).
  **
   *****/
  this.updateField = function(calling_field) {
    if (calling_field.attr('id').match(doc_interface_params.dmnemonics_to_ignore) === null) {
      superUpdateField(calling_field);
    } else {
      return false;
    }
  }


  /*****
  **
  **  populateForm : Performs the same function as ApplicationInterface.populateForm, but also performs loans record specific interface handling
  **
  **  notes:
  **    - This will check if the currently loaded page is "Costs", and if so, will populate the costs page
  **
   *****/
  this.populateForm = function() {
    if ($(doc_interface_params.regdoc_container).length > 0) {
      app_interface.populateCosts();
    }
    superPopulateForm();
  };


  /*****
  **
  **  populateCosts : populates the costs page with a table of all of the members of the RR_ITEM_INFO ground inside of the loaded record
  **
   *****/
  this.populateCosts = function() {
    var addCostPiece = function(occurrence, mnemonic) {
      var html = $("<td/>");

      if (record.getElement(mnemonic, 0, occurrence).length > 0) {
        html.append(record.getElement(mnemonic, 0, occurrence).text());
      }

      return html;
    };

    $(doc_interface_params.regdoc_container).find('tr').remove();

    if (record.hasCosts()) {
      var occurrences_html = $('<tbody/>');

      for (var i = 1; i <= record.getCostsCount(); i++) {
        var html = $("<tr/>");

        html.append($("<td>" + i + "</td>"));

        for (var mnemonic = 0; mnemonic < doc_interface_params.regdoc_mnemonics.length - 1; mnemonic++) {
          html.append(addCostPiece(record.getCost(i), doc_interface_params.regdoc_mnemonics[mnemonic]));
        }

        occurrences_html.append(html);
      }

      $(doc_interface_params.regdoc_container).append(occurrences_html.children());
    } else {
      $(doc_interface_params.regdoc_container).append('<tr><td colspan="4">No Documents Found</td></tr>');
    }
  };


  /*****
  **
  **  selectCost : attaches a class and some visual cues for the user that a cost has been selected
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
  this.selectCost = function(calling_field) {
    if ($(calling_field).attr('id') === 'tmp_com') { return false; }

    if ($(calling_field).hasClass('selected')) {
      $(doc_interface_params.regdoc_container + ' tr').removeClass('selected');
    } else {
      $(doc_interface_params.regdoc_container + ' tr').removeClass('selected');
      $(calling_field).addClass('selected');
    }
  };


  /*****
  **
  **  addCost : Displays a lightbox with a form for users to fill out to add a new cost to a loans record
  **
   *****/
  this.addCost = function() {
    $(doc_interface_params.regdoc_data_entry_form + ' :input').val('');
    $('#regdoc_occurrence').val(record.getCostsCount() + 1);
    app_interface.costColorbox("Add New Cost");
  };



  /*****
  **
  **  addCost : Displays a lightbox with a form for users to fill out to edit an existing cost in a loans record
  **
   *****/
  this.editCost = function() {
    if ($(doc_interface_params.regdoc_container + ' tr.selected').length > 0) {
      var occurrence = $(doc_interface_params.regdoc_container + ' tr.selected').find('td:first').text();
      $(doc_interface_params.regdoc_data_entry_form + ' :input').val('');
      app_interface.populateCostsForm(occurrence);
      app_interface.costColorbox("Edit Cost");
    } else {
      alert("You need to select (click on) an occurrence to edit");
      return false;
    }
  };



  /*****
  **
  **  removeCost : removes an existing cost from a loans record if the user confirms removal
  **
   *****/
  this.removeCost = function() {
    if ($(doc_interface_params.regdoc_container + ' tr.selected').length > 0) {
      var occurrence = $(doc_interface_params.regdoc_container + ' tr.selected').find('td:first').text();
      if (confirm("Are you sure you want to remove this occurrence?")) {
        record.removeGroupOccurrence(record.getGroup(doc_interface_params.regdoc_group, occurrence));
        app_interface.populateCosts();
        alert("Occurrence has been successfully removed.");
      } else {
        return false;
      }
    } else {
      alert("You need to select (click on) an occurrence to edit");
      return false;
    }
  };


  /*****
  **
  **  costColorbox : displays a lightbox with a form for adding and modifying occurrences in the loan costs group
  **
  **  params:
  **    - title : A string to display as the title of the colorbox
  **
   *****/
  this.costColorbox = function(title) {
    $.colorbox({
      inline: true,
      href: doc_interface_params.regdoc_data_entry_form,
      title: title,
      transition: 'elastic',
      width: '900px',
      height: '600px',
      onCleanup: function() {
        // Clear Form Fields
        $('#' + doc_interface_params.regdoc_group.toUpperCase()).find(':input').val('');
        $('#' + doc_interface_params.regdoc_group.toUpperCase()).find('option:selected').removeAttr('selected');

        // Update the table:
        app_interface.populateCosts();
      }
    });
  };


  /*****
  **
  **  saveCost : gets values from a form lightbox and populates a loans record with the modified (or new) costs occurrence
  **
  **  params:
  **    - occurrence : An integer representing the occurrence number in the group to save
  **
   *****/
  this.saveCost = function(occurrence) {
    occurrence = (typeof occurrence !== 'undefined') ? occurrence : 1;

    if (!record.getCost(occurrence) && record.getCostsCount() > 0) {
      // RL-2020-12-21
      record.addGroup(doc_interface_params.regdoc_group, occurrence, record.getCosts(), true);
    } else if (!record.getCost(occurrence) && record.getCostsCount() <= 0) {
      // RL-2020-12-21
      record.addGroup(doc_interface_params.regdoc_group, 1, null, true);
    }

    cost_group = record.getCost(occurrence);
    var costs_mnemonics = doc_interface_params.regdoc_mnemonics;

    for (var i = 0; i < costs_mnemonics.length; i++) {
      if ($('#regdoc_' + costs_mnemonics[i]).val().length > 0) {
        var mnemonic_value = $('#regdoc_' + costs_mnemonics[i]).val();

        if (record.getElement(costs_mnemonics[i], 0, cost_group)) {
          record.updateElement(record.getElement(costs_mnemonics[i], 0, cost_group), mnemonic_value);
        } else {
          record.addElement(costs_mnemonics[i], mnemonic_value, false, cost_group);
        }
      }
    }

    app_interface.populateCosts();
    $.colorbox.close();
  };



  /*****
  **
  **  populateRight_cost Form : gets values from a passed occurrence in the loans cost group and populates the editing form with those values
  **
  **  params:
  **    - occurrence : An integer representing the occurrence number in the group to display
  **
   *****/
  this.populateCostsForm = function(occurrence) {
    var cost_occurrence = record.getCost(occurrence);
    var costs_mnemonics = doc_interface_params.regdoc_mnemonics;
    $('#doc_occurrence').val(occurrence);

    for (var i = 0; i < costs_mnemonics.length; i++) {
      if (record.getElement(costs_mnemonics[i], 0, cost_occurrence)) {
        $('#regdoc__' + costs_mnemonics[i]).val(record.getElement(costs_mnemonics[i], 0, cost_occurrence).text());
      }
    }
  };

  /*****
  **
  **  calculateTotalCost : gets values from all occurrences in the loans cost group, and all values from loans taxes,
  **  and populates the LO_TOTAL_COST field with the sum of those values.
  **
  **  params:
  **    - occurrence : An integer representing the occurrence number in the group to display
  **

  this.calculateTotalCost = function() {
    var total = 0;
    var costs_1 = record.getElement('enq_tax1').text();
    var costs_2 = record.getElement('enq_tax2').text();

    if (record.getGroup('enq_charge_group', 1)) {
      var costs = record.getGroup('enq_charge_group', 1).parent();

      for (var i = 0; i < $(costs).children().length; i++) {
        if ($(costs).children().eq(i).find('charge_amount').length > 0) {
          cost = parseFloat($(costs).children().eq(i).find('charge_amount').text());
          total += parseFloat(cost);
        }
      }

      if (costs_1) {
        total += parseFloat(costs_1);
      }

      if (costs_2) {
        total += parseFloat(costs_2);
      }

      total = parseFloat(Math.round(total * 100) / 100).toFixed(2);
      $('#ENQ_TOTAL_COST').val(total);
      $('#ENQ_TOTAL_COST').change();
    } else {
      // no costs found, abort
      return false;
    }
  };
   *****/


};