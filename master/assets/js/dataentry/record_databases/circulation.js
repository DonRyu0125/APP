/*
  M2A Online Data Entry
  Catalogue Specific Scripting
  v1.0

  Richard lee - MINISIS Inc
  January 2021
*/
function CirculationRecord(xml) {
  // CataloguesRecord extends Record
  Record.call(this, xml);
  var record = this;

  this.readonly_flag = checkReadOnly( xml );

  this.params =
  {
    'database' : 'Circulation',
    'restriction_mnemonic' : '',
    'current_accession_number' : this.getElement('accession_number', '0'),
    'components_mnemonic' : '',
    'record_image_group' : 'item_info',
    'record_image_field' : 'book_cover',
    'record_image_caption_field' : 'barcode',

    'maps' :
    {
     'map-key?' :    [{'key' : 'key?',     'value' : 'value?'}]
    }
  };

  var params = this.params;


  ///////// Circulation dummy specific methods /////////

}