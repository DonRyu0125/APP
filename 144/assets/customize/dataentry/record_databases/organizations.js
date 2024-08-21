/* 
  M2A Online Data Entry
  Organizations Specific Scripting
  v2.0

  Jon West - MINISIS Inc
  February 2015
*/

function OrganizationsRecord(xml) {
  // RL-2020-09-29
  this.readonly_flag = checkReadOnly( xml );
  
  this.params = {
    'maps' : {
      'new_org_contact_name' : [{'key' : 'fullname3',       'value' : 'con_fullname3'},
                                {'key' : 'person_id',       'value' : 'con_fullname_id'},
                                {'key' : 'person_phone',    'value' : 'person_phone'},
                                {'key' : 'person_fax',      'value' : 'person_fax'},
                                {'key' : 'person_url',      'value' : 'person_url'},
                                {'key' : 'person_email',    'value' : 'person_email'}],

      'sub_org' :              [{'key' : 'org_main_body',   'value' : 'org_sub_body'}, // KN-20220715
                                {'key' : 'org_id',          'value' : 'org_sub_body_id'}], // KN-20220715

      'controlling_entity' :   [{'key' : 'org_main_body',   'value' : 'org_cont_agency'},
                                {'key' : 'org_id',          'value' : 'o_cont_agency_id'}],

      'predecessors' :         [{'key' : 'org_main_body',   'value' : 'org_predecessor'},
                                {'key' : 'org_id',          'value' : 'org_pred_id'}],

      'successors' :           [{'key' : 'org_main_body',   'value' : 'org_successor'},
                                {'key' : 'org_id',          'value' : 'org_success_id'}],

      'org_restrict' :         [{'key' : 'rest_text',       'value' : 'o_rest_details'},
                                {'key' : 'rest_id',         'value' : 'o_restrict_id'},
                                {'key' : 'rest_category',   'value' : 'o_restrict_cat'}],

      'default_address' :      [{'key': 'o_oth_address1',   'value': 'org_address1'},
                                {'key': 'o_oth_address2',   'value': 'org_address2'},
                                {'key': 'o_oth_city',       'value': 'org_city'},
                                {'key': 'o_oth_county',     'value': 'org_county'},
                                {'key': 'o_oth_country',    'value': 'org_country'},
                                {'key': 'o_oth_postal_cod', 'value': 'org_postal_code'},
                                {'key': 'o_oth_phone',      'value': 'org_phone'},
                                {'key': 'o_oth_phone2',     'value': 'org_phone2'},
                                {'key': 'o_oth_fax',        'value': 'org_fax'},
                                {'key': 'o_oth_url',        'value': 'org_url'},
                                {'key': 'o_oth_email',      'value': 'org_email'}]}
};


  // OrganizationRecord extends Record
  Record.call(this, xml);
  this.database = 'organizations';
  this.restrictionMnemonic = 'o_restrict_stat';

  this.setDefaultAddress = function(new_default_address_group){
    this.remap(new_default_address_group, this.params.maps.default_address);
  };
}