/*
  M2A Online Data Entry
  Sites Specific Scripting
  v2.0

  Richard Lee - MINISIS Inc
  February 2022
*/
function ContainerRecord(xml) {
  // ContainerRecord extends Record
  Record.call(this, xml);

  // RL-2020-09-29
  this.readonly_flag = checkReadOnly( xml );

  this.params = {
    'database' : 'Container',
    'restriction_mnemonic' : '',
    'current_accno' : '',

    'maps' : {
      'treatment_proposal_by' :             [{'key' : 'fullname',         'value' : 'c_prop_imp_by'},
                                             {'key' : 'person_id',        'value' : 'c_prop_imp_id'}],
      'treatment_org_proposal_by' :         [{'key' : 'org_main_body',    'value' : 'c_prop_imp_by'},
                                             {'key' : 'org_id',           'value' : 'c_prop_imp_id'}],
      'video_location' :                    [{'key': 'curators_code',     'value' : 'c_convd_location'}],
      'audio_location' :                    [{'key': 'curators_code',     'value' : 'c_conad_location'}],
      'treatment_org_examiner' :            [{'key' : 'org_main_body',    'value' : 'examiner'},
                                             {'key' : 'org_id',           'value' : 'examiner_per_id'}],
      'treatment_examiner' :                [{'key' : 'fullname',         'value' : 'examiner'},
                                             {'key' : 'person_id',        'value' : 'examiner_per_id'}],
      'treat_org_treated_by' :              [{'key' : 'org_main_body',    'value' : 'treated_by'},
                                             {'key' : 'org_id',           'value' : 'treated_by_p_id'}],
      'treat_treated_by' :                  [{'key' : 'fullname3',        'value' : 'treated_by'},
                                             {'key' : 'person_id',        'value' : 'treated_by_p_id'}],
      'con_access_restrictions' :           [{'key' : 'rest_text',        'value' : 'con_restrict_cod'},
                                             {'key'  : 'rest_id',         'value' : 'con_restrict_id'}]

    }
  };
}
