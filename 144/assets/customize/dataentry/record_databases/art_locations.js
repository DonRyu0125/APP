/*
  CAMS Data Entry
  Locations Specific Scripting
  v2.0

  Jon West - MINISIS Inc
  February 2015
*/
function ArtLocationsRecord(xml) {
  // ArtLocationsRecord extends Record
  Record.call(this, xml);

  // RL-2020-09-29
  this.readonly_flag = checkReadOnly( xml );

  this.params = {
    'database' : 'artlocations',

    'maps' : {
      'art_locperson' : [{'key': 'fullname3',  'value': 'art_move_contact'},
                  {'key': 'person_id', 'value': 'art_l_mv_cnt_id'}]
    }
  };
}