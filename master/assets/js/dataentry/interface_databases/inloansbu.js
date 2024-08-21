function InloansInterface(record, params) {
  ApplicationInterface.call(this, record, params);
  var app_interface = this;

  var inloans_interface_params = {
    'inloans_costs_group': 'li_fee_grp',
    'inloans_costs_container': 'table.inloan_costs tbody',
    'inloans_costs_mnemonics': ['li_fee_active', 'li_fee_details', 'li_fee_hours', 'li_fee_staff', 'li_fee_amount', 'li_fee_note'],
    'inloans_costs_data_entry_form': '#costs_data_entry',
    'mnemonics_to_ignore': /inloancost_/
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
  this.updateField = function (calling_field) {
    if (calling_field.attr('id').match(inloans_interface_params.mnemonics_to_ignore) === null) {
      superUpdateField(calling_field);
    } else {
      return false;
    }
  }


  /*****
   **
   **  populateForm : Performs the same function as ApplicationInterface.populateForm, but also performs inloans_ record specific interface handling
   **
   **  notes:
   **    - This will check if the currently loaded page is "Costs", and if so, will populate the costs page
   **
   *****/
  this.populateForm = function () {
    if ($(inloans_interface_params.inloans_costs_container).length > 0) {
      app_interface.populateCosts();
    }
    superPopulateForm();
  };


  /*****
   **
   **  populateCosts : populates the costs page with a table of all of the members of the RR_ITEM_INFO ground inside of the loaded record
   **
   *****/
  this.populateCosts = function () {
    var addCostPiece = function (occurrence, mnemonic) {
      var html = $("<td/>");

      if (record.getElement(mnemonic, 0, occurrence).length > 0) {
        html.append(record.getElement(mnemonic, 0, occurrence).text());
      }

      return html;
    };

    $(inloans_interface_params.inloans_costs_container).find('tr').remove();

    if (record.hasCosts()) {
      var occurrences_html = $('<tbody/>');

      for (var i = 1; i <= record.getCostsCount(); i++) {
        var html = $("<tr/>");

        html.append($("<td>" + i + "</td>"));

        for (var mnemonic = 0; mnemonic < inloans_interface_params.inloans_costs_mnemonics.length - 1; mnemonic++) {
          html.append(addCostPiece(record.getCost(i), inloans_interface_params.inloans_costs_mnemonics[mnemonic]));
        }

        occurrences_html.append(html);
      }

      $(inloans_interface_params.inloans_costs_container).append(occurrences_html.children());
    } else {
      $(inloans_interface_params.inloans_costs_container).append('<tr><td colspan="7">No Costs Found</td></tr>');
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
  this.selectCost = function (calling_field) {
    if ($(calling_field).attr('id') === 'tmp_com') {
      return false;
    }

    if ($(calling_field).hasClass('selected')) {
      $(inloans_interface_params.inloans_costs_container + ' tr').removeClass('selected');
    } else {
      $(inloans_interface_params.inloans_costs_container + ' tr').removeClass('selected');
      $(calling_field).addClass('selected');
    }
  };


  /*****
   **
   **  addCost : Displays a lightbox with a form for users to fill out to add a new cost to a inloans_ record
   **
   *****/
  this.addCost = function () {
    $(inloans_interface_params.inloans_costs_data_entry_form + ' :input').val('');
    $('#inloancost_occurrence').val(record.getCostsCount() + 1);
    app_interface.costColorbox("Add New Cost");
  };



  /*****
   **
   **  addCost : Displays a lightbox with a form for users to fill out to edit an existing cost in a inloans_ record
   **
   *****/
  this.editCost = function () {
    if ($(inloans_interface_params.inloans_costs_container + ' tr.selected').length > 0) {
      var occurrence = $(inloans_interface_params.inloans_costs_container + ' tr.selected').find('td:first').text();
      $(inloans_interface_params.inloans_costs_data_entry_form + ' :input').val('');
      app_interface.populateCostsForm(occurrence);
      app_interface.costColorbox("Edit Cost");
    } else {
      alert("You need to select (click on) an occurrence to edit");
      return false;
    }
  };



  /*****
   **
   **  removeCost : removes an existing cost from a inloans_ record if the user confirms removal
   **
   *****/
  this.removeCost = function () {
    if ($(inloans_interface_params.inloans_costs_container + ' tr.selected').length > 0) {
      var occurrence = $(inloans_interface_params.inloans_costs_container + ' tr.selected').find('td:first').text();
      if (confirm("Are you sure you want to remove this occurrence?")) {
        record.removeGroupOccurrence(record.getGroup(inloans_interface_params.inloans_costs_group, occurrence));
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
   **  costColorbox : displays a lightbox with a form for adding and modifying occurrences in the costs group
   **
   **  params:
   **    - title : A string to display as the title of the colorbox
   **
   *****/
  this.costColorbox = function (title) {
    $.colorbox({
      inline: true,
      href: inloans_interface_params.inloans_costs_data_entry_form,
      title: title,
      transition: 'elastic',
      width: '900px',
      height: '600px',
      onCleanup: function () {
        // Clear Form Fields
        $('#' + inloans_interface_params.inloans_costs_group.toUpperCase()).find(':input').val('');
        $('#' + inloans_interface_params.inloans_costs_group.toUpperCase()).find('option:selected').removeAttr('selected');

        // Update the table:
        app_interface.populateCosts();
      }
    });
  };

  this.handleNomenclature = function(calling_field) {
    $.colorbox({
      href: app_interface.interface_params.base_url + '/M3_NOMENCLATURE?DIRECTSEARCH',
      iframe: true,
      width: '900px',
      height: '600px',
      onCleanup: function() {
        if (typeof $tmp_data !== 'undefined') {
          app_interface.updateNomenclature($tmp_data);
        } else {
          console.log("Nomenclature error: $tmp_data was not set");
        }
      },
      onClosed: function() {
        app_interface.populateField('CATEGORY');
        app_interface.populateField('CLASSIFICATION');
        app_interface.populateField('SUB_CLASSIFCIATI');
        app_interface.populateField('PRIMARY');
        app_interface.populateField('SECONDARY');
        app_interface.populateField('TERTIARY');
        delete $tmp_data;
      }
    });
  };


  this.updateNomenclature = function(new_val) {
    var nomenclature_group = $(new_val).find('record').first();
    record.remap(nomenclature_group, record.params.maps.nomenclature);
  };


  /*****
   **
   **  saveCost : gets values from a form lightbox and populates a inloans_ record with the modified (or new) costs occurrence
   **
   **  params:
   **    - occurrence : An integer representing the occurrence number in the group to save
   **
   *****/
  this.saveCost = function (occurrence) {
    occurrence = (typeof occurrence !== 'undefined') ? occurrence : 1;

    if (!record.getCost(occurrence) && record.getCostsCount() > 0) {
      // RL-2020-12-21
      record.addGroup(inloans_interface_params.inloans_costs_group, occurrence, record.getCosts(), true);
    } else if (!record.getCost(occurrence) && record.getCostsCount() <= 0) {
      // RL-2020-12-21
      record.addGroup(inloans_interface_params.inloans_costs_group, 1, null, true);
    }

    cost_group = record.getCost(occurrence);
    var costs_mnemonics = inloans_interface_params.inloans_costs_mnemonics;

    for (var i = 0; i < costs_mnemonics.length; i++) {
      if ($('#inloancost_' + costs_mnemonics[i]).val().length > 0) {
        var mnemonic_value = $('#inloancost_' + costs_mnemonics[i]).val();

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
   **  populateRight_cost Form : gets values from a passed occurrence in the inloans_ cost group and populates the editing form with those values
   **
   **  params:
   **    - occurrence : An integer representing the occurrence number in the group to display
   **
   *****/
  this.populateCostsForm = function (occurrence) {
    var cost_occurrence = record.getCost(occurrence);
    var costs_mnemonics = inloans_interface_params.inloans_costs_mnemonics;
    $('#inloancost_occurrence').val(occurrence);

    for (var i = 0; i < costs_mnemonics.length; i++) {
      if (record.getElement(costs_mnemonics[i], 0, cost_occurrence)) {
        $('#inloancost_' + costs_mnemonics[i]).val(record.getElement(costs_mnemonics[i], 0, cost_occurrence).text());
      }
    }
  };

  /*****
   **
   **  calculateTotalCost : gets values from all occurrences in the inloans_ cost group, and all values from inloans_ taxes,
   **  and populates the LO_TOTAL_COST field with the sum of those values.
   **
   **  params:
   **    - occurrence : An integer representing the occurrence number in the group to display
   **
   *****/
  this.calculateTotalCost = function () {
    var total = 0;
    var costs_1 = record.getElement('li_tax1').text();
    var costs_2 = record.getElement('li_tax2').text();

    if (record.getGroup('li_fee_grp', 1)) {
      var costs = record.getGroup('li_fee_grp', 1).parent();

      for (var i = 0; i < $(costs).children().length; i++) {
        if ($(costs).children().eq(i).find('li_fee_amount').length > 0) {
          cost = parseFloat($(costs).children().eq(i).find('li_fee_amount').text());
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
      $('#REG_LI_TTLCOST').val(total);
      $('#REG_LI_TTLCOST').change();
    } else {
      // no costs found, abort
      return false;
    }
  };
};