/*
  M2A Online Data Entry
  Locations Specific Scripting
  v2.0

  Jon West - MINISIS Inc
  February 2015
*/
function LocationsRecord(xml) {
  // LocationRecord extends Record
  Record.call(this, xml);

   // RL-2020-09-29
  this.readonly_flag = checkReadOnly( xml );

  this.params = {
    'database' : 'location_authority',

    'maps' : {
      'loc_auth_contact' :              [{'key': 'fullname3',         'value': 'move_contact'},
                                         {'key': 'person_id',         'value': 'loc_move_cnt_id'}],
       'm2a_item_id':                   [{'key': 'd_locn_link',       'value': 'curators_code'}],
       'm3_item_id':                    [{'key': 'c_locn_link',       'value': 'curators_code'},
                                         {'key': 'L=Onsite',          'value': 'location_type'}],
       'accession_item_id':             [{'key': 'a_locn_link',       'value': 'curators_code'}],
       'lib_item_id':                   [{'key': 'b_locn_link',       'value': 'curators_code'},
                                         {'key': 'L=Onsite',          'value': 'location_type'}]
    }
  };
}