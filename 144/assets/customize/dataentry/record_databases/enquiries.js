/*
  M2A Online Data Entry
  Rights Specific Scripting
  v2.0

  Jon West - MINISIS Inc
  February 2015
*/
function EnquiriesRecord(xml) {
  // EnquiriesRecord extends Record
  Record.call(this, xml);

  // RL-2020-09-29
  this.readonly_flag = checkReadOnly( xml );

  this.params = {
    'database' : 'enquiries',
    'rights_costs_group': 'enq_charge_group',


  'maps' : {

       'client_organization' :              [{'key' : 'delete_this',      'value' : 'enq_user'},
                                             {'key' : 'delete_this',      'value' : 'enq_user_id'},
                                             {'key' : 'org_main_body',    'value' : 'enq_org'},
                                             {'key' : 'org_id',           'value' : 'enq_org_id'},
                                             {'key' : 'org_address1',     'value' : 'address1'},
                                             {'key' : 'org_address2',     'value' : 'address2'},
                                             {'key' : 'org_city',         'value' : 'city'},
                                             {'key' : 'org_county',       'value' : 'state'},
                                             {'key' : 'org_country',      'value' : 'country'},
                                             {'key' : 'org_postal_code',  'value' : 'zipcode'},
                                             {'key' : 'org_phone',        'value' : 'phone1'},
                                             {'key' : 'org_phone2',       'value' : 'phone2'},
                                             {'key' : 'org_fax',          'value' : 'fax'},
                                             {'key' : 'org_url',          'value' : 'url_user'},
                                             {'key' : 'org_email',        'value' : 'email'}],

       'client_individual' :                [{'key' : 'delete_this',      'value' : 'enq_org'},
                                             {'key' : 'delete_this',      'value' : 'enq_org_id'},
                                             {'key' : 'fullname3',        'value' : 'enq_user'},
                                             {'key' : 'person_id',        'value' : 'enq_user_id'},
                                             {'key' : 'person_address1',  'value' : 'address1'},
                                             {'key' : 'person_address2',  'value' : 'address2'},
                                             {'key' : 'person_city',      'value' : 'city'},
                                             {'key' : 'person_county',    'value' : 'state'},
                                             {'key' : 'person_country',   'value' : 'country'},
                                             {'key' : 'person_postal_co', 'value' : 'zipcode'},
                                             {'key' : 'person_phone',     'value' : 'phone1'},
                                             {'key' : 'person_phone_2',   'value' : 'phone2'},
                                             {'key' : 'person_fax',       'value' : 'fax'},
                                             {'key' : 'person_url',       'value' : 'url_user'},
                                             {'key' : 'person_email',     'value' : 'email'}],

       'enquiry_objects' :                  [{'key' : 'refd',             'value' : 'enq_access_no'},
                                             {'key' : 'title',            'value' : 'enq_title'}],

       'org_retrieve' :                     [{'key' : 'org_main_body',    'value' : 'org_name'},
                                             {'key' : 'org_id',           'value' : 'org_name_id'}],

       'person_retrieve' :                  [{'key' : 'fullname3',         'value' : 'pers_name'},
                                             {'key' : 'person_id',        'value' : 'pers_name_id'}],

       'enq_client_object':                 [{'key': 'c_client_number',   'value': 'enq_patron_id'},
                                             {'key': 'c_name_full',       'value': 'enq_patron_name'},
                                             {'key': 'c_email',           'value': 'enq_patron_email'},
                                             {'key': 'aor_card_no',       'value': 'aor_card_no'}], 
       'enq_loan_org':                      [{'key': 'org_main_body',     'value': 'e_loan_org'},
                                             {'key': 'org_id',            'value': 'e_loan_org_id'}],
       'enq_exh_contact':                   [{'key': 'fullname3',         'value': 'e_exh_contact'},
                                             {'key': 'person_id',         'value': 'e_exh_contact_id'}],
       'enq_int_contact':                   [{'key': 'fullname3',         'value': 'e_int_contact'},
                                             {'key': 'person_id',         'value': 'e_int_contact_id'}],
       'enq_return_to':                     [{'key': 'fullname3',         'value': 'e_return_to'},
                                             {'key': 'person_id',         'value': 'e_return_to_id'}]

    }
  };

  var record = this;

  this.getCost = function(occurrence) {
    return record.getGroup(record.params.rights_costs_group, occurrence);
  };

  this.hasCosts = function() {
    return (record.getGroup(record.params.rights_costs_group).length > 0);
  };

  this.getCosts = function() {
    if (record.hasCosts()) {
      return (record.getGroup(record.params.rights_costs_group, 1).parent());
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