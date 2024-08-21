/*
  M2A Online Data Entry
  Restrictions Specific Scripting
  v2.0

  Richard Lee - MINISIS Inc
  2021-03-24
*/
function ServiceDeskRecord(xml) {
  // ServiceDeskRecord extends Record
  Record.call(this, xml);

  this.readonly_flag = checkReadOnly( xml );

  this.params = {
    'database' : 'servicedesk',
    'restriction_mnemonic'  :  '',

       'maps' : {
       // RL-2021-03-28
       'request_object':                [{'key': 'refd',              'value': 'req_refd'},
	                                     {'key': 'refd',              'value': 'req_item_id'},
                                         {'key': 'title',             'value': 'req_item_title'},
                                         {'key': 'L=DESCRIPTION',     'value': 'req_db_name'},
                                         {'key': 'barcode',           'value': 'req_child_id'}],
       'm2a_request_object':            [{'key': 'refd',              'value': 'req_refd'},
	                                     {'key': 'refd',              'value': 'req_item_id'},
                                         {'key': 'title',             'value': 'req_item_title'},
                                         {'key': 'L=DESCRIPTION',     'value': 'req_db_name'},
                                         {'key': 'barcode',           'value': 'req_child_id'}],
       'm3_request_object':             [{'key': 'accession_number',  'value': 'req_item_id'},
                                         {'key': 'legal_title',       'value': 'req_item_title'},
                                         {'key': 'L=Onsite',          'value': 'req_loc_type'},
                                         {'key': 'c_locn_link',       'value': 'req_loc_code'},
                                         {'key': 'L=COLLECTION',      'value': 'req_db_name'}],
       'accession_request_object':      [{'key': 'accno',             'value': 'req_item_id'},
                                         {'key': 'acc_title',         'value': 'req_item_title'},
                                         {'key': 'L=ACCESSION',       'value': 'req_db_name'}],
       'container_request_object':      [{'key': 'L=CONTAINER',       'value': 'req_db_name'},
                                         {'key': 'container_id',      'value': 'req_item_id'},
                                         {'key': 'location_details',  'value': 'req_item_title'},
                                         {'key': 'container_id',      'value': 'req_child_id'}],   // RL-20220207
       'lib_request_object':            [{'key': 'accession_number',  'value': 'req_acc_number'},  // RL-20220913
                                         {'key': 'barcode',           'value': 'req_item_id'},     // RL-20220913
                                         {'key': 'title',             'value': 'req_item_title'},
                                         {'key': 'L=Onsite',          'value': 'req_loc_type'},
                                         {'key': 'b_locn_link',       'value': 'req_loc_code'},
                                         {'key': 'L=LIBRARY',         'value': 'req_db_name'}],
       'client_object':                 [{'key': 'c_client_number',   'value': 'req_patron_id'},
                                         {'key': 'c_name_full',       'value': 'req_patron_name'},
                                         {'key': 'c_email',           'value': 'req_patron_email'},
                                         {'key': 'aor_card_no',       'value': 'req_aor_card_no'}],
       'req_loan_org':                  [{'key': 'org_main_body',     'value': 'r_loan_org'},
                                         {'key': 'org_id',            'value': 'r_loan_org_id'}],
       'req_exh_contact':               [{'key': 'fullname3',         'value': 'r_exh_contact'},
                                         {'key': 'person_id',         'value': 'r_exh_contact_id'}],
       'req_int_contact':               [{'key': 'fullname3',         'value': 'r_int_contact'},
                                         {'key': 'person_id',         'value': 'r_int_contact_id'}],
       'req_return_to':                 [{'key': 'fullname3',         'value': 'r_return_to'},
                                         {'key': 'person_id',         'value': 'r_return_to_id'}]
    }
  };
}