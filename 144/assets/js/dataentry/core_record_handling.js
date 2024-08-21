/*
  M2A Online Data Entry
  Record Handling
  v2.0

  Jon West - MINISIS Inc
  February 2015
*/

function Record(xml_id) {
  var xml = ($(xml_id).length > 0) ? $(xml_id).find('record').first() : $("<record/>");
  var record = this;
  this.params; // This is overridden in individual database class files


  /*****
  **
  **  getGroup : returns either an XML copy of a specific group occurrence, or will return false if no group is found.
  **
  **  params:
  **    - g_id : String value representing group name (_occurrence not required), eg: 'last_modified'
  **    - occurrence : String value representing occurrence number, eg: '1'
  **    - parent_group : XML copy of the group occurrence's parent.  If not specified, defaults to the root <record>.
  **
   *****/
  this.getGroup = function(g_id, occurrence, parent_group) {
    parent_group = (typeof parent_group !== 'undefined' && parent_group) ? parent_group : xml;
    g_id = g_id.toLowerCase();
    occurrence = (typeof occurrence !== "undefined") ? occurrence : 1;

    if (parent_group.find(g_id + "_occurrence[occ=" + occurrence + "]").length > 0) {
      return parent_group.find(g_id + "_occurrence[occ=" + occurrence + "]");
    } else {
      return false;
    }
  };

  /*****
  **
  **  addGroup
  **
  **  params:
  **    - g_id : String value representing group name (_occurrence not required), eg: 'last_modified'
  **    - occurrence : String value representing occurrence number, eg: '1'
  **    - parent_group : XML copy of the group occurrence's parent.  If not specified, defaults to the root <record>.
  **
   *****/
  // RL-2020-09-29
  this.addGroup = function(g_id, occurrence, parent_group, repeating ) {
    // RL-2020-09-29
    var repeating_group = true;
    if ( typeof repeating !== 'undefined' ) {
      repeating_group = repeating;
    }

    parent_group = (typeof parent_group !== 'undefined' && parent_group) ? parent_group : xml;
    g_id = g_id.toLowerCase();
    occurrence = (typeof occurrence !== "undefined") ? occurrence : 1;
    var new_group;

    // RL-2020-09-29
    if ( !repeating_group ) {
      new_group = $("<" + g_id + "/>");
    }
    else {
      var child_count = parent_group.length;
      if ( child_count == 0   // group tag not found
      ||   parent_group.prop('nodeName').toLowerCase() !== g_id.toLowerCase() ) { // group tag name not matched
        new_group = $("<" + g_id + "/>");
        var tmp_group = $("<" + g_id + "_occurrence occ='"+occurrence+"'/>");
        new_group.append(tmp_group);
      }
      else {
        new_group = $("<" + g_id + "_occurrence occ='"+occurrence+"'/>");
      }
    }

    parent_group.append(new_group);
    return true;
  };

  /*****
  **
  **  getElement : returns either an XML copy of a specific element, or will return false if no group is found.
  **
  **  params:
  **    - g_id : String value representing element name (_occurrence not required), eg: 'last_modified_by'
  **    - occurrence : String value representing occurrence number, or '0' if no occurrence required (elementary field), eg: '1'
  **    - parent_group : XML copy of the element's parent.  If not specified, defaults to the root <record>.
  **
   *****/
  this.getElement = function(e_id, occurrence, parent_group) {
    var element;
    parent_group = (typeof parent_group !== 'undefined' && parent_group) ? parent_group : xml;
    e_id = e_id.toLowerCase();
    var element_is_repeating = false;
    if ( parent_group.find(e_id + "_occurrence").length > 0 ) {
      if ( occurrence !== 0 ) {
        element_is_repeating = true;
      }
    }

    if (parent_group.find(e_id).length === 0) {
      return false;
    }

    if (element_is_repeating) {
      if (parent_group.find(e_id + "_occurrence[occ=" + occurrence + "]").length === 0) { return false; }
      element = parent_group.find(e_id + "_occurrence[occ=" + occurrence + "]");
    }
    else {
      element = parent_group.find(e_id);
    }
      // var tempxml = xml.find(e_id);
      // if(tempxml.next().length > 0){
      //   var nodeId = tempxml.next()[0].nodeName;
      //   var id_value = tempxml.next().text();
      //   $('#' + nodeId).val(id_value);
      // }
    return element;
  };


  /*****
  **
  **  getOccurrenceCount : returns an integer with the amount of occurrences for a field or repeating group.
  **
  **  params:
  **    - id : String value representing element name (_occurrence not required), eg: 'last_modified_by'
  **    - element_parent : XML copy of the element's parent.  If not specified, defaults to the root <record>.
  **
   *****/
  this.getOccurrenceCount = function(id, element_parent) {
    element_parent = (typeof element_parent !== "undefined" && element_parent) ? element_parent : xml;

    var numocc = element_parent.find(id + '_occurrence').length;   // RL-2021-09-13
    // if ( numocc == 0 ) {
      // count it as non-repeating field
    //   numocc = element_parent.find(id).length;
    // }
    return numocc;
  };

  /*****
  **
  **  addElement : returns true if element is added successfully.
  **
  **  params:
  **    - element_name : String value representing the desired element name, eg: 'new_field'
  **    - element_value : String value representing element's value, eg: 'Test Value'
  **    - element_is_repeating : Boolean representing whether the field is repeating or not, eg: 'false'
  **    - element_parent : XML copy of the element's desired parent.  If not specified, defaults to the root <record>.
  **
   *****/
  this.addElement = function(element_name, element_value, element_is_repeating, element_parent) {
    element_parent = (typeof element_parent !== 'undefined' && element_parent) ? element_parent : xml;
    var new_element;

    if (element_is_repeating) {
      var occurrence;

      if (element_parent.find(element_name).length > 0) {
        element_parent = element_parent.find(element_name);
        occurrence = element_parent.children().length + 1;
        new_element = $("<" + element_name + "_occurrence/>");
        new_element.attr('occ', occurrence);
        new_element.text(element_value);
      } else {
        new_element = $("<" + element_name + "/>");
        var temp_element = $("<" + element_name + "_occurrence/>");
        temp_element.attr('occ','1');
        temp_element.text(element_value);
        new_element.append(temp_element);
      }

    }
    else {
      new_element = $("<" + element_name + "/>");
      new_element.text(element_value);
    }

    element_parent.append(new_element);
    return true;
  };

  /*****
  **
  **  updateElement : returns true if element is successfully updated
  **
  **  params:
  **    - element : XML copy of element to be updated, eg: "record.getElement('sisn','0');"
  **    - new_value : String value representing the value to change element's value to, eg: "New Value"
  **
   *****/
  this.updateElement = function(element, new_value, occ) {
    // RL-2020-09-29
    if ( typeof element == 'undefined' || element === false ) {
      return false;
    }

    if ( typeof occ == 'undefined' ) {
      element.text(new_value);
    }
    else {
      if ( occ > 0 && occ <= element.length ) {
        element[occ-1].textContent = new_value;
      }
    }
    return true;
  };

  /*****
  **
  **  renameElement : returns true if element is successfully renamed
  **
  **  params:
  **    - element : XML copy of element to be updated, eg: "record.getElement('sisn','0');"
  **    - new_name : String value representing the value to change element's name to, eg: "new_element"
  **
   *****/
  this.renameElement = function(element, new_name) {
    new_name = new_name.toLowerCase();
    var old_name = element.prop('tagName').toLowerCase();
    var new_element = $('<' + new_name + '/>');

    if (typeof element.attr('occ') !== 'undefined') {
      new_element.attr('occ', element.attr('occ'));
    }

    if (element.children(old_name + '_occurrence').length > 0) {
      new_element.append(element.children());

      new_element.children(old_name + '_occurrence').each(function(){
        record.renameElement($(this), new_name + '_occurrence');
      });
    } else if (element.children().length > 0) {
      new_element.append(element.children());
    } else if (element.children().length === 0) {
      new_element.text(element.text());
    }

    element.replaceWith(new_element);
    return true;
  };


  /*****
  **
  **  removeElement : returns a boolean value for whether the operation was successful or not
  **
  **  params:
  **    - element : XML copy of element to be removed, eg: "record.getElement('sisn','0');"
  **
   *****/
  this.removeElement = function(element) {
    var cleanDeletedElement = function(element_to_delete) {
      if (element_to_delete.children().length === 0) {
        element_to_delete.text('');
      } else {
        element_to_delete.children().each(function(){
          cleanDeletedElement($(this));
        });
      }

      return element_to_delete;
    };

    var element_parent = element.parent();
    var cleaned_deleted_element;

    if (element.prop('tagName').toLowerCase().indexOf('_occurrence') !== -1) {
      if (element_parent.children().length > 1) {
        cleaned_deleted_element = cleanDeletedElement(element_parent.children().last().clone());
        element.remove();
        element_parent.append(cleaned_deleted_element);
        record.sortOccurrences(element_parent);
        return true;
      } else {
        element_grandparent = element_parent.parent();
        cleaned_element_parent = cleanDeletedElement(element_grandparent.children().last().clone());
        element_parent.remove();
        element_grandparent.append(cleaned_element_parent);
        record.sortOccurrences(element_grandparent);
        return true;
      }
    } else {
      cleaned_deleted_element = cleanDeletedElement(element.clone());
      element.remove();
      element_parent.append(cleaned_deleted_element);
      return true;
    }
    return false;
  };

  /*****
  **
  **  removeGroupOccurrence : returns a boolean value for whether the operation was successful or not
  **
  **  params:
  **    - element : XML copy of element to be removed, eg: "record.getElement('sisn','0');"
  **
  **  notes:
  **    - If the occurrence is the last occurrence, the whole group is removed.
  **
   *****/
  this.removeGroupOccurrence = function(group) {
    var cleanDeletedElement = function(occ_to_delete) {
      if (occ_to_delete.children().length === 0) {
        occ_to_delete.text('');
      } else {
        occ_to_delete.children().each(function(){
          cleanDeletedElement($(this));
        });
      }

      return occ_to_delete;
    };

    var group_parent = group.parent();

    if (group_parent.children().length > 1 || (group_parent.children().length === 1 && group_parent.parent().prop('tagName').toLowerCase() === 'record')) {
      cleaned_group = cleanDeletedElement(group_parent.children().last().clone());
      group.remove();
      group_parent.append(cleaned_group);
      record.sortOccurrences(group_parent);
      return true;
    } else {
      group_grandparent = group_parent.parent();
      cleaned_parent = cleanDeletedElement(group_grandparent.children().last().clone());
      group_parent.remove();
      group_grandparent.append(cleaned_parent);
      return true;
    }

    return false;
  };

  /*****
  **
  **  moveOccurrence : returns a boolean value for whether the operation was successful or not
  **
  **  params:
  **    - occurrence : XML copy of element to be updated, eg: "record.getGroup('last_modified','1');"
  **    - new_position : String value for desired occurrence position
  **
   *****/
  this.moveOccurrence = function(occurrence, new_position) {
    var old_occurrence = occurrence.attr('occ');
    var parent_element = occurrence.parent();
    var grandparent_element = parent_element.parent();

    if (parent_element.children('[occ='+ new_position +']').length > 0) {
      if (new_position > 1) {
        occurrence.insertAfter(parent_element.children('[occ=' + new_position + ']'));
      } else {
        occurrence.insertBefore(parent_element.children('[occ=' + new_position + ']'));
      }
    }

    record.sortOccurrences(parent_element.prop('tagName'), grandparent_element);
    return true;
  };

  /*****
  **
  **  sortOccurrences : returns a boolean value for whether the operation was successful or not
  **
  **  params:
  **    - group_name : String value representing group name to be sorted
  **    - group_parent : XML representation of the group-to-be-sorted's parent.  If not specified, defaults to root element.
  **
   *****/
  this.sortOccurrences = function(group_name, group_parent) {
    group_parent = (typeof group_parent !== 'undefined' && group_parent) ? group_parent : xml;

    var occ = 1;

    group_parent.find(group_name).children().each(function(){
      $(this).attr('occ', occ);
      occ++;
    });

    return true;
  };


  /*****
  **
  **  remap : returns a boolean value for whether the operation was successful or not
  **
  **  params:
  **    - loaded_xml : XML representation of data coming either from a validated table record, or an existing group in the record
  **    - map : a javascript object with a series of 'key's and 'value's.  A 'key' is field mnemonic in the validated table (original name),
  **            and a 'value' is the mnemonic name as it will exist after being remapped.
  **    - parent_group : XML representation of the caller of the remap's parent.  If not specified, defaults to root
  **
   *****/
  this.remap = function(loaded_xml, map, parent_group, is_repeating_field = false,  current_occ = undefined) {
    // MK-20230120 - add codes to handle mapping of repeating field
    // RL-2021-03-28
    var top_parent = (typeof parent_group !== 'undefined' && parent_group) ? false : true;
    parent_group = (!top_parent) ? parent_group : xml;   // RL-2021-07-04
    loaded_xml = loaded_xml.clone();

    // RL-2021-03-28
    var i, ix;  // RL-20230706
    var tmp_key;
    var tmp_val;
    var source_field;
    var target_field;
    var target_mnemonic;
    var source_value;
    var literal;

    // RL-20220922
    var has_selected_fieldinfo = false;
    var field_info = null;
    var xml_record_node = $(loaded_xml).find('record');
    if ( xml_record_node.length > 0 ) {
      field_info = $(xml_record_node).find('_fieldInfo');
      if ( field_info.length > 0 ) {
        has_selected_fieldinfo = true;
      }
    }

    // RL-20230706
    var target_repeate;
	var source_repeat;
	var sf;

    if ( top_parent ) {
      for (i=0; i < map.length; i++) {
        tmp_key = map[i].key;
        tmp_val = map[i].value;

        // RL-2021-05-31
        literal = false;
        if ( tmp_key.indexOf ('L=') == 0 ) {
          literal = true;
          tmp_key = tmp_key.substring(2);
        }

        target_mnemonic = tmp_val.toUpperCase();

        // RL-2023070
        target_repeat = false;
		source_repeat = false;
		if ( $('#'+target_mnemonic).parent().hasClass('repeating_field') ) {
		  target_repeat = true;
		}
		
        // check existence of target field in XML record
        target_field = this.getElement(tmp_val, 1, null);

        // RL-2021-05-31
        if ( literal ) {
          source_value = tmp_key;
          if ( source_value == '' ) {
            // does target field exist?
            if ( target_field !== false ) {
              // delete target field
              this.removeElement ( target_field );
            }
            else {
              // is target field defined?
              if ( target_field === false ) {
                // no, add target field
                this.addElement(tmp_val, source_value, false, null);
              }
              else {
                //  update target field
                this.updateElement(target_field, source_value );
              }
            }
          }
        }
        else {
          // RL-20220922
          source_value = null;
          if ( has_selected_fieldinfo ) {
            source_value = getSelectedValue( loaded_xml, tmp_key );
          }
          if ( source_value == null ) {
            // Is source field found?
            source_field = loaded_xml.find(tmp_key);
            if (source_field.length > 0) {
		      // RL-2023070		
			  sf = source_field.find(tmp_key+'_occurrence');
			  if ( $(sf).length > 1 ) {
				source_repeat = true;
			  }
              source_value = $(source_field[0]).text(); // RL-20220913
            }
            else {
              source_value = '';
            }
          }
          if ( source_value != null ) {
			// RL-2023070  
			if ( target_repeat ) {
			  // remove target field ocurrences
			  if ( target_field != false ) {
			    this.removeElement ( target_field );
			  }
			  
			  if ( source_repeat ) {
				// update XML reocrd 
				for ( ix = 0 ; ix < sf.length ; ix++ ) {
				  source_value = $(sf[ix]).text();
				  this.addElement(tmp_val, source_value, true, null);
				}
				
				// update form field
				source_value = $(sf[0]).text();
			  }
			  else {
				this.addElement(tmp_val, source_value, true, null);
			  }
			}				
			else {  // RL-2023070
              // is target field defined?
              if ( target_field === false ) {
                // no, add target field
                this.addElement(tmp_val, source_value, is_repeating_field, null);  // MK-20230120
              }
              else {
                //  update target field
                this.updateElement(target_field, source_value, current_occ);  // MK-20230120
              }
			}  // RL-2023070
          }
          else {
            source_value = '';

            // does target field exist?
            if ( target_field !== false ) {
              // delete target field
              this.removeElement ( target_field );
            }
          }
        }

        // update form field
        target_field = $('#'+target_mnemonic);
        if ( $(target_field).length > 0 ) {
          $(target_field).val(source_value);
          if ( target_field !== null ) {
            target_field.change();
          }
        }
      }
    }
    else {
      // Step one: Get relevant data from the validated record xml:
      var relevant_data = $('<relevant/>');

      for (var i=0; i < map.length; i++) {
        tmp_key = map[i].key;
        tmp_val = map[i].value;

        // RL-2021-05-31
        literal = false;
        if ( tmp_key.indexOf ('L=') == 0 ) {
          literal = true;
          tmp_key = tmp_key.substring(2);
        }
        else {
          // RL-20220922
          source_vaue = null;
          if ( has_selected_fieldinfo ) {
            source_value = getSelectedValue( loaded_xml, tmp_key );
            if ( source_value != null ) {
              relevant_data.append('<' + tmp_key + '>' + source_value + '</' + tmp_key + '>');
            }
          }

          if ( source_value == null ) {
            if (loaded_xml.find(tmp_key).length > 1) {
              var tmp = record.returnAsRepeatingField(loaded_xml.find(tmp_key));
              relevant_data.append(tmp);
              record.sortOccurrences(tmp_val, relevant_data);
            } else if (loaded_xml.find(tmp_key).length === 1) {
              relevant_data.append(loaded_xml.find(tmp_key));
            } else {
              relevant_data.append('<' + tmp_key + '/>');
            }
          }
        }
      }

      // Step two: Rename all relevant data:
      for (var i=0; i < map.length; i++) {
        tmp_key = map[i].key;    // RL-2021-05-31
        tmp_val = map[i].value;  // RL-2021-05-31

        // RL-2021-05-31
        literal = false;
        if ( tmp_key.indexOf ('L=') == 0 ) {
          literal = true;
          tmp_key = tmp_key.substring(2);
          relevant_data.append('<' + tmp_val + '>' + tmp_key + '</' + tmp_val + '>');
        }
        else {
          if (relevant_data.find(tmp_key).length > 0) {
            relevant_data.find(tmp_key).each(function(){
              record.renameElement($(this), tmp_val);
            });
          }
        }
      }

      // Step three: find any conflicting data and remove from parent_group:
      for (var i=0; i<map.length; i++) {
        tmp_key = map[i].key;    // RL-2021-05-31
        tmp_val = map[i].value;  // RL-2021-05-31

        var h_val = $(parent_group).find(tmp_val);
        if ( $(h_val).length > 0 ) {
          $(h_val).remove();
        }

        if ($(relevant_data).find(tmp_val).length > 1) {
          $(relevant_data).find(tmp_val).each(function(){
            if ($(this).text().length === 0) {
              $(this).remove();
            }
          });
        }
      }

      // Step four: Remove irrelevant stray nodes from relevant data:
      $(relevant_data).find('*').each(function(){
        var mnemonic = $(this).prop('tagName').toLowerCase();
        if (!isInMap(mnemonic, map)) {
          $(this).remove();
        }
      });

      relevant_data.children().each(function(){
        parent_group.append($(this));
      });
    }

    return true;
  };



  /*****
  **
  **  returnAsRepeatingField : returns an element setup as a repeating field
  **
  **  params:
  **    - element_array : An array of XML elements which all share a common mnemonic
  **
  **  notes:
  **    - This is used by the remapping function.  If a field in the validated table database is stored as an
  **      elementary field within a repeating group, but in the calling record is stored as a repeating field,
  **      this will ensure that the structure of the data returned is acceptable.
  **    - Why not fix the structure of the database to match? ¯\_(ツ)_/¯ MINISIS.
  **
   *****/
  this.returnAsRepeatingField = function(element_array) {
    var mnemonic = $(element_array[0]).prop('tagName').toLowerCase();
    var new_element = $('<' + mnemonic + '/>');
    var occurrence = 1;

    $(element_array).each(function() {
      var tmp_occ = $('<' + mnemonic + '_occurrence/>');
      tmp_occ.attr('occ', occurrence);
      tmp_occ.text($(this).text());
      new_element.append(tmp_occ);
      occurrence++;
    });

    return new_element;
  };

  /*****
  **
  **  hasActiveRestrictions : returns a boolean value for whether the record contains active restrictions
  **
  **  notes:
  **    - restriction_mnemonic needs to be specified in the database class for this to work.
  **
   *****/
  this.hasActiveRestrictions = function(){
    if (typeof record.params.restriction_mnemonic === 'undefined') { return false; }

    var restrictions = [];

    if (record.getElement(record.params.restriction_mnemonic)) {
      record.getElement(record.params.restriction_mnemonic).each(function(){ restrictions.push($(this).text()) });
    } else {
      return false;
    }

    if ($.inArray('Active', restrictions) >= 0) return true;

    return false;
  };

  /*****
  **
  **  getXML : returns a copy of the entire record in XML format
  **
  **  notes:
  **    - This is used for debugging purposes only to get an idea as to what's contained within the record
  **    - Changes to this XML does not affect the actual record
  **
   *****/
  this.getXML = function() {
    return xml.clone();
  };


  /*****
  **
  **  prepareSubmission : returns an HTML form ready for submission (with the addition of an "action" attribute)
  **
  **  params:
  **    - record_xml : A record, or piece of record, which is to be processed for submission to MINISIS.
  **    - form_html : Generated HTML used to submit a record to MINISIS
  **
  **  notes:
  **    - Both parameters are optional on a first call.  If no parameters are sent, it's going to take the complete record,
  **      and generate a new submission form.
  **
  **    - This is a recursive function.  Its base case is going to be that the XML it receives as a parameter has no children.
  **
  **    - By sending in the entire record at once, and ensuring that each child has no children, every element contained within
  **      the record will be included.
  **
  **    - This function is not enough to save a record.  You also need to have an appropriate "action" attribute for the form,
  **      which should be generated in the interface parameters.
  **
  **    - There's an `ignored_mnemonics` variable, which is used to block fields from being resubmitted to MINISIS.  This is used
  **      for fields like 'fullname', which MINISIS is going to generate on submission based on a first and last name.  If fullname
  **      is submitted, MINISIS will take that as the value to use and won't generate the proper value.
  **
   *****/
  this.prepareSubmission = function(record_xml, form) {
    // var ignored_mnemonic is defined in app_de_config.js file

    record_xml = (typeof record_xml !== 'undefined') ? record_xml : xml;
    form = (typeof form !== 'undefined') ? form : $("#submission-form");

    if (record_xml.children().length === 0) {
      var occ = [];
      var name = record_xml.prop('tagName').toLowerCase();
      var fld_val = htmlEscape(record_xml.text());
      var in_group = false;
      var field = $('<input type="hidden"/>');

      // check repeatable group tag
      var nextElement = record_xml.next();
      var nextName = '';
      if ( typeof nextElement != 'undefined' ) {
        nextName = $(nextElement).prop('tagName');
        if ( typeof nextName == 'undefined' ) {
          nextName = '';
        }
        else {
          nextName = nextName.toLowerCase();
        }
      }

      // ignore repeatable group tag
      if ( nextName == name+'_occurrence' ) {
        in_group = false;
      }
      else {
        // Repeating Field:
        if (name.indexOf('_occurrence') > -1) {
          name = name.replace('_occurrence', '');
          occ.push(record_xml.attr('occ'));
        }

        record_xml.parents().each(function(){
          if (typeof $(this).attr('occ') !== 'undefined') {
            occ.push($(this).attr('occ'));
            in_group = true;
          }
        });

        while (occ.length > 0) {
          name = name + "$" + occ.pop();
        }

        if (typeof record_xml.attr('occ') == 'undefined' && in_group) {
          name = name + "$1";
        }

        field.attr('name', name);
        field.val(fld_val);

        if (!isInArray(field.attr('name'), ignored_mnemonics)) form.append(field);
      }
    }
    else {
      record_xml.children().each(function(){
        record.prepareSubmission($(this), form);
      });
    }
  };

  // RL-2020-09-29
  /*****
  **
  **  recordToForm : copy record fields to form fields
  **
  **  params:
  **    - loaded_xml : XML representation of data coming either from a validated table record, or an existing group in the record
  **    - map : a javascript object with a series of 'key's and 'value's.  A 'key' is field mnemonic in the validated table (original name),
  **            and a 'value' is the mnemonic name as it will exist after being remapped.
  **
   *****/
  this.recordToForm = function(loaded_xml, map) {
    parent_group = xml;
    loaded_xml = loaded_xml.clone();

    for (var i=0; i < map.length; i++) {
      var target = document.getElementById(map[i].value);
      var source = loaded_xml.find(map[i].key);
      if ( target != null ) {
        if ( source.length > 0 ) {
          target.value = source[0].textContent;
        }
        else {
          target.value = "";
        }
      }
    }
  };


  // RL-2021-01-24
  /*****
  **
  **  getMARCFieldList : return an array of MARC fields
  **
  **  params:
  **    none
  **
   *****/
  this.getMARCFieldList = function() {
    var childNode = xml.children();
    var field_list = [];
    var occ_node;
    var i, ix;
    var hold_value;
    for ( i = 0 ; i < childNode.length ; i++ ) {
      if ( childNode[i].nodeName.indexOf("MARC__") == 0 ) {
        occ_node = childNode[i].children;
        if ( occ_node.length == 0 ) {
          field_list.push ( childNode[i].nodeName );
        }
        else {
          // append suffix * character to MARC tag to indicate repeating MARC field
          field_list.push ( childNode[i].nodeName + MARC_REPEAT_FLAG );
        }
      }
    }

    // sort MARC tag list in ascending order
    field_list.sort();

    return field_list;
  };

  // extract selected field value - selected field info is stored in XML structure as below
  //   <record>
  //     <_fieldInfo>  <- selected field information
  //       <fieldName>name></fieldName>
  //       <fieldValue>value</fieldValue>
  //     </-fieldInfo>
  //   </record>

  function getSelectedValue( loaded_xml, field_mnemonic ) {
    var result = null;

    // count number of <_fieldInfo> tag
    var fieldInfo = loaded_xml.find('_fieldInfo');
    // process each <_fieldIfo> tag
    for ( var ix = 0 ; ix < fieldInfo.length ; ix++ ) {
      // search <fieldName> tag
      var fieldName = $(fieldInfo[ix]).find('fieldName');

      // compare <fieldNmae> tag value with field_mnemonc
      if ( fieldName.length > 0 && $(fieldName[0]).text() == field_mnemonic ) {
        // if found, extract <fieldValue> tag
        var fieldValue = $(fieldInfo[ix]).find('fieldValue');

        // if <fieldValue> tag is found, set result to <fieldValue> tag value
        if ( fieldValue.length > 0 ) {
          result = $(fieldValue[0]).text();
        }
        break;
      }
    }

    return result;
  }
};
