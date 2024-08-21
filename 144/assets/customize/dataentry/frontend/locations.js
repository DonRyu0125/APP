/* **********************************************************************************
  setupWorksheetHandler()

  This function sets up the event handler of catalogue worksheet.
************************************************************************************ */

var setupWorksheetHandler = function ()
{
  $('a.get_index_value_exit').on('click', function() { selectIndexKey($(this)); });
  $('a.view_item_record').on('click', function () { showItemRecord ( $(this) ); });

  $('#print_label').on('click', function (e) { printLabel(e, $(this)); });
}

$(document).ready(function(){
  active_interface = new ApplicationInterface(new LocationsRecord('#MY_XML'));
  active_interaction = new ApplicationInteraction(active_interface);

  // setup application event handler
  active_interface.appWorksheetHandler = setupWorksheetHandler;

  init(active_interaction.populateForm);

  // Handle Page Loading:
  $('nav#worksheet_nav a').off().on('click', function(e) { e.preventDefault(); loadForm($(this).attr('href')); });
  updateDatabaseActionLinks();
  generateRecordSavingForm('normal');
});

// functions reads and show location item record.
function showItemRecord ( calling_field ) {
  var current_record = currentAppInterface.app_record;

  // get CURATORS_CODE field value
  // get
  // extract data-view parameter
  var item_recid = currentAppInterface.getFieldValue(calling_field, "CURATORS_CODE");
  if ( item_recid === false ) {
    item_recid = '';
    alert ( "Item ID is missing." );
  }
  else {
    var db_source = '';
    var db_parm = '';

    if ( item_recid.indexOf("LIBRARY-") == 0 ) {
      db_source = 'CATALOGUE';
      db_parm = '/BIBLIO_VALTAB/WEB_VALTABLE_DET_REP/B_LOCN_LINK%20%3D%3D%20';
    }
    else if ( item_recid.indexOf("COLLECTION-") == 0 ) {
      db_source = 'COLLECTIONS';
      db_parm = '/COL_VALTAB/WEB_VALTABLE_DET_REP/C_LOCN_LINK%20%3D%3D%20';
    }
    else if ( item_recid.indexOf("DESCRIPTION-") == 0 ) {
      db_source = 'DESCRIPTION';
      db_parm = '/DES_VALTAB/WEB_VALTABLE_DET_REP/D_LOCN_LINK%20%3D%3D%20';
    }
    else if ( item_recid.indexOf("ACCESSION-") == 0 ) {
      db_source = 'ACCESSION';
      db_parm = '/ACCESSION_VALTAB/WEB_VALTABLE_DET_REP/AC_LOCN_LINK%20%3D%3D%20';
    }
    else if ( item_recid.indexOf("CONTAINER-") == 0 ) {
      db_source = 'CONTAINER';
      db_parm = '/CONTAINER_VALTAB/WEB_VALTABLE_DET_REP/A_LOCN_LINK%20%3D%3D%20';
    }

    if ( db_source == '' ) {
      alert ( "Source database is unknown." );
    }
    else {
      currentAppInterface.loadValidatedTableRecord(calling_field, db_source, item_recid, db_parm);
    }
  }

}

// function handles the approval of displosed object.
function approveDisposal (calling_field)
{
  // extract DISPOSAL action
  var sourceField = getXmLRecordFieldValue( 'LOC_DP_ACTION', null );

  // if no displosal action, exit function
  if ( sourceField == '' ) {
    alert ( "Disposal Action is not yet selected." );
  }
  else {
    // set approved on
    setXmlRecordFieldValue ( 'LOC_DP_DATE', '++1', 0 );

    // set approved by
    setXmlRecordFieldValue ( 'LOC_DP_USER', '++2', 0 );

    var callback_func = null;
    var callback_data  = {};
    var return_code;

    // send HTTP request to commit record change
    var field_handle = $('#dba_save').find('a');
    if ( field_handle.length > 0 ) {
      var form_action = $(field_handle).data('form-action');
      var form = $('#submission_form');

      if ( form_action === undefined || form_action == null || form.length <= 0 ) {
        alert ( "Form is not found." );
        return_code = false;
      }
      else {
        alert ( "Disposal is approved" );

        return_code = submitFormAndCallback ( form_action, form, callback_func, callback_data, false );
      }
    }
  }
}
