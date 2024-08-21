/*
  M2A Online Data Entry
  Sites Specific Scripting
  v2.0

  Jon West - MINISIS Inc
  February 2015
*/
function AccessionRecord(xml) {
 // AccessionRecord extends Record
  Record.call(this, xml);

  // RL-2020-09-29
  this.readonly_flag = checkReadOnly( xml );

  this.params = {
    'database' : 'accession',
    'restriction_mnemonic' : 'a_restrict_stat',
    'current_accno' : this.getElement('accno', '0'),

    'maps' : {
      'descript_ref' :                       [{'key' : 'refd',             'value' : 'desc_ref_id'}],

      'acc_schedule' :                       [{'key' : 'schedule_no',      'value' : 'schedule'},
                                              {'key' : 'schedule_id',      'value' : 'acc_sched_id'},
                                              {'key' : 'recseries_title',  'value' : 'acc_sched_title'},
                                              {'key' : 'recseries_cutoff', 'value' : 'acc_sched_cutoff'},
                                              {'key' : 'total_retention',  'value' : 'acc_sched_retain'},
                                              {'key' : 'adopted_date',     'value' : 'acc_sched_adopt'},
                                              {'key' : 'effective_date',   'value' : 'acc_sched_effect'}],

      'donor_org' :                          [{'key' : 'org_main_body',    'value' : 'organization'},
                                             {'key'  : 'org_id',           'value' : 'orgn_id'}],

      'donor_ind' :                          [{'key' : 'fullname3',        'value' : 'individual'},
                                             {'key'  : 'person_id',        'value' : 'ind_id'}],

      'donor_contact' :                      [{'key' : 'fullname3',        'value' : 'contact'},
                                             {'key'  : 'person_id',        'value' : 'con_id'}],

      'acc_loc' :                            [{'key' : 'curators_code',    'value' : 'acc_loc_code_id'}],

      'accession_creator' :                  [{'key'  : 'fullname3',         'value' : 'acc_creator'},
                                              {'key'  : 'person_id',        'value' : 'accr_id'}],  // RL-20211231

      'accession_org_creator' :              [{'key' : 'org_main_body',     'value' : 'acc_creator'},   // RL-20211231
                                             {'key'  : 'org_id',           'value' : 'accr_id'}],

      'value_appraiser' :                    [{'key' : 'org_main_body',     'value' : 'valuer'},
                                              {'key'  : 'org_id',           'value' : 'valuer_id'}],  // RL-20211231
      'value_org_appraiser' :                [{'key'  : 'fullname3',        'value' : 'valuer'},      // RL-20211231
                                              {'key'  : 'person_id',        'value' : 'valuer_id'}],

      'insurance_insurer' :                 [{'key'  : 'org_main_body',     'value' : 'insurer'},
                                             {'key'  : 'org_id',            'value' : 'insurer_id'}],

      'prop_receip' :                        [{'key' : 'org_main_body',    'value' : 'proposed_receip'},
                                              {'key' : 'org_id',           'value' : 'prop_receip_id'}],   // RL-20211231
      'prop_org_receip' :                    [{'key' : 'fullname3',         'value' : 'proposed_receip'},  // RL-20211231
                                              {'key' : 'person_id',        'value' : 'prop_receip_id'}],

      'act_receip' :                         [{'key' : 'org_main_body',    'value' : 'act_receipient'},
                                              {'key' : 'org_id',           'value' : 'act_recip_id'}],     // RL-20211231
      'act_org_receip' :                     [{'key' : 'fullname3',         'value' : 'act_receipient'},   // RL-20211231
                                              {'key' : 'person_id',        'value' : 'act_recip_id'}],

      'object_restrictions' :               [{'key'  : 'rest_text',         'value' : 'a_restriction'},
                                             {'key'  : 'rest_id',           'value' : 'a_restrict_id'},
                                             {'key'  : 'rest_category',     'value' : 'a_restrict_cat'}],

      'copyright_owner_individual' :        [{'key' : 'fullname3',        'value' : 'ac_cpyri_own_ind'},
                                             {'key' : 'person_id',        'value' : 'ac_cpyri_oi_id'}],

      'copyright_owner_org' :               [{'key' : 'org_main_body',    'value' : 'ac_cpyri_own_org'},
                                             {'key' : 'org_id',           'value' : 'ac_cpyri_oo_id'}],

      'copyright_beneficiary_individual' :  [{'key' : 'fullname3',        'value' : 'ac_cpyri_ben_ind'},
                                             {'key' : 'person_id',        'value' : 'ac_cpyri_bp_id'}],

      'copyright_beneficiary_org' :         [{'key' : 'org_main_body',    'value' : 'ac_cpyri_ben_org'},
                                             {'key' : 'org_id',           'value' : 'ac_cpyri_bo_id'}],

      'copyright_admin_individual' :        [{'key' : 'fullname3',        'value' : 'ac_cpyri_adm_ind'},
                                             {'key' : 'person_id',        'value' : 'ac_cpyri_ai_id'}],

      'copyright_admin_org' :               [{'key' : 'org_main_body',    'value' : 'ac_cpyri_adm_org'},
                                             {'key' : 'org_id',           'value' : 'ac_cpyri_ao_id'}],

       'legal_heirs_individual' :           [{'key' : 'fullname3',        'value' : 'ac_leg_hr_ind'},
                                             {'key' : 'person_id',        'value' : 'ac_leg_in_id'}],

       'legal_heirs_org' :                  [{'key' : 'org_main_body',    'value' : 'ac_leg_hr_org'},
                                             {'key' : 'org_id',           'value' : 'ac_leg_org_id'}],

       'acc_item_loc' :                     [{'key' : 'curators_code',    'value' : 'box_item_loc_id'}]
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