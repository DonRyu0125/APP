/*
  M2A Online Data Entry
  Collections Specific Scripting
  v2.0

  Jon West - MINISIS Inc
  February 2015
*/
function CollectionsRecord(xml) {
  // CollectionsRecord extends Record
  Record.call(this, xml);
  var record = this;

  // RL-2020-09-29
  this.readonly_flag = checkReadOnly( xml );

  this.params = {
    'database' : 'collections',
    'restriction_mnemonic' : 'rest_status',
    'current_accession_number' : this.getElement('accession_number', '0'),
    'components_mnemonic' : 'child_link',
    'record_image_group' : 'm_im_ref_grp',
    'record_image_field' : 'm_im_access',
    'record_image_caption_field' : 'm_im_caption',

    'maps' : {
     'acquisition_to_collections' :    [{'key' : 'temporary_no',     'value' : 'reg_tracking_no'}],

     'source_organization' :               [{'key' : 'delete_this',      'value' : 'acq_source'},
                                             {'key' : 'delete_this',      'value' : 'acq_source_id'},
                                             {'key' : 'org_main_body',    'value' : 'acq_source_org'},
                                             {'key' : 'org_id',           'value' : 'acq_org_id'},
                                             {'key' : 'org_alias',        'value' : 'acq_source_alias'},
                                             {'key' : 'org_address1',     'value' : 'acq_address'},
                                             {'key' : 'org_address2',     'value' : 'acq_address2'},
                                             {'key' : 'org_city',         'value' : 'acq_city'},
                                             {'key' : 'org_county',       'value' : 'acq_province'},
                                             {'key' : 'org_country',      'value' : 'acq_country'},
                                             {'key' : 'org_postal_code',  'value' : 'acq_postal'},
                                             {'key' : 'org_phone',        'value' : 'acq_phone'},
                                             {'key' : 'org_phone2',       'value' : 'acq_phone2'},
                                             {'key' : 'org_fax',          'value' : 'acq_fax'},
                                             {'key' : 'org_url',          'value' : 'acq_url'},
                                             {'key' : 'org_email',        'value' : 'acq_email'}],

      'source_individual' :                 [{'key' : 'delete_this',      'value' : 'acq_source_org'},
                                             {'key' : 'delete_this',      'value' : 'acq_org_id'},
                                             {'key' : 'fullname3',        'value' : 'acq_source'},
                                             {'key' : 'person_id',        'value' : 'acq_source_id'},
                                             {'key' : 'person_alias',     'value' : 'acq_source_alias'},
                                             {'key' : 'person_address1',  'value' : 'acq_address'},
                                             {'key' : 'person_address2',  'value' : 'acq_address2'},
                                             {'key' : 'person_city',      'value' : 'acq_city'},
                                             {'key' : 'person_county',    'value' : 'acq_province'},
                                             {'key' : 'person_country',   'value' : 'acq_country'},
                                             {'key' : 'person_postal_co', 'value' : 'acq_postal'},
                                             {'key' : 'person_phone',     'value' : 'acq_phone'},
                                             {'key' : 'person_phone_2',    'value' : 'acq_phone2'},
                                             {'key' : 'person_fax',       'value' : 'acq_fax'},
                                             {'key' : 'person_url',       'value' : 'acq_url'},
                                             {'key' : 'person_email',     'value' : 'acq_email'}],

      'source_contact' :                    [{'key' : 'fullname3',        'value' : 'source_contact'},
                                             {'key' : 'person_id',        'value' : 'srce_contact_id'},
                                             {'key' : 'person_alias',     'value' : 'srce_con_alias'}],

      'object_restrictions' :               [{'key' : 'rest_text',        'value' : 'rest_details'},
                                             {'key' : 'rest_id',          'value' : 'cat_rest_id'},
                                             {'key' : 'rest_category',    'value' : 'restrict_cat'}],

      'associated_person' :                 [{'key' : 'fullname3',        'value' : 'assoc_fullname3'},
                                             {'key' : 'person_id',        'value' : 'assoc_full_id'}],

      'associated_organization' :           [{'key' : 'org_main_body',    'value' : 'org_assoc'},
                                             {'key' : 'org_id',           'value' : 'assoc_org_id'}],

      'associated_event' :                  [{'key' : 'event_name',       'value' : 'event_name'},
                                             {'key' : 'event_id',         'value' : 'assoc_event_id'},
                                             {'key' : 'event_date',       'value' : 'event_date'}],

      'material' :                          [{'key' : 'desc_english',     'value' : 'material_coo'},
                                             {'key' : 'desc_french',      'value' : 'material_french'}],

      'medium' :                            [{'key' : 'desc_english',     'value' : 'medium'},
                                             {'key' : 'desc_french',      'value' : 'medium_french'}],

      'cons_material' :                     [{'key' : 'desc_english',     'value' : 'cons_material'},
                                             {'key' : 'desc_french',      'value' : 'cons_mat_french'}],

      'cons_medium' :                       [{'key' : 'desc_english',     'value' : 'cons_medium'},
                                             {'key' : 'desc_french',      'value' : 'cons_med_french'}],

      'provenance_owner_individual' :       [{'key' : 'fullname3',        'value' : 'owner_fullname'},
                                             {'key' : 'person_id',        'value' : 'owner_id'}],

      'provenance_owner_org' :              [{'key' : 'org_main_body',    'value' : 'owner_org'},
                                             {'key' : 'org_id',           'value' : 'owner_org_id'}],

      'maker_group_individual' :            [{'key' : 'fullname3',        'value' : 'maker_fullname'},
                                             {'key' : 'person_id',        'value' : 'maker_person_id'},
                                             {'key' : 'person_alias',     'value' : 'maker_alias'}],

      'maker_group_organization' :          [{'key' : 'org_main_body',    'value' : 'maker_org'},
                                             {'key' : 'org_id',           'value' : 'maker_org_id'},
                                             {'key' : 'org_alias',        'value' : 'maker_alias'}],

      'lib_author' :                        [{'key' : 'org_main_body',    'value' : 'author'},
                                             {'key' : 'org_id',           'value' : 'author_id'},
                                             {'key' : 'fullname3',        'value' : 'author'},
                                             {'key' : 'person_id',        'value' : 'author_id'}],

      'lib_publisher' :                     [{'key' : 'org_main_body',    'value' : 'l_publisher'},
                                             {'key' : 'org_id',           'value' : 'l_pub_id'}],

      'desc_originator' :                   [{'key' : 'org_main_body',    'value' : 'a_originator'},
                                             {'key' : 'org_id',           'value' : 'a_origin_id'}],  // RL-20211231
      'desc_org_originator' :               [{'key' : 'fullname3',        'value' : 'a_originator'},  // RL-20211231
                                             {'key' : 'person_id',        'value' : 'a_origin_id'}],

      'copyright_owner_individual' :        [{'key' : 'fullname3',        'value' : 'cpyrght_own_ind'},
                                             {'key' : 'person_id',        'value' : 'own_ind_id'}],

      'copyright_owner_org' :               [{'key' : 'org_main_body',    'value' : 'cpyrgt_own_org'},
                                             {'key' : 'org_id',           'value' : 'own_org_id'}],

      'copyright_beneficiary_individual' :  [{'key' : 'fullname3',        'value' : 'cpyrght_benf_ind'},
                                             {'key' : 'person_id',        'value' : 'benf_ind_id'}],

      'copyright_beneficiary_org' :         [{'key' : 'org_main_body',    'value' : 'cpyrght_benf_org'},
                                             {'key' : 'org_id',           'value' : 'benf_org_id'}],

      'copyright_admin_individual' :        [{'key' : 'fullname3',        'value' : 'cpyrght_admn_ind'},
                                             {'key' : 'person_id',        'value' : 'admn_ind_id'}],

      'copyright_admin_org' :               [{'key' : 'org_main_body',    'value' : 'cpyrght_admn_org'},
                                             {'key' : 'org_id',           'value' : 'admn_org_id'}],

      'related_objects' :                   [{'key' : 'accession_number', 'value' : 'related_acc_id'},
                                             {'key' : 'legal_title',      'value' : 'related_title'},
                                             {'key' : 'collection_type',  'value' : 'relat_discipline'}],

      'rel_orgout' :                        [{'key' : 'org_main_body',    'value' : 'rel_obj_oth_inst'},
                                             {'key' : 'org_id',           'value' : 'rel_objoth_in_id'}],

      'rel_indout' :                        [{'key' : 'fullname3',        'value' : 'rel_obj_oth_per'},
                                             {'key' : 'person_id',        'value' : 'rel_objoth_pr_id'}],

      'legal_heirs' :                       [{'key' : 'fullname3',        'value' : 'legal_heirs'},
                                             {'key' : 'person_id',        'value' : 'legal_heirs_id'}],

      'research_researcher' :               [{'key' : 'fullname3',        'value' : 'researcher'},
                                             {'key' : 'person_id',        'value' : 'researcher_id'}],

      'legal_text_author' :                 [{'key' : 'fullname3',        'value' : 'label_txt_author'},
                                             {'key' : 'person_id',        'value' : 'lbl_author_id'}],

      'bibliographic_author' :              [{'key' : 'org_main_body',    'value' : 'reference_assoc'},
                                             {'key' : 'org_id',           'value' : 'ref_assoc_id'},
                                             {'key' : 'fullname3',        'value' : 'reference_assoc'},
                                             {'key' : 'person_id',        'value' : 'ref_assoc_id'}],

      'bibliographic_publisher' :           [{'key' : 'org_main_body',    'value' : 'publisher'},
                                             {'key' : 'org_id',           'value' : 'publisher_id'}],

      'art_planned_movement' :              [{'key': 'art_loc_code_id',     'value' : 'plnd_cur_code_id'},
                                             {'key': 'aoacts_ministry',     'value' : 'plnd_ministry'},
                                             {'key': 'aoacts_region',       'value' : 'plnd_region'},
                                             {'key': 'art_street',          'value' : 'plnd_street'},
                                             {'key': 'art_city',            'value' : 'plnd_loc_city'},
                                             {'key': 'art_building',        'value' : 'plnd_bldg'},
                                             {'key': 'art_floor',           'value' : 'plnd_floor'},
                                             {'key': 'aoacts_suite',        'value' : 'plnd_suite'},
                                             {'key': 'art_room',            'value' : 'plnd_room'},
                                             {'key': 'art_rack_unit',       'value' : 'plnd_rack_unit'},
                                             {'key': 'art_shelf',           'value' : 'plnd_shelf'},
                                             {'key': 'art_loc_contact',     'value' : 'plnd_loc_contact'},
                                             {'key': 'art_location_typ',    'value' : 'plnd_loc_type'},
                                             {'key': 'art_position',        'value' : 'plnd_position'},
                                             {'key': 'art_loc_access',      'value' : 'plnd_access'}],

      'perform_movement' :                  [{'key': 'plnd_cur_code_id',     'value' : 'curators_code_id'},
                                             {'key': 'plnd_ministry',        'value' : 'ministry'},
                                             {'key': 'plnd_region',          'value' : 'region'}, 
                                             {'key': 'plnd_street',          'value' : 'street'},
                                             {'key': 'plnd_loc_city',        'value' : 'loc_city'},
                                             {'key': 'plnd_bldg',            'value' : 'building'},
                                             {'key': 'plnd_floor',           'value' : 'floor'},
                                             {'key': 'plnd_suite',           'value' : 'suite'},
                                             {'key': 'plnd_room',            'value' : 'room'},
                                             {'key': 'plnd_rack_unit',       'value' : 'rack_unit'},
                                             {'key': 'plnd_shelf',           'value' : 'shelf'},
                                             {'key': 'plnd_loc_contact',     'value' : 'location_contact'},
                                             {'key': 'plnd_loc_type',        'value' : 'location_type'},
                                             {'key': 'plnd_position',        'value' : 'position'},
                                             {'key': 'plnd_access',          'value' : 'loc_access'},
                                             {'key': 'plnd_move_author',     'value' : 'movement_author'},
                                             {'key': 'pland_remov_date',     'value' : 'location_date'},
                                             {'key': 'plnd_mov_conct',       'value' : 'movement_contact'},
                                             {'key': 'plnd_mov_note',        'value' : 'movement_note'}],

      'permanent_location' :                [{'key': 'art_loc_code_id',     'value' : 'perm_location'}],

      'prop_receip' :                     [{'key' : 'org_main_body',    'value' : 'proposed_receip'},
                                             {'key' : 'org_id',           'value' : 'prop_receip_id'},
                                             {'key' : 'fullname3',        'value' : 'proposed_receip'},
                                             {'key' : 'person_id',        'value' : 'prop_receip_id'}],

      'act_receip' :                      [{'key' : 'org_main_body',      'value' : 'act_receipient'},
                                             {'key' : 'org_id',           'value' : 'act_recip_id'},
                                             {'key' : 'fullname3',        'value' : 'act_receipient'},
                                             {'key' : 'person_id',        'value' : 'act_recip_id'}],

      'dispatch_location' :                 [{'key': 'art_loc_code_id',     'value' : 'dispatch_loc_id'}],

      'inventory_location' :                [{'key': 'art_loc_code_id',     'value' : 'inv_cur_code_id'}],

      'audio_location' :                    [{'key': 'art_loc_code_id',     'value' : 'm_ad_location_id'}],

      'video_location' :                    [{'key': 'art_loc_code_id',     'value' : 'm_vd_location_id'}],

      'shipping_shipped_by' :               [{'key' : 'org_main_body',    'value' : 'shipped_by'},
                                             {'key' : 'org_id',           'value' : 'shipped_by_id'}],

      'packing_case_location' :             [{'key': 'art_loc_code_id',     'value' : 'box_loc_id'}],

      'treatment_org_treated_by' :          [{'key' : 'org_main_body',    'value' : 'treated_by'},        // RL-20211231
                                             {'key' : 'org_id',           'value' : 'treated_by_p_id'}],  // RL-20211231
      'treatment_treated_by' :              [{'key' : 'fullname3',        'value' : 'treated_by'},        // RL-20211231
                                             {'key' : 'person_id',        'value' : 'treated_by_p_id'}],

      'treatment_org_examiner' :            [{'key' : 'org_main_body',    'value' : 'examiner'},          // RL-20211231
                                             {'key' : 'org_id',           'value' : 'examiner_per_id'}],  // RL-20211231
      'treatment_examiner' :                [{'key' : 'fullname3',         'value' : 'examiner'},          // RL-20211231
                                             {'key' : 'person_id',        'value' : 'examiner_per_id'}],

      'treatment_org_proposal_by' :         [{'key' : 'org_main_body',    'value' : 'prop_imp_by'},  // RL-20211231
                                             {'key' : 'org_id',           'value' : 'prop_imp_id'}], // RL-20211231
      'treatment_proposal_by' :             [{'key' : 'fullname3',         'value' : 'prop_imp_by'},  // RL-20211231
                                             {'key' : 'person_id',        'value' : 'prop_imp_id'}],

      'con_audio_location' :                [{'key': 'art_loc_code_id',     'value' : 'm_conad_loc_id'}],

      'con_video_location' :                [{'key': 'art_loc_code_id',     'value' : 'm_convd_loc_id'}],

      'revaluation_appraiser' :             [{'key' : 'org_main_body',    'value' : 'valuer'},
                                             {'key' : 'org_id',           'value' : 'valuer_id'},
                                             {'key' : 'fullname3',        'value' : 'valuer'},
                                             {'key' : 'person_id',        'value' : 'valuer_id'}],

      'insurance_insurer' :                 [{'key' : 'org_main_body',    'value' : 'insurer'},
                                             {'key' : 'org_id',           'value' : 'insurer_id'}],

      'damage_reported_by' :                [{'key' : 'fullname3',        'value' : 'loss_reporter'},
                                             {'key' : 'person_id',        'value' : 'loss_reporter_id'}],

      'claim_settlement_to' :               [{'key' : 'org_main_body',    'value' : 'settle_to'},
                                             {'key' : 'org_id',           'value' : 'settle_to_id'},
                                             {'key' : 'fullname3',        'value' : 'settle_to'},
                                             {'key' : 'person_id',        'value' : 'settle_to_id'}],

      'damage_actions_contact' :            [{'key' : 'fullname3',        'value' : 'incident_contact'},
                                             {'key' : 'person_id',        'value' : 'inc_contact_id'}],

      'components' :                        [{'key' : 'legal_title',      'value' : 'child_title'},
                                             {'key' : 'sisn',             'value' : 'child_sisn'},
                                             {'key' : 'accession_number', 'value' : 'child_acc_num'},
                                             {'key' : 'object_name',      'value' : 'child_obj_name'},
                                             {'key' : 'early',            'value' : 'child_early'}],

      'nomenclature' :                      [{'key' : 'category',         'value' : 'category'},
                                             {'key' : 'classification',   'value' : 'classification'},
                                             {'key' : 'sub_category',     'value' : 'sub_classify'},
                                             {'key' : 'object',           'value' : 'primary'},
                                             {'key' : 'secondary',        'value' : 'secondary'},
                                             {'key' : 'tertiary',         'value' : 'tertiary'}],

      'borrower_ind' :                      [{'key' : 'fullname3',         'value' : 'borrower'},
                                             {'key' : 'person_id',        'value' : 'borrower_id'}]
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


  /*****
  **
  **  getSecondImage : returns a javascript object containing the physical location of second image (ie [M3IMAGE]file.jpg), and the image caption
  **
   *****/
  // RL-2020-09-29
  this.getSecondImage = function() {
    if (this.getGroup(this.params.record_image_group, '2')) {
      var image_group = this.getGroup(this.params.record_image_group, '2').clone();
      var second_image = {};
      second_image.image = this.getElement(this.params.record_image_field, '2', image_group);
      second_image.caption = this.getElement(this.params.record_image_caption_field, '2', image_group);

      return second_image;
    } else {
      return false;
    }
  };

}