/*
  M2A Online Data Entry
  Organizations Specific Scripting
  v2.0

  Jon West - MINISIS Inc
  February 2015
*/

function SchedulesRecord(xml) {

  console.log(xml)
  // SchedulesRecord extends Record
  Record.call(this, xml);

    // RL-2020-09-29
  this.readonly_flag = checkReadOnly( xml );

  this.params = {
    'database' : 'schedule_val',

    'maps' : {
      'sch_recseries' :             [
                                      {'key' : 'series_id',         'value' : 'p_recseries_id'},
                                      {'key' : 'series_title',      'value' : 'p_recseries_tit'}
                                    ]

    }
  }
}