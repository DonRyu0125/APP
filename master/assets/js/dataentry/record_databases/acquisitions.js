/*
  M3 Online Data Entry
  People Specific Scripting
  v2.0

  Jon West - MINISIS Inc
  February 2015
*/
function AcquisitionsRecord(xml) {
  // AcquisitionsRecord extends Record
  Record.call(this, xml);

  // RL-2020-09-29
  this.readonly_flag = checkReadOnly( xml );

  this.params = {
    'database' : 'registration_root',
    'regdoc_group' : 'reg_document_grp',
    'current_accno' : this.getElement('access_grp_no', '0'),

    'maps' : {
      'rsource_organization' :              [{'key' : 'org_main_body',    'value' : 'source_org_name'},
                                             {'key' : 'org_id',           'value' : 'source_org_id'},
                                             {'key' : 'org_alias',        'value' : 'source_alias'},
                                             {'key' : 'org_abbreviation', 'value' : 'source_abbreviat'},
                                             {'key' : 'org_address1',     'value' : 'source_add_1'},
                                             {'key' : 'org_address2',     'value' : 'source_add_2'},
                                             {'key' : 'org_city',         'value' : 'source_city'},
                                             {'key' : 'org_county',       'value' : 'source_state'},
                                             {'key' : 'org_country',      'value' : 'source_country'},
                                             {'key' : 'org_postal_code',  'value' : 'source_zip'},
                                             {'key' : 'org_phone',        'value' : 'source_phone_1'},
                                             {'key' : 'org_phone2',       'value' : 'source_phone_2'},
                                             {'key' : 'org_fax',          'value' : 'source_fax'},
                                             {'key' : 'org_url',          'value' : 'source_url'},
                                             {'key' : 'org_email',        'value' : 'source_email'}],

      'rsource_individual' :                [{'key' : 'fullname',         'value' : 'source_fullname2'},
                                             {'key' : 'surname',          'value' : 'source_surname'},
                                             {'key' : 'forename',         'value' : 'source_first'},
                                             {'key' : 'person_id',        'value' : 'source_name_id'},
                                             {'key' : 'person_alias',     'value' : 'source_alias'},
                                             {'key' : 'person_address1',  'value' : 'source_add_1'},
                                             {'key' : 'person_address2',  'value' : 'source_add_2'},
                                             {'key' : 'person_city',      'value' : 'source_city'},
                                             {'key' : 'person_county',    'value' : 'source_state'},
                                             {'key' : 'person_country',   'value' : 'source_country'},
                                             {'key' : 'person_postal_co', 'value' : 'source_zip'},
                                             {'key' : 'person_phone',     'value' : 'source_phone_1'},
                                             {'key' : 'person_phone_2',   'value' : 'source_phone_2'},
                                             {'key' : 'person_fax',       'value' : 'source_fax'},
                                             {'key' : 'person_url',       'value' : 'source_url'},
                                             {'key' : 'person_email',     'value' : 'source_email'}],

      'rsource_contact' :                   [{'key' : 'fullname',        'value' : 'sc_fullname'},
                                             {'key' : 'person_id',        'value' : 'sc_id'},
                                             {'key' : 'person_alias',     'value' : 'srce_con_alias'},
                                             {'key' : 'surname',          'value' : 'sc_surname'},
                                             {'key' : 'forename',         'value' : 'sc_forename'}],


    }
  };

  var record = this;

  this.getCost = function(occurrence) {
    return record.getGroup(record.params.regdoc_group, occurrence);
  };

  this.hasCosts = function() {
    return (record.getGroup(record.params.regdoc_group).length > 0);
  };

  this.getCosts = function() {
    if (record.hasCosts()) {
      return (record.getGroup(record.params.regdoc_group, 1).parent());
    } else {
      return false;
    }
  };

  this.getCostsCount = function() {
    if (record.hasCosts()) {
      return record.getCosts().children().length;
    } else {
      return 0;
    }
  };
}