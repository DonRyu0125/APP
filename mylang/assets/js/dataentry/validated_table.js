 /*****
  **
  **  handleValidatedTable : returns an XML representation of data coming from the validated table record
  **  
  **  params:
  **    - map : a javascript object with a series of 'key's and 'value's.  A 'key' is field mnemonic in the validated table (original name),
  **            and a 'value' is the mnemonic name as it will exist after being remapped.
  **    - record : XML representation of the validated table record to be passed back to the original caller
  **
   *****/
$(document).ready(function() {
  $('span.copy_to_record').on('click', function() {
    parent.$tmp_data = $(this).parent('li').find('xml.record_xml').first();
    parent.$.colorbox.close();
  });
});