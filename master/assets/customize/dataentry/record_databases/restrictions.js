/* 
  M2A Online Data Entry
  Restrictions Specific Scripting
  v2.0

  Jon West - MINISIS Inc
  February 2015
*/
function RestrictionsRecord(xml) {
  // RestrictionsRecord extends Record
  Record.call(this, xml);

  // RL-2020-09-29
  this.readonly_flag = checkReadOnly( xml );
  
  this.params = {
    'database' : 'restrictions'
  };
}