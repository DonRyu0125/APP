/*
  M2A Online Data Entry
  Comments Specific Scripting
  v2.0

  Richard Lee - MINISIS Inc
  2022-05-13
*/
function CommentsRecord(xml) {
  // CommentsRecord extends Record
  Record.call(this, xml);

  // RL-2020-09-29
  this.readonly_flag = checkReadOnly( xml );

  this.params = {
    'database' : 'comments',
    'restriction_mnemonic'  :  '',

       'maps' : {
       // RL-2021-03-28
       'm2a_comments_object':            [{'key': 'refd',              'value': 'comments_item_id'},
                                         {'key': 'L=DESCRIPTION',     'value': 'comments_source'},],
       'm3_comments_object':             [{'key': 'accession_number',  'value': 'comments_item_id'},
                                         {'key': 'L=COLLECTION',      'value': 'comments_source'},],
       'accession_comments_object':      [{'key': 'accno',            'value': 'comments_item_id'},
                                         {'key': 'L=ACCESSION',       'value': 'comments_source'},],
       'container_comments_object':      [{'key': 'container_id',     'value': 'comments_item_id'},
                                         {'key': 'L=CONTAINER',       'value': 'comments_source'},],
       'lib_comments_object':            [{'key': 'accession_number', 'value': 'comments_item_id'},
                                         {'key': 'L=LIBRARY',         'value': 'comments_source'},]
    }
  };

  this.setDefaultAddress = function(new_default_address_group){
    this.remap(new_default_address_group, this.params.maps.default_address);
  };
}