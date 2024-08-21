/*
  M2A Online Data Entry
  Forbidden Word Specific Scripting
  v2.0

  Jon West - MINISIS Inc
  February 2015
*/
function emailTemplateRecord(xml) {


 // ForbiddenwordRecord extends Record
  Record.call(this, xml);

  // RL-2020-09-29
  this.readonly_flag = checkReadOnly( xml );

  this.params = {
    'database' : 'lookup_email_template',
  };
}