/*
  M2A Online Data Entry
  Project Specific Scripting
  v2.0

  Jon West - MINISIS Inc
  February 2015
*/
function ProjectRecord(xml) {
  // ProjectRecord extends Record
  Record.call(this, xml);

  // RL-2020-09-29
  this.readonly_flag = checkReadOnly( xml );


  this.params = {
    'database': 'project',
    'pfees_costs_group': 'project_fee_grp',

    'maps': {
      'proj_funder':           [{'key': 'fullname3',          'value': 'project_funder'},
                                {'key': 'person_id',          'value': 'proj_funder_id'}],  // RL-20211231
      'proj_org_funder':       [{'key': 'org_main_body',      'value': 'project_funder'},   // RL-20211231
                                {'key': 'org_id',             'value': 'proj_funder_id'}],

      'project_objects':       [{'key': 'refd',              'value': 'proj_access_no'},
                                {'key': 'title',             'value': 'proj_legal_title'}]

      'request_objects':       [{'key': 'refd',              'value': 'req_item_id'},
                                {'key': 'title',             'value': 'req_item_title'}]

    }
  };



  var record = this;

  //get cost for projects
  this.getCost = function (occurrence) {
    return record.getGroup(record.params.pfees_costs_group, occurrence);
  };

  this.hasCosts = function () {
    return (record.getGroup(record.params.pfees_costs_group).length > 0);
  };

  this.getCosts = function () {
    if (record.hasCosts()) {
      return (record.getGroup(record.params.pfees_costs_group, 1).parent());
    } else {
      return false;
    }
  };

  this.getCostsCount = function () {
    if (record.hasCosts()) {
      return record.getCosts().children().length;
    } else {
      return 0;
    }
  };
}