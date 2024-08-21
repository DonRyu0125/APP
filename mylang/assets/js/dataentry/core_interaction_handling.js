/* Global variable for unlocking record if web page is closed */ // RL-2020-11-10
var record_unlocked = false;

/* Global variable for enabling support of tree processing */     // RL-2020-11-10
var enable_tree = true;

ApplicationInteraction = function (app_interface, simple_form) {  // RL-2020-09-29

  if ( simple_form == null ) {   // RL-2020-09-29
    simple_form == false;
  }

   /*****
  **
  **  Interaction Parameters:
  **    - form_container            : Should always be 'app_interface.interface_params.form_container'
  **
  **    - prev_group_occurrence     : The desired toggle element selector for getting the previous occurrence
  **                                  of a group.
  **
  **    - next_group_occurrence     : The desired toggle element selector for getting the next occurrence of
  **                                  a group.
  **
  **    - prev_field_occurrence     : The desired toggle element selector for getting the previous occurrence
  **                                  of a field.
  **
  **    - next_field_occurrence     : The desired toggle element selector for getting the next occurrence of
  **                                  a field.
  **
  **    - repeating_context_toggle  : The desired toggle element(s) selector(s) for triggering the 'Remove'
  **                                  and 'Move' Occurrence context menu.  This shouldn't need to be changed.
  **
  **    - move_occurrence_toggle    : The desired toggle element selector for triggering the Move Occurrence
  **                                  functionality.  This shouldn't need to be changed.
  **
  **    - remove_occurrence_toggle  : The desired toggle element selector for triggering the Remove
  **                                  Occurrence functionality.  This shouldn't need to be changed.
  **
   *****/
  this.params = {
    'form_container': app_interface.interface_params.form_container,
    'prev_group_occurrence': 'ul.repeating_group_chrome a.previous',
    'next_group_occurrence': 'ul.repeating_group_chrome a.next',
    'prev_field_occurrence': 'ul.repeating_field_chrome a.previous',
    'next_field_occurrence': 'ul.repeating_field_chrome a.next',
    'repeating_context_toggle': app_interface.interface_params.r_field + ', div.repeating_field textarea, div.repeating_group_metadata',  // RL-2021-02-16
    'cancel_planned_move_toggle': 'a.cancel_move',
    'perform_planned_move_toggle': 'a.perform_move',
    'move_occurrence_toggle': 'li#move_occ a',
    'remove_occurrence_toggle': 'li#remove_occ a',
    'get_valtable_toggle': 'ul.browse_chrome a[class^=load]',
    'view_valtable_toggle': 'ul.browse_chrome a[class^=view_]',
    'save_valtable_toggle': '#dba_save_record a',
    'cancel_valtable_toggle': '#dba_cancel a',
    'save_valtable_form': '#valtable_submission_form',
    'validated_field_toggle': 'div.validated_table input, div.validated_table a.browse_trigger',
    'new_form_toggle': 'ul.form_type_links a',
    'save_record': '#dba_save a',
    'cancel_record_toggle' : '#dba_cancel a',   // RL-2020-11-10
    'file_upload': 'div.file_attachment a.load, .add_image a',
    'file_download': 'a.file_download, a.launch_external_url',
    'img_group': 'fieldset.contains_image div.file_attachment.image input',

    // rl-2020-11-10
    'img_group_alt': 'fieldset.has_image_holder div.file_attachment.image input',

    // Database specific:
    'nomenclature_toggle': 'a.load_nom',

    // browse and slect record and view record  // RL-20211207
    'browse_n_select_toggle': 'a.browse_n_select_record',
    'view_database_toggle': 'a.view_selected_record',
    'edit_database_toggle': 'a.edit_record',

    'component_toggle': 'table.components tbody tr',
    'component_add_toggle': 'ul.components_menu a.add',
    'component_edit_toggle': 'ul.components_menu a.edit',
    'component_remove_toggle': 'ul.components_menu a.delete',
    'component_save_toggle': '#dba_save_record a',
    'component_save_form': '#components_submission_form',

    'costs_select_toggle': 'table.loan_costs tbody tr, table.inloan_costs tbody tr, table.rights_costs tbody tr, table.pfees_costs tbody tr, table.ifees_costs tbody tr',
    'costs_save_toggle': '.dba_save_cost a',
    'costs_add_toggle': 'ul.loans_menu a.add, ul.inloans_menu a.add, ul.rights_menu a.add, ul.pfees_menu a.add, ul.ifees_menu a.add',
    'costs_edit_toggle': 'ul.loans_menu a.edit, ul.inloans_menu a.edit, ul.rights_menu a.edit, ul.pfees_menu a.edit, ul.ifees_menu a.edit',
    'costs_remove_toggle': 'ul.loans_menu a.delete, ul.inloans_menu a.delete, ul.rights_menu a.delete, ul.pfees_menu a.delete, ul.ifees_menu a.delete',
    'costs_calculate_toggle': 'a.calculate_loans_costs, a.calculate_inloans_costs, a.calculate_rights_costs, a.calculate_pfees_costs, a.calculate_ifees_costs',

    'document_select_toggle': 'table.regdoc tbody',
    'document_save_toggle': '#dba_save_record a',
    'document_add_toggle': 'ul.document_menu a.add',
    'document_edit_toggle': 'ul.document_menu a.edit',
    'document_remove_toggle': 'ul.document_menu a.delete',

    'set_default_address': 'a.set_default_address',

    // mnemonics to ignore:
    'mnemonics_to_ignore': 'loancost_, inloancost_',
    // 'lmnemonics_to_ignore': 'inloancost_',
    'rmnemonics_to_ignore': 'rightscost_',
    'pmnemonics_to_ignore': 'pfeescost_',
    'imnemonics_to_ignore': 'ifeescost_'
  };

  var interaction = this;

  this.populateForm = app_interface.populateForm;

  // RL-2020-09-29
  if ( simple_form ) {
    /*****
    **
    **  Get Validated Table Record (People, Org, Locations, Events, Restrictions, Etc)
    **
    *****/
    $(interaction.params.form_container).on('click', interaction.params.get_valtable_toggle, function (e) {
      e.preventDefault();
      app_interface.getValidatedTable($(this));
    });

    /*****
     **
     **  getValidatedField
     **
     *****/
    // RL-20220420
    $(interaction.params.form_container).on('click', interaction.params.validated_field_toggle, function (e) {
      e.preventDefault();

      // rl-2020-09-29
      var readonly_field = false;
      if ( app_interface.readonly_record ) {
        readonly_field = true;
      }
      else {
        readonly_field = checkReadOnly( 'body' );
        if ( !readonly_field ) {
          readonly_field = checkReadOnly( $(this) );
        }
      }

      if ( !readonly_field ) {
        // find parent div tag
        var div_tag = $(this).parent('div');
        if ( div_tag.length > 0 ) {
          // find input tag
          var input_tag = $(div_tag).first().find('input');
          if ( input_tag.length > 0 ) {
            // if input tag has disabled class, set readonly_field to true
            if ( input_tag.first().hasClass('disabled') ) {
              readonly_field = true;
            }
          }
        }
      }

      if ( !readonly_field ) {
        app_interface.loadValidatedTableField($(this));
      }
    });

    return;  // exit function
  }

  /*****
   **
   **  Update a Field
   **
   *****/
  $(interaction.params.form_container).on('change', ':input', function () {
    // call user routines before saving field value // RL-2021-03-28
    var proceedProcessing = true;
    if ( typeof exitDefaultController == 'function' ) {
      proceedProcessing = exitDefaultController($(this));
    }
    if ( proceedProcessing && typeof exitController == 'function' ) {
      proceedProcessing = exitController($(this));
    }

    if ( proceedProcessing ) {  // RL-2021-03-28
      if ($(this).attr('id') == null
      ||  $(this).attr('id').indexOf(interaction.params.mnemonics_to_ignore) < 0) {
        app_interface.updateField($(this));

        // RL-2021-03-16
        if ( $(this).hasClass('update_table') ) {
          // update table column
          app_interface.updateTableColumn($(this));
        }
      }
    }
  });


  /*****
   **
   **  Save a Record
   **
   *****/
  $('body').on('click', interaction.params.save_record, function (e) {
    e.preventDefault();
    app_interface.saveRecord($(this).data('form-action'), $('#submission_form'));
  });

  // RL-2020-11-10

  /******
  **
  ** Event Handler: Closing Tab/Window on web broswer event
  **
  ** - Helps unlock record when closing tab without clicking Save or Cancel icon
  ** - This handler is mainly for opening existing record in their data entry forms
  **
  ******/
  // add handler to listen page closing event
  window.addEventListener('beforeunload', function(e) {
    // e.preventDefault();  // turn off confirmation message

    var close_link = site_params.close_link;
    if ( close_link == null ) { // RL-20220614
      close_link =  site_params.skip_link;
    }
    var status = 0;
    if ( !record_unlocked && close_link != null ) {
      if (navigator.sendBeacon) {
        // add dummy form data because sendBeacon sends post HTTP request
        var formData = new FormData();
        formData.append('SKIP', 'YES');
        status = navigator.sendBeacon ( close_link, formData );
      }
    }
  });

  // RL-2020-11-10

   /*****
  **
  **  Skip a Record - When your in the data entry form, and click Cancel icon
  **
  **  1.) if statement - will check if '?SAVETREE' position is greater than 0 and runs skipTreeRecord
  **
  **  Otherwise,
  **  1.) else - redirects the user to Description Home Search Page and unlock record and refresh webpage
  **
   *****/



  $('body').on('click', interaction.params.cancel_record_toggle, function(e) {
    e.preventDefault();
    var save_link = site_params.save_link;
    var skip_link = site_params.skip_link;

    // RL-2020-12-10
    record_unlocked = true;
    try {
      if ( popupWindow() && typeof parent.already_unlocked != 'undefined' ) {
        parent.already_unlocked = true;
      }

      if ( popupWindow() && parent.modal_skip_record_link != "" ) {
        skip_link = parent.modal_skip_record_link;
      }
    }
    catch ( err ) {
    }

    if ( save_link.indexOf("?SAVETREE") > 0 ) {
      // unlock record and close web page

      skipTreeRecord ( skip_link );
    }
    else {
      /*  RL-2021-08-19
      if ( popupWindow() ) {
        // unlock record
        $.ajax({
          async: false,
          type: "GET",
          url: skip_link,
          success: function (data) {
            rc = 0;
          },
          error: function (xhr, status, error) {
            rc2 = 1;
          }
        });
        parent.$.colorbox.close();
      }
      else {
        // unlock record and refresh web page with search form
        window.location = skip_link;
      }
      */
      window.location = skip_link;
    }
  });

  /*****
   **
   **  getPreviousGroupOccurrence
   **
   *****/
  $(interaction.params.form_container).on('click', interaction.params.prev_group_occurrence, function (e) {
    e.preventDefault();
    app_interface.getPreviousGroupOccurrence($(this));
  });


  /*****
   **
   **  getValidatedField
   **
   *****/
  $(interaction.params.form_container).on('click', interaction.params.validated_field_toggle, function (e) {
    e.preventDefault();

    // rl-2020-09-29
    var readonly_field = false;
    if ( app_interface.readonly_record ) {
      readonly_field = true;
    }
    else {
      readonly_field = checkReadOnly( 'body' );
      if ( !readonly_field ) {
        readonly_field = checkReadOnly( $(this) );
      }
    }

    if ( !readonly_field ) {
      // find parent div tag
      var div_tag = $(this).parent('div');
      if ( div_tag.length > 0 ) {
        // find input tag
        var input_tag = $(div_tag).first().find('input');
        if ( input_tag.length > 0 ) {
          // if input tag has disabled class, set readonly_field to true
          if ( input_tag.first().hasClass('disabled') ) {
            readonly_field = true;
          }
        }
      }
    }

    if ( !readonly_field ) {
      app_interface.loadValidatedTableField($(this));
    }
  });


  /*****
   **
   **  getLanguageField
   **
   *****/
  $(interaction.params.form_container).on('click', interaction.params.language_trigger, function (e) {
    e.preventDefault();
    // app_interface.loadLanguageTableField($(this));
  });

  /*****
   **
   **  getNextGroupOccurrence
   **
   *****/
  $(interaction.params.form_container).on('click', interaction.params.next_group_occurrence, function (e) {
    e.preventDefault();
    app_interface.getNextGroupOccurrence($(this));
  });


  /*****
   **
   **  getPreviousFieldOccurrence
   **
   *****/
  $(interaction.params.form_container).on('click', interaction.params.prev_field_occurrence, function (e) {
    e.preventDefault();
    app_interface.getPreviousFieldOccurrence($(this));
  });


  /*****
   **
   **  getNextFieldOccurrence
   **
   *****/
  $(interaction.params.form_container).on('click', interaction.params.next_field_occurrence, function (e) {
    e.preventDefault();
    app_interface.getNextFieldOccurrence($(this));
  });


  /*****
   **
   **  cancelPlannedMove
   **
   *****/
  $(interaction.params.form_container).on('click', interaction.params.cancel_planned_move_toggle, function (e) {
    e.preventDefault();
    app_interface.cancelMove($(this));
  });


  /*****
   **
   **  performPlannedMove
   **
   *****/
  $(interaction.params.form_container).on('click', interaction.params.perform_planned_move_toggle, function (e) {
    e.preventDefault();
    app_interface.performMove($(this));
  });


  /*****
   **
   **  Input Field Data Changes
   **
   *****/
  // $(interaction.params.form_container).on('change', ':input', function () {
  //   app_interface.updateField($(this));
  // });


  /*****
   **
   **  Display Context Menu
   **
   *****/
  $(interaction.params.form_container).on('contextmenu', interaction.params.repeating_context_toggle, function (e) {
    var mouse_position = {
      'x': e.pageX,
      'y': e.pageY
    };
    e.preventDefault();
    app_interface.contextMenu($(this), mouse_position);
  });

  /*
  // 2021-02-04
  $(interaction.params.form_container).on('contextmenu', 'div.repeating_field textarea, div.repeating_group_metadata', function (e) {
    var mouse_position = {
      'x': e.pageX,
      'y': e.pageY
    };
    e.preventDefault();
    app_interface.contextMenu($(this), mouse_position);
  });
  */


  /*****
   **
   **  Clear Context Menu
   **
   *****/
  $('body').on('click', app_interface.interface_params.overlay, function (e) {
    e.preventDefault();
    app_interface.clearContextMenu($(this));
  });


  /*****
   **
   **  Remove Occurrence
   **
   *****/
  $('body').on('click', interaction.params.remove_occurrence_toggle, function (e) {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this occurrence?")) {
      app_interface.removeOccurrence($(this));
    }
    app_interface.clearContextMenu($(this));
  });


  /*****
   **
   **  Move Occurrence
   **
   *****/
  $('body').on('click', interaction.params.move_occurrence_toggle, function (e) {
    e.preventDefault();
    app_interface.moveOccurrence($(this));
    app_interface.clearContextMenu($(this));
  });


  /*****
   **
   **  First Occurrence
   **
   *****/
  $('body').on('click', 'li#first_occ a', function (e) {
    e.preventDefault();
    app_interface.firstOccurrence($(this));
    app_interface.clearContextMenu($(this));
  });


  /*****
   **
   **  Last Occurrence
   **
   *****/
  $('body').on('click', 'li#last_occ a', function (e) {
    e.preventDefault();
    app_interface.lastOccurrence($(this));
    app_interface.clearContextMenu($(this));
  });


  /*****
   **
   **  New Occurrence
   **
   *****/
  $('body').on('click', 'li#new_occ a', function (e) {
    e.preventDefault();
    app_interface.newOccurrence($(this));
    app_interface.clearContextMenu($(this));
  });


  // RL-2021-02-04
  /*****
   **
   **  Close popup menu
   **
   *****/
  $('body').on('click', 'li#close_menu a', function (e) {
    e.preventDefault();
    app_interface.clearContextMenu($(this));
  });


  /*****
   **
   **  Get Validated Table Record (People, Org, Locations, Events, Restrictions, Etc)
   **
   *****/
  $(interaction.params.form_container).on('click', interaction.params.get_valtable_toggle, function (e) {
    e.preventDefault();
    app_interface.getValidatedTable($(this));
  });

  // RL-20211207
  $(interaction.params.form_container).on('click', interaction.params.browse_n_select_toggle, function (e) {
    e.preventDefault();
    app_interface.getValidatedTable($(this));
  });


  /*****
   **
   **  View Validated Table Record
   **
   *****/
  $(interaction.params.form_container).on('click', interaction.params.view_valtable_toggle, function (e) {
    e.preventDefault();
    app_interface.loadValidatedTableRecord($(this));
  });

  // RL-20211207
  $(interaction.params.form_container).on('click', interaction.params.view_database_toggle, function (e) {
    e.preventDefault();
    app_interface.loadValidatedTableRecord($(this));
  });

  // RL-20220120
  $(interaction.params.form_container).on('click', interaction.params.edit_database_toggle, function (e) {
    e.preventDefault();
    app_interface.editRecord($(this));
  });

  /*****
   **
   **  Save a Validated Table Record
   **
   *****/
  $('body').on('click', interaction.params.save_valtable_toggle, function (e) {
    e.preventDefault();
    app_interface.saveRecord($(this).data('form-action'), $(interaction.params.save_valtable_form));
  });


  /*****
   **
   **  Get New Form Pages
   **
   *****/
  $(interaction.params.form_container).on('click', interaction.params.new_form_toggle, function (e) {
    e.preventDefault();
    app_interface.loadNewFormPage($(this));
  });


  /*****
   **
   **  Set as default address
   **
   *****/
  $(interaction.params.form_container).on('click', interaction.params.set_default_address, function (e) {
    e.preventDefault();
    app_interface.setDefaultAddress($(this));
  });


  /*****
   **
   **  File Upload / Download
   **
   *****/
  $('body').on('click', interaction.params.file_upload, function () {
    app_interface.uploadFile($(this));
  });
  $('body').on('click', interaction.params.file_download, function () {
    app_interface.downloadFile($(this));
  });


  /*****
   **
   **  Contains Image workaround
   **
   *****/
  $(interaction.params.form_container).on('change', interaction.params.img_group, function () {
    app_interface.updateImages($(this));
  });

  // RL-2020-11-10
  $(interaction.params.form_container).on('change', interaction.params.img_group_alt, function () {
    app_interface.updateImages($(this));
  });

  // CHENHALL //
  if (typeof app_interface.handleNomenclature !== 'undefined') {
    $(interaction.params.form_container).on('click', interaction.params.nomenclature_toggle, function (e) {
      e.preventDefault();
      app_interface.handleNomenclature($(this));
    });
  };
  // END CHENHALL //


  // COMPONENTS //
  if (typeof app_interface.selectComponent !== 'undefined') {
    /*****
     **
     **  Select a Component
     **
     *****/
    $(interaction.params.form_container).on('click', interaction.params.component_toggle, function (e) {
      e.preventDefault();
      app_interface.selectComponent($(this));
    });

    /*****
     **
     **  Add a Component
     **
     *****/
    $(interaction.params.form_container).on('click', interaction.params.component_add_toggle, function (e) {
      e.preventDefault();
      app_interface.addComponent();
    });

    /*****
     **
     **  Edit a Component
     **
     *****/
    $(interaction.params.form_container).on('click', interaction.params.component_edit_toggle, function (e) {

      e.preventDefault();
      app_interface.editComponent($(interaction.params.component_toggle + '.selected').children().first().text());
    });

    /*****
     **
     **  Remove a Component
     **
     *****/
    $(interaction.params.form_container).on('click', interaction.params.component_remove_toggle, function (e) {
      e.preventDefault();
      app_interface.removeComponent();
    });

    /*****
     **
     **  Save a Component
     **
     *****/
    $('body').on('click', interaction.params.component_save_toggle, function (e) {
      e.preventDefault();
      app_interface.saveComponent($(this).data('form-action'), $(interaction.params.component_save_form));
    });
  }
  // END COMPONENTS //



  if (typeof app_interface.selectCost == 'undefined') {
    // if selectCoost method is undefined, setup event hooks of GENERIC TABLE
    // RL-2021-03-16
    // var groupTable = $(interaction.params.form_container).find('table.generic_table tbody tr');
    // if ( $(groupTable).length > 0 ) {
      $(interaction.params.form_container).on('click', 'table.generic_table tbody tr', function (e) {
        e.preventDefault();
        app_interface.selectTableRow($(this));
      });

      $(interaction.params.form_container).on('dblclick', 'table.generic_table tbody tr', function (e) {
        e.preventDefault();

        var edit_enabled = true;
        var no_edit_flag = "";
        var table_tag = $(this).parents('table');
        if ( table_tag.length > 0 ) {
          no_edit_flag = table_tag.data('no-edit');
          if ( no_edit_flag != undefined && no_edit_flag == 'Y' ) {
            edit_enabled = false;
          }
        }

        if ( edit_enabled ) {
          app_interface.selectEditTableRow($(this));
        }
      });

      $(interaction.params.form_container).on('click', 'ul.generic_table_menu a.add_group_occ', function (e) {
        e.preventDefault();
        app_interface.addTableRow($(this));
      });

      $(interaction.params.form_container).on('click', 'ul.generic_table_menu a.edit_group_occ', function (e) {
        e.preventDefault();
        app_interface.editTableRow($(this), true);
      });

      $(interaction.params.form_container).on('click', 'ul.generic_table_menu a.delete_group_occ', function (e) {
        e.preventDefault();
        app_interface.removeTableRow($(this));
      });
    // }
  }
  else {
    // COSTS (LOANS) //
    /*****
     **
     **  Select a Cost
     **
     *****/
    $(interaction.params.form_container).on('click', interaction.params.costs_select_toggle, function (e) {
      e.preventDefault();
      app_interface.selectCost($(this));
    });

    /*****
     **
     **  Add a Cost
     **
     *****/
    $(interaction.params.form_container).on('click', interaction.params.costs_add_toggle, function (e) {
      e.preventDefault();
      app_interface.addCost();
    });

    /*****
     **
     **  Edit a Cost
     **
     *****/
    $(interaction.params.form_container).on('click', interaction.params.costs_edit_toggle, function (e) {
      e.preventDefault();
      app_interface.editCost();
    });

    /*****
     **
     **  Remove a Cost
     **
     *****/
    $(interaction.params.form_container).on('click', interaction.params.costs_remove_toggle, function (e) {
      e.preventDefault();
      app_interface.removeCost();
    });

    /*****
     **
     **  Calculate Total Cost
     **
     *****/
    $(interaction.params.form_container).on('click', interaction.params.costs_calculate_toggle, function (e) {
      e.preventDefault();
      app_interface.calculateTotalCost();
    });

    /*****
     **
     **  Save a Cost
     **
     *****/
    $('body').on('click', interaction.params.costs_save_toggle, function (e) {
      e.preventDefault();
      // occurrence
      var occurrence;
      if ($('#loancost_occurrence').length > 0) {
        occurrence = $('#loancost_occurrence').val();
      } else if ($('#inloancost_occurrence').length > 0) {
        occurrence = $('#inloancost_occurrence').val();
      } else if ($('#rightscost_occurrence').length > 0) {
        occurrence = $('#rightscost_occurrence').val();
      } else if ($('#pfeescost_occurrence').length > 0) {
        occurrence = $('#pfeescost_occurrence').val();
      } else if ($('#ifeescost_occurrence').length > 0) {
        occurrence = $('#ifeescost_occurrence').val();
      } else if ($('#regdoc_occurrence').length > 0) {
        occurrence = $('#regdoc_occurrence').val();
      }
      app_interface.saveCost(occurrence);
    });
  }
};