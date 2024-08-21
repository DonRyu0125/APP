/*
  M2A Online Data Entry
  Restrictions Specific Scripting
  v2.0

  Jon West - MINISIS Inc
  February 2015
*/
function BuildingsRecord(xml) {
  // BuildingsRecord extends Record
  Record.call(this, xml);

   // RL-2020-09-29
  this.readonly_flag = checkReadOnly( xml );

  this.params = {
    'database' : 'buildings',
    'restriction_mnemonic'  :  'bd_rest_status',

    'maps' : {
       'bdemerg_name' :                 [{'key' : 'fullname3',       'value' : 'bd_emergenc_cont'},
                                         {'key' : 'person_id',      'value' : 'bd_emerg_cont_id'}],

       'bldg_cust' :                    [{'key' : 'fullname3',      'value' : 'bd_custodian'},
                                         {'key' : 'person_id',      'value' : 'bd_custodian_id'}],   // RL-2021123
       'bldg_org_cust' :                [{'key' : 'org_main_body',  'value' : 'bd_custodian'},       // RL-2021123
                                         {'key' : 'org_id',         'value' : 'bd_custodian_id'}],

       'bldg_inspect' :                [{'key' : 'fullname3',       'value' : 'bd_inspect_by'},
                                        {'key' : 'person_id',      'value' : 'bd_inspect_by_id'}],  // RL-20211231
       'bldg_org_inspect' :            [{'key' : 'org_main_body',  'value' : 'bd_inspect_by'},      // RL-20211231
                                        {'key' : 'org_id',         'value' : 'bd_inspect_by_id'}],

       'bldg_pest' :                    [{'key' : 'fullname3',       'value' : 'bd_pest_remed_by'},
                                         {'key' : 'person_id',      'value' : 'bd_pest_r_by_id'}],   // RL-20211231
       'bldg_org_pest' :                [{'key' : 'org_main_body',  'value' : 'bd_pest_remed_by'},   // RL-20211231
                                         {'key' : 'org_id',         'value' : 'bd_pest_r_by_id'}],

       'bdincident_person' :            [{'key' : 'fullname3',       'value' : 'bd_inc_person'},
                                         {'key' : 'person_id',      'value' : 'bd_inc_person_id'}],

       'bldg_pref' :                    [{'key' : 'fullname3',       'value' : 'bd_pref_name'},
                                         {'key' : 'person_id',      'value' : 'bd_pref_name_id'},
                                         {'key' : 'org_main_body',  'value' : 'bd_pref_name'},
                                         {'key' : 'org_id',         'value' : 'bd_pref_name_id'}],

       'bldg_proposer' :                [{'key' : 'fullname3',       'value' : 'bd_prop_imp_by'},
                                         {'key' : 'person_id',      'value' : 'bd_prop_imp_b_id'}],  // RL-20211231
       'bldg_org_proposer' :            [{'key' : 'org_main_body',  'value' : 'bd_prop_imp_by'},     // RL-20211231
                                         {'key' : 'org_id',         'value' : 'bd_prop_imp_b_id'}],

       'bldg_repair' :                  [{'key' : 'fullname3',       'value' : 'bd_repair_by'},
                                         {'key' : 'person_id',      'value' : 'bd_repair_by_id'}],   // RL-20211231
       'bldg_org_repair' :              [{'key' : 'org_main_body',  'value' : 'bd_repair_by'},       // RL-20211231
                                         {'key' : 'org_id',         'value' : 'bd_repair_by_id'}],

       'bldg_restrict' :                [{'key' : 'rest_text',      'value' : 'bd_rest_details'},
                                         {'key' : 'rest_id',        'value' : 'bd_rest_id'},
                                         {'key' : 'rest_category',  'value' : 'bd_restrict_ca'}]

    }
  };
}