/*
  M2A Online Data Entry
  Sites Specific Scripting
  v2.0

  Jon West - MINISIS Inc
  February 2015
*/
function SitesRecord(xml) {

console.log(xml);
 // SitesRecord extends Record
  Record.call(this, xml);

  // RL-2020-09-29
  this.readonly_flag = checkReadOnly( xml );

  this.params = {
    'database' : 'sites',
    'restriction_mnemonic' : 'geo_rest_status',

    'maps' : {
      'powner_org' :         [{'key' : 'org_main_body',    'value' : 'site_owner'},   // RL-20211231
                              {'key' : 'org_id',           'value' : 'site_owner_id'}],  // RL-20211231
      'powner' :             [{'key' : 'fullname3',        'value' : 'site_owner'},  // RL-20211231
                              {'key' : 'person_id',        'value' : 'site_owner_id'}],

      'visit_person' :       [{'key' : 'fullname3',        'value' : 'member_name'},
                              {'key' : 'person_id',        'value' : 'member_id'}],

    }
  };
}