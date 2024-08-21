/*
  M2A Online Data Entry
  Restrictions Specific Scripting
  v2.0

  Richard Lee - MINISIS Inc
  2021-03-24
*/
function ServiceDeskSummaryRecord(xml) {
  // ServiceDeskSummaryRecord extends Record
  Record.call(this, xml);

  this.readonly_flag = checkReadOnly( xml );

  this.params = {
    'database' : 'buildings',
    'restriction_mnemonic'  :  'bd_rest_status',

       'maps' : {
       'bdemerg_name' :                 [{'key' : 'fullname3',       'value' : 'bd_emergenc_cont'},
                                         {'key' : 'person_id',      'value' : 'bd_emerg_cont_id'}],

       'bldg_cust' :                    [{'key' : 'fullname3',       'value' : 'bd_custodian'},
                                         {'key' : 'person_id',      'value' : 'bd_custodian_id'},
                                         {'key' : 'org_main_body',  'value' : 'bd_custodian'},
                                         {'key' : 'org_id',         'value' : 'bd_custodian_id'}],

        'bldg_inspect' :                [{'key' : 'fullname3',       'value' : 'bd_inspect_by'},
                                         {'key' : 'person_id',      'value' : 'bd_inspect_by_id'},
                                         {'key' : 'org_main_body',  'value' : 'bd_inspect_by'},
                                         {'key' : 'org_id',         'value' : 'bd_inspect_by_id'}],

       'bldg_pest' :                    [{'key' : 'fullname3',       'value' : 'bd_pest_remed_by'},
                                         {'key' : 'person_id',      'value' : 'bd_pest_r_by_id'},
                                         {'key' : 'org_main_body',  'value' : 'bd_pest_remed_by'},
                                         {'key' : 'org_id',         'value' : 'bd_pest_r_by_id'}],

       'bdincident_person' :            [{'key' : 'fullname3',       'value' : 'bd_inc_person'},
                                         {'key' : 'person_id',      'value' : 'bd_inc_person_id'}],

       'bldg_pref' :                    [{'key' : 'fullname3',       'value' : 'bd_pref_name'},
                                         {'key' : 'person_id',      'value' : 'bd_pref_name_id'},
                                         {'key' : 'org_main_body',  'value' : 'bd_pref_name'},
                                         {'key' : 'org_id',         'value' : 'bd_pref_name_id'}],

       'bldg_proposer' :                [{'key' : 'fullname3',       'value' : 'bd_prop_imp_by'},
                                         {'key' : 'person_id',      'value' : 'bd_prop_imp_b_id'},
                                         {'key' : 'org_main_body',  'value' : 'bd_prop_imp_by'},
                                         {'key' : 'org_id',         'value' : 'bd_prop_imp_b_id'}],

       'bldg_repair' :                  [{'key' : 'fullname3',       'value' : 'bd_repair_by'},
                                         {'key' : 'person_id',      'value' : 'bd_repair_by_id'},
                                         {'key' : 'org_main_body',  'value' : 'bd_repair_by'},
                                         {'key' : 'org_id',         'value' : 'bd_repair_by_id'}],

       'bldg_restrict' :                [{'key' : 'rest_text',      'value' : 'bd_rest_details'},
                                         {'key' : 'rest_id',        'value' : 'bd_rest_id'},
                                         {'key' : 'rest_category',  'value' : 'bd_restrict_ca'}]

    }
  };
}