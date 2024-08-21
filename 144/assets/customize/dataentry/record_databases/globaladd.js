/*
  M2A Online Data Entry
  Locations Specific Scripting
  v2.0

  Jon West - MINISIS Inc
  February 2015

  RL-2020-09-29  - map locations field to plan movement fields
*/
function LocationsRecord(xml) {
  // LocationRecord extends Record
  Record.call(this, xml);

  // RL-2020-09-29
  this.readonly_flag = checkReadOnly( xml );

  // RL-2020-09-29
  this.params = {
    'database' : 'location_authority',

    'maps' : {
      'person' :                            [{'key': 'fullname',          'value': 'move_contact'},
                                             {'key': 'person_id',         'value': 'move_contact_id'}],

      'plan_location' :                     [{'key': 'curators_code',     'value' : 'LOC1'},
                                             {'key': 'room',              'value' : 'LOC2'},
                                             {'key': 'building',          'value' : 'LOC3'},
                                             {'key': 'floor',             'value' : 'LOC4'},
                                             {'key': 'location_type',     'value' : 'LOC5'},
                                             {'key': 'rack_unit',         'value' : 'LOC6'},
                                             {'key': 'lication_contact',  'value' : 'LOC7'},
                                             {'key': 'bus_unit',          'value' : 'LOC9'},
                                             {'key': 'move_contact',      'value' : 'LOC10'},
                                             {'key': 'shelf',             'value' : 'LOC13'},
                                             {'key': 'position',          'value' : 'LOC14'},
                                             {'key': 'loc_access',        'value' : 'LOC15'}]
    }
  };
}