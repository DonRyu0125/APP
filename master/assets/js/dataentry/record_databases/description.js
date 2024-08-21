/*
  M2A Online Data Entry
  Description Specific Scripting
  v1.0

  Jon West - MINISIS Inc
  February 2015
*/
function DescriptionRecord(xml) {
  // DescriptionRecord extends Record
  Record.call(this, xml);
  var record = this;

  // RL-2020-09-29
  this.readonly_flag = checkReadOnly( xml );

  this.params = {
    'database' : 'description',
    'restriction_mnemonic' : 'r_restrict_stat',
    'current_refd' : this.getElement('refd', '0'),
    'record_image_group' : 'a_im_ref_grp',
    'record_image_field' : 'a_im_access',
    'record_image_caption_field' : 'a_im_caption',

    'maps' : {

      'accsn_group' :                        [{'key' : 'accno',             'value' : 'd_accno_id'},
                                             {'key'  : 'box_item_number',   'value' : 'box_no'}],

      'bibliographic_publisher' :            [{'key' : 'org_main_body',    'value' : 'publisher'},
                                             {'key'  : 'org_id',           'value' : 'pub_id'}],

      'related_objects' :                    [{'key' : 'refd',            'value' : 'related_refd_id'},
                                             {'key' : 'title',            'value' : 'related_title'}],

      'rel_orgout' :                        [{'key' : 'org_main_body',    'value' : 'a_rel_obj_oth_in'},
                                             {'key'  : 'org_id',          'value' : 'a_r_objoth_in_id'}],

      'rel_indout' :                        [{'key' : 'fullname3',         'value' : 'a_rel_obj_oth_pe'},
                                             {'key'  : 'person_id',        'value' : 'a_r_objoth_pe_id'}],

      'desc_barcode' :                      [{'key' : 'container_id',       'value' : 'barcode_id'}],

      'architect_name' :                    [{'key' : 'org_main_body',    'value' : 'architect'},
                                             {'key'  : 'org_id',           'value' : 'arch_id'},
                                             {'key'  : 'fullname3',        'value' : 'architect'},
                                             {'key'  : 'person_id',        'value' : 'arch_id'}],

      'architect_other' :                    [{'key' : 'org_main_body',    'value' : 'others_resp'},
                                             {'key'  : 'org_id',           'value' : 'archoth_id'},
                                             {'key'  : 'fullname3',        'value' : 'others_resp'},
                                             {'key'  : 'person_id',        'value' : 'archoth_id'}],

      'interviewee' :                        [{'key' : 'fullname3',        'value' : 'oh_interviewee'},
                                             {'key'  : 'person_id',        'value' : 'oh_intrviewee_id'},
                                             {'key'  : 'person_address1',  'value' : 'oh_inter_add1'},
                                             {'key'  : 'person_address2',  'value' : 'oh_inter_add2'},
                                             {'key'  : 'person_city',      'value' : 'oh_inter_city'},
                                             {'key'  : 'person_county',    'value' : 'oh_inter_prov'},
                                             {'key'  : 'person_country',   'value' : 'oh_inter_country'},
                                             {'key'  : 'person_postal_co', 'value' : 'oh_inter_pc'},
                                             {'key'  : 'person_phone',     'value' : 'oh_inter_phone'},
                                             {'key'  : 'person_email',     'value' : 'oh_inter_email'}],

      'interviewer' :                        [{'key' : 'fullname3',       'value' : 'oh_interviewer'},
                                             {'key'  : 'person_id',        'value' : 'oh_interviewr_id'}],

      'present_individual' :                 [{'key' : 'fullname3',       'value' : 'oh_people_p'},
                                             {'key'  : 'person_id',        'value' : 'oh_people_p_id'}],

      'recorded_individual' :                [{'key' : 'fullname3',       'value' : 'oh_recorded_by'},
                                             {'key'  : 'person_id',        'value' : 'oh_record_by_id'}],

      'transcribe_individual' :              [{'key' : 'fullname3',       'value' : 'oh_transcriber'},
                                             {'key'  : 'person_id',        'value' : 'oh_trnscriber_id'}],

      'access_restrictions' :               [{'key' : 'rest_text',        'value' : 'restriction'},
                                             {'key'  : 'rest_id',          'value' : 'restrict_id'}],

      'desc_restrictions' :                 [{'key' : 'rest_text',        'value' : 'd_restriction'},
                                             {'key'  : 'rest_id',          'value' : 'd_restrict_id'},
                                             {'key'  : 'rest_category',    'value' : 'd_restrict_cat'}],

      'current_movement' :                  [{'key': 'curators_code',     'value' : 'a_curators_code'},
                                             {'key': 'bus_unit',          'value' : 'a_bus_unit'},
                                             {'key': 'building',          'value' : 'a_building'},
                                             {'key': 'floor',             'value' : 'a_floor'},
                                             {'key': 'room',              'value' : 'a_room'},
                                             {'key': 'rack_unit',         'value' : 'a_rack_unit'},
                                             {'key': 'shelf',             'value' : 'a_shelf'},
                                             {'key': 'location_contact',  'value' : 'a_container'},
                                             {'key': 'location_type',     'value' : 'a_location_type'},
                                             {'key': 'position',          'value' : 'a_position'},
                                             {'key': 'loc_access',        'value' : 'a_loc_access'}],

      'permanent_location' :                [{'key': 'curators_code',     'value' : 'perm_location_id'}],

      'planned_movement' :                  [{'key': 'curators_code',     'value' : 'plnd_cur_code_id'},
                                             {'key': 'bus_unit',          'value' : 'plnd_bus_unit'},
                                             {'key': 'building',          'value' : 'plnd_bldg'},
                                             {'key': 'floor',             'value' : 'plnd_floor'},
                                             {'key': 'room',              'value' : 'plnd_room'},
                                             {'key': 'rack_unit',         'value' : 'plnd_rack_unit'},
                                             {'key': 'shelf',             'value' : 'plnd_shelf'},
                                             {'key': 'location_contact',  'value' : 'plnd_loc_contact'},
                                             {'key': 'location_type',     'value' : 'plnd_loc_type'},
                                             {'key': 'position',          'value' : 'plnd_position'},
                                             {'key': 'loc_access',        'value' : 'plnd_access'}],

      'perform_movement' :                  [{'key': 'plnd_cur_code_id',  'value' : 'curators_code'},
                                             {'key': 'plnd_bus_unit',     'value' : 'bus_unit'},
                                             {'key': 'plnd_bldg',         'value' : 'building'},
                                             {'key': 'plnd_floor',        'value' : 'floor'},
                                             {'key': 'plnd_room',         'value' : 'room'},
                                             {'key': 'plnd_rack_unit',    'value' : 'rack_unit'},
                                             {'key': 'plnd_shelf',        'value' : 'shelf'},
                                             {'key': 'plnd_loc_contact',  'value' : 'location_contact'},
                                             {'key': 'plnd_loc_type',     'value' : 'location_type'},
                                             {'key': 'plnd_position',     'value' : 'position'},
                                             {'key': 'plnd_access',       'value' : 'loc_access'},
                                             {'key': 'plnd_move_author',  'value' : 'movement_author'},
                                             {'key': 'pland_remov_date',  'value' : 'location_date'},
                                             {'key': 'plnd_mov_conct',    'value' : 'movement_contact'},
                                             {'key': 'plnd_mov_note',     'value' : 'movement_note'}],

      'audio_location' :                    [{'key': 'curators_code',     'value' : 'a_ad_location_id'}],

      'video_location' :                    [{'key': 'curators_code',     'value' : 'a_vd_location_id'}],

      'neg_location' :                      [{'key': 'curators_code',     'value' : 'copy_neg_loc'}],

      'cartographic_location' :             [{'key': 'curators_code',     'value' : 'carto_location'}],

      'spec_location' :                     [{'key': 'curators_code',     'value' : 'specific_loc_id'}],

      'name_org_access' :                   [{'key' : 'org_main_body',    'value' : 'indexname'}, // RL-20211231
                                             {'key' : 'org_id',           'value' : 'name_id'}],

      'name_access' :                       [{'key' : 'fullname3',        'value' : 'indexname'}, // RL-20211231
                                             {'key' : 'person_id',        'value' : 'name_id'}],

      'name_org_subject' :                  [{'key' : 'org_main_body',    'value' : 'indexsub'},  // RL-20211231
                                             {'key' : 'org_id',           'value' : 'sub_id'}],   // RL-20211231
      'name_subject' :                      [{'key' : 'fullname3',         'value' : 'indexsub'}, // RL-20211231
                                             {'key' : 'person_id',         'value' : 'sub_id'}],

      'name_org_prov' :                     [{'key' : 'org_main_body',    'value' : 'indexprov'}, // RL-20211231
                                             {'key' : 'org_id',           'value' : 'prov_id'}],  // RL-20211231
      'name_prov' :                         [{'key' : 'fullname3',        'value' : 'indexprov'}, // RL-20211231
                                             {'key' : 'person_id',        'value' : 'prov_id'}],
 
      'geo_access' :                        [{'key' : 'site_name',        'value' : 'indexgeo'}, // KN-2022-07-22
                                             {'key' : 'geo_site_id',      'value' : 'geo_id'}],

      'sound_credit' :                      [{'key' : 'org_main_body',    'value' : 'credits'},
                                             {'key' : 'org_id',           'value' : 'credits_id'},
                                             {'key' : 'fullname3',         'value' : 'credits'},
                                             {'key' : 'person_id',        'value' : 'credits_id'}],

      'office_org_main' :                   [{'key' : 'org_main_body',    'value' : 'office_ab'},    // KN-20220112
                                             {'key' : 'org_id',           'value' : 'office_id'},  // KN-20220112
                                             {'key' : 'refa',             'value' : 'ab_refa'}],  // KN-20220629

      'office_org_sub' :                    [{'key' : 'org_natural_name', 'value' : 'office_c'},      // KN-20220112
                                             {'key' : 'org_id',           'value' : 'officec_id'},  // KN-20220112
                                             {'key' : 'refa',             'value' : 'c_refa'}],  // KN-20220629

      'treat_org_treated_by' :              [{'key' : 'org_main_body',    'value' : 'treated_by'},   // RL-20211231
                                             {'key' : 'org_id',           'value' : 'treated_by_p_id'}],  // RL-20211231
      'treat_treated_by' :                  [{'key' : 'fullname3',        'value' : 'treated_by'},    // RL-20211231
                                             {'key' : 'person_id',        'value' : 'treated_by_p_id'}],

      'treatment_org_examiner' :            [{'key' : 'org_main_body',    'value' : 'examiner'},  // RL-20211231
                                             {'key' : 'org_id',           'value' : 'examiner_per_id'}],  // RL-20211231
      'treatment_examiner' :                [{'key' : 'fullname3',        'value' : 'examiner'},  // RL-20211231
                                             {'key' : 'person_id',        'value' : 'examiner_per_id'}],

      'treatment_org_proposal_by' :         [{'key' : 'org_main_body',    'value' : 'prop_imp_by'},  // RL-20211231
                                             {'key' : 'org_id',           'value' : 'prop_imp_id'}], // RL-20211231
      'treatment_proposal_by' :             [{'key' : 'fullname3',        'value' : 'prop_imp_by'},  // RL-20211231
                                             {'key' : 'person_id',        'value' : 'prop_imp_id'}],

      'con_audio_location' :                [{'key': 'curators_code',     'value' : 'a_conad_loc_id'}],

      'con_video_location' :                [{'key': 'curators_code',     'value' : 'a_convd_loc_id'}],

      'insurance_insurer' :                 [{'key' : 'org_main_body',    'value' : 'insurer'},
                                             {'key' : 'org_id',           'value' : 'insurer_id'}],

      'damage_reported_by' :                [{'key' : 'fullname3',         'value' : 'loss_reporter'},
                                             {'key' : 'person_id',        'value' : 'loss_reporter_id'}],

      'claim_settlement_to' :               [{'key' : 'org_main_body',    'value' : 'settle_to'},
                                             {'key' : 'org_id',           'value' : 'settle_to_id'},
                                             {'key' : 'fullname3',         'value' : 'settle_to'},
                                             {'key' : 'person_id',        'value' : 'settle_to_id'}],

      'crwd_source' :                       [{'key' : 'fullname3',        'value' : 'crowd_source'},
                                             {'key' : 'person_id',        'value' : 'crowd_source_id'}]
    }
  };

  var params = this.params;


  ///////// Collections specific methods /////////


  /*****
  **
  **  hasComponents : returns a boolean value based on whether or not the currently loaded record contains components
  **
   *****/
  this.hasComponents = function() {
    return (record.getGroup(params.components_mnemonic) !== false);
  };


  /*****
  **
  **  getComponents : returns an XML/JS copy of the component group contained within the current record
  **
   *****/
  this.getComponents = function() {
    if (record.hasComponents()) {
      return record.getGroup(params.components_mnemonic).parent();
    } else {
      return false;
    }
  };


  /*****
  **
  **  getComponent : returns an XML/JS copy of a specific occurrence of the component group contained within the current record
  **
   *****/
  this.getComponent = function(occurrence) {
    return record.getGroup(params.components_mnemonic, occurrence);
  };


  /*****
  **
  **  componentCount : returns an integer with the amount of component occurrences contained within the current record
  **
   *****/
  this.componentCount = function() {
    if (record.hasComponents()) {
      return record.getComponents().length;
    } else {
      return 0;
    }
  };


  /*****
  **
  **  getPrimaryImage : returns a javascript object containing the physical location of the image (ie [M3IMAGE]file.jpg), and the image caption
  **
   *****/
  this.getPrimaryImage = function() {
    if (this.getGroup(this.params.record_image_group, '1')) {
        var image_group = this.getGroup(this.params.record_image_group, '1').clone();
        var primary_image = {};
        primary_image.image = this.getElement(this.params.record_image_field, '1', image_group);
        primary_image.caption = this.getElement(this.params.record_image_caption_field, '1', image_group);

        return primary_image;
    } else {
        return false;
    }
  };

}