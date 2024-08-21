var  user_group_params =
{
  // group name
  'ADMIN' :
  {
    // application module ID
    'enq':       'General Information|Accessing Collection Items|Finding Collection Items|Obtaining Reproductions|Art Collection Inquiries|Donations - Art|Educational Resources and Workshops|Loans - Digitization|Tours and Events|Exhibits|Website Technical Issues|Corrections to Descriptions|Loans - Exhibition|Donations - Archival and Library|Other',
    'request':   '@'
  },
  'ARCHIVISTS': // Archivists
  {
    'enq':       'Archivists',
    'request':   'Archivists'
  },
  'RECEPTION': // Reception
  {
    'enq':       'Reception',
    'request':   'Reception'
  },
  'ART':   // Art
  {
    'enq':       'Art',
    'request':   'Art'
  },
  'EDUCATION':   // Education Programming
  {
    'enq':       'Education Programming',
    'request':   'Education Programming'
  },
  'DIGITIZATION':   // Digitization
  {
    'enq':       'Digitization',
    'request':   'Digitization'
  },
  'OUTREACH':   // Outreach
  {
    'enq':       'Outreach',
    'request':   'Outreach'
  },
  'WEBSITE':   // Website
  {
    'enq':       'Website',
    'request':   'Website'
  },
  'DESC_LOAN':   // Archival Descriptions|Archival Loans'
  {
    'enq':       'Archival Descriptions|Archival Loans',
    'request':   'Archival Descriptions|Archival Loans'
  },
  'DONATIONS':   // Archival Donations
  {
    'enq':       'Archival Donations',
    'request':   'Archival Donations'
  }
};

// use user role to lookup record selectors
function lookupRecordSelector(user_role, module_id, search_mnemonic)
{
  var return_value = search_mnemonic + ' @';
  var accessList = '';
  var group_params;

  var lastChar = user_role.substring(user_role.length-1);
  if ( user_role.indexOf('(') == 0 && lastChar == ')' ) {
    var role_names = user_role.substring(1, user_role.length-1).split('|');
    for ( var ix = 0 ; ix < role_names.length ; ix++ ) {
      if ( user_group_params != undefined  && user_group_params[role_names[ix]] != undefined ) {
        group_params = user_group_params[role_names[ix]];
        if ( group_params[module_id] != undefined ) {
          if ( accessList.length > 0 ) {
            accessList = accessList + '|';
          }
          accessList = accessList + group_params[module_id];
        }
      }
    }
  }
  else {
    if ( user_group_params != undefined  && user_group_params[user_role] != undefined ) {
      group_params = user_group_params[user_role];
      if ( group_params[module_id] != undefined ) {
        accessList = group_params[module_id];
      }
    }
  }
  if ( accessList != '' && accessList != '@' ) {
    return_value = search_mnemonic + ' "' + accessList.replace(/\|/g, '" + ' + search_mnemonic + ' "') + '"';
  }

  return return_value;
}
