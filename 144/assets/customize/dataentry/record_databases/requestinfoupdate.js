/*
  M2A Online Data Entry
  Restrictions Specific Scripting
  v2.0

  Richard Lee - MINISIS Inc
  2021-03-24
*/
function RequestInfoUpdateRecord(xml) {
  // RequestInfoUpdate extends Record
  Record.call(this, xml);

  this.readonly_flag = checkReadOnly( xml );

  this.params = {
    'database' : 'request_info_update',
    'restriction_mnemonic'  :  ''
  };
}