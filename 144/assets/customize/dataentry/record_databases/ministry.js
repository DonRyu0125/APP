/*
  M2A Online Data Entry
  People Specific Scripting
  v2.0

  Richard lee - MINISIS Inc
  Stptember 2021
*/
function MinistryRecord(xml) {
  // MinistryRecord extends Record
  Record.call(this, xml);

  this.readonly_flag = checkReadOnly( xml );

  this.params = {
    'database' : 'people',
    'restriction_mnemonic' : 'p_restrict_stat',

    'maps' : {
      'dbname' :                  [{'key' : 'source_name  ',    'value' : 'target_name'},
                                   {'key' : 'source_id',        'value' : 'target_id'}]
    }
  };
}