/*
  M2A Online Data Entry
  Interface Handling
  v2.0

  Jon West - MINISIS Inc
  February 2015
*/

// RL-2020-11-10
// declare global constants
const MAX_WEB_CHARS           = 62;
const CURRENTUSER_KW          = "currentUser";
const USERWELCOME_KW          = "userWelcome";
const MARC_INDICATOR_ID       = "marc_indicator_id";

// rl-2020-09-29
var currentAppInterface = null;
var is_contextmenu_open = false;   // MH-20230131

function ApplicationInterface(record, caller_params) {
  var app_interface = this;

  // RL-2020-09-29
  this.app_record = record;

  // rl-2020-09-29
  currentAppInterface = this;

  // RL-2021-09-15
  this.ignore_mandatory_check = false;

  // rl-2020-09-29
  this.readonly_record = false;
  if ( record.readonly_flag != undefined ) {
    this.readonly_record = record.readonly_flag;
  }

  // RL-2021-03-28
  this.appWorksheetHandler = null;

  // RL-2021-03-16
  this.popup_group_dialog = false;

  // RL-2020-12-10
  if ( popupWindow() ) {
    try {
      if ( typeof parent.modal_skip_record_link != 'undefined' ) {
        parent.modal_skip_record_link = site_params.skip_link;
      }
    }
    catch(err) {
    }

    // remove links in modal dialog
    removeModalLinks(false);
  }

  var params = null;
  if ( typeof caller_params !== 'undefined' ) {
    // load application dataentry parameters
    params = caller_parms;
  }
  else {
    params =
    {
      'form_container': '#data_entry_forms',
      'overlay': '#temporary_overlay',
      'group_title': 'li.repeating_group_title',
      'group_container': 'fieldset.repeating_group',
      'group_occurrence': 'li.repeating_group_current_occurrence',
      'group_total_occurrences': 'li.repeating_group_total_occurrences',
      'browse_field_container': '[class*=validated_field]',
      'marc_browse_field_container': 'div.marc_validation',  // RL-20211207
      'r_field': 'div.repeating_field input',
      'r_field_container': 'div.repeating_field',
      'r_field_occurrence': 'li.current_occurrence',
      'r_field_total_occurrences': 'li.total_occurrences',
      'context_menu': 'ul#repeating_menu',
      'record_image': 'div.img_container img',
      'image_group': IMAGE_GROUP,
      'tooltip_elements': '#data_entry_forms label, #CANCEL_MOVE, #MOVE_BUTTON, #GET_LOC_BTN',
      'image_virtual_directory': MEDIA_VD_NAME,
      'image_url_path': SITE_ROOT_PATH + '/' + SITE_MEDIA_FOLDER + '/',
      'contains_image': 'fieldset.contains_image div.image input',
      'base_url': SITE_ROOT_PATH + '/scripts/mwimain.dll' + MWI_LANG_ID,
      'sessid': $.cookie('HOME_SESSID'),

      // RL-2020-09-29
      'record_image2': 'div.img_container2 img',
      'image_group_repeating': 'Y',

      // RL-2020-11-10
      'has_image_holder': 'fieldset.has_image_holder div.image input',

      'valtable_view_links': {},
      'valtable_query_links': {},
      'tdr_map': {}
    };

    if ( typeof customized_interface_params !== 'undefined' ) {
      params = $.extend(true, params, customized_interface_params );
    }
  }

  this.interface_params = $.extend(true, {}, params);


  /*****
   **
   **  populateForm : returns true when operation is complete.
   **
   **  notes:
   **    - This is used to initially populate a form when a page is first loaded.
   **    - For populating individual groups and fields, the appropriate `populateGroup`
   **      and `populateField` functions should be used instead.
   **
   *****/
  this.populateForm = function () {
    // Handle fields outside of any groups:
    $(params.form_container + ' :input').each(function () {
      var marc_header = false;
      var marc_value = false;
      var marc_repeat = false;
      var marc_occ = "1";
      var marctag = "";
      var field_id = $(this).attr('id');
      if ( field_id == undefined ) {
        field_id = "";
      }
      if ( field_id == "" && $(this).parent().hasClass('marc_header') ) {
        marc_header = true;
      }
      else {
        marctag = field_id;
        if ( $(this).data('marc') == 'Y' ) {
          marc_value = true;
          if ( $(this).data('marc_repeat') == 'Y' ) {
            marc_repeat = true;
          }
        }
      }

      if ( field_id != "" || marc_header ) {
        if ( marc_header ) {
          field_id = MARC_INDICATOR_ID;
        }
        if ( marc_header || marc_value || !app_interface.isInGroup('#' + field_id)) {
          if ( marc_value ) {
            if ( marc_repeat ) {
              app_interface.populateField(field_id, marc_occ, $(this), false); // RL-2021-05-31
            }
            else {
              app_interface.populateField(field_id, '0', $(this), false); // RL-2021-05-31
            }
          }
          else {
            if ( field_id != MARC_INDICATOR_ID && app_interface.isRepeatingField('#' + field_id)) {
              app_interface.populateField(field_id, '1', $(this), false); // RL-2021-05-31
            } else {
              app_interface.populateField(field_id, '0', $(this), false); // RL-2021-05-31
            }
          }
        }
      }
    });

    // Handle fields inside of groups:
    $(params.group_container).each(function () {
      var group_id = $(this).attr('id');
      if ( group_id != null ) {
        var total_occurrences = app_interface.getTotalOccurrences(group_id);

        total_occurrences = (total_occurrences > 0) ? total_occurrences : 1;
        $('#' + group_id).find(params.group_total_occurrences).first().text(total_occurrences);

        app_interface.populateGroup(group_id, '1');
      }
    });

    // Handle record image (if applicable):
    if ($(params.record_image).length > -1) {
      app_interface.handleImages();
    }

    if ($(params.contains_image).length > -1) {
      $(params.contains_image).each(function () {
        app_interface.updateImages($(this));
      });
    }

    // RL-2020-11-10
    if ($(params.has_image_holder).length > -1) {
      $(params.has_image_holder).each(function () {
        app_interface.updateImages($(this));
      });
    }

    // Check for active restrictions:
    app_interface.handleActiveRestrictions();

    // Load tooltips:
    app_interface.loadTooltips();

    return true;
  };


  /*****
   **
   **  populateGroup : returns true when a group's data has been put into the appropriate form fields,
   **                  or false if there was no appropriate data found for the request.
   **
   **  params:
   **    - group_id : String value representing the groups ID in the HTML, eg: 'ACQ_SOURCE_GRP'
   **    - occurrence : String/Int value representing the desired group occurrence
   **
   **  notes:
   **    - Child groups are automatically handled by this
   **    - If an occurrence exceeding the amount of total occurrences by 1 is requested, it's assumed
   **      that a new occurrence is being created, and the form is setup appropriately.
   **
   *****/
  this.populateGroup = function (group_id, occurrence) {
    // RL-2020-09-29
    if ( group_id == null ) {
      return true;
    }

    // check group madnatory fields
    if ( !this.ignore_mandatory_check && typeof occurrence != 'undefined' && occurrence > 1 ) {
      var result = checkMandatoryField(group_id);
      if ( !result ) {
        return true;
      }
    }

    // this utility function calls user routines that are attached to the input field
    // within the <fieldset> tag
    var callGroupExit = function (group_id, occurrence) {
      // call group initialization user routines
      var group_user_routine = $('#'+group_id).find('.group_call_exit');
      $(group_user_routine).each(function()  {
        var proceedProcessing = true;
        if ( typeof exitDefaultController == 'function' ) {
          proceedProcessing = exitDefaultController($(this));
        }
        if ( proceedProcessing && typeof exitController == 'function' ) {
          proceedProcessing = exitController($(this));
        }
      });
    }

    var parent_group = app_interface.getGroupParent(group_id);
    var group = record.getGroup(group_id.toLowerCase(), occurrence, parent_group);

   if (group) {
      var total_occurrences = app_interface.getTotalOccurrences(group_id);

      $('#' + group_id).find(params.group_occurrence).first().text(occurrence);
      $('#' + group_id).find(params.group_total_occurrences).first().text(total_occurrences);

      $('#' + group_id + ' :input').each(function () {
        if ($(this).closest(params.group_container).attr('id') === group_id) {
          app_interface.populateField($(this).attr('id'), 1, $(this), false); // RL-2021-05-31
        }
      });

      $('#' + group_id + ' ' + params.group_container).each(function () {
        var child_group_id = $(this).attr('id');
        if (app_interface.occurrenceExists(child_group_id, '1')) {
          app_interface.populateGroup(child_group_id, '1');
        } else {
          app_interface.clearGroup(child_group_id);
        }
      });

      // RL-2021-05-31
      $('#' + group_id).find('.richText').each(function () {
        app_interface.switchGroupWithRichText($(this), false);
      });

      // RL-20221031
      $('#' + group_id).find('.contains_image').each(function () {
        $(this).find('.file_attachment input').each(function () {
          app_interface.updateImages($(this).attr('id'));
        });
      });

      // RL-20221031
      $('#' + group_id).find('.has_image_holder').each(function () {
        $(this).find('.file_attachment input').each(function () {
          app_interface.updateImages($(this).attr('id'));
        });
      });

      // call group user routimes
      callGroupExit (group_id, occurrence);

      return true;
    } else {
      if (parseInt(occurrence) === app_interface.getTotalOccurrences(group_id) + 1) {
        app_interface.clearGroup(group_id);
        $('#' + group_id).find(params.group_occurrence).first().text(occurrence);
        $('#' + group_id).find(params.group_total_occurrences).first().text(occurrence);

        // RL-2021-05-31
        $('#' + group_id).find('.richText').each(function () {
          app_interface.switchGroupWithRichText($(this), false);
        });

        // RL-20221031
        $('#' + group_id).find('.contains_image').each(function () {
          $(this).find('.file_attachment input').each(function () {
            app_interface.updateImages($(this).attr('id'));
          });
        });

        // RL-20221031
        $('#' + group_id).find('.has_image_holder').each(function () {
          $(this).find('.file_attachment input').each(function () {
            app_interface.updateImages($(this).attr('id'));
          });
        });

        // call group user routimes
        callGroupExit (group_id, occurrence);

        return true;
      }
    }

    return false;
  };


  /*****
   **
   **  populateField : returns true when a field's data has been put into the appropriate form fields,
   **                  or false when no suitable data was found.
   **
   **  params:
   **    - field_id : String value representing the groups ID in the HTML, eg: 'SRC_CON_ALIAS'
   **    - occurrence : String/Int value representing the desired group occurrence. eg: '1', or '0' for elementary fields
   **
   **  notes:
   **    - Repeating fields are automatically handled by this
   **    - If an occurrence exceeding the amount of total occurrences by 1 is requested, it's assumed
   **      that a new occurrence is being created, and the form is setup appropriately.
   **
   *****/
  // RL-2021-05-31
  this.populateField = function (field_id, occurrence, jquery_field, richTextFlag) {
    // RL-2020-09-29
    if ( typeof field_id == 'undefined' ||  field_id == null ) {
      return true;
    }

    // RL-2021-05-31
    var richText = false;
    if ( richTextFlag !== undefined ) {
      richText = richTextFlag;
    }

    var h_jquery_field = null;
    if ( typeof jquery_field != 'undefined' ) {
      h_jquery_field = jquery_field;
    }

    // RL-2021-05-31
    var marc_field = false;
    var marc_body = null;
    var marc_indicator = null;
    var marc_indicator_id = false;
    var marc_indicator_value = "";

    if ( field_id == MARC_INDICATOR_ID ) {
      marc_indicator_id = true;
    }

    if ( marc_indicator_id && h_jquery_field != null  && !richText ) {
      marc_indicator_value = h_jquery_field.val();

      // find MARC field
      marc_body = h_jquery_field.parent().next();
      if ( marc_body != null ) {
        marc_field = true;

        var marc_field_value = marc_body.find('textarea');
        if ( marc_field_value.length <= 0 ) {
          marc_field_value = marc_body.find('input[type=text]');
        }

        if ( marc_field_value.length > 0 && marc_field_value[0].id != "" ) {
          field_id = marc_field_value[0].id;
        }
        else {
          return true; // do nothing
        }
      }
      else {
        return true; // do nothing
      }
    }
    else {
      if ( h_jquery_field != null && h_jquery_field.parent().hasClass('marc_body') && !richText) {
        marc_body = h_jquery_field.parent();
        marc_indicator = marc_body.prev().find('input[type=text]');
        if ( marc_indicator != null ) {
          marc_indicator_value = marc_indicator.val();
        }
        // marc_field = true; // RL-20211205
      }
    }

    xml_field_id = field_id.toLowerCase();
    form_field_id = (field_id[0] === '#') ? field_id : '#' + field_id;

    // RL-2020-09-29
    // check to see input file is read-only
    var readonly_field = false;
    if ( this.readonly_record ) {
      readonly_field = true;
    }
    else {
      readonly_field = checkReadOnly( 'body' );
      if ( !readonly_field ) {
        readonly_field = checkReadOnly( form_field_id );
      }
    }

    // RL-2021-05-31
    if ( !readonly_field ) {
      if ( richText ) {
        $(form_field_id).removeClass('disabled');
      }
    }
    else {
      if ( richText ) {  // RL-2021-05-31
        $(form_field_id).addClass('disabled');
      }
      else {
        if ( $(form_field_id).is("input") || $(form_field_id).is("textarea") ) {
          if ( $(form_field_id).hasClass('checkbox') ) {
            $(form_field_id).prop('disabled', true);
          }
          else {
            $(form_field_id).prop('readonly', true);
          }
        }
        else {
          $(form_field_id).prop('disabled', true);
        }
      }
    }

    marc_field = false;
    if ( $(form_field_id).data('marc') == 'Y' ) { // RL-20211205
      marc_field = true;
    }

    var parent_group = app_interface.getGroupParent(field_id);
    var total_occurrences;

    var field_found = false;
    var h_field = record.getElement(xml_field_id, occurrence, parent_group);
    if ( h_field !== false ) {
      field_found = true;
    }

    // RL-2021-05-31
    var field_val = '';
    if (marc_field || field_found) {
      // RL-2021-05-31
      if ( richText ) {
        if ( field_found ) {
          field_val = h_field.text();
        }

        // unescape richText field
        field_val = richTextUnEscape(field_val);

        // update rich text field in data entry form
        $(form_field_id).html(field_val);
      }
      else {
        if ( field_found ) {
          field_val = h_field.text();
        }
        if ($(form_field_id).attr('type') === 'hidden' && $(form_field_id).hasClass('checkbox')) {
          if (marc_field || field_val.toUpperCase() === 'X') {
            $(form_field_id).val('X');
            var check_element = $(form_field_id).parents('span.check').find('i').first();
            check_element.removeClass('fa-square-o').addClass('fa-check-square');
          }
        }
        else {
          // unescape HTML in record to prevent double escaping:
          if ( marc_indicator_id || marc_body != null ) {
            field_val = htmlUnescape(field_val);
          }
          else {
            field_val = $.trim(htmlUnescape(field_val));
          }

          if ( marc_field ) {
            field_val = marc_indicator_value + field_val;
          }
          if ( field_found ) {
            record.updateElement(h_field, field_val);
          }

          marc_indicator_value = "";
          var marc_body_flag = false;
          if ( $(form_field_id).parent().hasClass('marc_body') ) {
            marc_body_flag = true;
          }
          if ( field_val != "" && marc_body_flag ) {
            // extract MARC indicator
            var  found_loc = field_val.indexOf("\u2021");
            if ( found_loc > 0 ) {
              marc_indicator_value = field_val.substring ( 0, found_loc );
              field_val = field_val.substring ( found_loc );
            }
          }
          if ( marc_indicator_value != "" ) {
            var marc_header = $(form_field_id).parent().prev();
            marc_indicator = marc_header.find('input[type=text]');

            // update MARC indicator
            if ( marc_indicator.length > 0 ) {
              marc_indicator.val( marc_indicator_value );
            }
          }

          //detailed report unicode
          // var parsedhtml = $.parseHTML(field_val);
          $(form_field_id).val(field_val);
          // $(form_field_id).val(parsedhtml[0].data);
        }
      }

      total_occurrences = record.getOccurrenceCount(xml_field_id, parent_group);
    }
    else {
      // RL-2021-05-31
      if ( marc_field ) {
        $(form_field_id).val('');
      }
      else {
        if ( richText ) {
          $(form_field_id).html('');
        }
        else {
          if (parseInt(occurrence) === app_interface.getTotalOccurrences(field_id) + 1) {
            $(form_field_id).val('');
            total_occurrences = record.getOccurrenceCount(xml_field_id, parent_group) + 1;
          }
          else if (parseInt(occurrence) === 0) {
            $(form_field_id).val('');
          }
          else {
            return false;
          }
        }
      }
    }

    if (!marc_field && app_interface.isRepeatingField(form_field_id)) {  // RL-2021-05-31
      total_occurrences = (total_occurrences > 0) ? total_occurrences : 1;
      $(form_field_id).closest(params.r_field_container).find(params.r_field_occurrence).first().text(occurrence);
      $(form_field_id).closest(params.r_field_container).find(params.r_field_total_occurrences).first().text(total_occurrences);
    }

    return true;
  };


  /*****
   **
   **  getGroupParent : returns either the group's parent, or 'undefined'.
   **
   **  params:
   **    - group_id : String value representing the groups ID in the HTML, eg: 'ACQ_SOURCE_GRP'
   **
   **  notes:
   **    - This is going to get the exact group (or repeating fields parent group) parent based on the currently displayed HTML
   **
   *****/
  this.getGroupParent = function (group_id) {
    // Get the total depth of the current group by seeing how many parents that have the 'group_container' selector
    var total_parents = $('#' + group_id).parents(params.group_container).length - 1;

    // If the total_parents is less than 0, that group is at the root of the record
    if (total_parents >= 0) {
      // if there is more than one parent, we're going to traverse the currently displayed HTML to find the groups current parent:
      var group_parents = [];

      $('#' + group_id).parents(params.group_container).each(function () {
        group_parents.push({
          'group_id': $(this).attr('id').toLowerCase(),
          'group_occ': $(this).find(params.group_occurrence).first().text()
        });
      });

      // Now that we have a list of all of the group's parents, we need to get each parent group from the XML starting with the deepest ancestor.
      // We're going to do this until we either run out of parents, which will make `current_parent` equal to the XML group of the requested ID.
      // If a parent along the way doesn't exist, it will need to be created based on the last requested `current_parent` as the group parent.
      var current_parent = undefined;   // RL-2021-06-23
      for (var i = total_parents; i >= 0; i--) {
        if (typeof group_parents[i] !== 'undefined') {
          if (!record.getGroup(group_parents[i].group_id, group_parents[i].group_occ, current_parent)) {
            if (group_parents[i].group_occ > 1) {
              if (record.getGroup(group_parents[i].group_id, parseInt(group_parents[i].group_occ - 1), current_parent)) {
                current_parent = record.getGroup(group_parents[i].group_id, parseInt(group_parents[i].group_occ - 1), current_parent).parent();
              } else {
                console.log("SOMETHING WENT TERRIBLY WRONG!");
              }
            }
            record.addGroup(group_parents[i].group_id, group_parents[i].group_occ, current_parent, true); // RL-2020-12-21
          }
          current_parent = record.getGroup(group_parents[i].group_id, group_parents[i].group_occ, current_parent);
        }
      }

      return current_parent;

    } else {
      // returning undefined would let the getGroup() function use undefined, which sets the parent group to the root of the record
      return undefined;
    }
  };

  /*****
   **
   **  getGroupListParent : returns XML group field of HTML table tag or 'undefined'.
   **
   **  params:
   **    - group_mnemonic : String value representing the groups ID in the HTML table tag, eg: 'ACQ_SOURCE_GRP'
   **
   **  notes:
   **    - This is going to get the exact group (or repeating fields parent group) parent based on the currently displayed HTML
   **
   *****/
  this.getGroupListParent = function (grouplist_mnemonic, occurrence, caller_id, create_group)
  {
    var startup_group = null;
    var startup_group = this.getGroupParent(grouplist_mnemonic);
    if ( startup_group === false || startup_group === undefined ) {
      if ( caller_id != null && caller_id != '' ) {
        startup_group = this.getGroupParent(caller_id);
        if ( startup_group === false || startup_group === undefined ) {
          startup_group = null;
        }
      }
    }

    var grouplist = record.getGroup(grouplist_mnemonic.toLowerCase(), occurrence, startup_group);
    if ( grouplist === false || grouplist === undefined ) {
      if ( create_group ) {
        var addResult = record.addGroup(grouplist_mnemonic, occurrence, startup_group, true);
        if ( addResult === true ) {
          grouplist = record.getGroup(grouplist_mnemonic.toLowerCase(), occurrence, startup_group);
        }
      }
    }

    if ( grouplist === false || grouplist === undefined ) {
      grouplist = null;
    }

    return grouplist;
  }

  /*****
   **
   **  getTotalOccurrences : returns an integer value for the total amount of occurrences for a group or repeating field.
   **
   **  params:
   **    - id : String value representing a group, or repeating field's ID in the HTML, eg: 'ACQ_SOURCE_GRP'
   **
   *****/
  this.getTotalOccurrences = function (id) {
    if ( id == null || id == "" ) {
      return 1;
    }

    return record.getOccurrenceCount(id.toLowerCase(), app_interface.getGroupParent(id));
  }


  /*****
   **
   **  getCurrentOccurrence : returns an integer value for the currently displayed occurrences for a group or repeating field.
   **
   **  params:
   **    - id : String value representing a group, or repeating field's ID in the HTML, eg: 'ACQ_SOURCE_GRP'
   **
   *****/
  this.getCurrentOccurrence = function (id) {
    if ( id == null || id == "" ) {
      return 1;
    }

    var element_type = ($(params.form_container).find('#' + id).closest(params.r_field_container).length > 0) ? 'field' : 'group';

    if (element_type === 'field') {
      return parseInt($(params.form_container).find('#' + id).closest(params.r_field_container).find(params.r_field_occurrence).first().text());
    } else {
      return parseInt($(params.form_container).find('#' + id).find(params.group_occurrence).first().text());
    }
  }


  /*****
   **
   **  occurrenceExists : returns a boolean based on whether the occurrence is found or not.
   **
   **  params:
   **    - element_id : String value representing the groups ID in the HTML, eg: 'ACQ_SOURCE_GRP'
   **    - occurrence : String/Int value representing the desired group occurrence
   **
   *****/
  this.occurrenceExists = function (element_id, occurrence) {
    var element_type = ($(params.form_container).find('#' + element_id).closest(params.r_field_container).length > 0) ? 'field' : 'group';
    var parent_group = app_interface.getGroupParent(element_id);

    switch (element_type) {
      case 'group':
        if (record.getGroup(element_id.toLowerCase(), occurrence, parent_group)) {
          return true;
        } else {
          return false;
        }
        break;
      case 'field':
        if (record.getElement(element_id.toLowerCase(), occurrence, parent_group)) {
          return true;
        } else {
          return false;
        }
        break;
      default:
        return false;
    }
  }


  /*****
   **
   **  isRepeatingField : returns a boolean based on if the passed field_id represents a repeating field in the data
   **
   **  params:
   **    - field_id : String value representing a field's ID in the HTML, eg: 'ACCESSION_NUMBER'
   **
   *****/
  this.isRepeatingField = function (field_id) {
    return ($(field_id).parents(params.r_field_container).length > 0);
  };


  /*****
   **
   **  isInGroup : returns a boolean based on if the passed field_id is contained within a group or not
   **
   **  params:
   **    - element_id : String value representing a field's ID in the HTML, eg: '#ACCESSION_NUMBER'
   **
   *****/
  this.isInGroup = function (element_id) {
    return $(element_id).parents(params.group_container).length > 0;
  };

  /*****
   **
   **  groupIsPopulated : returns a boolean based on if there are any populated elements contained within `group_id`.
   **
   **  params:
   **    - group_id : String value representing a group's ID in the HTML, eg: 'ACQ_SOURCE_GRP'
   **
   *****/
  this.groupIsPopulated = function (group_id) {
    var populated_fields = 0;
    $('#' + group_id).find(':input').each(function () {
      if ($.trim($(this).val()).length > 0) {
        populated_fields++;
      }
    });

    // RL-2021-05-31 - count rich text filed
    $('#' + group_id).find('.richText').each(function () {
      if ( ($(this).html()).length > 0 ) {
        populated_fields++;
      }
    });

    if (populated_fields > 0) {
      return true;
    } else {
      return false;
    }
  };


  /*****
   **
   **  clearGroup : clears a group's HTML fields and occurrences.
   **
   **  params:
   **    - group_id : String value representing a group's ID in the HTML, eg: 'ACQ_SOURCE_GRP'
   **
   *****/
  this.clearGroup = function (group_id) {
    // rl-2020-09-29
    // check to see input file is read-only
    var readonly_field = false;
    if ( this.readonly_record ) {
      readonly_field = true;
    }
    else {
      readonly_field = checkReadOnly( 'body' );
    }

    $(params.form_container).find('#' + group_id).find(':input').each(function () {
      if ($(this).attr('type') === 'checkbox') {
        $(this).prop('checked', 'false');
      }
      $(this).val('');

      // RL-2020-09-29
      if ( readonly_field ) {
        if ( $(this).is("input") || $(this).is("textarea") ) {
          $(this).prop('readonly', true);
        }
        else {
          $(this).prop('disabled', true);
        }
      }
    });

    // RL-2021-05-31
    $(params.form_container).find('#' + group_id).find('.richText').each(function () {
      $(this).html('');

      if ( readonly_field ) {
        $(this).removeClass('disabled');
      }
      else {
        $(this).addClass('disabled');
      }
    });

    app_interface.resetOccurrences(group_id);
  }

  /*****
   **
   **  resetOccurrences : resets occurrences for a passed group or repeating field to '1'.
   **
   **  params:
   **    - element_id : String value representing a repeating field, or a group's ID in the HTML, eg: 'ACQ_SOURCE_GRP'
   **
   *****/
  this.resetOccurrences = function (element_id) {
    var element_type = ($(params.form_container).find('#' + element_id).closest(params.r_field_container).length > 0) ? 'field' : 'group';

    if (element_type === 'field') {
      var field = $(params.form_container).find('#' + element_id).closest(params.r_field_container);
      field.find(params.r_field_occurrence).first().text('1');
      field.find(params.r_field_total_occurrences).first().text('1');
    } else {
      var group = $(params.form_container).find('#' + element_id);
      group.find(params.group_occurrence).each(function () {
        $(this).text('1');
      });
      group.find(params.group_total_occurrences).each(function () {
        $(this).text('1');
      });
      group.find(params.r_field_occurrence).each(function () {
        $(this).text('1');
      });
      group.find(params.r_field_total_occurrences).each(function () {
        $(this).text('1');
      });
    }
  }



  /*****
   **
   **  handleImages : returns false if image is not present in the record, otherwise it will replace the placeholder
   **                 image with the first image in the record.
   **
   *****/
  this.handleImages = function () {
    // RL-2020-09-29
    var h_image = false;
    if ($(params.record_image).length > 0) {
      h_image = record.getPrimaryImage();
    }

    if ( h_image != false ) {
      // populate first image
      if ( h_image.image) {
        if (h_image.image.text().indexOf(params.image_virtual_directory) > -1) {
          h_image.image.text( h_image.image.text().replace(params.image_virtual_directory, params.image_url_path));
        }

        $(params.record_image).attr('src',  h_image.image.text());

        if ( h_image.caption) {
          $(params.record_image).attr('alt',  h_image.caption.text());
        } else {
          $(params.record_iamge).attr('alt', '');
        }

        h_image = false;
        if ($(params.record_image2).length > 0) {
          h_image = record.getSecondImage();
          if ( h_image != false ) {
            // populate second image
            if (h_image.image.text().indexOf(params.image_virtual_directory) > -1) {
              h_image.image.text( h_image.image.text().replace(params.image_virtual_directory, params.image_url_path));
            }

            $(params.record_image2).attr('src',  h_image.image.text());

            if ( h_image.caption) {
              $(params.record_image2).attr('alt',  h_image.caption.text());
            }
            else {
              $(params.record_iamge2).attr('alt', '');
            }
          }
        }
      }
      else {
        return false; // Image not present
      }
    }
    else {
      return false;
    }

    return true;
  };

  /*****
   **
   **  getPreviousGroupOccurrence : either populates the form with the previous occurrence of a group, or returns
   **                               false if the current group is the first group.
   **
   **  params:
   **    - calling_field : jQuery object representing the clicked link requesting the previous group occurrence
   **
   **  notes:
   **    - This will not be called internally, it is used by the outer-most application javascript file.
   **
   *****/
  this.getPreviousGroupOccurrence = function (calling_field) {
    var group_id = $(calling_field).closest(params.group_container).first().attr('id');
    var current_occurrence = parseInt($('#' + group_id).find(params.group_occurrence).first().text());

    if (current_occurrence > 1) {
      // RL-2021-05-31
      // if switch group, save rich text field within group field
      app_interface.switchGroupWithRichText(calling_field, true);

      app_interface.populateGroup(group_id, current_occurrence - 1);

      // RL-2021-05-31
      // if switch group, load rich text field within group field
      app_interface.switchGroupWithRichText(calling_field, false);

      if ($('#' + group_id).hasClass('contains_image')) {
        app_interface.updateImages($('#' + group_id).find('.file_attachment input').first().attr('id'));
      }
      else { // RL-2020-11-10
        if ($('#' + group_id).hasClass('has_image_holder')) {
          app_interface.updateImages($('#' + group_id).find('.file_attachment input').first().attr('id'));
        }
      }
    } else {
      return false;
    }
  };



  /*****
   **
   **  getNextGroupOccurrence : either populates the form with the next occurrence of a group, or returns
   **                           false if the current group is the last occurrence, and is empty.
   **
   **  params:
   **    - calling_field : jQuery object representing the clicked link requesting the previous group occurrence
   **
   **  notes:
   **    - This will not be called internally, it is used by the outer-most application javascript file.
   **
   *****/
  this.getNextGroupOccurrence = function (calling_field) {
    var group_id = $(calling_field).closest(params.group_container).first().attr('id');
    var current_occurrence = parseInt($('#' + group_id).find(params.group_occurrence).first().text());
    var total_occurrences = app_interface.getTotalOccurrences(group_id);

    if (current_occurrence < total_occurrences || (current_occurrence === total_occurrences && app_interface.groupIsPopulated(group_id))) {
      // RL-2021-05-31
      // if switch group, update rich text field within group field
      app_interface.switchGroupWithRichText(calling_field, true);

      app_interface.populateGroup(group_id, current_occurrence + 1);

      // RL-2021-05-31
      // if switch group, update rich text field within group field
      app_interface.switchGroupWithRichText(calling_field, false);

      if ($('#' + group_id).hasClass('contains_image')) {
        app_interface.updateImages($('#' + group_id).find('.file_attachment input').first().attr('id'));
      }
      else {   // RL-2020-11-10
        if ($('#' + group_id).hasClass('has_image_holder')) {
          app_interface.updateImages($('#' + group_id).find('.file_attachment input').first().attr('id'));
        }
      }
    }
    else {
      return false;
    }
  };



  /*****
   **
   **  getPreviousFieldOccurrence : either populates the form with the previous occurrence of a field, or returns
   **                               false if the current field is the first occurrence.
   **
   **  params:
   **    - calling_field : jQuery object representing the clicked link requesting the previous field occurrence
   **
   **  notes:
   **    - This will not be called internally, it is used by the outer-most application javascript file.
   **
   *****/
  this.getPreviousFieldOccurrence = function (calling_field) {
    var repeat_parent_field = $(calling_field).closest(params.r_field_container);
    if ( repeat_parent_field.length == 0 ) {
      return false;
    }
    var marc_field = false;
    var parent_field = repeat_parent_field.find('.marc_body');
    if ( parent_field.length == 0 ) {
      parent_field = repeat_parent_field;
    }
    else {
      marc_field = true;
    }

    var field_id = parent_field.find(':input').first().attr('id');
    var current_occurrence = parseInt(repeat_parent_field.find(params.r_field_occurrence).first().text());

    if (current_occurrence > 1) {
      app_interface.populateField(field_id, current_occurrence - 1, null, false); // RL-2021-05-31
    }
    else {
      return false;
    }
  };


  /*****
   **
   **  getNextFieldOccurrence : either populates the form with the next occurrence of a field, or returns false
   **                           if the current field is the last occurrence, and is empty (and not protected).
   **
   **  params:
   **    - calling_field : jQuery object representing the clicked link requesting the previous field occurrence
   **
   **  notes:
   **    - This will not be called internally, it is used by the outer-most application javascript file.
   **
   *****/
  this.getNextFieldOccurrence = function (calling_field) {
    var repeat_parent_field = $(calling_field).closest(params.r_field_container);
    if ( repeat_parent_field.length == 0 ) {
      return false;
    }
    var marc_field = false;
    var parent_field = repeat_parent_field.find('.marc_body');
    if ( parent_field.length == 0 ) {
      parent_field = repeat_parent_field;
    }
    else {
      marc_field = true;
    }

    var field_id = $(parent_field).find(':input').first().attr('id');
    var current_occurrence = parseInt(repeat_parent_field.find(params.r_field_occurrence).first().text());
    var total_occurrences = app_interface.getTotalOccurrences(field_id);

    if (current_occurrence < total_occurrences) {
      app_interface.populateField(field_id, current_occurrence + 1, null, false); // RL-2021-05-31
    }
    else {
      if ($('#' + field_id).val() !== "" && ($('#' + field_id).attr('readonly') !== 'readonly' || ($('#' + field_id).parents('.file_attachment').length > 0 || $('#' + field_id).parents('.validated_table').length > 0))) {
        repeat_parent_field.find(params.r_field_occurrence).first().text(current_occurrence + 1);
        repeat_parent_field.find(params.r_field_total_occurrences).first().text(total_occurrences + 1);
        $('#' + field_id).val('');
        if ( marc_field ) {
          set_marc_indicator ( field_id, "" );
        }
      }
      else {
        return false;
      }
    }
  };


  /*****
   **
   **  updateField : returns true if the record has been successfully updated with the new field value
   **
   **  params:
   **    - calling_field : jQuery object representing the form field which has been changed
   **
   **  notes:
   **    - This will not be called internally, it is used by the outer-most application javascript file.
   **
   *****/
   // RL-2021-5-31
  this.updateField = function (calling_field, richText) {
    var marc_indicator_value = "";
    var marc_field = false;
    var marc_indicator_field = false;
    var parent_node = null;
    var calling_field_id = calling_field.attr('id');  // RL-20211207
    if ( calling_field_id == null ) {   // RL-20211207
      calling_field_id = '';  // RL-20211207
      parent_node = calling_field.parent();
      if ( parent_node != null && parent_node.hasClass("marc_header") ) {
        marc_indicator_field = true;
        parent_node = parent_node.next();
        if ( parent_node != null && parent_node.hasClass("marc_body") ) {
          var marc_value = parent_node.find("textarea");
          if ( marc_value.length <= 0 ) {
            marc_value = parent_node.find("input[type=text]");
          }
          if ( marc_value.length > 0 ) {
            marc_indicator_value = calling_field.val();
            marc_field = true;
            calling_field = marc_value; // set MARC field in focus
          }
        }
      }
    }
    else {
      parent_node = calling_field.parent();
      if ( parent_node != null && parent_node.hasClass("marc_body") ) {
        if ( calling_field_id.indexOf("MARC__") == 0 ) {  // RL-20211207
          parent_node = parent_node.prev();
          if ( parent_node != null && parent_node.hasClass("marc_header") ) {
            var marc_indicator = parent_node.find("input[type=text]");
            if ( marc_indicator != null ) {
              marc_indicator_value = marc_indicator.val();
              marc_field = true;
            }
          }
        }
      }
    }

    if ( calling_field_id == '' && !marc_indicator_field ) {
      return;
    }

    var parent_group = null;
    if (calling_field.parents(params.group_container).length > 0) {
      parent_group = app_interface.getGroupParent(calling_field.attr('id'));

      // If this is false, a new group/occurrence must be created:
      if (!parent_group) {
        var new_group_id = calling_field.closest(params.group_container).attr('id');
        var new_group_occurrence = calling_field.closest(params.group_container).find(params.group_occurrence).first().text();
        var new_group_parent = calling_field.closest(params.group_container).parents(params.group_container).first();
        var new_group_parent_occ = new_group_parent.find(params.group_occurrence).first().text();

        if (new_group_parent.length === 0) {
          new_group_parent = undefined;
        }

        record.addGroup(new_group_id,
                        new_group_occurrence,
                        record.getGroup(new_group_parent.attr('id').toLowerCase(), new_group_parent_occ),
                        true); // RL-2020-12-21
        parent_group = app_interface.getGroupParent(calling_field.attr('id'));
      }
    }

    var occurrence = (app_interface.isRepeatingField('#' + calling_field.attr('id'))) ? calling_field.closest(params.r_field_container).find(params.r_field_occurrence).first().text() : '0';
    if ( occurrence == null || occurrence == "" ) {
      if ( marc_field ) {
        occurrence = "1";
      }
      else {
        occurrence = "0";
      }
    }
    var field_is_repeating = (parseInt(occurrence) > 0) ? true : false;
    var field = record.getElement(calling_field.attr('id').toLowerCase(), occurrence, parent_group);

    // RL-2021-5-31
    var field_value = '';
    if ( marc_field ) {
      field_value = $.trim(calling_field.val());  // RL-2021-09-15
      var  found_loc = field_value.indexOf("\u2021"); // search subfield delimiter
      if ( found_loc >= 0 ) {
        if ( found_loc > 0 )  {  // RL-20211207
          // take 1st and 2nd byte as marc indicator
          marc_indicator_value = field_value.substring(0, found_loc);
          if ( found_loc == 1 ) {
            marc_indicator_value = marc_indicator_value + ' ';
          }
        }
        field_value = marc_indicator_value + field_value.substring(found_loc);
      }
      else {
        field_value = marc_indicator_value;
      }
    }
    else {
      if ( typeof richText !== 'undefined' && richText == true ) {
        // extract HTML code
        field_value = $(calling_field).html();

        // escape HTML forbidden characters
        field_value = richTextEscape(field_value);
      }
      else {
        field_value = $.trim(calling_field.val());
      }
    }

    if (field) {
      record.updateElement(field, field_value);
    }
    else {
      record.addElement(calling_field.attr('id').toLowerCase(), field_value, field_is_repeating, parent_group);
    }
  };

  /*
    getGroupID : extracts the closest group ID.

    params:
      - calling_filed : jQuery object representing the element for repeating group.
  */

  this.getGroupID = function ( calling_field ) {
    var result = '';

    result = $(calling_field).closest(params.group_container).attr('id');
    if ( typeof result == 'undefined' ) {
      result = '';
    }

    return result;
  }


  /*****
   **
   **  contextMenu : creates and displays an HTML menu for selecting tasks for repeating groups and fields (move/remove occurrences)
   **
   **  params:
   **    - calling_field : jQuery object representing the element which has called for the context menu to be displayed over.
   **
   **  notes:
   **    - This will not be called internally, it is used by the outer-most application javascript file.
   **    - If the context menu does not exist in the HTML, it will be created.
   **
   *****/
  this.contextMenu = function (calling_field, mouse_position) {
    if (!calling_field.hasClass('relative')) calling_field.addClass('relative');

    var field_type = (calling_field.closest(params.r_field_container).length > 0) ? 'field' : 'group';
    var element_id = (field_type === 'field') ? calling_field.attr('id') : element_id = calling_field.closest(params.group_container).first().attr('id');
    var current_occurrence = app_interface.getCurrentOccurrence(element_id);
    var total_occurrences = app_interface.getTotalOccurrences(element_id);
    var html_overlay = $('<div id="' + params.overlay.split('#').pop() + '"/>');

    var createContextMenu = function () {
      var context_menu_type = params.context_menu.split('#').shift();
      var context_menu_name = params.context_menu.split('#').pop();
      var built_context_menu = $("<" + context_menu_type + " id='" + context_menu_name + "'/>");

      $('body').append(built_context_menu);
      return $('body').find(params.context_menu);
    };

    var setupContextMenu = function (context_menu) {
      context_menu.attr('data-current_occ', current_occurrence);
      context_menu.attr('data-total_occ', total_occurrences);
      context_menu.attr('data-element', element_id);
      context_menu.attr('data-fld_type', field_type);
      context_menu.append($('<li id="move_occ"><a href="#">Move Occurrence</a></li>'));
      context_menu.append($('<li id="remove_occ"><a href="#">Remove Occurrence</a></li>'));
      context_menu.append($('<li id="first_occ"><a href="#">First Occurrence</a></li>'));  // RL-2021-05-31
      context_menu.append($('<li id="last_occ"><a href="#">Last Occurrence</a></li>'));
      context_menu.append($('<li id="new_occ"><a href="#">New Occurrence</a></li>'));
      context_menu.append($('<li id="close_menu"><a href="#">Close Menu</a></li>'));
      context_menu.css({
        'top': mouse_position.y,
        'left': mouse_position.x,
        'z-index': '99999'
      });

      $('body').append(html_overlay);
      context_menu.show('100');
    };

    // RL-2021-05-31 - NOMNEU option is set in setupGroupList function in frontend.js
    var nomenu = false;
    var h_field = $(calling_field).parent().data('NOMENU');
    if ( typeof h_field == 'Y' ) {
      nomenu = true;
    }
    else {
      if ( (calling_field).parent().hasClass('single_occ') ) {  // RL-20230125
        nomenu = true;
      }
    }
    if ( !nomenu ) {
      var repeating_menu = $(params.context_menu);
      var context_menu = (repeating_menu.length === 0) ? createContextMenu() : $('body').find(params.context_menu);
      if ( !is_contextmenu_open ) {   // MH-20230131
        setupContextMenu(context_menu);
        is_contextmenu_open = true;   // MH-20230131
      } // MH-20230131
    }

  };

  /*****
   **
   **  clearContextMenu : removes a previously displayed context menu from the DOM
   **
   **  params:
   **    - calling_field : jQuery object representing the element which has called for the context menu to be removed.
   **
   **  notes:
   **    - This will not be called internally, it is used by the outer-most application javascript file.
   **
   *****/
  this.clearContextMenu = function (calling_field) {
    var context_menu = $('body').find(params.context_menu);
    context_menu.hide('100');
    $(params.overlay).hide('100').remove();
    context_menu.remove();
	is_contextmenu_open = false;   // RL-20230314 - turn off context menu flag
    if (calling_field.hasClass('relative')) calling_field.removeClass('relative');
  };


  /*****
   **
   **  removeOccurrence : removes an occurrence of a field or group from the XML and from the HTML
   **
   **  params:
   **    - calling_field : jQuery object representing the element which has called for the occurrence to be removed.
   **
   **  notes:
   **    - This will not be called internally, it is used by the outer-most application javascript file.
   **    - If the context menu does not exist in the HTML, it will be created.
   **
   *****/
  this.removeOccurrence = function (calling_field) {
    var context_menu = calling_field.parents(params.context_menu).first();
    var current_occurrence = context_menu.data('current_occ');
    var total_occurrences = context_menu.data('total_occ');
    var field_type = context_menu.data('fld_type');
    var element_id = context_menu.data('element');
    var element_xml_id = element_id.toLowerCase();
    var group_parent = app_interface.getGroupParent(element_id);
    var populate, remove, clearOccurrence, occurrence;

    app_interface.ignore_mandatory_check = true;  // RL-202109-15 - turn off mandatory check

    if (field_type === 'group') {
      populate = 'app_interface.populateGroup';
      removeOccurrence = 'record.removeGroupOccurrence';
      clearOccurrence = 'app_interface.clearGroup(element_id)';
      occurrence = record.getGroup(element_xml_id, current_occurrence, group_parent);
    }
    else {
      populate = 'app_interface.populateField';
      removeOccurrence = 'record.removeElement';
      clearOccurrence = '$("#" + element_id).val("")';
      occurrence = record.getElement(element_xml_id, current_occurrence, group_parent);
    }

    if (app_interface.occurrenceExists(element_id, current_occurrence)) {
      eval(removeOccurrence + '(occurrence)');
      record.sortOccurrences(element_xml_id, group_parent);

      if (current_occurrence === total_occurrences && total_occurrences > 1) {
        eval(populate + '(element_id, parseInt(current_occurrence) - 1, null, false)'); // RL-2021-05-31
      }
      else if (app_interface.occurrenceExists(element_id, current_occurrence)) {
        eval(populate + '(element_id, current_occurrence, null, false)');  // RL-2021-05-31
      }
      else {
        eval(clearOccurrence);
      }
      app_interface.ignore_mandatory_check = false;  // RL-202109-15 - turn on mandatory check

      // RL-2020-12-21
      if (field_type === 'group' && $(params.record_image).length > -1) {
        if ($(params.contains_image).length > -1) {
          $(params.contains_image).each(function () {
            app_interface.updateImages($(this));
          });
        }

        // RL-2020-11-10
        if ($(params.has_image_holder).length > -1) {
          $(params.has_image_holder).each(function () {
            app_interface.updateImages($(this));
          });
        }

        app_interface.handleImages();
      }
    }
    else {
      app_interface.ignore_mandatory_check = false;  // RL-202109-15 - turn on mandatory check
      return false;
    }
  };


  /*****
   **
   **  moveOccurrence :
   **
   **  params:
   **    - calling_field : jQuery object representing the element which has called for the occurrence to be moved.
   **
   **  notes:
   **    - This will not be called internally, it is used by the outer-most application javascript file.
   **    - If the context menu does not exist in the HTML, it will be created.
   **
   *****/
  this.moveOccurrence = function (calling_field) {
    var new_occurrence;
    var context_menu = calling_field.parents(params.context_menu).first();
    var current_occurrence = context_menu.data('current_occ');
    var total_occurrences = context_menu.data('total_occ');
    var field_type = context_menu.data('fld_type');
    var element_id = context_menu.data('element');
    var element_xml_id = element_id.toLowerCase();
    var group_parent = app_interface.getGroupParent(element_id);
    var skip_move = false;
    var occnum = 0;

    do {
      new_occurrence = prompt('Enter a new position for this occurrence: ');
      // RL-2020-12-21
      if ( new_occurrence == null ) {
        skip_move = true;
        break;
      }
      var valid_occurrence = false;
      if ( !isNaN(new_occurrence) ) {
        occnum = parseInt(new_occurrence, 10);
        if ( occnum > 0 && occnum <= total_occurrences ) {
          valid_occurrence = true;
        }
      }

      if (!valid_occurrence) {
        alert("You've entered an invalid occurrence number.  Please try again.");
      }
    } while (!valid_occurrence);

    // RL-2020-12-21
    if ( !skip_move && occnum != current_occurrence ) {
      if (field_type === 'group') {
        var group = record.getGroup(element_xml_id, current_occurrence, group_parent);
        record.moveOccurrence(group, new_occurrence);
      } else {
        var element = record.getElement(element_xml_id, current_occurrence, group_parent);
        record.moveOccurrence(element, new_occurrence);
      }

      record.sortOccurrences(element_xml_id, group_parent);

      if (field_type === 'group') {
        app_interface.populateGroup(element_id, new_occurrence);

        // RL-2020-12-21
        if ($(params.record_image).length > -1) {
          if ($(params.contains_image).length > -1) {
            $(params.contains_image).each(function () {
              app_interface.updateImages($(this));
            });
          }

          // RL-2020-11-10
          if ($(params.has_image_holder).length > -1) {
            $(params.has_image_holder).each(function () {
              app_interface.updateImages($(this));
            });
          }

          app_interface.handleImages();
        }
      }
      else {
        app_interface.populateField(element_id, new_occurrence, null, false); // RL-2021-05-31
      }
    }
  };



  /**
   **  getValidatedTable : handles loading validated table records into the currently-being-edited record.
   **/
  this.getValidatedTable = function (calling_field) {
    // RL-20211207
    var has_data_key = false;
    var database = $(calling_field).data('key');
    if ( typeof database == 'undefined' || database == '' ) {
      if ( calling_field.attr('class').indexOf('load ')== 0 // RL-20221221
      ||   calling_field.attr('class') == 'load' ) {
        database = '';
      }
      else {
        database = calling_field.attr('class').split('load_').pop();
      }
    }
    else {
      has_data_key = true;
    }
    if (typeof database == 'undefined') {
      return false;
    }

    // RL-2020-09-29
    var formdata = $(calling_field).parents('.field_container').first().data('formfield');
    if ( formdata == null ) {
      formdata = 'N';
    }
    else {
      formdata = formdata.toUpperCase();
    }

    // rl-changed-20200511
    var class_name = '';   // RL-20211207

    // RL-20211207
    if ( has_data_key ) {
      class_name = 'load_' + database;
    }
    else {
      class_name = calling_field.context.className;
      if ( typeof class_name == 'undefined' ) {
        class_name = "";
      }
    }

    // calculate modal window width/height - RL-2021-02-04
    var dialog_width = window.innerWidth - 8; // leave spaces in left and right margin
    var dialog_height = window.innerHeight - 13; // leave spaces in top and bottom margin

    // RL-20211207
    var upload_file = false;   // RL-20221221
    var map;
    if ( has_data_key ) {
      map = eval('record.params.maps.' + $(calling_field).data('map'));
    }
    else {
      map = null;

      // RL-2021-05-31
      var mapName = 'map';
      var caller_map = null;

      var className = $(calling_field).attr('class');
      if ( className != null ) {
        if ( className.indexOf('load_') == 0 ) {
          var suffix = className.substring(5);
          if ( suffix != null ) {
            if ( $(calling_field).parents('.field_container').first().data('map-' + suffix) != undefined ) {
              mapName = 'map-' + suffix;
            }
          }
        }
        else if ( className == 'load' || className.indexOf('load ') == 0 ) {   // RL-20221221
          upload_file = true;
        }
      }

      if ( !upload_file ) {
        caller_map = $(calling_field).parents('.field_container').first().data(mapName);   // RL-2021-05-31
        map = eval('record.params.maps.' + caller_map);
      }
    }

    // RL-202112076
    var calling_element_id;
    var  x = calling_field.parents('div.field_container').find(':input');
    if ( x.length == 0 ) {
      calling_element_id = '';
    }
    else if ( x.length == 1 ) {
      calling_element_id = $(x).first().attr('id');
    }
    else {
      if ( $(x[0]).parent().hasClass('marc_header') ) {
        calling_element_id = $(x[1]).attr('id');
      }
      else {
        calling_element_id = $(x).first().attr('id');  // RL-20211231
      }
    }

    var parent_group_id = '';   // RL-202112076
    var parent_group_occurrence = '1';   // RL-202112076
    var parent_group = app_interface.getGroupParent(calling_element_id, true);

    /**
     * Mike Hoang MK-20230120
     * Added these values for repeating field check and current occurence number
     *
     * if is_repeating_field is false then current occurence has
     * a default value of 1
     */
    let field_div = calling_field.closest("div")
    let is_repeating_field = field_div.hasClass("repeating_field");
    let current_occurrence = is_repeating_field ? field_div.find(".current_occurrence").text() : 1;

    if (typeof parent_group !== 'undefined') {
      parent_group_id = parent_group.parent().prop('tagName').toUpperCase();
      parent_group_occurrence = parent_group.attr('occ');
    }
    // rl changed-20200511
    if ( !upload_file ) {   // RL-20221221
      // if upload, do not create colorbox because it is created in the upLoadFile method
      // RL-2020-09-29
      $record = record;  // RL-2021-02-27
      $map = map;  // RL-2021-02-27
      $parent_field_id = parent_group_id;   // RL-2021-02-27
      $tmp_data = [];
      $is_done = false;
      $multi_selection = false;  // it indicates multi validation records are selected // RL-20211201
      // RL-2021-03-28 - this var indciates authority record is added dynamically.
      // It is set by the javascript code in the dataentry confirmation page
      $added_record = false;
      var url = params.base_url + eval('params.valtable_query_links.' + database) + "&KEEP_HOME_SESS=Y";
      $.colorbox({
        iframe: true,
        href: url,
        width: dialog_width,
        height: dialog_height,
        onOpen: function(){   // RL-2021-05-31
          $('body').css({ overflow: 'hidden' });
        },
        onCleanup: function () {
          if (typeof $tmp_data !== 'undefined' && $tmp_data.length > 0 ) {   // RL-20211207
            // RL-2020-09-29
            if ( formdata == 'Y' ) {
              record.recordToForm($tmp_data, map);
            }
            else {
              if ( $multi_selection ) {
                // RL-2021-03-28 - save dynamic added authority record
                if ( $added_record ) {
                  record.remap($tmp_data, map, parent_group);
                  app_interface.populateGroup( parent_group_id, parent_group_occurrence );
                }
                else if($is_done){
                  $tmp_data.map((el, index) => {
                    if (index === 0) {
                      record.remap(el, map, parent_group);
                      app_interface.populateGroup(
                        parent_group_id,
                        parent_group_occurrence
                      );
                    }
                    else {
                      let num_occ = record.getOccurrenceCount( parent_group_id, null );

                      while (parent_group_occurrence <= num_occ) {
                        app_interface.populateGroup(
                          parent_group_id,
                          parent_group_occurrence
                        );
                        $(".next").click();
                        parent_group = app_interface.getGroupParent( calling_element_id, true );
                        if (typeof parent_group !== "undefined") {
                          parent_group_id = parent_group
                            .parent()
                            .prop("tagName")
                            .toUpperCase();
                          parent_group_occurrence = parent_group.attr("occ");
                        }
                      }
                      record.remap(el, map, parent_group);
                      app_interface.populateGroup( parent_group_id, parent_group_occurrence );

                      console.log(parent_group, parent_group_occurrence);
                    }
                  });
                }
              }
              else {
                // MK-20230120 - handle repeatable field
                if ( is_repeating_field ) {
                    record.remap($tmp_data, map, parent_group, is_repeating_field, current_occurrence);
                } else {
                    record.remap($tmp_data, map, parent_group);
                }
              }
            }
          }
        },
        onClosed: function () {
          if ( $multi_selection ) {
            sessionStorage.removeItem("pagination_checker");
          }

          if ( formdata != 'Y' ) {  // RL-20220420
            if (typeof parent_group !== 'undefined') {
              app_interface.populateGroup(parent_group_id, parent_group_occurrence);
            }
            else {
              app_interface.populateField(calling_element_id, current_occurrence, null, false); // RL-2021-05-31 MK-20230120

              // populate top-level elementary fields in web form // RL-20211025
              for ( var i = 0 ; i < map.length ; i++ ) {
                var tmp_key = map[i].key;
                var tmp_val = map[i].value.toUpperCase();
                if ( calling_element_id != tmp_val ) {
                  app_interface.populateField(tmp_val, current_occurrence, null, false);  // RL-20211025 MK-20230120
                }
              }
            }
          }

          delete $record;  // RL-2021-02-27
          delete $map;  // RL-2021-02-27
          delete $parent_field_id; // RL-2021-02-27
          delete $tmp_data;
          delete $is_done;
          delete $added_record;   // RL-2021-03-28
          delete $multi_selection;  // RL-20211201
          $('body').css({ overflow: '' });  // RL-2021-05-31

        }
      });
    }
  }


  // RL-2021-05-31
  /*****
   **
   **  moveOccurrence :
   **
   **  params:
   **    - calling_field : jQuery object representing the element which has called for the occurrence to be moved.
   **
   **  notes:
   **    - This will not be called internally, it is used by the outer-most application javascript file.
   **    - If the context menu does not exist in the HTML, it will be created.
   **
   *****/
  this.moveOccurrence = function (calling_field) {
    var new_occurrence;
    var context_menu = calling_field.parents(params.context_menu).first();
    var current_occurrence = context_menu.data('current_occ');
    var total_occurrences = context_menu.data('total_occ');
    var field_type = context_menu.data('fld_type');
    var element_id = context_menu.data('element');
    var element_xml_id = element_id.toLowerCase();
    var group_parent = app_interface.getGroupParent(element_id);
    var skip_move = false;
    var occnum = 0;

    do {
      new_occurrence = prompt('Enter a new position for this occurrence: ');
      // RL-2020-12-21
      if ( new_occurrence == null ) {
        skip_move = true;
        break;
      }
      var valid_occurrence = false;
      if ( !isNaN(new_occurrence) ) {
        occnum = parseInt(new_occurrence, 10);
        if ( occnum > 0 && occnum <= total_occurrences ) {
          valid_occurrence = true;
        }
      }

      if (!valid_occurrence) {
        alert("You've entered an invalid occurrence number.  Please try again.");
      }
    } while (!valid_occurrence);

    // RL-2020-12-21
    if ( !skip_move && occnum != current_occurrence ) {
      if (field_type === 'group') {
        var group = record.getGroup(element_xml_id, current_occurrence, group_parent);
        record.moveOccurrence(group, new_occurrence);
      } else {
        var element = record.getElement(element_xml_id, current_occurrence, group_parent);
        record.moveOccurrence(element, new_occurrence);
      }

      record.sortOccurrences(element_xml_id, group_parent);

      if (field_type === 'group') {
        app_interface.populateGroup(element_id, new_occurrence);

        // RL-2020-12-21
        if ($(params.record_image).length > -1) {
          if ($(params.contains_image).length > -1) {
            $(params.contains_image).each(function () {
              app_interface.updateImages($(this));
            });
          }

          // RL-2020-11-10
          if ($(params.has_image_holder).length > -1) {
            $(params.has_image_holder).each(function () {
              app_interface.updateImages($(this));
            });
          }

          app_interface.handleImages();
        }
      }
      else {
        app_interface.populateField(element_id, new_occurrence, null, false);  // RL-2021-05-31
      }
    }
  };


  /*****
   **
   **  firstOccurrence :
   **
   **  params:
   **    - calling_field : either populates the form with the first occurrence of a group, or returns
   **                           false if the group has one ocurrence.
   **
   **  notes:
   **    - This will not be called internally, it is used by the outer-most application javascript file.
   **    - If the context menu does not exist in the HTML, it will be created.
   **
   *****/
  this.firstOccurrence = function (calling_field, occ_info) {
    // RL-20220601
    var current_occurrence;
    var total_occurrences;
    var field_type;
    var element_id;
    if ( typeof occ_info == 'undefined' ) {
      context_menu = calling_field.parents(params.context_menu).first();
      current_occurrence = context_menu.data('current_occ');
      total_occurrences = context_menu.data('total_occ');
      field_type = context_menu.data('fld_type');
      element_id = context_menu.data('element');
    }
    else {
      current_occurrence = occ_info.current_occ;
      total_occurrences = occ_info.total_occ;
      field_type = occ_info.fld_type;
      element_id = occ_info.element;
    }

    if (field_type === 'group') {
      var group_id = element_id;

      if (current_occurrence > 1 ) {
        app_interface.populateGroup(group_id, 1);

        if ($('#' + group_id).hasClass('contains_image')) {
          app_interface.updateImages($('#' + group_id).find('.file_attachment input').first().attr('id'));
        }
        else {
          if ($('#' + group_id).hasClass('has_image_holder')) {
            app_interface.updateImages($('#' + group_id).find('.file_attachment input').first().attr('id'));
          }
        }
      }
      else {
        return false;
      }
    }
    else {
      app_interface.populateField(element_id, 1, null, false); // RL-2021-05-31
    }
  };


  /*****
   **
   **  lastOccurrence :
   **
   **  params:
   **    - calling_field : either populates the form with the last occurrence of a group, or returns
   **                      false if the group has one ocurrence or the last group is always shown.
   **
   **  notes:
   **    - This will not be called internally, it is used by the outer-most application javascript file.
   **    - If the context menu does not exist in the HTML, it will be created.
   **
   *****/
  this.lastOccurrence = function (calling_field, occ_info) {
    // RL-20220601
    var current_occurrence;
    var total_occurrences;
    var field_type;
    var element_id;
    if ( typeof occ_info == 'undefined' ) {
      context_menu = calling_field.parents(params.context_menu).first();
      current_occurrence = context_menu.data('current_occ');
      total_occurrences = context_menu.data('total_occ');
      field_type = context_menu.data('fld_type');
      element_id = context_menu.data('element');
    }
    else {
      current_occurrence = occ_info.current_occ;
      total_occurrences = occ_info.total_occ;
      field_type = occ_info.fld_type;
      element_id = occ_info.element;
    }

    if (field_type === 'group') {
      var group_id = element_id;
      if ( current_occurrence < total_occurrences ) {
        app_interface.populateGroup(group_id, total_occurrences);
        if ( total_occurrences > 1 && !app_interface.groupIsPopulated(group_id) ) {
          // If last occurrence is empty, try previous group
          app_interface.populateGroup(group_id, total_occurrences-1);
        }

        if ($('#' + group_id).hasClass('contains_image')) {
          app_interface.updateImages($('#' + group_id).find('.file_attachment input').first().attr('id'));
        }
        else {
          if ($('#' + group_id).hasClass('has_image_holder')) {
            app_interface.updateImages($('#' + group_id).find('.file_attachment input').first().attr('id'));
          }
        }
      }
      else {
        return false;
      }
    }
    else {
      app_interface.populateField(element_id, total_occurrences, null, false); // RL-2021-05-31
    }
  };


  /*****
   **
   **  newOccurrence :
   **
   **  params:
   **    - calling_field : either populates the form with the new occurrence of a group, or returns
   **                      false if the last group is empty.
   **
   **  notes:
   **    - This will not be called internally, it is used by the outer-most application javascript file.
   **    - If the context menu does not exist in the HTML, it will be created.
   **
   *****/
  this.newOccurrence = function (calling_field, occ_info) {
    // RL-20220601
    var current_occurrence;
    var total_occurrences;
    var field_type;
    var element_id;
    if ( typeof occ_info == 'undefined' ) {
      context_menu = calling_field.parents(params.context_menu).first();
      current_occurrence = context_menu.data('current_occ');
      total_occurrences = context_menu.data('total_occ');
      field_type = context_menu.data('fld_type');
      element_id = context_menu.data('element');
    }
    else {
      current_occurrence = occ_info.current_occ;
      total_occurrences = occ_info.total_occ;
      field_type = occ_info.fld_type;
      element_id = occ_info.element;
    }

    if (field_type === 'group') {
      var group_id = element_id;
      if ( current_occurrence <= total_occurrences ) {
        app_interface.populateGroup(group_id, total_occurrences+1);

        if ($('#' + group_id).hasClass('contains_image')) {
          app_interface.updateImages($('#' + group_id).find('.file_attachment input').first().attr('id'));
        }
        else {
          if ($('#' + group_id).hasClass('has_image_holder')) {
            app_interface.updateImages($('#' + group_id).find('.file_attachment input').first().attr('id'));
          }
        }
      }
      else {
        return false;
      }
    }
    else {
      app_interface.populateField(element_id, total_occurrences+1, null, false); // RL-2021-05-31
    }
  };
  // RL-2021-05-31

  /**
   **  loadExternalLink : handles launching media and external links.
   **/
  this.loadExternalLink = function (calling_field) {
    var caller_value = $(calling_field).parents('.field_container').first().find('input[type=text]').val();
    if (caller_value.indexOf(params.image_virtual_directory) > -1) {
      caller_value = caller_value.replace(params.image_virtual_directory, params.image_url_path);
    }

    window.open(caller_value);
  };

  /**
   **  loadValidatedTableRecord : handles loading in validated table records based on their unique ID.
   **/
  this.loadValidatedTableRecord = function (calling_field, passed_dbname, passed_key, db_parm) {  // RL-2021-05-31
    // RL-20211207
    var has_data_key = false;
    var database = '';
    if ( typeof passed_dbname == 'undefined' ) {  // RL-2021-05-31
      database = $(calling_field).data('key');
      if ( typeof database == 'undefined' || database == '' ) {
        database = calling_field.attr('class').split('view_').pop();  // RL-20211231
      }
      else {
        has_data_key = true;
      }
      if (typeof database == 'undefined') {
        return false;
      }
    }
    else {
      database = passed_dbname;  // RL-2021-05-31
    }
    var field_id;

    if (typeof database == 'undefined') {
      return false;
    } else if (database === 'link' || database.indexOf('link__') == 0) { // RL-2021102
      app_interface.loadExternalLink(calling_field);
      return false;
    }

    var source_key = $(calling_field).data('source');
    if ( typeof source_key === 'undefined' ) {
      source_key = '';
    }

    var url = '';
    if ( db_parm == null || db_parm == '' ) {
      url = params.base_url + eval('params.valtable_view_links.' + database);
    }
    else {
      url = params.base_url + db_parm;
  }

    if ( typeof passed_key != 'undefined' ) { // RL-2021-05-31
      field_id = passed_key;
    }
    else {
      // RL-20211207
      if ( source_key != '' ) {
        var parent_id = $(calling_field).data('parent');
        if ( typeof parent_id === 'undefined' ) {
          parent_id = '';
        }

        // extract sourc key value
        field_id = getXmLRecordFieldValue ( source_key, parent_id );
      }
      else {
        var search_by_name = false;
        if ($(calling_field).hasClass('view_by_name') || database === 'loc' || database =='m2a' || database =='acc'
        ||  database == 'acc_valtab' || database == 'lib' || database == 'reprod'
        ||  database == 'col_valtab' ) {  // RL-2021-03-28
          search_by_name = true;
        }

        if ( has_data_key ) {
          if (search_by_name) {
            field_id = $.trim(calling_field.parents(params.marc_browse_field_container).first().find('div.marc_body input[type=text]').first().val());
          }
          else {
            field_id = $.trim(calling_field.parents(params.marc_browse_field_container).first().find('div.marc_body input[id$=_ID]').first().val());
          }
        }
        else {
          if (search_by_name) {
            field_id = $.trim(calling_field.parents(params.browse_field_container).first().find('input[type=text]').first().val());
          }
          else {
            field_id = $.trim(calling_field.parents(params.browse_field_container).first().find('input[id$=_ID]').first().val());
            if ( field_id == '' ) {
              field_id = $.trim(calling_field.parents(params.browse_field_container).first().find('input[id$=_NO]').first().val());
            }
          }
        }
      }
    }

    // If no ID is present, don't load a colorbox that's going to fail:
    if (field_id.length > 0) {
      url += escapeUrlchars(field_id);   // RL-20230107
    } else {
      return false;
    }

    url += "?COMMANDSEARCH";

    // RL-2021-05-31
    // calculate modal window width/height
    var dialog_width = window.innerWidth - 8; // leave spaces in left and right margin
    var dialog_height = window.innerHeight - 13; // leave spaces in top and bottom margin

    $.colorbox({
      iframe: true,
      href: url,
      width: dialog_width,
      height: dialog_height,
      onOpen: function(){   // RL-2021-05-31
        $('body').css({ overflow: 'hidden' });
      },
      onClosed: function () {
        $('body').css({ overflow: '' });  // RL-2021-05-31
      }
    });
  };



  /*
    Validated Table Fields

    - Fields coming from a validated list which don't have full online data entry capabilities are
      pulled up in the same way as form "browse" buttons in query forms.

    - The user clicks on the field which is linked to a validated table, and a browse window pops
      up, allowing them to click on the value they would like to enter, and then the value populates
      the field in the record.

    - In the HTML forms, two new attributes are added to the fields,  data-val-database, and
      data-val-field.

    - data-val-database contains the database name of the validated field (ie VAL_USER)

    - data-val-field contains the name of the validated field in the database (ie LOOKUP_FIELD).
  */
  this.loadValidatedTableField = function (calling_field) {
    if ($(calling_field).hasClass('browse_trigger')) {
      target_field = calling_field.parents('.validated_table').find('input[type=text]').first();
    } else {
      target_field = calling_field;
    }
    var calling_database = target_field.data('val-database');
    var val_field = target_field.data('val-field');
    var title = target_field.siblings('label').first().text();
    var repeating = app_interface.isRepeatingField(target_field.attr('id'));
    // RL-2021-05-31
    var dialog_width = window.innerWidth - 8; // leave spaces in left and right margin
    var dialog_height = window.innerHeight - 13;  // leave spaces in top and bottom margin


    $(calling_field).colorbox({
      href: function () {
        return params.sessid + "/FIRST?INDEXLIST&WINDOW=" + name + "&DATABASE=" + calling_database + "&KEYNAME=" + val_field + "&TITLE=" + title;
      },
      transition: "elastic",
      iframe: true,
      width: dialog_width,  // RL-2021-05-31
      height: dialog_height,  // RL-2021-05-31
      onClosed: function () {
        if (typeof tmp_val !== 'undefined') {
          $(target_field).val(tmp_val);
          app_interface.updateField($(target_field));
          $(target_field).change();  // RL-202-07-04
		  tmp_val = undefined;  // RL-20230223
        } 
      }
    });
  };


  // RL-2020-11-10

  /**
   **  deleteTDRBookmark - remove TDR bookmark
   **/
  this.deleteTDRBookmark = function (bookmark_id) {
    // get access token
    var token_result = app_interface.getAccessToken();
    var delete_ok = 0;

    if ( Object.keys(token_result).length > 0 ) {
      var token_type = token_result["token_type"];
      var access_token = token_result["access_token"];

      if ( access_token != null && token_type != null ) {
        var bookmark_url = app_config.tdr_parms.tdr_api +
                           app_config.tdr_parms.delete_bookmark_ep +
                           "/" + bookmark_id;
        var request_headers = { };
        request_headers["Authorization"] = token_type + " " + access_token;
        request_headers["Content-Type"] = "application/x-www-form-urlencoded";
        request_headers["Accept"] = "application/json";

        // send request to delete TDR bookmark
        $.ajax({
          async: false,
          type: "delete",
          dataType: "json",
          headers: request_headers,
          url: bookmark_url,
          success: function (data) {
            delete_ok = 1;
          },
          error: function (xhr, status, error) {
            delete_ok = -1;
          }
        });
      }
    }
  }

  /**
   **  setImagefield - save image path to field of record object
   **/
  this.setImagefield = function (image_path, thumbnail_image_path, calling_field) {
    if (calling_field.parents('div.file_attachment').length > 0) {
      // add image field inside image grouped field structure
      if ( typeof image_path != 'undefined' ) {
        var calling_element = $(calling_field).parents('div.file_attachment').find('input[type=text]').first();
        calling_element.val(image_path);
        calling_element.change();
      }
    }
    else {
      // add image field without image grouped field structure
      var repeating = true;
      if ( !params.hasOwnProperty('image_group_repeating')
      ||   params.image_group_repeating.toUpperCase() != 'Y' ) {
        repeating = false;
      }

      // primary record image
      if (!record.getGroup(params.image_group, 1)) {
        record.addGroup(params.image_group, 1, null, repeating);
      }

      var has_thumbnail = true;
      if ( thumbnail_image_path == null ) {
        thumbnail_image_path = image_path;
        has_thumbnail = false;
      }

      var image_occ_group = record.getGroup(params.image_group, 1);  // <group_name occ="1">
      var image_group = image_occ_group.parent();                    // <group_name>
      var image_element = record.getElement(image_mnemonic, 1, image_group);
      if (image_element && image_element.length > 0) {
        record.updateElement(image_element, thumbnail_image_path, 1);
      }
      else {
        record.addElement(image_mnemonic, thumbnail_image_path, false, image_occ_group);
      }
      if ( has_thumbnail ) {
        // add access path
        image_element = record.getElement(image_mnemonic, 1, image_group);
        if (image_element && image_element.length > 0) {
          record.updateElement(image_element, image_path, 1);
        }
        else {
          record.addElement(image_mnemonic, image_path, false, image_occ_group);
        }
      }
    }
  }

  /**
   **  setAllImagefield - save image property fields to field of record object
   **/
  this.setAllImagefield = function (data_group, calling_field, first_instance ) {
    var ix = 0;
    var media_type = "Image Reference";
    var group_fieldset = null;
    var fieldsets = $(calling_field).parents('fieldset');
    if ( fieldsets.length > 0 ) {
      // RL-2021-05-31
      group_fieldset = $(calling_field).parents('div')[0];
      var tdr_map = $(group_fieldset).attr('data-tdr-map');
      if ( typeof tdr_map != 'undefined' ) {
        media_type = tdr_map;
      }
      else {
        group_fieldset = $(fieldsets)[0];
        if ( $(group_fieldset).hasClass('logical_group') && fieldsets.length > 1 ) {
          // skip logical group - RL20220105
          group_fieldset = $(fieldsets)[1];
        }
        if ( $(group_fieldset).data('group-title') != null ) {
          media_type = $(group_fieldset).data('group-title');
        }
      }
    }

    // RL-20211331
    if ( typeof params.tdr_map[media_type] == 'undefined' ) {
      alert ( 'TDR file path is not saved because TDR map "' + media_type + '" is missing.' );
    }
    else {
      if ( first_instance ) {
        if (calling_field.parents('div.file_attachment').length > 0) {
          // add image field inside image grouped field structure
          for ( ix = 0 ; ix < params.tdr_map[media_type].map.length ; ix++ ) {
            var from_field_value = data_group[params.tdr_map[media_type].map[ix].Source];
            if ( from_field_value == null ) {
              from_field_value = "";
            }
            var seek_element = $('body').find('#'+params.tdr_map[media_type].map[ix].Target);
            var calling_element = $(seek_element).first();
            if ( calling_element != null ) {
              calling_element.val(from_field_value);
              calling_element.change();
            }
          }
        }
      }
      else {
        var numocc = 0;
        var repeating = true;
        if (  params.tdr_map[media_type].group_repeating.toUpperCase() != 'Y' ) {
          repeating = false;
        }

        // count # of image grouped field
        numocc = record.getOccurrenceCount(params.tdr_map[media_type].group_mnemonic.toLowerCase()) + 1;
        if ( record.addGroup(params.tdr_map[media_type].group_mnemonic, numocc, null, repeating) ) {
          var image_occ_group = record.getGroup(params.tdr_map[media_type].group_mnemonic, numocc);
          if ( image_occ_group != false ) {
            for ( ix = 0 ; ix < params.tdr_map[media_type].map.length ; ix++ ) {
              var from_field_value = data_group[params.tdr_map[media_type].map[ix].Source];
              if ( from_field_value == null ) {
                from_field_value = "";
              }
              record.addElement(params.tdr_map[media_type].map[ix].Target.toLowerCase(), from_field_value, false, image_occ_group);
            }
          }
        }

        // update grouped field occurrence count
        var group_id = params.tdr_map[media_type].group_mnemonic;  // params.image_group;
        if ( group_fieldset != null ) {
          group_id = group_fieldset.id;
        }
        group_id = group_id.toUpperCase();
        $('#' + group_id).find(params.group_total_occurrences).first().text(numocc);
      }
    }
  }

  /**
   **  TdrItems2Record - save TDR items to fields of record object
   **/
  this.TdrItems2Record = function (data, calling_field) {
    if (calling_field.parents('div.file_attachment').length > 0) {
      // add image field inside image grouped field;
      var first_instance = true;
      for ( ix = 0 ; ix < data.length ; ix++ ) {
        app_interface.setAllImagefield(data[ix], calling_field, first_instance);
        first_instance = false;
      }
    }
    else {
      var thumbnail_image_path = data[0]['Thumbnail'];
      var image_path = data[0]['Access'];

      app_interface.setImagefield(image_path, thumbnail_image_path, calling_field);
    }
  }

  /**
   **  saveTDRitems - save bookmarked TDR items in record object
   **/
  this.saveTDRitems = function (bookmark_id, calling_field) {
    // get access token
    var token_result = app_interface.getAccessToken();

    // Is access token empty?
    if ( Object.keys(token_result).length <= 0 ) {
      alert ( "Unable to connect to TDR server." );
    }
    else {
      var token_type = token_result["token_type"];
      var access_token = token_result["access_token"];

      if ( access_token == null || token_type == null ) {
        alert ( "Unable to acquire access token." );
      }
      else {
        var request_headers = { };
        request_headers["Authorization"] = token_type + " " + access_token;
        request_headers["Content-Type"] = "application/x-www-form-urlencoded";
        var bookmark_url = app_config.tdr_parms.tdr_api +
                           app_config.tdr_parms.bookmark_endpoint +
                           "/" + bookmark_id;

        // send request to retrieve bookmarked items
        $.ajax({
          async: false,
          type: "get",
          dataType: "json",
          headers: request_headers,
          url: bookmark_url,
          success: function (data) {
            if ( data.length > 0 ) {
              app_interface.TdrItems2Record(data, calling_field);
            }
          },
          error: function (xhr, status, error) {
            if ( xhr.status == 400 ) {
              alert ( "No item is bookmarked." );
            }
            else {
              alert ( "Unable to obtain boomarked items" + "\n" + "xhr: " + xhr + '\n' + "status: " + status + '\n' + "error: " + error );
            }
          }
        });
      }
    }
  }

  /**
   **  uploadFile
   **/
 this.uploadFile = function (calling_field) {
    var calling_element, urler;
    var colorbox_params = 0;

    // RL-20230213
    var h_file_upload = $(calling_field).parents('div.file_attachment');
    var filename_prefix = '';
    if ( $(h_file_upload).length > 0 ) {
      var prefix_id = $(h_file_upload).data('name-prefix');
      if ( prefix_id != undefined && prefix_id != '' ) {
        filename_prefix = record.getElement(prefix_id, 0).text();
        if ( filename_prefix != '' ) {
          // get date stamp
          filename_prefix = filename_prefix + '_' + autoGeneratedAccessionNumber('');
        }
      }
    }
    if ( filename_prefix == '' ) {  // RL-20230213
      if (record.getElement('accession_number', 0)) {
        filename_prefix = record.getElement('accession_number', 0).text();
      }
      else {
        filename_prefix = autoGeneratedAccessionNumber('.');   // RL-20230213
      }
    }

    var handleFileUpload = function () {
      // RL-2020-11-10
      if ( typeof $tmp != 'undefined' && $tmp == "$browse_TDR_items" ) {
        app_interface.showTdrModalDialog ( 0, 0, calling_field, app_interface.saveTDRitems );
      }
      else {
        // RL-2020-11-10
        if ( typeof $tmp != 'undefined' ) {
          app_interface.setImagefield($tmp, null, calling_field);
        }
      }

      // RL-2020-11-10
      if ( typeof $tmp != 'undefined' ) {
        delete $tmp;
      }

      // RL-2020-09-29
      app_interface.handleImages();
    };

    // RL-2020-09-29
    url = params.sessid + "?get&file=" + UPLOAD_HTML_FILE + "&parm1=" + filename_prefix + "&parm2=" + params.image_virtual_directory;
    // RL-2021-05-31
    var dialog_width = window.innerWidth - 8; // leave spaces in left and right margin
    var dialog_height = window.innerHeight - 13;  // leave spaces in top and bottom margin

    // RL-2020-09-29
    $(calling_field).colorbox({
      href: url,
      transition: "elastic",
      iframe: true,
      width: dialog_width,   // RL-2021-05-31
      height: dialog_height,  // RL-2021-05-31
      onClosed: function() {
        handleFileUpload();
      }
    });
  };

  /**
   **  downloadFile
   **/
  this.downloadFile = function (calling_field) {
    var file_url = $(calling_field).parent('div').find(':input').first().val();

    if (file_url.length == 0) {
      return false;
    } else if (file_url.indexOf("MEDIA_VD_NAME") >= 0) {
    file_url = file_url.replace("[FTemporary Element not set by upload.php]", DEFAULT_MEDIA_WEB_PATH);
    } else if (file_url.indexOf(DEFAULT_MEDIA_PATH) >= 0) {
      file_url = file_url.replace(DEFAULT_MEDIA_PATH, DEFAULT_MEDIA_WEB_PATH);
    }

    window.open(file_url);
  };



  /**
   **  loadNewFormPage
   **/
  this.loadNewFormPage = function (calling_field) {
    var new_form_url = calling_field.attr('href');

    $(params.form_container).load(new_form_url, function () {
      app_interface.populateForm();
    });

    return false;
  };


  /**
   ** toggleMenu (for toggling between museum, archives,library)
   **/
  this.toggleMenu = function (visible_menu) {
    visible_menu = '#' + visible_menu;

    if (!$(visible_menu).is(':visible')) {
      $(visible_menu).show();
    }

    $('ul[id^=primary_worksheet_]').not(visible_menu).hide();
  };


  /**
   **  handleActiveRestrictions
   **/
  this.handleActiveRestrictions = function () {
    var res_icon = $('a[data-form=restrictions]').find('i.fa-warning');

    if (record.hasActiveRestrictions() && res_icon) {
      res_icon.addClass('active');
    } else if (res_icon) {
      res_icon.removeClass('active');
    } else {
      return false;
    }

    return true;
  };



  /**
   **  loadTooltips
   **/
  this.loadTooltips = function (calling_field) {
    // RL-202-12-21
    var tooltip = $('.tooltipstered');
    if ( tooltip.length > 0 ) {
      try {  // RL-20211207
        $(tooltip).tooltipster('destroy');
      }
      catch ( err ) {
        console.log(err);
      }
    }

    $(params.tooltip_elements).tooltipster({
      animation: 'fade',
      delay: 1500,
      theme: 'tooltipster-default',
      touchDevices: false,
      trigger: 'hover',
      functionBefore: function(origin, continueTooltip) {
        const regExp = /http(s)?:\/\//i
        var tooltipText = $(this).tooltipster('content');
        if ( regExp.exec(tooltipText) != null ) {
          var dialog_width = window.innerWidth - 8; // leave spaces in left and right margin
          var dialog_height = window.innerHeight - 13;  // leave spaces in top and bottom margin
          $.colorbox({
            iframe: true,
            href: tooltipText,
            transition: "elastic",
            width: dialog_width,
            height: dialog_height,
            title: "<span style='color:black;'>Click <i class='fa fa-times-circle-o'></i> to close tooltip</span>"
          });
        }
        else {
          if ( tooltipText != null && tooltipText != '' ) {
            continueTooltip();
          }
        }
      }
    });

    $(params.tooltip_elements).each(function () {
      // MH 23/02/09: Add db check
      // RL-20230215 - add codes for handling old and new tooltips strcuture
      var field_name = $(this).attr('for');
      var has_db_category = false;
      var tooltips_found = false;
      let db_name = $('body').data('database');
      if (tooltips[db_name]) {
        has_db_category = true;
        if (typeof tooltips[db_name][field_name] != undefined) {
          tooltips_found = true;
        }
      }
      else {
        if (typeof tooltips[field_name] != undefined) {
          tooltips_found = true;
        }
      }
      if (tooltips_found) {
        if (field_name.indexOf('MARC__') == 0) {
          // change label width
          var css_width = 36;
          if (this.innerText.length > 0) {
            css_width = this.innerText.length * 12 + 10;
          }
          $(this).css("width", css_width + "px");
        }
        if ( has_db_category ) {
          $(this).tooltipster('content', tooltips[db_name][field_name]);
        }
        else {
          $(this).tooltipster('content', tooltips[field_name]);
        }
      }
    });
  };

  /**
   **  Set As Default Address
   **/
  this.setDefaultAddress = function (calling_field) {
    if (typeof record.setDefaultAddress !== 'undefined') {
      var address_group_id = calling_field.parents(params.group_container).first().attr('id').toLowerCase();
      var address_group_occurrence = app_interface.getCurrentOccurrence(address_group_id.toUpperCase());
      var address_group = record.getGroup(address_group_id, address_group_occurrence);

      if (address_group) {
        record.setDefaultAddress(address_group);
        alert("Default address has been set");
      } else {
        console.log("ERROR");
      }
    }
  };

  /**
   **  saveRecord
   **/
  this.saveRecord = function (form_action, form) {
    if (typeof form_action == 'undefined' || typeof form === 'undefined') {
      return false;
    }

    // RL-2021-05-13
    // check mandatory fields
    var continueSaveForm = true;
    if ( typeof checkMandatoryField == 'function' ) {
      if ( checkMandatoryField() === false ) {
        continueSaveForm = false;
      }
    }

    // RL-2021-05-13
    // call record wrapup user routine
    if ( continueSaveForm ) {
      if ( typeof callWrapupUserExit == 'function' ) {
        if ( callWrapupUserExit() === false ) {
          continueSaveForm = false;
        }
      }
    }

    if ( continueSaveForm ) {
      // RL-2021-05-31
      // update richtext field
      $("div").find('.richText').each(function(){
        saveRichTextField($(this));
      });

      record.prepareSubmission(undefined, $(form));

      if ( typeof record_unlocked != 'undefined' ) {
        // Is record_unlocked defined in core_interface_handleing.js
        record_unlocked = true;
      }

      // RL-2020-12-10
      try {
        if ( popupWindow() && typeof parent.already_unlocked != 'undefined' ) {
          parent.already_unlocked = true;
        }
      }
      catch ( err ) {
      }

      // RL-2020-11-10
      if ( enable_tree && form_action.indexOf("?SAVETREE") > 0 ) {
        return saveTreeRecord ( form_action, form ); // Goes to m2atree_scripts.html
      }
      else {
        // RL-2020-12-10
        if ( popupWindow() ) {
          submitModalForm ( form_action, form );
        }
        else {
          $(form).attr('action', form_action);
          $(form).submit();
        }
      }
    }
  };


  /**
   **  updateImages
   **
   **  Notes:
   **  - This is going to be called whenever an image is uploaded to a group designated with '.contains_image' or '.has_image_holder'
   **  - It will replace the default placeholder image with the image that has just been uploaded.
   **/
  this.updateImages = function (calling_field) {
    if (typeof calling_field == 'string') {
      calling_field = (calling_field.indexOf('#') > -1) ? calling_field : '#' + calling_field;
    }

    if ($(calling_field).parents('.contains_image').length > 0) {
      var image_src = $(calling_field).val();

      if (image_src.length > 0) {
        if (image_src.indexOf(params.image_virtual_directory) > -1) {
          image_src = image_src.replace(params.image_virtual_directory, params.image_url_path);
        }

        $(calling_field).parents('.contains_image').find('img.field_img').attr('src', image_src);
      } else {
        $(calling_field).parents('.contains_image').find('img.field_img').attr('src', NOIMAGE_WWW_PATH);
      }
    }
    else {  // RL-2020-11-10
      if ($(calling_field).parents('.has_image_holder').length > 0) {
        var image_src = $(calling_field).val();

        if (image_src.length > 0) {
          if (image_src.indexOf(params.image_virtual_directory) > -1) {
            image_src = image_src.replace(params.image_virtual_directory, params.image_url_path);
          }

          $(calling_field).parents('.has_image_holder').find('img.field_img').attr('src', image_src);
        } else {
          $(calling_field).parents('.has_image_holder').find('img.field_img').attr('src', NOIMAGE_WWW_PATH);
        }
      }
    }
  };




  /**
   **
   **  Set Current Location
   **
   **/
  this.setCurrentLocation = function () {
    if (record.getGroup(current_loc_info_mnemonic)) {
      var current_location_grp = record.getGroup(current_loc_info_mnemonic, 1);
      var current_location = record.getElement(curators_code_mnemonic, 0, current_location_grp);

      if (record.getElement(c_cur_code_mnemonic)) {
        record.updateElement(record.getElement(c_cur_code_mnemonic), current_location.text());
      } else {
        record.addElement(c_cur_code_mnemonic, current_location.text(), false);
      }

      app_interface.populateField(c_cur_code_mnemonic.toUpperCase(), 1, null, false); // RL-2021-05-31
    } else {
      return false;
    }
  };




  /**
   **
   **  Cancel Move
   **
   **/
  this.cancelMove = function (calling_field) {
    var current_occurrence = app_interface.getCurrentOccurrence(planned_loc_grp_mnemonic.toUpperCase());
    var planned_loc_grp = record.getGroup(planned_loc_grp_mnemonic, current_occurrence);

    if (record.getElement(moved_flag_mnemonic, 0, planned_loc_grp)) {
      var moved_flag = record.getElement(moved_flag_mnemonic, 0, planned_loc_grp);
      record.updateElement(moved_flag, 'Cancelled');
    } else {
      record.addElement(moved_flag_mnemonic, 'Cancelled', false, planned_loc_grp);
    }

    app_interface.populateField(moved_flag_mnemonic.toUpperCase(), 0, null, false); // RL-2021-05-31
  };


  /**
   **
   **  Perform Move
   **
   **/
  this.performMove = function (calling_field) {
    // change moved_flag of current occurrence to "planned"
    // remap current group of planned move to current location
    var current_locations; // will hold the parent group of planned moves
    var current_occurrence = app_interface.getCurrentOccurrence(planned_loc_grp_mnemonic.toUpperCase());
    var planned_loc_grp = record.getGroup(planned_loc_grp_mnemonic, current_occurrence);
    var planned_loc_grp_copy = planned_loc_grp.clone();

    // RL-2020-12-21
    var move_flag = record.getElement(moved_flag_mnemonic, 0, planned_loc_grp);
    if ( move_flag != false && move_flag.text() == 'Moved' ) {
      alert ( "Planned movement is already moved." );
    }
    else {
      if (record.getElement(moved_flag_mnemonic, 0, planned_loc_grp)) {
        moved_flag = record.getElement(moved_flag_mnemonic, 0, planned_loc_grp);
        record.updateElement(moved_flag, 'Moved');
      } else {
        record.addElement(moved_flag_mnemonic, 'Moved', false, planned_loc_grp);
      }

      app_interface.populateField(moved_flag_mnemonic.toUpperCase(), 0, null, false); // RL-2021-05-31

      // remap current group to current location:
      if (record.getGroup(current_loc_info_mnemonic)) {
        current_locations = record.getGroup(current_loc_info_mnemonic).parent();
        var new_occurrence_number = current_locations.children().length + 1;
        record.addGroup(current_loc_info_mnemonic, new_occurrence_number, current_locations, true);  // RL-2020-12-21
        current_location_group = record.getGroup(current_loc_info_mnemonic, new_occurrence_number);
        record.remap(planned_loc_grp_copy, record.params.maps.perform_movement, current_location_group);

        // move the new occurrence to the front
        // record.moveOccurrence(current_location_group, 1);   // RL-20220814
      } else {
        record.addGroup(current_loc_info_mnemonic, 1, null, true);  // RL-2020-12-21
        current_locations = record.getGroup(current_loc_info_mnemonic); // sets to the new occurrence
        record.remap(planned_loc_grp_copy, record.params.maps.perform_movement, current_locations);
      }

      // populate group
      app_interface.populateGroup(current_loc_info_mnemonic.toUpperCase(), new_occurrence_number);  // RL-20220814

      // update current location
      app_interface.setCurrentLocation();
      app_interface.populateField(c_cur_code_mnemonic, 0, null, false); // RL-2021-05-31
    }
  };

  // rl-2020-09-29

  /**
  **
  **  return read-only record flag
  **
  **/
  this.readonlyRecord = function() {
    return this.readonly_record;
  };

  /*****
  **
  **  RetrieveSetAiValue : retrive AI value from server and save it in specified input tag
  **
  **  params:
  **    - caller : an HTML select element
  **
   *****/
  this.RetrieveSetAiValue = function(caller) {
    var ai_parm_name = $(caller).data('ai');
    if ( ai_parm_name != '' ) {
      if ( currentAppInterface != undefined && currentAppInterface != null ) {
        var ai_params = eval('currentAppInterface.app_record.params.' + ai_parm_name);

        // get AI field ID
        var ai_field_id = ai_params.ai_field;
        if ( ai_field_id != null ) {
          // get AI value
          if ( ai_params[caller.value] != null ) {
            read_n_save_ai_value ( ai_params[caller.value], ai_field_id ); // read_n_save_ai_value is defined in assets/js/fontend.js
          }
        }
      }
    }
  };


  // RL-2020-11-10

  /*****
  **
  **  getAccessToken : get titan access token for discover page
  **
  **  params:
  **    - none
  **
   *****/
  this.getAccessToken = function () {
    var token_result = {};
    var token_url = app_config.tdr_parms.tdr_api + app_config.tdr_parms.login_endpoint;

    // prepare form data
    var grant_type = "password";
    var username = decode_string(app_config.tdr_parms.username);
    var userpassword = decode_string(app_config.tdr_parms.userpassword);
    var form_data = 'grant_type=' + grant_type + "&username=" + username + "&password=" + userpassword;

    $.ajax({
      async: false,
      type: "POST",
      url: token_url,
      headers: {'Content-Type' : 'application/x-www-form-urlencoded',
                'Accept'       : 'application/json'},
      data: form_data,
      processData: false,
      cache: false,
      timeout: 30000,
      success: function (data) {
        token_result = data;
      },
      error: function (e) {
        alert ( "Error is encountered while obtaining access token." );
      }
    });

    return token_result;
  }


  // RL-2020-11-10

  /*****
  **
  **  showTdrModalDialog : show web page in iframe modal dialog
  **
  **  params:
  **    - dialog_width : dialog width in pixels. If zero, screen width is assumed
  **    - dialog_height : dialog hieght in pixels. If zero, screen height is assumed.
  **    - calling_feld : an HTML DOM element where image reference is added.
  **    - closeFunc : callback function which saves image path of bookmarked items in record object.
  **
  *****/
  this.showTdrModalDialog = function ( dialog_width, dialog_height, calling_field, closeFunc ) {
    // ensure mandatory parameters are defined
    if ( typeof app_config == 'undefined'
    ||   typeof app_config.tdr_parms == 'undefined'
    ||   app_config.tdr_parms.tdr_api == null
    ||   app_config.tdr_parms.tdr_ui == null
    ||   app_config.tdr_parms.login_endpoint == null
    ||   app_config.tdr_parms.search_endpoint == null
    ||   app_config.tdr_parms.bookmark_endpoint == null
    ||   app_config.tdr_parms.delete_bookmark_ep == null
    ||   app_config.tdr_parms.username == null
    ||   app_config.tdr_parms.userpassword == null ) {
      alert ( "Madnatoy TDR parameter is missing." );
    }
    else {
      if ( dialog_width == 0 ) {
        // calculate modal window width
        dialog_width = window.innerWidth - 8; // leave spaces in left and right margin
      }

      if ( dialog_height == 0 ) {
        // calculate modal window height
        dialog_height = window.innerHeight - 13;  // leave spaces in top and bottom margin
      }

      // get user name
      var user_name = $.cookie('USERNAME');
      if ( user_name == null || user_name== "" ) {
        user_name = "M2A";
      }

      // get current time in seconds
      var today = new Date();
      var year = (today.getFullYear()).toString();
      var month = (today.getMonth()+1).toString();
      var day = (today.getDate()).toString();
      var hour = (today.getHours()).toString();
      var minute = (today.getMinutes()).toString();
      var second = (today.getSeconds()).toString();
      if ( today.getMonth()+1 < 10 ) {
        month = "0" + month;
      }
      if ( today.getDate() < 10 ) {
        day = "0" + day;
      }
      if ( today.getHours() < 10 ) {
        hour = "0" + hour;
      }
      if ( today.getMinutes() < 10 ) {
        minute = "0" + minute;
      }
      if ( today.getSeconds() < 10 ) {
        second = "0" + second;
      }

      // geenrate bookmark ID
      var bookmark_id = user_name + "_" + year + month + day + "_" + hour + minute + second;

      var login_url = encode_string(app_config.tdr_parms.tdr_api + app_config.tdr_parms.login_endpoint);
      var search_url = encode_string(app_config.tdr_parms.tdr_ui + app_config.tdr_parms.search_endpoint);
      var discovery_url = app_config.tdr_parms.tdr_ui + "/m2a-search.html" +
                          "?US=" +  app_config.tdr_parms.username +
                          "&PW=" +  app_config.tdr_parms.userpassword +
                          "&LO=" +  login_url +
                          "&SE=" +  search_url +
                          "&BI=" +  bookmark_id +
                          app_config.tdr_parms.search_endpoint +
                          "/" + bookmark_id;

      $.colorbox({
        iframe: true,
        href: discovery_url,
        transition: "elastic",
        width: dialog_width,
        height: dialog_height,
        title: "<span style='color:black;'>Click <i class='fa fa-times-circle-o'></i> to save bookmarked items</span>",
        onClosed: function() {
          if ( closeFunc != null ) {
            // call app_interface.saveTDRitems method
            closeFunc ( bookmark_id, calling_field );

            // remove bookmark
            app_interface.deleteTDRBookmark(bookmark_id);

            // RL-2020-11-10
            app_interface.handleImages();   // update tombstone image
          }
          // parent.$.colorbox.close();
        }
      });
    }
  }

  // RL-2021-03-16
  /*****
  **
  **  selectTableRow : toggle the table row (<tr> tag) with class "selected".
  **  editTableRow and removeTableRow method works with the row with "selected" class.
  **
  **  params:
  **    - calling_field : The javascript object that this function was called from (will be the currently clicked occurrence table row in this case)
  **
  **  notes:
  **    - If any occurrence is clicked, all other occurrences will have the "selected" class removed to ensure only one occurrence is selected
  **    - If an occurrence is selected, and clicked again, the selected class will be removed, thus 'deselecting' the occurrence
  **
   *****/
  this.selectTableRow = function(calling_field) {
    var caller_parent = $(calling_field).closest('tbody');

    if ($(calling_field).hasClass('selected')) {
      $(caller_parent).find('tr').removeClass('selected');
    }
    else {
      $(caller_parent).find('tr').removeClass('selected');
      $(calling_field).addClass('selected');
    }
  };


  /*****
  **
  **  addTableRow : Displays a lightbox with a form for users to fill out to add new grouped field occurrence to a record
  **
   *****/
  this.addTableRow = function(calling_field) {
    var return_code = true;
    var table_id = "";
    var group_id = "";
    var row_data = [];
    var numocc = 0;
    var form_id = "";
    var table_field = null;
    var exit_name = '';
    var default_processing = true;

    table_id = $(calling_field).data('table');
    if ( typeof table_id == 'undefined' || table_id == '' ) {
      alert("Table ID is missing.");
      return_code = false;
    }
    else {
      table_field = $('#' + table_id);
      if ( table_field.length <= 0 ) {
        alert("Table id '" + table_id + "' is undefined." );
        return_code = false;
      }
    }

    if ( return_code ) {
      // get group ID
      group_id = $(table_field).data('group');
      if ( typeof group_id == 'undefined' ) {
        alert("Grouped field name is undefined in <table> tag.");
        return_code = false;
      }
      else {
        exit_name = $(table_field).data('exit');
        if ( typeof exit_name == 'undefined' ) {
          exit_name = '';
        }
        else {
          var checkResult = eval ( 'typeof ' + exit_name  );
          if ( checkResult === 'undefined' ) {
            alert ( exit_name + ' is not found.' );
            exit_name = '';
            return_code = false;
          }
          else {
            default_processing = false;
          }
        }

        if ( default_processing && return_code == true ) {
          form_id = $(table_field).data('form');
          if ( typeof form_id == 'undefined' ) {
            alert("Form name is undefined in <table> tag.");
            return_code = false;
          }
        }
      }
    }

    if ( return_code ) {
      var sourceNames = getColSoruceNames ( table_field );
      if ( sourceNames.length <= 0 ) {
        alert("Column source name is undefined in <table> tag.");
        return_code = false;
      }
      else {
        // get number of group occurrences
        numocc = record.getOccurrenceCount(group_id, null);
        numocc++;

        if ( numocc == 1 && emptyTable(table_id) ) {
          removeTableRow ( table_id, 0 );
        }

        row_data.push(numocc.toString());
        for ( i = 1 ; i < sourceNames.length ; i++ ) {
          row_data.push('');
        }

        // create table row
        insertTableRow ( table_id, -1, row_data );

        if ( exit_name != '' ) {
          // call exit to handle data entry
          var call_statement = exit_name + '("' + table_id + '", "A", numocc);';
          return_code = eval ( call_statement );
          if ( return_code == false ) {
            // remove new table row
            removeTableRow ( table_id, numocc );
          }
        }
        else {
          if ( default_processing ) {
            if ( !this.popup_group_dialog ) {
              app_interface.populateGroup(group_id, numocc);
            }
            if ( return_code ) {
              this.showGroupedDataEntryForm ( table_id, form_id );
            }
          }
        }
      }
    }

    return return_code;
  };



  /*****
  **
  **  editTableRow : Displays a lightbox with a form for users to fill out to edit an existing groupped field occrrence in a record
  **
   *****/
  this.editTableRow = function(calling_field, edit_control) {
    var return_code = true;
    var table_id = "";
    var exit_name = '';
    var table_field = null;
    var default_processing = true;

    if ( edit_control ) {
      table_id = $(calling_field).data('table');
      table_field = $('#'+table_id);
    }
    else {
      table_field = $(calling_field).parents('table');
      if ( table_field.length > 0 ) {
        table_id = table_field.attr('id');
      }
    }

    if ( typeof table_id == 'undefined' || table_id == '' ) {
      alert("Table ID is missing.");
      return_code = false;
    }
    else {
      var selected_row = '#' + table_id + ' tr.selected';
      if ($(selected_row).length > 0) {
        // get form ID
        var form_id = $('#' + table_id).data('form');
        var group_id = $('#' + table_id).data('group');

        if ( typeof group_id == 'undefined' ) {
          alert("Grouped field name is undefined in <table> tag.");
          return_code = false;
        }
        else {
          exit_name = $(table_field).data('exit');
          if ( typeof exit_name == 'undefined' ) {
            exit_name = '';
          }
          else {
            var checkResult = eval ( 'typeof ' + exit_name  );
            if ( checkResult === 'undefined' ) {
              alert ( exit_name + ' is not found.' );
              exit_name = '';
              return_code = false;
            }
            else {
              default_processing = false;
            }
          }

          if ( default_processing && return_code == true ) {
            if ( typeof form_id == 'undefined' || $('#' + form_id).length <= 0 ) {
              alert("Data entry form is not found.");
              return_code = false;
            }
          }
        }
        if ( return_code == true ) {
          // get ocurrence number
          var occurrence = $(selected_row).find('td:first').text();
          var group_fieldset = $('#' + form_id).find('fieldset');
          if ( typeof group_fieldset == 'undefined' ) {
            alert("Group fieldset is not defined.");
          }
          else {
            if ( exit_name != '' ) {
              // call exit to handle data entry
              var occnum = parseInt(occurrence, 10);
              var call_statement = exit_name + '("' + table_id + '", "C", occnum);';
              return_code = eval ( call_statement );
            }
            else {
              // select group occurrence of data entry form
              app_interface.populateGroup(group_id, occurrence);

              if ($(group_fieldset).hasClass('contains_image')) {
                app_interface.updateImages($(group_fieldset).find('.file_attachment input').first().attr('id'));
              }
              else {
                if ($(group_fieldset).hasClass('has_image_holder')) {
                  app_interface.updateImages($(group_fieldset).find('.file_attachment input').first().attr('id'));
                }
              }

              this.showGroupedDataEntryForm ( table_id, form_id );
            }
          }
        }
      }
      else {
        alert("You need to select (click on) an occurrence to edit");
        return_code = false;
      }
    }

    return return_code;
  };



  /*****
  **
  **  removeTableRow : removes an existing grouped field occurrence from a record if the user confirms removal
  **
   *****/
  this.removeTableRow = function(calling_field) {
    var return_code = true;
    var table_id = $(calling_field).data('table');
    var table_field = $('#'+table_id);
    var exit_name = '';
    var default_processing = true;

    if ( typeof table_id == 'undefined' || table_id == '' ) {
      alert("Table ID is missing.");
      return_code = false;
    }
    else {
      var selected_row = '#' + table_id + ' tr.selected';
      if ($(selected_row).length > 0) {
        // get form ID
        var form_id = $('#' + table_id).data('form');
        var group_id = $('#' + table_id).data('group');

        if ( typeof group_id == 'undefined' ) {
          alert("Grouped field name is undefined in <table> tag.");
          return_code = false;
        }
        else {
          exit_name = $(table_field).data('exit');
          if ( typeof exit_name == 'undefined' ) {
            exit_name = '';
          }
          else {
            var checkResult = eval ( 'typeof ' + exit_name  );
            if ( checkResult === 'undefined' ) {
              alert ( exit_name + ' is not found.' );
              exit_name = '';
              return_code = false;
            }
            else {
              default_processing = false;
            }
          }
          if ( default_processing && return_code == true ) {
            if ( typeof form_id == 'undefined' || $('#' + form_id).length <= 0 ) {
              alert("Data entry form is not found.");
              return_code = false;
            }
          }
        }

        if ( return_code == true ) {
          // get ocurrence number
          var occurrence = $(selected_row).find('td:first').text();
          var group_fieldset = $('#' + form_id).find('fieldset');
          if ( typeof group_fieldset == 'undefined' ) {
            alert("Group fieldset is not defined.");
          }
          else {
            if ( exit_name != '' ) {
              // call exit to handle data entry
              var occnum = parseInt(occurrence, 10);
              var call_statement = exit_name + '("' + table_id + '", "D", occnum);';
              return_code = eval ( call_statement );
            }
            else {
              if (confirm("Are you sure you want to remove this occurrence?")) {
                // remove ocurrence from record object
                record.removeGroupOccurrence(record.getGroup(group_id, occurrence));

                // remove row from table
                if ( !this.popup_group_dialog ) {
                  removeTableRow ( table_id, occurrence );
                }

                alert("Occurrence has been successfully removed.");
              }
              else {
                return_code = false;
              }
            }
          }
        }
      }
      else {
        alert("You need to select (click on) an occurrence to edit");
        return_code = false;
      }
    }

    return return_code;
  };

  /*****
  **
  **  selectEditTableRow : select and change the table row.
  **
  **  params:
  **    - calling_field : The javascript object that this function was called from (will be the currently clicked occurrence table row in this case)
  **
   *****/
  this.selectEditTableRow = function(calling_field) {
    var caller_parent = $(calling_field).closest('tbody');

    if ( !($(calling_field).hasClass('selected')) ) {
      $(caller_parent).find('tr').removeClass('selected');
      $(calling_field).addClass('selected');
    }

    // edit grouped field occurrence
    this.editTableRow(calling_field, false);
  };

  /*****
  **
  **  updateTableColumn : update table column value.
  **
  **  params:
  **    - calling_field : The javascript object that this function was called from (will be the in-focus field)
  **
   *****/
  this.updateTableColumn = function (calling_field) {
    var occ = 0;
    var col_num = -1;
    var row_num = -1;
    var tr_html = null;
    var td_htmls = null;
    var i = 0;

    // get id of current field
    var field_id = $(calling_field).attr('id');

    // get current group occurrence number
    var fieldset_html = $(calling_field).parents('fieldset');
    if ( fieldset_html.length > 0 ) {
      var current_occ_field = $(fieldset_html).find('li.repeating_group_current_occurrence');
      if ( current_occ_field.length > 0 ) {
        occ = parseInt($(current_occ_field).text(), 10);
      }
    }

    // extract data-table attribute
    var table_id = $(calling_field).data('table');

    // find <table> tag
    var table_field = $('#' + table_id );
    if ( table_field.length > 0 ) {
      // get source names of table columns
      var source_names = getColSoruceNames ( table_field );

      // determine column #
      for ( i = 0 ; i < source_names.length ; i++ ) {
        if ( source_names[i] == field_id ) {
          col_num = i;
          break;
        }
      }
    }

    if ( col_num >= 0 ) {
      // search table row by occurrence number
      var tr_htmls = $(table_field).find('tr');
      if ( tr_htmls.length > 0 ) {
        for ( i = 0 ; i < tr_htmls.length ; i++ ) {
          td_htmls = $(tr_htmls[i]).find('td');
          if ( td_htmls.length > 0 ) {
            var row_no = parseInt($(td_htmls[0]).text(), 10);
            if ( occ == row_no ) {
              tr_html = tr_htmls[i];
              row_num = i;
              break;
            }
          }
        }
      }
    }

    // Is table row found?
    if ( row_num >= 0 ) {
      // extract current field value
      var field_value = $(calling_field).val();

      // update column value
      if ( col_num < td_htmls.length ) {
        $(td_htmls[col_num]).text(field_value);
      }
    }
  };

  // utility method to show grouped field data entry form
  this.showGroupedDataEntryForm = function(table_id, form_id)
  {
    if ( !this.popup_group_dialog ) {
      // make field visible
      var element = document.getElementById(form_id);
      if ( element != null ) {
        element.scrollIntoView(true);
      }
    }
    else {
      // show grouped field data entry form
      groupedFieldModalDialog ( null, form_id );
    }
  }

  // RL-2021-05-31
  /* ************************************************************************ */
  // handler saves richedtext field of current group in XML record abd reads
  // richtext field from next/previous group occurrrence.
  this.switchGroupWithRichText = function(calling_field, save_field)
  {
    // get closest fieldset tag
    var group_field = $(calling_field).closest(params.group_container).first();

    if ( typeof group_field != 'undefined' ) {
      // scan for rich text field
      var richTextField = $(group_field).find('.richText');

      // for each rich text field, save and reload it
      $(richTextField).each( function() {
        // save HTML div string in XML record
        if ( save_field ) {
          saveRichTextField($(this));
        }
        else {
          // read message text from XML record
          loadRichTextField($(this));
        }
      })
    }
  }

  // RL-2021-05-31
  // extract the field value of record object.  The current field pointer is paased
  // in and is used to determines the current occurrence of nested grouped field.
  this.getFieldValue = function (calling_field, field_id) {
    var field_value = false;
    var parent_group = null;

    if (calling_field.parents(params.group_container).length > 0) {
      parent_group = app_interface.getGroupParent(calling_field.attr('id'));
    }

    var xml_field_id = field_id.toLowerCase();
    var occurrence = (app_interface.isRepeatingField('#' + field_id)) ? calling_field.closest(params.r_field_container).find(params.r_field_occurrence).first().text() : '0';
    var field_is_repeating = (parseInt(occurrence) > 0) ? true : false;
    var field = record.getElement(xml_field_id, occurrence, parent_group);
    if (field) {
      field_value = field.text();
    }

    return field_value;
  }

  /*
    This function exract source key value form the current record and shows the source record
    in the popup window for editing.
  */
  this.editRecord = function (calling_field) {
    // extract data-sourcedb option
    var sourcedb = $(calling_field).data('sourcedb');
    if ( typeof sourcedb == 'undefined' ) {
      sourcedb = '';
    }

    // extract data-source option
    var source = $(calling_field).data('source');
    if ( typeof source == 'undefined' ) {
      source = '';
    }

    // extract data-key option
    var key = $(calling_field).data('key');
    if ( typeof key == 'undefined' ) {
      key = '';
    }

    // ensure option values are present
    var okay = true;
    if ( sourcedb == '' ) {
      okay = false;
      alert ( "Source database name is missing." );
    }
    else if ( source == '' ) {
      okay = false;
      alert ( "source field is missing." );
    }
    else if ( key == '' ) {
      okay = false;
      alert ( "Key field name is missing." );
    }

    var source_value ='';
    if ( okay ) {
      // extract source field value
      source_key = $('#'+source).val();
      if ( source_key == null || source_key == '' ) {
        alert ( "Source field value is defined." );
        okay = false;
      }
    }

    if ( okay ) {
      // create changesinglerecord URL
      var url = params.sessid + '?CHANGESINGLERECORD&NEW=Y&DISCONNECT=Y' +
       '&DATABASE=' + sourcedb +
       '&EXP=' + key + '%20' + source_key +
       '&RETURN_URL=' + params.sessid + '%3fget%26file=[m2ademo]assets%5chtml%5ctemplate%5cclose_form.html';

      // prepare and show colorbox patameters
      var dialog_width = window.innerWidth - 8;
      var dialog_height = window.innerHeight - 13;

      $disable_logoff = true;
      $popup = "Y";
      $.colorbox({
        iframe: true,
        href: url,
        transition: "elastic",
        width: dialog_width,
        height: dialog_height,
        overlayClose: false,
        // onLoad: function() {
        //  $('#cboxClose').remove();
        // },
        onOpen: function(){
          $('body').css({ overflow: 'hidden' });
        },
        onClosed: function() {
          $('body').css({ overflow: '' });
          delete $disable_logoff;
          delete $popup;

          try {
            if ( modal_skip_record_link != "" && parent.already_unlocked ) {
              modal_skip_record_link = "";
            }
          }
          catch ( err ) {
            modal_skip_record_link = "";
          }

          if ( modal_skip_record_link != "" ) {
            // unlock record
            $.ajax({
              async: false,
              type: "GET",
              url: modal_skip_record_link,
              success: function (data) {
              },
              error: function (xhr, status, error) {
              }
            });
          }
        }
      });
    }
  }

  // RL-20220131
  // sets image attributes
  this.setImageAttr = function (cust_image_group_mnemonic, cust_image_mnemonic) {
    if ( cust_image_group_mnemonic != null && cust_image_group_mnemonic != '' ) {
      params.image_group = cust_image_group_mnemonic;
    }

    if ( cust_image_mnemonic != null && cust_image_mnemonic != '' ) {
      image_mnemonic = cust_image_mnemonic;
    }
  }

  // RL-20220131
  // show image in colorbox
  this.showImageBox = function (calling_field) {
    // calling_field is <a> tag
    var img_tag = $(calling_field).find('img');
    if ( img_tag.length > 0 ) {
      var img_source = $(img_tag).prop('src');
      if ( img_source.indexOf('placeholder.png') >= 0 ) {
        alert ( "No image is selected." );
      }
      else {
        var box_width = 900;
        var box_height = 600;
        img_source = '<div width="' + box_width + '" height="' + box_height + '" style="vertical-align: middle; text-align: center;"><img width="95%" height="95%" style="display: block; margin-left: auto; margin-right: auto; objct-fit: contain;" src="' + img_source + '"></div>';
        $.colorbox({
          href: false,
          html: img_source,
          transition: "elastic",
          width: box_width,
          height: box_height,
          overlayClose: false,
          onOpen: function(){
            $('body').css({ overflow: 'hidden' });
          },
          onClosed: function() {
            $('body').css({ overflow: '' });
          }
        });
      }
    }
  }
} // end of ApplicationInterface class

// **********************************************************************
// Utility functions
// **********************************************************************

// RL-2020-11-09

// map escaped url characters
function map_escaped_chars ( input_string )
{
  // map ~2f to /
  input_string = input_string.replace(/\//g, "~2f");
  // map ~22 to "
  input_string = input_string.replace(/\"/g, "~22");
  // map ~3a to :
  input_string = input_string.replace(/:/g, "~3a");
  // map ~20 to space
  input_string = input_string.replace(/ /g, "~20");

  return input_string;
}

// encode_string()
// Purpose: convert plan-text string to web character string
function encode_string ( input_string )
{
  // convert plan-text string to MINISIS encoded string
  var minisis_encoded_string = minisis_encoding ( input_string );

  // convert MINISIS encoded sting to web-encoded string
  var web_string = web_encoding ( minisis_encoded_string );

  // return web-encoded string
  return web_string;
}

// minisis_encoding()
// Purpose: encode plan-text to minisis encoded string
// Processing: It splits byte into two 4bit value, add sum value to 4bit value, swap values and add check digit.
function minisis_encoding ( input_string )
{
  var mEncodedString = "";
  var ix = 0;
  var limit = 0;
  var last_loc = 0;
  var value1 = 0;
  var value2 = 0;
  var charvalue;
  var temp_array = [];
  var string_leng = input_string.length;

  // input string size must be less than or equal to 96 character
  if ( string_leng <= 96 ) {
    // split byte to 2 4bit byte and then add sum value
    for ( ix = 0 ; ix < string_leng ; ix++ ) {
      charvalue = input_string.charCodeAt(ix);
      value2 = Math.floor(charvalue / 16);
      value1 = charvalue % 16;
      temp_array[ix*2] = (value1 + (ix * 2) + 1 + 48);  // 48 = character code of "0"
      temp_array[ix*2+1] = (value2 + (ix * 2) + 2 + 48);
    }

    // swap characters
    limit = Math.floor(string_leng / 2);
    last_loc = (string_leng * 2) - 2;
    for ( ix = 0 ; ix < limit ; ix++ ) {
      value1 = temp_array[ix*2];
      temp_array[ix*2] = temp_array[last_loc];
      temp_array[last_loc] = value1;
      last_loc -= 2;
    }

    // set check digit
    temp_array[string_leng*2] = string_leng + 65;  // 65 = character code "A"

    // convert byte array to string
    limit = string_leng*2 + 1;
    for ( ix = 0; ix < limit ; ix++ ){
      mEncodedString = mEncodedString + String.fromCharCode(temp_array[ix]);
    }
  }

  return mEncodedString;
}

// web_encoding()
// Purpose: encode text string to web encoded string
// Processing: It maps 256base character code to one or more 62base character codes
function web_encoding ( input_string )
{
  var base62_code = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var multipler_char = "|?@[";
  var wEncodedString = "";
  var web_char_string = "";
  var charvalue = 0;
  var ix = 0;
  var multipler = 0;
  var string_leng = input_string.length;

  for ( ix = 0 ; ix < string_leng ; ix++ )
  {
    charvalue = input_string.charCodeAt(ix);
    if ( charvalue < MAX_WEB_CHARS ) {
      web_char_string = String.fromCharCode(base62_code.charCodeAt(charvalue));
    }
    else {
      multipler = Math.floor(charvalue / MAX_WEB_CHARS) - 1;
      web_char_string = String.fromCharCode(multipler_char.charCodeAt(multipler));
      web_char_string = web_char_string + String.fromCharCode(base62_code.charCodeAt(charvalue % MAX_WEB_CHARS));
    }
    wEncodedString = wEncodedString + web_char_string;
  }

  return wEncodedString;
}

// RL-2021-01-07
// auto-generated access number
function autoGeneratedAccessionNumber(sep) {   // RL-20230213
  now = new Date();
  var dd = now.getDate();
  var mm = now.getMonth() + 1;
  var yyyy = now.getFullYear().toString();  // RL-20230213

  if (dd < 10) {
    dd = '0' + dd.toString();  // RL-20230213
  }
  else {
    dd = dd.toString(); // RL-20230213
  }

  if (mm < 10) {
    mm = '0' + mm.toString();  // RL-20230213
  }
  else {
    mm = mm.toString();  // RL-20230213
  }

  currentTime = yyyy + sep + mm + sep + dd;  // RL-20230213
  randomNum = '';
  randomNum += Math.round(Math.random() * 9);
  randomNum += Math.round(Math.random() * 9);
  randomNum += now.getTime();

  // RL-20230213
  if ( sep == '' ) {
    return currentTime;
  }

  return currentTime + sep + randomNum.substr(0, 5); // RL-20230213
}

// RL-2021-05-31
// This function sets marc indicator to supplied value.   It searches the parent node,
// get previous node, search input tag. If input tag is found, set input tag to supplied value.

function set_marc_indicator ( field_id, indicator_value )
{
  var marc_body = $("#" + field_id).parent();

  if ( marc_body.length > 0 ) {
    var marc_indicator = marc_body.prev().find('input[type=text]');
    if ( marc_indicator.length > 0 ) {
      marc_indicator.val( indicator_value );
    }
  }
}

// RL-2021-03-16
// This function shows the data entry form of grouped field in the modal dialog.
function groupedFieldModalDialog ( title, div_id )
{
  if ( title == null || typeof title == 'undefined' ) {
    title = "<span style='color:black;'>Click <i class='fa fa-times-circle-o'></i> to close data entry form</span>";
  }

  // make modal dialog same size as current window
  var dialog_width = window.innerWidth;
  var dialog_height = window.innerHeight;

  $.colorbox({
    inline: true,
    href: '#' + div_id,
    title: title,
    transition: 'elastic',
    width: dialog_width,
    height: dialog_height,
    onCleanup: function() {
    }
  });
}

// RL-2021-05-31
// escape rich text field
function richTextEscape(str) {
  var t1 = str.replace(/#/g, "&#35;").replace(/</g, "&#60;").replace(/>/g, "&#62;");
  return t1;
}

// Unescape rich text field
function richTextUnEscape(str) {
  var t1 = str.replace(/&amp;/g, '&').replace(/&#35;/g, "#").replace(/&#60;/g, "<").replace(/&#62;/g, ">");
  return t1;
}
