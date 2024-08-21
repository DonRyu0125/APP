/*
  M2A Online Data Entry
  Organizations Specific Scripting
  v2.0

  richard Lee - MINISIS Inc
  Sept 2021
*/

function RecordSeriesRecord(xml) {

console.log(xml)
  // RecordSeriesRecord extends Record
  Record.call(this, xml);

  // RL-2020-09-29
  this.readonly_flag = checkReadOnly( xml );

  this.params = {
    'database' : 'record_series',

    'maps' : {
      'record_series_schedule' :    [
                                      {'key' : 'schedule_no',         'value' : 'asso_sch_id'},
                                      {'key' : 'schedule_name',       'value' : 'asso_schedule'}
                                    ]

    }
  };
}