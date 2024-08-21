/*
  M2A Online Data Entry
  People Specific Scripting
  v2.0

  Richard Lee - MINISIS Inc
  2021-12-31
*/
function BranchRecord(xml) {
  // BranchRecord extends Record
  Record.call(this, xml);

  // RL-2020-09-29
  this.readonly_flag = checkReadOnly( xml );

  this.params = {
    'database' : 'branch',
    'restriction_mnemonic' : '',

    'maps' : {
      'branch_ministry' : [{'key' : 'ministry_name',    'value' : 'b_ministry_name'},
                           {'key' : 'ministry_id',      'value' : 'b_ministry_id'}]
    }
  };
}