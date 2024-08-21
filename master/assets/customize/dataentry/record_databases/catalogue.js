/*
  M2A Online Data Entry
  Catalogue Specific Scripting
  v1.0

  Richard lee - MINISIS Inc
  January 2021
*/
function CatalogueRecord(xml) {
  // CataloguesRecord extends Record
  Record.call(this, xml);
  var record = this;

  this.readonly_flag = checkReadOnly( xml );

  this.params =
  {
    'database' : 'Catalogue',
    'restriction_mnemonic' : '',
    'current_accession_number' : this.getElement('accession_number', '0'),
    'components_mnemonic' : '',
    'record_image_group' : 'l_im_ref_grp',
    'record_image_field' : 'l_im_access',
    'record_image_caption_field' : 'l_im_caption',

    'maps' :
    {
      'collect_code' :               [{'key' : 'collect_code_des',      'value' : 'i_collect_code'},
                                      {'key' : 'collection_code',       'value' : 'collection_code'},
                                      {'key' : 'col_material_typ',      'value' : 'media_type'}],
      'marc_100' :                   [{'key' : 'lib_fullname',          'value' : 'marc__100'}],
      'marc_600' :                   [{'key' : 'lib_fullname',          'value' : 'marc__600'}],
      'marc_700' :                   [{'key' : 'lib_fullname',          'value' : 'marc__700'}],
      'marc_541' :                   [{'key' : 'lib_fullname2',         'value' : 'marc__541'}],
      'marc_541_org' :               [{'key' : 'lib_org_main',          'value' : 'marc__541'}],  // RL-20220603
      'marc_110' :                   [{'key' : 'lib_org_main',          'value' : 'marc__110'}],
      'marc_610' :                   [{'key' : 'lib_org_main',          'value' : 'marc__610'}],
      'marc_710' :                   [{'key' : 'lib_org_main',          'value' : 'marc__710'}],

      'item_restrictions' :          [{'key' : 'rest_text',             'value' : 'item_status_n'}, // KN - 20220727
                                      {'key' : 'rest_id',               'value' : 'item_status_id'}]
    }
  };

  var params = this.params;


  ///////// Catalogue dummy specific methods /////////


  /*****
  **
  **  hasComponents : returns a boolean value based on whether or not the currently loaded record contains components
  **
   *****/
  this.hasComponents = function() {
    return ( false );
  };


  /*****
  **
  **  getComponents : returns an XML/JS copy of the component group contained within the current record
  **
   *****/
  this.getComponents = function() {
    return false;
  };


  /*****
  **
  **  getComponent : returns an XML/JS copy of a specific occurrence of the component group contained within the current record
  **
   *****/
  this.getComponent = function(occurrence) {
    return false;
  };


  /*****
  **
  **  componentCount : returns an integer with the amount of component occurrences contained within the current record
  **
   *****/
  this.componentCount = function() {
    return 0;
  };


  /*****
  **
  **  getPrimaryImage : returns a javascript object containing the physical location of the image (ie [M3IMAGE]file.jpg), and the image caption
  **
   *****/
  this.getPrimaryImage = function() {
    if (this.getGroup(this.params.record_image_group, '1')) {
      var image_group = this.getGroup(this.params.record_image_group, '1').clone();
      var primary_image = {};
      primary_image.image = this.getElement(this.params.record_image_field, '1', image_group);
      primary_image.caption = this.getElement(this.params.record_image_caption_field, '1', image_group);

      return primary_image;
    } else {
      return false;
    }
  };


  /*****
  **
  **  getSecondImage : returns a javascript object containing the physical location of second image (ie [M3IMAGE]file.jpg), and the image caption
  **
   *****/
  this.getSecondImage = function() {
    if (this.getGroup(this.params.record_image_group, '2')) {
      var image_group = this.getGroup(this.params.record_image_group, '2').clone();
      var second_image = {};
      second_image.image = this.getElement(this.params.record_image_field, '2', image_group);
      second_image.caption = this.getElement(this.params.record_image_caption_field, '2', image_group);

      return second_image;
    } else {
      return false;
    }
  };

}