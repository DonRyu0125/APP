/* 
  M2A Online Data Entry
  Incident Specific Scripting
  v2.0

  Jon West - MINISIS Inc
  February 2015
*/
function IncidentRecord(xml) {
  // IncidentRecord extends Record
  Record.call(this, xml);
  
  // RL-2020-09-29
  this.readonly_flag = checkReadOnly( xml )  

  this.params = {
    'database': 'incident',
    'ifees_costs_group': 'incident_fee_grp',


    'maps' : {

	'incident_loc': [{
	     'key' : 'curators_code',    
		 'value' : 'inc_loc_code'
		},
        {
		  'key' : 'building',         
		  'value' : 'inc_loc_bldg'
		  }
	],
										  
    'incident_objects': [{
		  'key': 'refd',
		  'value': 'job_acc_no'
		},
		{
		  'key': 'title',       
		  'value': 'job_legal_title'
		}
	],			

    'job_conserve': [{
		  'key' : 'fullname3',         
		  'value' : 'j_conservator'
		 },
         {
		   'key' : 'person_id',        
		   'value' : 'j_conservator_id'
		}
	],	
										  
    'damage_reported_by': 	[{
		  'key' : 'fullname3',         
		  'value' : 'j_loss_reporter'
		 },
         {
		  'key' : 'person_id',        
		  'value' : 'j_loss_report_id'
		  }
	]
	
    }
  };

  var record = this;

  //get cost for incidents
  this.getCost = function (occurrence) {
    return record.getGroup(record.params.ifees_costs_group, occurrence);
  };

  this.hasCosts = function () {
    return (record.getGroup(record.params.ifees_costs_group).length > 0);
  };

  this.getCosts = function () {
    if (record.hasCosts()) {
      return (record.getGroup(record.params.ifees_costs_group, 1).parent());
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