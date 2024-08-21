/*
  M2A Online Data Entry
  People Specific Scripting
  v2.0

  Richard Lee - MINISIS Inc
  2022-05-13
*/
function ClientRecord(xml) {
  // ClientRecord extends Record
  Record.call(this, xml);

  // RL-2020-09-29
  this.readonly_flag = checkReadOnly( xml );

  this.params = {
    'database' : 'client',
    'restriction_mnemonic' : 'p_restrict_stat',

    'maps' : {
      'associated_organization' : [{'key' : 'org_main_body',    'value' : 'maker_org'},
                                   {'key' : 'org_id',           'value' : 'p_maker_org_id'}],

      'related_person' :          [{'key' : 'fullname3',        'value' : 'rel_per_name'},
                                   {'key' : 'person_id',        'value' : 'rel_per_id'}],

      'relationship' :            [{'key' : 'desc_english',     'value' : 'relationship_eng'},
                                   {'key' : 'desc_french',      'value' : 'relationship_fre'}],

      'person_restrict' :         [{'key' : 'rest_text',        'value' : 'p_rest_details'},
                                   {'key' : 'rest_id',          'value' : 'p_restrict_id'},
                                   {'key' : 'rest_category',    'value' : 'p_restrict_cat'}],

      'default_address' :         [{'key' : 'p_oth_address1',   'value' : 'person_address1'},
                                   {'key' : 'p_oth_address2',   'value' : 'person_address2'},
                                   {'key' : 'p_oth_city',       'value' : 'person_city'},
                                   {'key' : 'p_oth_county',     'value' : 'person_county'},
                                   {'key' : 'p_oth_country',    'value' : 'person_country'},
                                   {'key' : 'p_oth_postal_cod', 'value' : 'person_postal_co'},
                                   {'key' : 'p_oth_phone',      'value' : 'person_phone'},
                                   {'key' : 'p_oth_phone_2',    'value' : 'person_phone_2'},
                                   {'key' : 'p_oth_fax',        'value' : 'person_fax'},
                                   {'key' : 'p_oth_url',        'value' : 'person_url'},
                                   {'key' : 'p_oth_email',      'value' : 'person_email'}]
    }
  };

  this.setDefaultAddress = function(new_default_address_group){
    this.remap(new_default_address_group, this.params.maps.default_address);
  };
}