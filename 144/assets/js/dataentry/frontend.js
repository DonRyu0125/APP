// declare global constants
const NOIMMAGE_PATH                    = "/m3online/assets/img/image-placeholder.png";

var init = function(callback) {
  // RL-2021-05-31
  // create MARC HTML fields
  $('#marc_field_table').each(function() { setupMarcTable($(this)); });

  $('#data_entry_forms').find('*').not('nav#worksheet_nav a, #COLLECTION_TYPE').off();
  $('div.field_container').find('input[type=checkbox]').each(function() { setupCheckBoxes($(this)); });
  $('div.validated_table').each(function() { setupValidatedTableField($(this)); });
  $('div.language_table').each(function() { setupLanguageTableField($(this)); });
  $('fieldset.contains_image').each(function() { addImagePlaceholder($(this)); });
  $('fieldset.repeating_group').each(function() { setupRepeatingGroup($(this)); });
  $('div.repeating_field').each(function() { setupRepeatingField($(this)); });
  $('div.org_validated_field').each(function() { setupBrowseField($(this), 'organizations'); });
  $('div.sites_validated_field').each(function() { setupBrowseField($(this), 'sites'); });
  $('div.cevents_validated_field').each(function() { setupBrowseField($(this), 'cevents'); });
  $('div.enq_validated_field').each(function() { setupBrowseField($(this), 'enquiries'); });
  $('div.project_validated_field').each(function() { setupBrowseField($(this), 'project'); });
  $('div.incident_validated_field').each(function() { setupBrowseField($(this), 'incident'); });
  $('div.prop_validated_field').each(function() { setupBrowseField($(this), 'properties'); });
  $('div.building_validated_field').each(function() { setupBrowseField($(this), 'building'); });
  $('div.bldg_validated_field').each(function() { setupBrowseField($(this), 'buildings'); });
  $('div.people_validated_field').each(function() { setupBrowseField($(this), 'people'); });
  $('div.location_validated_field').each(function() { setupBrowseField($(this), 'locations'); });
  $('div.acqmeth_validated_field').each(function() { setupBrowseField($(this), 'acqmeth'); })
  $('div.artlocations_validated_field').each(function() { setupBrowseField($(this), 'artlocations'); }); // KN-2022-05-28
  $('div.schedule_validated_field').each(function() { setupBrowseField($(this), 'schedule'); });
  $('div.lib_validated_field').each(function() { setupBrowseField($(this), 'lib'); });  // RL-2021-03-28
  $('div.m3_validated_field').each(function() { setupBrowseField($(this), 'm3'); });
  $('div.m2a_validated_field').each(function() { setupBrowseField($(this), 'm2a'); });
  $('div.accession_validated_field').each(function() { setupBrowseField($(this), 'accession'); });  // RL-2021-03-28
  $('div.client_validated_field').each(function() { setupBrowseField($(this), 'client'); });  // RL-2021-03-28
  $('div.repro_validated_field').each(function() { setupBrowseField($(this), 'acc'); });
  $('div.loans_validated_field').each(function() { setupBrowseField($(this), 'loans'); });  // kn-2024-04-24

  // BOC validated tables - RL-20230313
  $('div.city_validated_field').each(function() { setupBrowseField($(this), 'city'); })
  $('div.district_validated_field').each(function() { setupBrowseField($(this), 'district'); })
  $('div.province_validated_field').each(function() { setupBrowseField($(this), 'province'); })
  $('div.country_validated_field').each(function() { setupBrowseField($(this), 'country'); })
  $('div.place_validated_field').each(function() { setupBrowseField($(this), 'place'); })
  $('div.category_validated_field').each(function() { setupBrowseField($(this), 'category'); })
  $('div.class_validated_field').each(function() { setupBrowseField($(this), 'class'); })
  $('div.subclass_validated_field').each(function() { setupBrowseField($(this), 'subclass'); })
  $('div.primary_validated_field').each(function() { setupBrowseField($(this), 'primary'); })
  $('div.secondary_validated_field').each(function() { setupBrowseField($(this), 'secondary'); })
  $('div.tertiary_validated_field').each(function() { setupBrowseField($(this), 'tertiary'); })
  $('div.nomenclature_validated_field').each(function() { setupBrowseField($(this), 'nomenclature'); })
  $('div.dateera_validated_field').each(function() { setupBrowseField($(this), 'dateera'); })
  $('div.designinfo_validated_field').each(function() { setupBrowseField($(this), 'designinfo'); })
  $('div.detailinfo_validated_field').each(function() { setupBrowseField($(this), 'detailinfo'); })
  $('div.makertype_validated_field').each(function() { setupBrowseField($(this), 'makertype'); })
  $('div.assocperson_validated_field').each(function() { setupBrowseField($(this), 'assocperson'); })
  $('div.specification_validated_field').each(function() { setupBrowseField($(this), 'specification'); })
  $('div.education_validated_field').each(function() { setupBrowseField($(this), 'education'); });
  $('div.registration_root_validated_field').each(function() { setupBrowseField($(this), 'registration_root'); });
  $('div.restrictions_validated_field').each(function() { setupBrowseField($(this), 'restrictions'); });
  $('div.denomination_validated_field').each(function() { setupBrowseField($(this), 'denomination'); });
  $('div.colour_validated_field').each(function() { setupBrowseField($(this), 'colour'); });
  $('div.subject_validated_field').each(function() { setupBrowseField($(this), 'subject'); })
  $('div.material_validated_field').each(function() { setupBrowseField($(this), 'material'); });
  $('div.technique_validated_field').each(function() { setupBrowseField($(this), 'technique'); });
  $('div.objname_validated_field').each(function() { setupBrowseField($(this), 'objname'); });

  $('div.matthes_validated_field').each(function() { setupBrowseField($(this), 'matthes'); });
  $('div.collectioncode_validated_field').each(function() { setupBrowseField($(this), 'collectioncode'); });  // KN-2021-11-27
  $('div.medium_validated_field').each(function() { setupBrowseField($(this), 'medium'); });
  $('div.relship_validated_field').each(function() { setupBrowseField($(this), 'relship'); });
  $('div.orelationship_validated_field').each(function() { setupBrowseField($(this), 'orelationship'); });
  $('div.forbiddenword_validated_field').each(function() { setupBrowseField($(this), 'forbiddenword'); });  // KN-2021-08-06
  $('div.recseries_validated_field').each(function() { setupBrowseField($(this), 'recseries'); });  // RL-2021-09-07
  $('div.ministry_validated_field').each(function() { setupBrowseField($(this), 'ministry'); });
  $('div.event_validated_field').each(function() { setupBrowseField($(this), 'event'); });  // RL-20220106
  $('div.container_validated_field').each(function() { setupBrowseField($(this), 'container'); });  // RL-2022-02-07
  $('div.validated_field').each(function() { setupBrowseField($(this), $(this).data('table')); });  // RL-20221230
  $('div.multi_validated_field').each(function() { setupBrowseField($(this), '', true); });  // RL-20230320
  $('div.file_attachment.image').each(function() { setupBrowseField($(this), 'image_upload'); });
  $('div.file_attachment.video').each(function() { setupBrowseField($(this), 'video_upload'); });
  $('div.file_attachment.audio').each(function() { setupBrowseField($(this), 'audio_upload'); });
  $('div.file_attachment.text').each(function() { setupBrowseField($(this), 'text_upload'); });
  $('div.file_attachment.misc').each(function() { setupBrowseField($(this), 'file_upload'); });
  $('div.url_field').each(function() { setupBrowseField($(this), 'url'); });
  $('div.date').each(function() { setupDatepicker($(this)); });
  $('select.set_ai_value').each(function() {setupAIField($(this)); });  // RL-2020-11-10
  $('#data_entry_forms select').not('[class*="ui"]').each(function() { setupSelectBoxes($(this)); });
  $('span.check i').on('click', function() { handleCheckBoxes($(this)); });

  $('a.image_clicked').on('click', function() { currentAppInterface.showImageBox($(this)); });  // RL-20220131

  // RL-2021-03-28
  $('a.call_exit').on('click', function () {
    var proceedProcessing = true;
    if ( typeof exitDefaultController == 'function' ) {
      proceedProcessing = exitDefaultController($(this));
    }
    if ( proceedProcessing && typeof exitController == 'function' ) {
      proceedProcessing = exitController($(this));
    }
  });

  // RL-2021-05-31
  if ( $('body').find('#add_marc').length > 0 ) {
    $('#add_marc').on('click', function () {
      addMarcFields();
    });
  }

  // setup listener for field with marc_data class - RL-2021-10-08
  $('.marc_data').keydown(function(e) {
    marcFieldKeypress(e);
  });

  // set up handler for manip_record class
  $('a.manip_record').on('click',function(){
    if(typeof manip_record == 'function'){
      manip_record($(this));
    }
  });

  if ( currentAppInterface != null
  &&   typeof currentAppInterface.appWorksheetHandler == 'function' ) {
    currentAppInterface.appWorksheetHandler();
  }

  $('fieldset li.repeating_group_title').on('click', 'a.hide_group', function(e) { hideGroup($(this), e); });
  if ($('.current_page').length > 0) selectActiveTab($('.current_page').attr('id'));
  if (typeof callback == 'function') callback();

  // RL-2021-03-16
  // setup group list
  $('.generic_table').each(function() { setupGroupList($(this)); });

  // RL-2021-05-31
  $('.richText').each(function() { loadRichTextField($(this)); });

  // RL-2021-05-31
  $('a.toggle_data_section').on('click', function ()
  {
    var section_id = $(this).data('section');
    if ( section_id != null ) {
      hide_show_div( section_id );
    }
  });

  // RL-2021-05-31
  $('a.view_authority_record').on('click', function ()
  {
    viewAuthorityRecord ( $(this) );
  });

  // call form initialization user routines  // RL-2021-03-28
  $('.init_call_exit').each(function()  {
    var proceedProcessing = true;
    if ( typeof exitDefaultController == 'function' ) {
      proceedProcessing = exitDefaultController($(this));
    }
    if ( proceedProcessing && typeof exitController == 'function' ) {
      proceedProcessing = exitController($(this));
    }
  });
};


var addImagePlaceholder = function(caller) {
  var img_tag = '<a href="#" class="image_clicked"><img class="field_img" src="' + NOIMMAGE_PATH + '"></a>'; // RL-20220131
  $(caller).prepend(img_tag);
};

var generateRecordSavingForm = function(record_type) {
  // RL-2020-09-29
  var db_save = null;

  if (record_type === 'normal') {
    // RL-2020-09-29
    db_save = document.getElementById("dba_save");
    if (db_save != null && $('#dba_save a').data('form-action').length > 0) {
      var html = $('<form id="submission_form" method="post"/>');
      html.attr('action', $('#dba_save a').data('form-action'));
      $('body').append(html);
    }
  } else {
    // RL-2020-09-29
    db_save = document.getElementById("dba_save_record");
    if (db_save != null && $('#dba_save_record a').data('form-action').length > 0) {
      var html = $('<form id="valtable_submission_form" method="post"/>');
      html.attr('action', $('#dba_save_record a').data('form-action'));
      $('body').append(html);
    }
  }
};


var updateDatabaseActionLinks = function() {
  cleanDatabaseActionLink(site_params.add_link, '#dba_add');
  cleanDatabaseActionLink(site_params.global_change_link, '#dba_global_change');
  cleanDatabaseActionLink(site_params.save_link, '#dba_save');
  cleanDatabaseActionLink(site_params.search_link, '#dba_search');
  cleanDatabaseActionLink(site_params.skip_link, '#dba_cancel');

  if (window.location.href.indexOf('DBOPTION=ADD') > -1) {
    $('li#dba_cancel a').attr('href', $('li#dba_search a').attr('href'));
  }
};

var cleanDatabaseActionLink = function(link, selector) {
  if (link.indexOf('^') < 0) {
    if (selector === '#dba_save') {
      $(selector).find('a').removeClass('disabled').data('form-action', link);
    } else {
      $(selector).find('a').removeClass('disabled').attr('href', link);
    }
  } else {
    if (!$(selector).find('a').hasClass('disabled')) {
      $(selector).find('a').addClass('disabled');
    }
  }
};

/*****
**
**  setupRepeatingGroup : updates passed HTML elements with appropriate occurrence information and occurrence handling chrome
**
**  params:
**    - caller : an HTML fieldset element
**
 *****/
var setupRepeatingGroup = function(caller) {
  var group_title = $(caller).data('group-title');
  var html = $('<div class="repeating_group_metadata"/>');

  var metadata = $('<ul/>');
  metadata.append($('<li class="repeating_group_title"><a class="hide_group" title="Hide Group" href="#"><i class="fa fa-eye"></i></a> '+group_title+'</li>'));
  metadata.append($('<li class="repeating_group_current_occurrence">1</li>'));
  metadata.append($('<li>of</li>'));
  metadata.append($('<li class="repeating_group_total_occurrences">1</li>'));
  html.append(metadata);

  // RL-20230125 - hide next and previous icon if single occurrence grouped field
  var single_occ = $(caller).hasClass('single_occ');
  if ( !single_occ ) {
    var chrome = $('<ul class="repeating_group_chrome"/>');
    chrome.append($('<li><a href="#" class="previous"><i class="fa fa-caret-up fa-lg"></i></a></li>'));
    chrome.append($('<li><a href="#" class="next"><i class="fa fa-caret-down fa-lg"></i></a></li>'));
    html.append(chrome);
  }

  $(caller).prepend(html);
};


/*****
**
**  setupRepeatingField : updates passed HTML elements with appropriate occurrence information and occurrence handling chrome
**
**  params:
**    - caller : an HTML div element containing a `label` element, and an input element (either input[type=text], or select).
**
 *****/
var setupRepeatingField = function(caller) {
  var occurrence_info = $('<ul class="repeating_field_metadata"/>');
  occurrence_info.append($('<li class="current_occurrence">1</li>'));
  occurrence_info.append($('<li>of</li>'));
  occurrence_info.append($('<li class="total_occurrences">1</li>'));

  // Is ocurrence chrome already loaded? // RL-20211025
  var h_label = $(caller).find('label');
  if ( $(h_label).length > 0 ) {
    var h_ul = $(h_label).find('ul.repeating_field_metadata');
    if ( $(h_ul).length <= 0 ) {
      // no, insert repeating field metadata
      $(caller).find('label').append(occurrence_info);

      var occurrence_chrome;  // RL-20211231

      // RL-2021-05-31
      if (caller.find('textarea').length > 0) {
        // RL-20211231
        if ( $(caller).find('.marc_body').length > 0 ) {
          occurrence_chrome = $('<ul class="repeating_field_chrome marc"/>');
        }
        else {
          occurrence_chrome = $('<ul class="repeating_field_chrome big"/>');
        }

        // add padding to right to avoid overlaying of input and occurrence toggle
        $(caller).css("padding-right", "38px" );    // RL-20230904
      }
      else {
        occurrence_chrome = $('<ul class="repeating_field_chrome"/>');

        // add padding to right to avoid overlaying of input and occurrence toggle - RL-2021-02-06
        if ( $(caller).hasClass('validated_table') ) {
          $(caller).css("padding-right", "45px" );
        }
        else {
          $(caller).css("padding-right", "28px" );
        }
      }

      // RL-20211028
      var h_div = $(caller).parents('div#universal_record_information');
      if ( h_div.length > 0 ) {
        // if field is inside the "universal_record_information" div, adjust margin of occurrence chrome
        occurrence_chrome.append($('<li><a href="#" class="previous" style="margin: 0px -8px 0px 0px;"><i class="fa fa-caret-up"></i></a></li>'));
        occurrence_chrome.append($('<li><a href="#" class="next" style="margin: 3px -8px 0px 0px;"><i class="fa fa-caret-down"></i></a></li>'));
      }
      else {
        occurrence_chrome.append($('<li><a href="#" class="previous"><i class="fa fa-caret-up"></i></a></li>'));
        occurrence_chrome.append($('<li><a href="#" class="next"><i class="fa fa-caret-down"></i></a></li>'));
      }

      // RL-2021-05-31
      $(caller).addClass('input-append');
      $(caller).append(occurrence_chrome);
    }
  }
};


/*****
**
**  setupValidatedTableField : updates passed HTML elements with appropriate handling toggles
**
**  params:
**    - caller : an HTML div element containing a `label` element, and an input element (either input[type=text], or select).
**
 *****/
var setupValidatedTableField = function(caller) {
  // rl-2020-09-29
  var readonly_field = false;
  if ( currentAppInterface != undefined && currentAppInterface != null ) {
    readonly_field = currentAppInterface.readonlyRecord();
  }
  if ( !readonly_field ) {
    readonly_field = checkReadOnly(caller);
  }
  if ( readonly_field ) {  // RL-20240524
    var edit_enabled = checkEditFlag(caller);
    if ( edit_enabled != null && edit_enabled ) {
      readonly_field = false;
    }
  }

  if ( !readonly_field ) {  // rl-2020-09-29
    $(caller).addClass('input-append');
    var toggle_html = $('<a class="browse_trigger"><i class="fa fa-bars fa-lg"></i></a>');
    $(caller).append(toggle_html);
  }  // rl-2020-09-29
};

/*****
**
**  setupLanguageTableField : updates passed HTML elements with appropriate handling toggles
**
**  params:
**    - caller : an HTML div element containing a `label` element, and an input element (either input[type=text], or select).
**
 *****/
var setupLanguageTableField = function(caller) {
  // rl-2020-09-29
  var readonly_field = false;
  if ( !readonly_field ) {  // RL-20240524
    if ( currentAppInterface != undefined && currentAppInterface != null ) {
      readonly_field = currentAppInterface.readonlyRecord();
    }
  }
  if ( !readonly_field ) {   // RL-20240524
    readonly_field = checkReadOnly(caller);
  }
  if ( readonly_field ) {  // RL-20240524
    var edit_enabled = checkEditFlag(caller);
    if ( edit_enabled != null && edit_enabled ) {
      readonly_field = false;
    }
  }
  if ( !readonly_field ) { // rl-2020-09-29
    $(caller).addClass('input-append');
    var toggle_field = $(caller).find('input').first();
    var toggle_html = $('<a class="language_trigger" data-val-database="' + toggle_field.data('val-database') + '" data-val-field="'+ toggle_field.data('val-field') + '" data-map="' + toggle_field.data('map') + '"><i class="fa fa-comment fa-lg"></i></a>');
    $(caller).append(toggle_html);
  }  // rl-2020-09-29
};



/*****
**
**  setupBrowseField : updates passed HTML elements with appropriate chrome to load validated table and file attachment fields
**
**  params:
**    - caller : an HTML div element containing a `label` element and an input[type=text] element.
**    - field_type : a string describing the type of browse field to be handled
***   - multi_tables : flag to indicate multiple validated tables. If ttrue, parameters are defined
**      in data-tableN attributes. Attribute value has format of <tablle name>,<msp nsme>[,<tooptip hhelp]>]

*******/
var setupBrowseField = function(caller, field_type, multi_tables = false) {
  // MH-20230131
  if ( $(caller).find('ul').hasClass('browse_chrome') ) {
    if ( $(caller).parents('div#universal_record_information').length > 0 ) { // RL-20230202
      return;
    }
  }

  // RL-2021028
  var view_class = '';

  // rl-2020-09-29
  var readonly_field = false;
  if ( !readonly_field ) {  // RL-20240524
    if ( currentAppInterface != undefined && currentAppInterface != null ) {
      readonly_field = currentAppInterface.readonlyRecord();
    }
  }
  if ( !readonly_field ) {  // RL-20240524
    readonly_field = checkReadOnly(caller);
  }
  if ( readonly_field ) {  // RL-20240524
    var edit_enabled = checkEditFlag(caller);
    if ( edit_enabled != null && edit_enabled ) {
      readonly_field = false;
    }
  }

  // 2022-01-25
  if ( $(caller).hasClass('view_by_name') == true ) {
    view_class = 'view_by_name ';
  }

  var browse_chrome = $('<ul class="browse_chrome"/>');

  var no_search_link = $(caller).hasClass('no_search_link');   // RL-20230419
  var no_view_link = $(caller).hasClass('no_view_link');       // RL-20230419
  var clear_dbname = field_type;  // RL-20231004
  var add_clear_link = true;  // RL-20231004

  switch (field_type) {
    case 'people':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_people" title="Load Person Authority"><i class="fa fa-user fa-lg"></i></a></li>'));
      }  // rl-2020-09-29
      if ( no_view_link == false ) {  // RL-2021-05-31
        view_class += 'view_people';
        browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'organizations':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_org" title="Load Organization Authority"><i class="fa fa-building fa-lg"></i></a></li>'));
      }  // rl-2020-09-29
      if ( no_view_link == false ) {  // RL-2021-05-31
        view_class += 'view_org';
        browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'properties':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_prop" title="Load Property Authority"><i class="fa fa-building fa-lg"></i></a></li>'));
      }  // rl-2020-09-29
      if ( no_view_link == false ) {  // RL-2021-05-31
        view_class += 'view_prop';
        browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'building':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_building" title="Load Building Authority"><i class="fa fa-building fa-lg"></i></a></li>'));
      }  // rl-2020-09-29
      if ( no_view_link == false ) {  // RL-2021-05-31
        view_class += 'view_building';
        browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'buildings':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_bldg" title="Load Building Authority"><i class="fa fa-building fa-lg"></i></a></li>'));
      }  // rl-2020-09-29
      if ( no_view_link == false ) {  // RL-2021-05-31
        view_class += 'view_bldg';
        browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'locations':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_locations" title="Load Location Authority"><i class="fa fa-map-marker fa-lg"></i></a></li>'));
      }  // rl-2020-09-29
      if ( no_view_link == false ) {  // RL-2021-05-31
        view_class += 'view_locations';
        browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'artlocations':  // KN-2022-05-28
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_artlocations" title="Load Art Location Authority"><i class="fa fa-map-marker fa-lg"></i></a></li>'));
      }  // rl-2020-09-29
      if ( no_view_link == false ) {  // RL-2021-05-31
        view_class += 'view_artlocations';
        browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'event':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_event" title="Load Event Authority"><i class="fa fa-ticket fa-lg"></i></a></li>'));
      }  // rl-2020-09-29
      view_class += 'view_event'; // RL-20211028
      browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      break;
    case 'acqmeth':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_acqmeth" title="Load Acquisition Method Authority"><i class="fa fa-comment fa-lg"></i></a></li>'));
      }  // kn-2021-02-16
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_acqmeth';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'city':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_city" title="Load City Authority"><i class="fa fa-map fa-lg"></i></a></li>'));
      }  // kn-2021-02-17
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_city';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'district':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_district" title="Load District Authority"><i class="fa fa-map fa-lg"></i></a></li>'));
      }  // kn-2021-02-17
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_district';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'province':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_province" title="Load Province Authority"><i class="fa fa-map fa-lg"></i></a></li>'));
      }  // kn-2021-02-17
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_province';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'country':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_country" title="Load Country Authority"><i class="fa fa-map fa-lg"></i></a></li>'));
      }  // kn-2021-02-16
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_country';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'place':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_place" title="Load Place Authority"><i class="fa fa-map fa-lg"></i></a></li>'));
      }  // kn-2021-02-17
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_place';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'category':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_category" title="Load Category Authority"><i class="fa fa-map fa-lg"></i></a></li>'));
      }  // kn-2021-02-17
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_category';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'class':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_class" title="Load Class Authority"><i class="fa fa-map fa-lg"></i></a></li>'));
      }  // kn-2021-02-17
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_class';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'subclass':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_subclass" title="Load Sub Class Authority"><i class="fa fa-map fa-lg"></i></a></li>'));
      }  // kn-2021-02-17
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_subclass';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'primary':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_primary" title="Load Primary Authority"><i class="fa fa-map fa-lg"></i></a></li>'));
      }  // kn-2021-02-17
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_primary';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'secondary':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_secondary" title="Load Secondary Authority"><i class="fa fa-map fa-lg"></i></a></li>'));
      }  // kn-2021-02-17
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_secondary';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'tertiary':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_tertiary" title="Load Tertiary Authority"><i class="fa fa-map fa-lg"></i></a></li>'));
      }  // kn-2021-02-17
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_tertiary';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'dateera': // kn-2021-08-25
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_dateera" title="Load Date Era Authority"><i class="fa fa-comment fa-lg"></i></a></li>'));
      }
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_dateera';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'designinfo': // kn-2021-10-03
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_designinfo" title="Load Design Info Authority"><i class="fa fa-cogs fa-lg"></i></a></li>'))
      }
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_designinfo'; // RL-20211028
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'detailinfo': // kn-2021-10-03
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_detailinfo" title="Load Detail Info Authority"><i class="fa fa-indent fa-lg"></i></a></li>'));
      }
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_detailinfo';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'makertype': // kn-2021-08-25
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="makertype" title="Load Maker Type Authority"><i class="fa fa-comment fa-lg"></i></a></li>'));
      }
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_makertype';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'assocperson': // kn-2021-08-25
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_assocperson" title="Load Assoc. Person Type Authority"><i class="fa fa-user-plus fa-lg"></i></a></li>'));
      }
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_assocperson';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'specification':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_specification" title="Load Specification Authority"><i class="fa fa-commenting fa-lg"></i></a></li>'));
      }  // rl-2020-09-29
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_specification';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'education':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_education" title="Load Education Authority"><i class="fa fa-building fa-lg"></i></a></li>'));
      }  // rl-2020-09-29
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_educaton';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'registration_root':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_registration_root" title="Load Acquisitions Authority"><i class="fa fa-book fa-lg"></i></a></li>'));
      } // rl-2020-09-29
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_registration_root';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'denomination':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_denomination" title="Load Denomination Authority"><i class="fa fa-comment fa-lg"></i></a></li>'));
      }  // kn - 2021-02-16
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_denomination';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'colour':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_colour" title="Load Colour Authority"><i class="fa fa-paint-brush fa-lg"></i></a></li>'));
      }  // rl-2020-09-29
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_colour';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'subject':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_subject" title="Load Subject Authority"><i class="fa fa-star fa-lg"></i></a></li>'));
      }  // rl-2020-09-29
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_subject';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'nomenclature':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_nomenclature" title="Load Nomenclature Authority"><i class="fa fa-sitemap fa-lg"></i></a></li>'));
      }  // rl-2020-09-2
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_nomenclature';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'material':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_material" title="Load Material Authority"><i class="fa fa-puzzle-piece fa-lg"></i></a></li>'));
      }  // kn-2021-11-16
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_material';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'technique':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_technique" title="Load Technique Authority"><i class="fa fa-share-alt-square fa-lg"></i></a></li>'));
      }  // kn-2021-11-16
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_technique';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'objname':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_objname" title="Load Object Name Authority"><i class="fa fa-tag fa-lg"></i></a></li>'));
      }  // kn-2021-10-16
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_objname';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'acc':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_acc" title="Load Acession Authority"><i class="fa fa-file-alt fa-lg"></i></a></li>'));
      }  // kn 2021-01-28
      if ( no_view_link == false ) {  // RL-2021-05-31
        view_class += 'view_acc';
        browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'restrictions':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_restrictions" title="Load Restrictions Authority"><i class="fa fa-warning fa-lg"></i></a></li>'));
      }  // rl-2020-09-29
      if ( no_view_link == false ) {  // RL-2021-05-31
        view_class += 'view_restrictions';
        browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'schedule':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_schedule" title="Load Schedule Authority"><i class="fa fa-comment fa-lg"></i></a></li>'));
      }  // kn 2021-01-28
      if ( no_view_link == false ) {  // RL-2021-05-31
        view_class += 'view_schedule';
        browse_chrome.append($('<li><a class="' + view_class + '" title="View Schedule Authority"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'enquiries':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_enq" title="Load Inquiries Authority"><i class="fa fa-building fa-lg"></i></a></li>'));
      }  // rl-2020-09-29
      if ( no_view_link == false ) {  // RL-2021-05-31
        view_class += 'view_enq';
        browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'project':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_project" title="Load Project Authority"><i class="fa fa-building fa-lg"></i></a></li>'));
      }  // rl-2020-09-29
      if ( no_view_link == false ) {  // RL-2021-05-31
        view_class += 'view_project';
        browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'incident':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_incident" title="Load Incident Authority"><i class="fa fa-building fa-lg"></i></a></li>'));
      }  // rl-2020-09-29
      if ( no_view_link == false ) {  // RL-2021-05-31
        view_class += 'view_incident';
        browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'sites':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_sites" title="Load Sites Authority"><i class="fa fa-comment fa-lg"></i></a></li>'));
      }  // rl-2020-09-29
      if ( no_view_link == false ) {  // RL-2021-05-31
        view_class += 'view_sites';
        browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'cevents':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_cevents" title="Load Collection Events Authority"><i class="fa fa-comment fa-lg"></i></a></li>'));
      }  // rl-2020-09-29
      if ( no_view_link == false ) {  // RL-2021-05-31
       view_class += 'view_cevents';
       browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'file_upload':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load" data-media-type="file" title="Attach File"><i class="fa fa-paperclip fa-lg"></i></a></li>'));
      }  // rl-2020-09-29
      if ( no_view_link == false ) {  // RL-2021-05-31
        view_class += 'view_link';
        browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'image_upload':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load" data-media-type="image" title="Attach Image"><i class="fa fa-file-image-o fa-lg"></i></a></li>'));
      }
      if ( no_view_link == false ) {  // RL-2021-05-31
        view_class += 'view_link__2';
        browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'video_upload':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load" data-media-type="video" title="Attach Video"><i class="fa fa-file-video-o fa-lg"></i></a></li>'));
      }  // rl-2020-09-29
      if ( no_view_link == false ) {  // RL-2021-05-31
        view_class += 'view_link__3';
        browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'audio_upload':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load" data-media-type="audio" title="Attach Audio"><i class="fa fa-file-audio-o fa-lg"></i></a></li>'));
      }  // rl-2020-09-29
      if ( no_view_link == false ) {  // RL-2021-05-31
        view_class += 'view_link__4';
        browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'text_upload':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load" data-media-type="text" title="Attach Document"><i class="fa fa-file-text-o fa-lg"></i></a></li>'));
      }  // rl-2020-09-29
      if ( no_view_link == false ) {  // RL-2021-05-31
        view_class += 'view_link__5';
        browse_chrome.append($('<li><a class="' + view_class + '"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'url':
      view_class += 'view_link__6';
      browse_chrome.append($('<li><a class="' + view_class + '" title="Visit External Link"><i class="fa fa-external-link fa-lg"></i></a></li>'));
      break;
    case 'relship':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_relship" title="Load Relationship Authority"><i class="fa fa-comment fa-lg"></i></a></li>'));
      }  // rl-2020-09-29
      break;
    case 'matthes':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_matthes" title="Load Material Authority"><i class="fa fa-comment fa-lg"></i></a></li>'));
      }  // rl-2020-09-29
      break;
    case 'medium':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_medium" title="Load Medium Authority"><i class="fa fa-comment fa-lg"></i></a></li>'));
      }  // rl-2020-09-29
      if ( no_view_link == false ) {  // RL-2021-05-31
        view_class += 'view_medium';
        browse_chrome.append($('<li><a class="' + view_class + '" title="View Medium Authority"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'client':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_client" title="Load Client Authority"><i class="fa fa-user-circle fa-lg"></i></a></li>'));
      }
      if ( no_view_link == false ) {  // RL-2021-05-31
        view_class += 'view_client';
        browse_chrome.append($('<li><a class="' + view_class + '" title="View Client Record"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'accession':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_accession" title="Select Accession Record"><i class="fa fa-file-o fa-lg"></i></a></li>'));
      }
      if ( no_view_link == false ) {  // RL-2021-05-31
        view_class += 'view_accession';
        browse_chrome.append($('<li><a class="' + view_class + '" title="View Accession Record"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'm2a':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  RL-20230419
        browse_chrome.append($('<li><a class="load_m2a" title="Select Description Record"><i class="fa fa-file-text fa-lg"></i></a></li>'));
      }  // kn 2021-01-28
      if ( no_view_link == false ) {  // RL-2021-05-31
        view_class += 'view_m2a';
        browse_chrome.append($('<li><a class="' + view_class + '" title="View Description Record"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'lib':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_lib" title="Select Library Record"><i class="fa fa-book fa-lg"></i></a></li>'));
      }
      if ( no_view_link == false ) {  // RL-2021-05-31
        view_class += 'view_lib';
        browse_chrome.append($('<li><a class="' + view_class + '" title="View Library Record"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'm3':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_m3" title="Select Collections Record"><i class="fa fa-picture-o fa-lg"></i></a></li>'));
      }
      if ( no_view_link == false ) {  // RL-2021-05-31
        view_class += 'view_m3';
        browse_chrome.append($('<li><a class="' + view_class + '" title="View Collections Record"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'loans':
      if ( !readonly_field && !no_search_link ) {  // KN-2024-04-24
        browse_chrome.append($('<li><a class="load_loans" title="Select Loan/Exhibition Record"><i class="fa fa-picture-o fa-lg"></i></a></li>'));
      }
      if ( no_view_link == false ) {  // KN-2024-04-24
        view_class += 'view_loans';
        browse_chrome.append($('<li><a class="' + view_class + '" title="View Loan/Exhibition Record"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'forbiddenword':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_forbiddenword" title="Load Forbidden Word Authority"><i class="fa fa-comment fa-lg"></i></a></li>'));
      }  // kn-2021-08-05
      if ( no_view_link == false ) {  // RL-2021-05-31
        view_class += 'view_forbiddenword';
        browse_chrome.append($('<li><a class="' + view_class + '" title="View Forbidden Word Authority"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'recseries': // rl-2021-09-07
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_recseries" title="Load Record Series"><i class="fa fa-comment fa-lg"></i></a></li>'));
      }
      if ( no_view_link == false ) {
        view_class += 'view_recseries';
        browse_chrome.append($('<li><a class="' + view_class + '" title="View Record Series"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'ministry':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_ministry" title="Load Ministry Authority"><i class="fa fa-user fa-lg"></i></a></li>'));
      }
      if ( no_view_link == false ) {
        view_class += 'view_ministry';
        browse_chrome.append($('<li><a class="' + view_class + '" title="View Ministry Authority"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'collectioncode':
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_collectioncode" title="Load Collection Code Authority"><i class="fa fa-comment fa-lg"></i></a></li>'));
      }  // kn-2021-08-05
      if ( no_view_link == false ) {
        view_class += 'view_collectioncode';
        browse_chrome.append($('<li><a class="' + view_class + '" title="View Collection Code Authority"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    case 'container':  // RL-2022-02-07
      if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
        browse_chrome.append($('<li><a class="load_container" title="Select Container Record"><i class="fa fa-file-o fa-lg"></i></a></li>'));
      }
      if ( no_view_link == false ) {
        view_class += 'view_container';
        browse_chrome.append($('<li><a class="' + view_class + '" title="View Container Record"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
      }
      break;
    default:
      var link_string;
      var tooltip_help = '';

      if ( multi_tables ) {
        add_clear_link = false;       // RL-20231004
        var ix = 0;
        var parm_name = '';
        while ( true ) {
          ix++;

          view_class = '';
          if ( $(caller).hasClass('view_by_name') == true ) {
            view_class = 'view_by_name ';
          }

          parm_name = 'table' + ix;
          var table_parm = $(caller).data(parm_name);
          if ( table_parm == undefined ) {
            // if no more parameter, exit loop
            break;
          }

          // parse parameter value - <table name>,<map name>,<tooltip>
          var parms = table_parm.split(',');
          if ( parms.length > 1 ) {
            if ( parms.length > 2 ) {
              tooltop_help = (parms.length > 2) ? parms[2] : 'Select Record';

              if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
                link_string = '<li><a class="load_' + parms[0] + '" title="' + tooktip_help + '"><i class="fa fa-file-o fa-lg"></i></a></li>';
                browse_chrome.append($(link_string));

                // insert data attribute - data-map-<table name>
                $(caller).data('map-'+parms[0], parms[1] );
              }
              if ( no_view_link == false ) {
                view_class += 'view_' + parms[0];
                browse_chrome.append($('<li><a class="' + view_class + '" title="View Record"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
              }

              // add delete option - RL-20231004
              if ( !readonly_field ) {
                browse_chrome.append($('<li><a class="clear_' + parms[0] + '" title="Clear values"><i class="fa fa-eraser fa-lg"></i></a></li>'));
              }
            }
          }
        }
      }
      else {
        if ( $(caller).data('table') == field_type ) {   // RL-20230107
          if ( !readonly_field && !no_search_link ) {  // rl-2020-09-29  // RL-20230419
            link_string = '<li><a class="load_' + field_type + '" title="Select Record"><i class="fa fa-file-o fa-lg"></i></a></li>';
            browse_chrome.append($(link_string));
          }
          if ( no_view_link == false ) {
            view_class += 'view_' + field_type;
            browse_chrome.append($('<li><a class="' + view_class + '" title="View Record"><i class="fa fa-info-circle fa-lg"></i></a></li>'));
          }
        }
        else {   // RL-20231004
          clear_dbname = '';       // RL-20231004
        }
      } // if ( multi_tables )
      break;
  }

  // add delete option    // RL-20231004
  if ( add_clear_link && !readonly_field && clear_dbname != '' ) {
    browse_chrome.append($('<li><a class="clear_' + clear_dbname + '" title="Clear values"><i class="fa fa-eraser fa-lg"></i></a></li>'));
  }

  // Is browse option already added?  RL-20211025
  var insert_browse_option = true; // RL-20211028

  var h_label = $(caller).find('label');
  if ( $(h_label).length > 0 ) {
    var h_ul = $(h_label).find('ul.browse_chrome');
    if ( $(h_ul).length > 0 && view_class != '' ) { // RL-20211028
      var h_li = $(h_label).find('a.'+view_class);
      if ( $(h_li).length > 0 ) {
        // If "view link" already defined, does not insert browse option
        insert_browse_option = false;
      }
    }
  }
  if ( insert_browse_option ) {  // RL-20211028
    $(caller).find('label').prepend(browse_chrome);
  }
};



/*****
**
**  setupSelectBoxes : changes `select` elements to be universally displayed across browsers
**
**  params:
**    - caller : an HTML select element
**
 *****/
var setupSelectBoxes = function(caller) {
  if ($(caller).parents('div.select').length > 0) { return false; }

  var select_box = $(caller).clone();
  var html = $('<div class="select"/>');
  html.append($(select_box));
  html.append($('<i class="select_button fa fa-chevron-down"></i>'));
  $(caller).replaceWith(html);
};


/*****
**
**  setupCheckBoxes : changes `checkbox` elements to be universally displayed across browsers
**
**  params:
**    - caller : an HTML select element
**
 *****/
var setupCheckBoxes = function(caller) {
  var check_box = $(caller).clone();
  check_box.attr('type', 'hidden').addClass('checkbox');
  var html = $('<span class="check"/>');
  html.append($(check_box));
  html.append($('<i class="fa fa-square-o fa-lg"></i>'));
  $(caller).replaceWith(html);
};

var populateCheckBoxes = function(caller) {
  var check_element = caller.parents('span.check').first().find('input[type=hidden]');

  if (check_element.val().length > 0) {
    caller.removeClass('fa-square-o').addClass('fa-check-square');
  } else {
    caller.removeClass('fa-check-square').addClass('fa-square-o');
  }
};

var handleCheckBoxes = function(caller) {
  var check_element = caller.parents('span.check').first().find('input[type=hidden]');

  // rl-2020-09-29
  var readonly_field = false;
  if ( !readonly_field ) { // rl-20240524
    if ( currentAppInterface != undefined && currentAppInterface != null ) {
      readonly_field = currentAppInterface.readonlyRecord();
    }
  }
  if ( !readonly_field ) { // rl-20240524
    readonly_field = checkReadOnly(check_element);
  }
  if ( readonly_field ) {  // RL-20240524
    var edit_enabled = checkEditFlag(caller);
    if ( edit_enabled != null && edit_enabled ) {
      readonly_field = false;
    }
  }

  if ( !readonly_field ) { // rl-2020-09-29
    if (check_element.val().length === 0) {
      check_element.val('X');
    } else {
      check_element.val('');
    }
  }   // rl-2020-09-29

  populateCheckBoxes(caller);

  check_element.change();
};


/*****
**
**  setupDatePicker : updates passed HTML elements with appropriate toggle for displaying a calendar in form input fields
**
**  params:
**    - caller : an HTML div element
**
 *****/
var setupDatepicker = function(caller) {
  // rl-2020-09-29
  var readonly_field = false;
  if ( !readonly_field ) {  // RL-20240524
    if ( currentAppInterface != undefined && currentAppInterface != null ) {
      readonly_field = currentAppInterface.readonlyRecord();
    }
  }
  if ( !readonly_field ) {  // RL-20240524
    readonly_field = checkReadOnly(caller);
  }
  if ( readonly_field ) {  // RL-20240524
    var edit_enabled = checkEditFlag(caller);
    if ( edit_enabled != null && edit_enabled ) {
      readonly_field = false;
    }
  }

  // RL-20220209
  var dateTimePicker = false;
  if ( $(caller).hasClass('date_time') ) {
    dateTimePicker = true;
  }

  if ( !readonly_field ) {  // rl-2020-09-29
    $(caller).addClass('input-append');
    var datepicker_html = $('<a class="datepicker_trigger" data-date="" data-val="true"><i class="fa fa-calendar fa-lg"></i></a>');
    $(caller).append(datepicker_html);
    var datepicker_trigger = $(caller).find('a.datepicker_trigger').eq(0);

    $(datepicker_trigger).on('click', function(e){
      e.preventDefault();
      var date_field = $(this).siblings('input[type=text]').first();

        $(date_field).datepicker({
          dateFormat: 'yy-mm-dd',
          changeMonth: true,
          changeYear: true,
          yearRange: "1600:2035"   //KN-2024-04-24 extend to 2035
        });
        $(date_field).datepicker('show');
    });
  };   // rl-2020-09-29
};

// RL-2020-09-29

/*****
**
**  setupAIField : add "onchange" event handler to select tag
**
**  params:
**    - caller : an HTML select element
**
 *****/
var setupAIField = function(caller) {
  var selectField = document.getElementById(caller[0].id);
  if ( selectField != null ) {
    selectField.setAttribute("onchange", "currentAppInterface.RetrieveSetAiValue(this);");
  }
};

// RL-2021-01-24

// create marc table entry according to parameter values
function generateMarcRow ( marc_id, marc_repeat )
{
  var   marc_entry = "";
  var   marc_tag = "MARC__" + marc_id;
  var   tag_no = parseInt(marc_id, 10);

  var field_type = 0;
  if ( tag_no == 6 || tag_no == 7 ) {
    field_type = 2;
  }
  else if ( tag_no >= 1 && tag_no <= 9 ) {
    field_type = 1;
  }
  else if ( tag_no == 20 || tag_no == 22 ) {
    field_type = 5;
  }
  else if ( marc_repeat && tag_no != 245 && tag_no != 100 && tag_no != 10 ) {
    field_type = 4;
  }
  else {
    field_type = 3;
  }

  switch ( field_type ) {
    case 1:  // MARC field without subfield (single line)
      marc_entry = '<div class="form_row" id="' + marc_id + '">' +
                   '<div class="full marc field_container">' +
                   '<label for="' + marc_tag + '">' + marc_id + '</label>' +
                   '<input type="text" id="' + marc_tag + '">' +
                   '</div>' +
                   '</div>';
      break;
    case 2:  // repeatable MARC field without subfield (single line)
      marc_entry = '<div class="form_row" id="' + marc_id + '">' +
                   '<div class="full repeating_field field_container">' +
                   '<label for="' + marc_tag + '">' + marc_id + '</label>' +
                   '<input type="text" id="' + marc_tag + '">' +
                   '</div>' +
                   '</div>';
      break;
    case 3:  // MARC field with subfields (multiple lines)
      marc_entry = '<div class="form_row" id="' + marc_id + '">' +
                   '<div class="full field_container">' +
                   '<label for="' + marc_tag + '">' + marc_id + '</label>' +
                   '<div class="marc_header field_container">' +
                   '<input type="text" maxLength="2">' +
                   '</div>' +
                   '<div class="marc_body field_container">' +
                   '<textarea id="' + marc_tag + '" rows="1" class="marc_data"></textarea>' +
                   '</div>' +
                   '</div>' +
                   '</div>';
      break;
    case 4:  // repeatable MARC field with subfields (multiple lines)
      marc_entry = '<div class="form_row" id="' + marc_id + '">' +
                   '<div class="full repeating_field field_container">' +
                   '<label for="' + marc_tag + '">' + marc_id + '</label>' +
                   '<div class="marc_header field_container">' +
                   '<input type="text" maxLength="2">' +
                   '</div>' +
                   '<div class="marc_body field_container">' +
                   '<textarea id="' + marc_tag + '" rows="1" class="marc_data"></textarea>' +
                   '</div>' +
                   '</div>' +
                   '</div>';
      break;
    case 5:  // repeatable MARC field with subfields (single line)
      marc_entry = '<div class="form_row" id="' + marc_id + '">' +
                     '<div class="full repeating_field field_container">' +
                     '<label for="' + marc_tag + '">' + marc_id + '</label>' +
                     '<div class="marc_header field_container">' +
                     '<input type="text" maxLength="2">' +
                     '</div>' +
                     '<div class="marc_body field_container">' +
                     '<input type="text" id="' + marc_tag + '" class="marc_data">' +
                     '</div>' +
                     '</div>' +
                     '</div>';
      break;
  }

  return marc_entry;
}

// check to see MARC field is repeatable or not
function repeatingMarcField ( marc_id ) {
  var   tag_no = parseInt(marc_id, 10);

  var repeating;
  if ( tag_no == 6 || tag_no == 7 ) {
    repeating = true;
  }
  else if ( tag_no >= 1 && tag_no <= 9 ) {
    repeating = false;
  }
  else if ( tag_no == 20 || tag_no == 22 ) {
    repeating = true;
  }
  else if ( tag_no != 245 ) {
    repeating = true;
  }
  else {
    repeating = false;
  }

  return repeating;
}


/*****
**
**  setupMarcTable : set up HTML codes of MARC table
**
**  params:
**    - caller : an HTML div element
**
**
**    data-marc_tag consists of MARC tag and occurrence number in format of <tag>:<occurrence number>.
 *****/
var setupMarcTable = function(caller) {
  var current_record = currentAppInterface.app_record;
  var field_list = null;
  var field_list_size = 0;

  if ( typeof current_record.getMARCFieldList == "function" ) {
    field_list = current_record.getMARCFieldList();
    field_list_size = field_list.length;
  }

  var marc_field_list = $('<div class="marc_table"/>');
  var marc_entry;
  var marc_tag;
  var marc_repeat;
  var exclude_list = $(caller).data("exclude");

  if ( exclude_list == null ) {
    exclude_list = "";
  }

  for ( i = 0 ; i < field_list_size ; i++ ) {
    marc_tag = field_list[i];

    // is it repeating MARC field
    marc_repeat = false;
    var ix = marc_tag.indexOf(MARC_REPEAT_FLAG);
    if ( ix >= 0 ) {
      marc_repeat = true;
      marc_tag = marc_tag.substring(0, ix);
    }
    var marc_id = marc_tag.substring(6);

    if ( exclude_list != "" && exclude_list.indexOf(marc_tag) >= 0 ) {
      // if found in exlcuded field list, exclude MARC field in MARC field table
      continue;
    }

    marc_entry = generateMarcRow ( marc_id, marc_repeat );

    if ( marc_entry != "" ) {
      marc_field_list.append($(marc_entry));
    }
  }

  $(caller).append(marc_field_list);
};

/**
 **  addMarcFields - prompt user to enter MARC tags and create MARC fields in data entry form
 **/
var addMarcFields = function () {
  var continue_to_add = false;
  var marc_tag = "";

  // find <div> with id = marc_field_table and then <div> with class = marc_table
  var marc_table = $('body').find('#marc_field_table');
  if ( marc_table.length > 0 ) {
    // find <div> with class = marc_table
    marc_table = marc_table.find('.marc_table');
  }
  if ( marc_table.length == 0 ) {
    alert ( "MARC table is not defined in data entry form." );
  }
  else {
    // if found, prompt user for MARC field name
    marc_tag = prompt('Enter a MARC Field Tag: ');

    // parse MARC field name
    if ( marc_tag != null ) {
      if ( marc_tag.length != 3
      ||   !marc_tag.match(/\d\d\d/) ) {
        alert ( "MARC field tag " + marc_tag + " is invalid." );
      }
      else {
        continue_to_add = true;
      }
    }
  }

  if ( continue_to_add ) {
    // generate MARC field HTML codes
    var marc_entry = generateMarcRow ( marc_tag, true );

    // get <div> with class = form row
    var marc_rows = marc_table.children();

    // determine insertion location
    var i = 0;
    var found = false;
    var already_defined = false;
    var row_id = "";
    var marc_row;
    for ( i = 0 ; i < marc_rows.length ; i++ ) {
      marc_row = marc_rows[i];
      row_id = marc_row.id;
      if ( marc_tag < row_id ) {
        found = true;
        break;
      }
      else if ( marc_tag == row_id ) {
        already_defined = true;
        break;
      }
    }

    if ( !already_defined ) {
      if ( !found ) {
        // add to end of MARC table
        marc_table.append(marc_entry);
      }
      else {
        // insert MARC field before MARC row
        $(marc_entry).insertBefore('#'+row_id);
      }

      // handle repeateable field
      if ( repeatingMarcField(marc_tag) ) {
        var div_repeating_field = $('#'+marc_tag).find('.repeating_field');
        if ( div_repeating_field.length > 0 ) {
          setupRepeatingField(div_repeating_field);
        }
      }
    }

    // set window focus
    var marc_field_id = 'MARC__' + marc_tag;
    var selector = $('body').find('#'+marc_field_id);
    if ( selector.length > 0 ) {
      selector.focus();

      // make field visible
      var element = document.getElementById(marc_field_id);
      if ( element != null ) {
        element.scrollIntoView(true);
      }
    }

    // setup listener for field with marc_data class - RL-2021-10-08
    $('.marc_data').keydown(function(e) {
      marcFieldKeypress(e);
    });
  }
};

/*****
**
**  hideGroup : hides/displays passed groups in the HTML
**
**  params:
**    - caller : an HTML fieldset element
**    - e : 'event', used for making sure the browser doesn't try to load the link
**
 *****/
var hideGroup = function(caller, e) {
  e.preventDefault();

  var parent_element = $(caller).closest('fieldset');

  $(caller).find('i').toggleClass('fa-eye-slash').toggleClass('fa-eye');
  // RL-2021-05-31
  $(parent_element).find('.show_as_is:visible').slideToggle();
  $(parent_element).find('>*').not('.repeating_group_metadata, .show_as_is').slideToggle();
};



/*****
**
**  selectActiveTab : finds the currently loaded form based on a hidden span element with the id of the currently loaded form
**                    and attaches appropriate classes to it for display.
**
**  params:
**    - active_tab : a string with the ID of the active tab.
**
 *****/
var selectActiveTab = function(active_tab) {
  active_tab = active_tab.split('_');
  console.log(active_tab);
  var primary_nav_id = active_tab.shift();
  console.log(primary_nav_id);
  active_tab = active_tab.join('_');
  if ( active_tab == '' ) {  // RL-2021-03-28
    active_tab = primary_nav_id;
  }
  console.log(active_tab);
  if (primary_nav_id !== DEFAULT_APP_DBNAME) {
    $('ul[id^=primary_worksheet_]').find('.active').removeClass('active');
    $('ul[id^=primary_worksheet_]').find('a[data-form='+primary_nav_id+']').addClass('active');
  }
  $('#secondary_worksheet_nav').find('ul').hide();
  $('#secondary_worksheet_nav').find('#'+primary_nav_id).show();
  $('#'+primary_nav_id).find('a[data-form='+active_tab+']').addClass('active');
};



/*****
**
**  loadForm : dynamically loads forms into the appropriate container
**
**  params:
**    - form_url : string containing the URL of the form to load
**
 *****/
var loadForm = function(form_url, callback) {
  // RL-2021-05-31
  // update richtext field
  $("div").find('.richText').each(function(){
    saveRichTextField($(this));
  });

  // RL-2021-05-13
  // check mandatory fields
  var continueLoadForm = true;
  if ( typeof checkMandatoryField == 'function' ) {
    if ( checkMandatoryField() === false ) {
      continueLoadForm = false;
    }
  }

  if ( continueLoadForm ) {
    var load_html = '<div class="loading"><i class="fa fa-spin fa-gear fa-4x"></i></div>';
    $.get(form_url, function(data) {
      $('#secondary_worksheet_nav a.active').removeClass('active');
      $('#data_entry_form').html(data);
      init(active_interaction.populateForm);
    }).done(function(e) {
      if (typeof callback == 'function') callback();
    });
  }
};

// rl-2020-09-29

/*****
**
**  checkReadOnly : check to see data-readonly attritbute of HTML tag is set to Y
**
**  params:
**    - field ID : HTML id value
**
 *****/

var checkReadOnly = function(field_id) {
  var readonly_field = false;
  var readonly_attr = $(field_id).data('readonly');
  if ( readonly_attr != undefined && readonly_attr.toUpperCase() == 'Y' ) {
    readonly_field = true;
  }

  return readonly_field;
};

/*****
**
**  checkEditflag : check to see data-edit attritbute of HTML tag is set to Y
**
**  params:
**    - field ID : HTML id value
**
 *****/

var checkEditFlag = function(field_id) {
  var edit_enabled = null;
  var edit_flag = $(field_id).data('edit');  // RL-20240524
  if ( typeof edit_flag == 'string' && edit_flag.toUpperCase() == 'Y' ) {
    edit_enabled = true;
  }

  return edit_enabled;
};


// RL-2021-03-16
// extract source values from the record object and returns them in an array
function getSourceValues ( current_record, group_id, occurrence, source_names )
{
  var source_values = [];
  var source_value = "";

  var group_parent = current_record.getGroup(group_id, occurrence, null);

  for ( i = 0 ; i < source_names.length ; i++ ) {
    source_value = "";
    if ( source_names[i] != '' ) {
      if ( source_names[i].toUpperCase() == "$OCCNUM" ) {
        source_value = occurrence.toString();
      }
      else {
        var source_field = current_record.getElement(source_names[i], 1, group_parent);
        if ( source_field != false ) {
          source_value = source_field.text();
        }
      }
      if ( typeof source_value != 'string' ) {
        source_value = '';
      }
    }
    source_values.push(source_value);
  }

  return source_values;
}

// RL-2021-03-16

/*****
**
**  setupGroupList : populate group list of repeatable grouped field.  Group list is a HTML <table> tag.
**
**  params:
**    - caller : an HTML select element
**
 *****/
var setupGroupList = function(caller) {
  var current_record = currentAppInterface.app_record;
  var i = 0, ix = 0;

  // extract data-empty-row option
  var empty_row = (caller).data('empty-row');    // RL-20231011
  if ( typeof empty_row != 'string' ) {
    empty_row = "No Occurrence";
  }
  // extract table ID
  var table_id = $(caller).attr('id');
  if ( table_id == 'undefined' ) {
    alert ( "table ID is missing." );
    table_id = '';
  }

  // extract data-group attribute
  var group_id = $(caller).data('group');

  // get source names of table coumns
  var source_names = getColSoruceNames ( caller );

  // clear table rows
  $(caller).find('tbody tr').remove();

  // get number of group occurrences
  var numocc = current_record.getOccurrenceCount(group_id, null);

  // initialize <tbody> tag
  var occurrences_html = $('<tbody/>');

  if ( numocc == 0 ) {
    // find <th> tag
    var th_tags = $(caller).find('th');

    occurrences_html.append('<tr><td colspan="' + th_tags.length + '" data-empty="Y">' + empty_row + '</td></tr>');
  }
  else {
    // for each group occurrence
    for ( i = 1 ; i <= numocc ; i++ ) {
      var tr_html = $("<tr/>");

      // get source values
      var source_values = getSourceValues ( current_record, group_id, i, source_names );

      // generate <tr> tag
      for ( ix = 0 ; ix < source_values.length ; ix++ ) {
        tr_html.append($("<td>" + source_values[ix] + "</td>"));
      }

      // append <tr> tag to <tbody> tag
      occurrences_html.append(tr_html);
    }
  }

  // insert <tr> tags to <tbody> tag
  var tbody_tag = $(caller).find('tbody');
  $(tbody_tag).append(occurrences_html.children());

  // protect scroll control and contextmenu of grouuped field
  var fieldset_html = $('#' + group_id);
  var repeat_chrome = $(fieldset_html).find('ul.repeating_group_chrome');
  if ( repeat_chrome.length > 0 ) {
    $(repeat_chrome[0]).addClass('disabled');
    $(fieldset_html).data('NOMENU','Y');
  }

  // add 'update_table' class to source field of table column
  // update_table class is used to refresh table column value after source field is touched
  if ( !currentAppInterface.popup_group_dialog ) {
    for ( i = 0 ; i < source_names.length ; i++ ) {
      if ( source_names[i].toUpperCase() != '$OCCNUM' ) {
        var source_field = $('#' + source_names[i]);
        if ( source_field.length > 0 ) {
          $(source_field[0]).addClass('update_table');
          $(source_field[0]).data('table', table_id );
        }
      }
    }
  }
};

// RL-2021-05-31
// utility function extracts source names of table colums.
function getColSoruceNames ( table_field )
{
  // find <th> tag
  var th_tags = $(table_field).find('th');

  // extract data-source attribute of <td> tag
  var source_names = [];
  var i = 0;
  for ( i = 0 ; i < th_tags.length ; i++ ) {
    if ( $(th_tags[i]).data('source') == 'undefined' ) {
      source_names.push("");
    }
    else {
      source_names.push($(th_tags[i]).data('source'));
    }
  }

  return source_names;
}

// function inserts a row to the HTML table
function insertTableRow ( table_id, insert_position, row_data )
{
  // find table field
  var table_field = $('#' + table_id);
  if ( table_field.length > 0 ) {
    var table_body = $(table_field).find('tbody');
    if ( table_body.length > 0 ) {
      // get number of rows
      var table_rows = $(table_body).find('tr');

      // prepare html row
      var tr_html = $('<tr/>');

      // generate <tr> tag
      var ix = 0;
      for ( ix = 0 ; ix < row_data.length ; ix++ ) {
        tr_html.append($("<td>" + row_data[ix] + "</td>"));
      }

      // insert html code to table
      if ( insert_position == -1 || insert_position > table_rows.length ) {
        $(table_body).append(tr_html);
      }
      else {
        $(table_rows[insert_position-1]).before(tr_html);
      }
    }
  }
}

// function removes a row from the HTML table. Ocurrence number of rows is resequenced.
function removeTableRow ( table_id, occurrence )
{
  var table_body = null;
  var table_rows = null;
  var td_htmls = null;
  var tr_html = null;
  var i = 0;
  var occnum = 0;

  // find table field
  var table_field = $('#' + table_id);
  if ( table_field.length > 0 ) {
    table_body = $(table_field).find('tbody');
    if ( table_body.length > 0 ) {
      // get number of rows
      table_rows = $(table_body).find('tr');

      // search selected row
      if ( table_rows.length > 0 ) {
        if ( table_rows.length == 1 && occurrence == 0 ) {
          tr_html = table_rows[0];
        }
        else {
          for ( i = 0 ; i < table_rows.length ; i++ ) {
            td_htmls = $(table_rows[i]).find('td');
            if ( td_htmls.length > 0 ) {
              var row_no = parseInt($(td_htmls[0]).text(), 10);
              if ( occurrence == row_no ) {
                tr_html = table_rows[i];
                break;
              }
            }
          }
        }
      }
    }
  }

  if ( tr_html != null ) {
    $(tr_html).remove();

    if ( table_field.length > 1 ) {
      // resequence table row numbers
      resequenceTableRows ( table_id );
    }
  }
}

// Function clears the HTML table.
function clearTable ( table_id )
{
  var table_body = null;
  var table_rows = null;
  var td_htmls = null;
  var tr_html = null;
  var i = 0;

  // find table field
  var table_field = $('#' + table_id);
  if ( table_field.length > 0 ) {
    table_body = $(table_field).find('tbody');
    if ( table_body.length > 0 ) {
      // get number of rows
      table_rows = $(table_body).find('tr');

      for ( i = table_rows.length ; i > 0 ; i-- ) {
        tr_html = table_rows[i-1];
        $(tr_html).remove();
      }
    }
  }
}

// function resequences row numbers of the HTML table.
function resequenceTableRows ( table_id )
{
  // find table field
  var table_field = $('#' + table_id);
  if ( table_field.length > 0 ) {
    var table_body = $(table_field).find('tbody');
    if ( table_body.length > 0 ) {
      var table_rows = $(table_body).find('tr');
      if ( table_rows.length > 0 ) {
        var numocc = 0;
        var i;
        for ( i = 0 ; i < table_rows.length ; i++ ) {
          td_htmls = $(table_rows[i]).find('td');
          if ( td_htmls.length > 0 ) {
            numocc++;
            $(td_htmls[0]).text( numocc.toString() );
          }
        }
      }
    }
  }
}

// function counts number of the HTML table rows.
function countTableRow ( table_id )
{
  var num_rows = 0;

  // find table field
  var table_field = $('#' + table_id);
  if ( table_field.length > 0 ) {
    table_body = $(table_field).find('tbody');
    if ( table_body.length > 0 ) {
      // get number of rows
      table_rows = $(table_body).find('tr');
      num_rows = table_rows.length;
    }
  }

  return num_rows;
}

// check to see the HTML table is empty.
function emptyTable ( table_id )
{
  var empty = false;

  // find table field
  var table_field = $('#' + table_id);
  if ( table_field.length > 0 ) {
    table_body = $(table_field).find('tbody');
    if ( table_body.length > 0 ) {
      // get number of rows
      table_rows = $(table_body).find('tr');
      if ( table_rows.length == 1 ) {
        var td_tags = $(table_rows[0]).find('td');
        if ( td_tags.length > 0 ) {
          var empty_flag = $(td_tags[0]).data('empty');
          if ( empty_flag != undefined && empty_flag == 'Y' ) {
            empty = true;
          }
        }
      }
    }
    else {
      empty = true;
    }
  }

  return empty;
}

// function gets the row number of selected row.
function getSelectedRowNumber ( table_id )
{
  var rowNumber = 0;

  var table_body = null;
  var table_rows = null;
  var i = 0;

  // find table field
  var table_field = $('#' + table_id);
  if ( table_field.length > 0 ) {
    table_body = $(table_field).find('tbody');
    if ( table_body.length > 0 ) {
      // get number of rows
      table_rows = $(table_body).find('tr');

      // search selected row
      if ( table_rows.length > 0 ) {
        for ( i = 0 ; i < table_rows.length ; i++ ) {
          if ( $(table_rows[i]).hasClass('selected')  ) {
            rowNumber = i + 1;
            break;
          }
        }
      }
    }
  }

  return rowNumber;
}

// function extracts column data of table row.
function extractRowData ( table_id, occurrence )
{
  var rowData = [];

  var table_body = null;
  var table_rows = null;
  var td_htmls = null;
  var tr_html = null;
  var i = 0;

  // find table field
  var table_field = $('#' + table_id);
  if ( table_field.length > 0 ) {
    table_body = $(table_field).find('tbody');
    if ( table_body.length > 0 ) {
      // get number of rows
      table_rows = $(table_body).find('tr');

      // search selected row
      if ( table_rows.length > 0 ) {
        if ( table_rows.length == 1 && occurrence == 0 ) {
          tr_html = table_rows[0];
        }
        else {
          for ( i = 0 ; i < table_rows.length ; i++ ) {
            td_htmls = $(table_rows[i]).find('td');
            if ( td_htmls.length > 0 ) {
              var row_no = parseInt($(td_htmls[0]).text(), 10);
              if ( occurrence == row_no ) {
                tr_html = table_rows[i];
                break;
              }
            }
          }
        }
      }
    }
  }

  if ( tr_html != null ) {
    var num_tds = tr_html.childElementCount;
    for ( i = 0 ; i < num_tds ; i++ ) {
      rowData.push ( tr_html.children[i].innerHTML );
    }
  }

  return rowData;
}

// function selects a table row.
function selectTableRow ( table_id, row_number )
{
  var return_value = false;

  var table_body = null;
  var table_rows = null;
  var td_htmls = null;
  var tr_html = null;
  var i = 0;

  // find table field
  var table_field = $('#' + table_id);
  if ( table_field.length > 0 ) {
    table_body = $(table_field).find('tbody');
    if ( table_body.length > 0 ) {
      // get number of rows
      table_rows = $(table_body).find('tr');

      // search selected row
      if ( table_rows.length >= row_number ) {
        $(table_body).find('tr').removeClass('selected');
        $(table_rows[row_number-1]).addClass('selected');
      }
    }
  }

  return return_value;
}


// function refreshes the row from the HTML table.
function refreshTableRow ( table_id, occurrence, row_data )
{
  var table_body = null;
  var table_rows = null;
  var td_htmls = null;
  var tr_html = null;
  var i = 0;
  var occnum = 0;

  // find table field
  var table_field = $('#' + table_id);
  if ( table_field.length > 0 ) {
    table_body = $(table_field).find('tbody');
    if ( table_body.length > 0 ) {
      // get number of rows
      table_rows = $(table_body).find('tr');

      // search selected row
      if ( table_rows.length > 0 ) {
        for ( i = 0 ; i < table_rows.length ; i++ ) {
          td_htmls = $(table_rows[i]).find('td');
          if ( td_htmls.length > 0 ) {
            var row_no = parseInt($(td_htmls[0]).text(), 10);
            if ( occurrence == row_no ) {
              tr_html = table_rows[i];
              break;
            }
          }
        }
      }
    }
  }

  if ( tr_html != null ) {
    // update columns of table row
    td_htmls = $(tr_html).find('td');
    if ( td_htmls.length > 0 ) {
      for ( i = 1 ; i < td_htmls.length && i < row_data.length ; i++ ) {
        var new_value = row_data[i];
        $(td_htmls[i]).text( new_value );
      }
    }
  }
}
// RL-2021-03-16

// RL-2021-05-31
// function reads richtext field from XML record and loads it in the div tag.
function loadRichTextField(calling_field)
{
  // load rich text string from XML record
  currentAppInterface.populateField($(calling_field).attr('id'), 1, null, true); // RL2021-05-31
}

// function saves richtext field in XML record.
function saveRichTextField(calling_field)
{
  // save escaped string in XML record
  currentAppInterface.updateField($(calling_field), true);
}

// RL-2021-05-31
// function shows authority record in popup window.
function viewAuthorityRecord ( calling_field )
{
  var current_record = currentAppInterface.app_record;
  var ix;
  var found;

  // extract data-view parameter
  var tempvalue = $(calling_field).data('view');
  var view_map = [];
  if ( tempvalue != undefined ) {
    view_map = tempvalue.split(',');
  }

  // extract data-recid attribute
  var recid = $(calling_field).data('recid');
  if ( recid == undefined ) {
    recid = '';
  }
  if ( recid != '' ) {
    // extract record ID
    tempvalue = currentAppInterface.getFieldValue(calling_field, recid);
    if ( tempvalue === false ) {
      recid = '';
    }
    else {
      recid = tempvalue;
    }
  }

  // extract data-source attribute
  var del = '';
  var db_source = $(calling_field).data('source');
  if ( db_source == undefined ) {
    db_source = '';
    tempvalue = $(calling_field).data('prefix-del');
    if ( tempvalue !== false ) {
      del = tempvalue;
      var ix = recid.indexOf(del);
      if ( ix >= 0 ) {
        db_source = recid.substring(0, ix);
      }
    }
  }
  else {
    // extract source value
    tempvalue = currentAppInterface.getFieldValue(calling_field, db_source);
    if ( tempvalue === false ) {
      tempvalue = '';
    }
    db_source = tempvalue;
  }
  if ( db_source != '' ) {
    // look up database name to be viewed
    found = false;
    for ( ix = 0 ; ix < view_map.length ; ix++ ) {
      var sub_option = view_map[ix].split('=');
      if ( sub_option.length == 2 ) {
        if ( db_source == sub_option[1] ) {
          found = true;
          db_source = sub_option[0];
          if ( db_source == 'm2a' ) {
            // REFD is stored in the REQ_REFD field
            tempvalue = currentAppInterface.getFieldValue(calling_field, 'REQ_REFD');
            if ( tempvalue !== false ) {
              recid = tempvalue;
            }
          }
          break;
        }
      }
    }
    if ( !found ) {
      db_source = '';
    }
  }

  if ( recid == '' || db_source == '' ) {
    alert ( "Either item ID or item source is missing." );
  }
  else {
    currentAppInterface.loadValidatedTableRecord(calling_field, db_source, recid, null);
  }

}

// event listener handles the entering subfield delimiter or select subfield delimiter from popup form.
function marcFieldKeypress(e)   // RL-2021-10-08
{
  var start = e.target.selectionStart;
  var end = e.target.selectionEnd;
  var oldValue = e.target.value;
  var newValue = null;

  // if control key and F1 key are pressed, insert ‡ character
  if ( e.keyCode === 112 && e.ctrlKey ) {
    e.preventDefault();

    // replace point and change input value
    newValue = oldValue.slice(0, start) + '\u2021' + oldValue.slice(end);
  }
  else if ( e.keyCode === 112 ) {
    // if F1 key is pressed, get ID attribute of current field
    var id = $(e.currentTarget).attr('id');
    if ( typeof marc_subfield != 'undefined' ) {
      if ( typeof marc_subfield[id] != 'undefined' ) {
        e.preventDefault();

        var subfld_popup = $("#subfieldSelection");
        if ( $(subfld_popup).length > 0 ) {
          // clear options of select tag
          var subfield_select = $("[name='subfield-list']");
          $(subfield_select).empty();

          // populate options of select tag of subfield delimiters
          var subflds = marc_subfield[id];
          var num_subflds = subflds.length / 2;
          for ( var i = 0 ; i < num_subflds ; i++ ) {
            $(subfield_select).append("<option>" + subflds[i*2] + subflds[i*2+1] + "</option>");
          }

          // save selected region and curent tag ID in data-start, data-end and data-target attribute of select tag
          $(subfield_select).data('target', id);
          $(subfield_select).data('start', start);
          $(subfield_select).data('end', end);

          $(subfld_popup).modal();
        }
      }
    }
  }

  if ( newValue !== null ) {
    e.target.value = newValue;

    // replace cursor
    e.target.selectionStart = e.target.selectionEnd = start + 1;
  }
}

// function extracts selected subfield delimiters and paste them to current input field.
function assignSubfieldDelimiter(name)  // RL-2021-10-08 RL-20220107
{
  // retrieve data attributes which are set by the marcFieldKeypress function
  var subfield_list = $("[name='" + name + "']");
  var start = $(subfield_list).data('start');
  var end = $(subfield_list).data('end');

  var target_field_id = $(subfield_list).data('target');
  if ( typeof target_field_id == 'string' ) {
    var target_field = $('#'+target_field_id);

    // get selected option values
    var selected_value = '';
    var jquery_select = $("[name='" + name + "'] option:selected");
    if ( jquery_select.length > 0 ) {
      for (var x = 0; x < jquery_select.length; ++x) {
        selected_value += jquery_select[x].innerHTML;
      }
    }

    if ( selected_value != '' ) {
      // update field value
      var oldValue = $(target_field).val();
      if ( typeof oldValue != 'string' ) {
        newValue = selected_value;
      }
      else {
        var newValue = oldValue.slice(0, start) + selected_value + oldValue.slice(end);
      }

      // update value
      $(target_field).val(newValue);

      // advance cursor position to pass first selected subfield
      $(target_field).caretTo(start + 2);
    }
  }
}
