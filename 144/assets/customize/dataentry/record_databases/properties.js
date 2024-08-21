/*
  M2A Online Data Entry
  Restrictions Specific Scripting
  v2.0

  Jon West - MINISIS Inc
  February 2015
*/
function PropertiesRecord(xml) {
  // PropertiesRecord extends Record
  Record.call(this, xml);

  // RL-2020-09-29
  this.readonly_flag = checkReadOnly( xml );

  this.params = {
    'database' : 'properties',
    'properties_mnemonic'  :  'prop_rest_status',

       'maps' : {
        'pdemerg_name' :                 [{'key' : 'fullname3',      'value' : 'pd_emergenc_cont'},
                                         {'key' : 'person_id',      'value' : 'pd_emerg_cont_id'},
                                         {'key' : 'person_phone',   'value' : 'pd_emergenc_phon'},
                                         {'key' : 'person_phone_2',  'value' : 'pd_emerg_phone2'}],

       'pdinspect' :                    [{'key' : 'fullname3',       'value' : 'pd_inspect_by'},
                                         {'key' : 'person_id',      'value' : 'pd_inspect_by_id'}],  // RL-20211231
       'pdinspect_org' :                [{'key' : 'org_main_body',  'value' : 'pd_inspect_by'},      // RL-20211231
                                         {'key' : 'org_id',         'value' : 'pd_inspect_by_id'}],

       'pdpest_treat' :                 [{'key' : 'fullname3',       'value' : 'pd_pest_remed_by'},
                                         {'key' : 'person_id',      'value' : 'pd_pest_r_by_id'}],   // RL-20211231
       'pdpest_org_treat' :             [{'key' : 'org_main_body',  'value' : 'pd_pest_remed_by'},   // RL-20211231
                                         {'key' : 'org_id',         'value' : 'pd_pest_r_by_id'}],

       'pdincident_person' :            [{'key' : 'fullname3',       'value' : 'pd_inc_person'},
                                         {'key' : 'person_id',      'value' : 'pd_inc_person_id'}],

       'prop_pref' :                    [{'key' : 'fullname3',        'value' : 'pd_pref_name'},
                                         {'key' : 'person_id',      'value' : 'pd_pref_name_id'}],
       'prop_org_pref' :                [{'key' : 'org_main_body',  'value' : 'pd_pref_name'},
                                         {'key' : 'org_id',         'value' : 'pd_pref_name_id'}],

       'proposal_by' :                  [{'key' : 'fullname3',       'value' : 'pd_prop_imp_by'},
                                         {'key' : 'person_id',      'value' : 'pd_prop_imp_b_id'}],  // RL-20211231
       'proposal_org_by' :              [{'key' : 'org_main_body',  'value' : 'pd_prop_imp_by'},     // RL-20211231
                                         {'key' : 'org_id',         'value' : 'pd_prop_imp_b_id'}],

       'repair_by' :                    [{'key' : 'fullname3',       'value' : 'pd_repair_by'},
                                         {'key' : 'person_id',      'value' : 'pd_repair_by_id'}],  // RL-20211231
       'repair_org_by' :                [{'key' : 'org_main_body',  'value' : 'pd_repair_by'},      // RL-20211231
                                         {'key' : 'org_id',         'value' : 'pd_repair_by_id'}],

       'prop_management' :              [{'key' : 'org_main_body',  'value' : 'pd_site_manageme'},
                                         {'key' : 'org_id',         'value' : 'pd_site_mgr_id'}],

       'prop_partner' :                 [{'key' : 'fullname3',       'value' : 'pd_operation_prt'},
                                         {'key' : 'person_id',      'value' : 'pd_op_prt_id'}],   // RL-20211231
       'prop_org_partner' :             [{'key' : 'org_main_body',  'value' : 'pd_operation_prt'}, // RL-20211231
                                         {'key' : 'org_id',         'value' : 'pd_op_prt_id'}],

       'proj_architect' :               [{'key' : 'fullname3',       'value' : 'pd_proj_architec'},
                                         {'key' : 'person_id',      'value' : 'pd_proj_arch_id'}],  // RL-20211231
       'proj_org_architect' :           [{'key' : 'org_main_body',  'value' : 'pd_proj_architec'},  // RL-20211231
                                         {'key' : 'org_id',         'value' : 'pd_proj_arch_id'}],

       'prop_restrictions' :            [{'key' : 'rest_text',      'value' : 'prop_rest_details'},
                                         {'key' : 'rest_id',        'value' : 'prop_rest_id'},
                                         {'key' : 'rest_category',  'value' : 'prop_restrict_ca'}],

       'build_link' :                   [{'key' : 'bd_building_name',    'value' : 'xbp_name'},
                                         {'key' : 'bd_building_no',      'value' : 'xb_no'}],
    }
  };
}