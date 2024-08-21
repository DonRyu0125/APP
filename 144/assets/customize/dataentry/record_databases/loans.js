/*
  M2A Online Data Entry
  Loans Specific Scripting
  v2.0

  Jon West - MINISIS Inc
  February 2015
*/

function LoansRecord(xml) {
  // LoansRecord extends Record
  Record.call(this, xml);

  // RL-2020-09-29
  this.readonly_flag = checkReadOnly( xml );

  this.params = {
    'database': 'loans',
    'loans_costs_group': 'lo_install_grp',

    'maps': {
      'step_one_institution': [{
          'key': 'org_main_body',
          'value': 'lo_org'
        },
        {
          'key': 'org_id',
          'value': 'lo_org_id'
        }
      ],
      'step_one_contact': [{
          'key': 'fullname',
          'value': 'lo_shipped_to'
        },
        {
          'key': 'person_id',
          'value': 'lo_shipped_to_id'
        }
      ],
      'step_one_location': [{
        'key': 'curators_code',
        'value': 'lo_int_ship_to'
      }],
      'step_one_location_contact': [{
          'key': 'fullname',
          'value': 'lo_int_contact'
        },
        {
          'key': 'person_id',
          'value': 'lo_int_cont_id'
        }
      ],
      'step_one_return_to': [{
          'key': 'fullname',
          'value': 'lo_returned_to'
        },
        {
          'key': 'person_id',
          'value': 'lo_returned_id'
        }
      ],
      'loan_renewed_by': [{
          'key': 'fullname',
          'value': 'lo_renewed_by'
        },
        {
          'key': 'person_id',
          'value': 'lo_renewed_by_id'
        }
      ],
      'exhibition_registrar': [{
          'key': 'fullname',
          'value': 'exhib_register'
        },
        {
          'key': 'person_id',
          'value': 'exhib_reg_id'
        }
      ],
      'venue_institution': [{
          'key': 'org_main_body',
          'value': 'exhib_v_venue'
        },
        {
          'key': 'org_id',
          'value': 'exhib_v_venue_id'
        }
      ],
      'venue_institution_contact': [{
          'key': 'fullname',
          'value': 'exh_v_curator'
        },
        {
          'key': 'person_id',
          'value': 'exh_v_curator_id'
        }
      ],
      'venue_location': [{
        'key': 'curators_code',
        'value': 'exh_v_inhouse'
      }],
      'venue_location_contact': [{
          'key': 'fullname',
          'value': 'exh_v_cur_inhous'
        },
        {
          'key': 'person_id',
          'value': 'exh_v_cur_inh_id'
        }
      ],

      'collections_to_loans': [{
          'key': 'accession_number',
          'value': 'item_acc_no'
        },
        {
          'key': 'legal_title',
          'value': 'item_legal_title'
        },
        {
          'key': 'L=COLLECTION',
          'value': 'item_db_name'
        }
      ],
      'description_to_loans': [{
          'key': 'refd',
          'value': 'item_acc_no'
        },
        {
          'key': 'title',
          'value': 'item_legal_title'
        },
        {
          'key': 'L=DESCRIPTION',
          'value': 'item_db_name'
        }
      ],
      'library_to_loans': [{
          'key': 'accession_number',
          'value': 'item_acc_no'
        },
        {
          'key': 'title',
          'value': 'item_legal_title'
        },
        {
          'key': 'L=LIBRARY',
          'value': 'item_db_name'
        }
      ],
      'accession_to_loans': [{
          'key': 'accno',
          'value': 'item_acc_no'
        },
        {
          'key': 'acc_title',
          'value': 'item_legal_title'
        },
        {
          'key': 'L=ACCESSION',
          'value': 'item_db_name'
        }
      ],
      'container_to_loans': [{  // RL-20220207
          'key': 'container_id',
          'value': 'item_acc_no'
        },
        {
          'key': 'location_details',
          'value': 'item_legal_title'
        },
        {
          'key': 'L=CONTAINER',
          'value': 'item_db_name'
        }
      ],

      'shipping_shipped_to': [{
          'key': 'fullname',
          'value': 'loan_ship_to'
        },
        {
          'key': 'person_id',
          'value': 'loan_ship_to_id'
        },
        {
          'key': 'org_main_body',
          'value': 'loan_ship_to'
        },
        {
          'key': 'org_id',
          'value': 'loan_ship_to_id'
        }
      ],

      'ship_shipped_to': [{
          'key': 'fullname',
          'value': 'loan_ship_to'
        },
        {
          'key': 'person_id',
          'value': 'loan_ship_to_id'
        }
      ],

      'shipping_accompany_by': [{
          'key': 'fullname',
          'value': 'lo_org_personnel'
        },
        {
          'key': 'person_id',
          'value': 'lo_org_per_id'
        }
      ],

      'shipping_shipper': [{
          'key': 'fullname3', // RL-20211231
          'value': 'lo_shipper'
        },
        {
          'key': 'person_id',
          'value': 'lo_ship_ind_id'
        }
      ], // RL-20211231
      'shipping_org_shipper': [{  // RL-20211231
          'key': 'org_main_body',
          'value': 'lo_shipper'
        },
        {
          'key': 'org_id',
          'value': 'lo_ship_ind_id'
        }
      ],

      'shipping_insurer': [{
          'key': 'org_main_body',
          'value': 'insurer'
        },
        {
          'key': 'org_id',
          'value': 'insurer_id'
        }
      ],
      'shipping_agent': [{
          'key': 'fullname',
          'value': 'insure_agent'
        },
        {
          'key': 'person_id',
          'value': 'ins_agent_id'
        }
      ],
      'media_video_location': [{
        'key': 'curators_code',
        'value': 'exhib_vid_loc'
      }],
      'media_audio_location': [{
        'key': 'curators_code',
        'value': 'exhib_audio_loc'
      }]
    },
    // RL-2020-09-29
    'loanout_ai': {
      'ai_field': 'LO_ID',
      'Outgoing Loan': 'LOANOUT_INC',
      'Internal Exhibition': 'EXHIBITION_LOAN_NUMBER',
      'Exhibition': 'EXHIBITION_LOAN_NUMBER'
    }
  };

  var record = this;

  this.getCost = function (occurrence) {
    return record.getGroup(record.params.loans_costs_group, occurrence);
  };

  this.hasCosts = function () {
    return (record.getGroup(record.params.loans_costs_group).length > 0);
  };

  this.getCosts = function () {
    if (record.hasCosts()) {
      return (record.getGroup(record.params.loans_costs_group, 1).parent());
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