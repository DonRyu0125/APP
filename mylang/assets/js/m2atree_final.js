const ROOT_ID       = "$ROOT";
const TOP_ID        = "$TOP";
const LMA_ICONS     = 170;
const MAX_COMP_SIZE = 30;
const zeros_string  = "000000000000000000000000000000";
const NODE_TYPE     = 0;
const PREV_TYPE     = 1;
const NEXT_TYPE     = 2;
const NEXT_LABEL    = "&lt;Next Page&gt;"
const PREV_LABEL    = "&lt;Previous Page&gt;"
const ITEM_PER_PAGE = 500;
const PAGE_SEPARATOR = "/";
const REFRESH_ICONS = "fa fa-refresh";
const SEARCH_INPUT  = "jstree_display_search";
const MODALDIALOG   = "#importModal";

// tree node icons list
const ford_test_icon = [ "/mylang/icons/minisis_default_database_00_01.png", // Database Lvl 0
                         "/mylang/icons/ford_placeholder_accession_01.png",  // Accession Lvl 1
                         "/mylang/icons/ford_placeholder_box_02.png",        // Box Lvl 2
                         "/mylang/icons/ford_placeholder_folder_03.png",     // Folder Lvl 3
                         "/mylang/icons/ford_placeholder_item_04.png"        // Item Lvl 4
                    ];
const minisis_online_default_icon =  ["/mylang/icons/minisis_default_database_00_01.png", // Database (Archive, Museum, Library)

                                      "/mylang/icons/minisis_default_collection_01.png", // Fonds, Collections
                                      "/mylang/icons/minisis_default_sub_collection_02.png", // Sous-fonds, sub-collections

                                      "/mylang/icons/minisis_default_series_03.png", // Series
                                      "/mylang/icons/minisis_default_sub-series_04.png", // Sub-series
                                      "/mylang/icons/minisis_default_sub-sub-series_05.png", // Sub-sub-series

                                      "/mylang/icons/minisis_default_file_06.png", // File
                                      "/mylang/icons/minisis_default_file_part_07.png", // File part
                                      "/mylang/icons/minisis_default_item_08.png", // Item
                                      "/mylang/icons/minisis_default_component_09.png"]; // Component, Diffusion Material

const lma_desc_icon = ["/mylang/icons/0-foldericon.png",
                       "/mylang/icons/1-fondsfoldericon.png",
                       "/mylang/icons/2-sousfondsfoldericon.png",
                       "/mylang/icons/3-seriesfoldericon.png",
                       "/mylang/icons/4-series2foldericon.png",
                       "/mylang/icons/5-series3foldericon.png",
                       "/mylang/icons/6-filefoldericon.png",
                       "/mylang/icons/7-filepartfoldericon.png",
                       "/mylang/icons/8-item_fol.png",
                       "/mylang/icons/9-tree_r.png"];

const default_desc_icon = ["/mylang/icons/0-foldericon.png",
                           "/mylang/icons/1-fondsfoldericon.png",
                           "/mylang/icons/2-sousfondsfoldericon.png",
                           "/mylang/icons/3-seriesfoldericon.png",
                           "/mylang/icons/4-series2foldericon.png",
                           "/mylang/icons/5-series3foldericon.png",
                           "/mylang/icons/6-filefoldericon.png",
                           "/mylang/icons/7-filepartfoldericon.png",
                           "/mylang/icons/8-item_fol.png",
                           "/mylang/icons/9-tree_r.png"];

// active tree node icons list
var icons_list = default_desc_icon;

/* -----------------------------------------------------------
   Untility functions
-------------------------------------------------------------- */

/*
   treeGetCookie()

   This is an utility function which checks to see whether
   cookie is defined in browser.  If cookie is found, the cookie value
   is returned as function return value.
*/

function treeGetCookie ( cookie_name ) {
  var cookie_value = "";

  var name = cookie_name + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');

  // search for cookie
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return cookie_value;
}


/*
  countXmlTag()

  This function counts number of specified XML tag.
*/

function countXmlTag( xml_result, xml_tag ) {
  var count = 0;

  var xml_nodes = xml_result.getElementsByTagName(xml_tag);
  if ( xml_nodes != null ) {
    count = xml_nodes.length;
  }

  return count;
}


/*
  getXMLTagValue()

  This function extruns the XML tag value and returns it as function return value.
*/

function getXMLTagValue ( xml_data, xml_tag ) {
  var tag_value = "";
  var tag_nodes = xml_data.getElementsByTagName(xml_tag)[0];
  if ( tag_nodes != null ) {
    var first_occ = tag_nodes.childNodes[0];
    tag_value = first_occ.nodeValue;
  }

  return tag_value;
}


/*
  m2a_trim_spaces

  This function trimes the leading and trailing spaces of string.
  The modified string is returned as function return value.
*/

function m2a_trim_spaces ( str ) {
  // convert string to lowercase and trim spaces
  var lowercase_str = str.toLowerCase().replace(/^\s+/g, '').replace(/\s+$/g, '');

  // remove noise characters
  lowercase_str = lowercase_str.replace ( /(\(|\)|\[|\]|{|})/g, '' );

  return lowercase_str;
}

/*
  searchNodeText()

  This function checks to see whether words of source string match words of target string.
*/

function searchNodeText ( str, node ) {
  var i = 0;
  var j = 0;
  var word;

  // trim spaces of search string
  var searchFor = "";
  searchFor = m2a_trim_spaces ( str );

  // parse search string to search word list
  var searchWords = [];
  if ( searchFor.indexOf(' ') > 0 ) {
    searchWords = searchFor.split(' ');
    for ( i = 0 ; i < searchWords.length ; i++ ) {
      searchWords[i] = m2a_trim_spaces ( searchWords[i] );
    }
  }
  else {
    searchWords = [m2a_trim_spaces(searchFor)];
  }

  // parse node title to title word list
  var titleWords = [];
  if ( node.text.indexOf(' ') > 0 ) {
    titleWords = node.text.split(' ');
    for ( i = 0 ; i < titleWords.length ; i++ ) {
      titleWords[i] = m2a_trim_spaces ( titleWords[i] );
    }
  }
  else {
    titleWords = [m2a_trim_spaces(node.text)];
  }

  // are search words found in title word list?
  var num_words = searchWords.length;
  var found_count = 0;
  for ( i = 0 ; i < num_words ; i++ ) {
    for ( j = 0 ; j < titleWords.length ; j++ ) {
      if ( titleWords[j] === searchWords[i] ) {
        found_count++;
        break;
      }
    }
    if ( found_count < i+1 ) {
      // if search word is not found, exit loop
      break;
    }
  }

  // set return value
  var match = false;
  if ( found_count == num_words ) {
    match = true;
    if ( m2a_tree != null ) {
      m2a_tree.m_num_hits++;
    }
  }

  return match;
}


/*
   treeAjaxCall()

   This is an utility function which sends URL to server and wait for URL response.
   The URL status code and response data are stored in CallResult object.
   CallResult object handle is returned as function return value.

   Parameters:
   url - is a tree resultful API URL
   respobse_type - is the format of response. It is either xml or text.
*/

function treeAjaxCall ( request_url, response_type ) {
  var result_data = null;
  var result_code = 0;
  var result_value = null;

  if ( response_type != "xml" && response_type != "text" ) {
    result_code = 4101;
  }
  else {
    // prepare and make Ajax call
    $.ajax({
      async: false,
      type: "GET",
      dataType: response_type,
      url: request_url,
      success: function (data) {
        result_data = data;

        // check Ajax return code
        if ( jQuery.isXMLDoc( data ) ) {
          var ecode_nodes = data.getElementsByTagName("error")[0];
          if ( ecode_nodes != null ) {
            var first_ecode = ecode_nodes.childNodes[0];
            var sub_code_start = first_ecode.nodeValue.indexOf("-");
            result_code = parseInt(first_ecode.nodeValue, 10);
            if ( result_code == 0 && sub_code_start > 0 ) {
              // extract sub error code
              result_code = parseInt(first_ecode.nodeValue.substring(sub_code_start+1), 10);
            }
          }

          // prepare result object
          result_value = new CallResult ( result_code, result_data );

          return result_value;
        }
      },
      error: function (xhr, status, error) {
        result_code = 4100;

        // prepare result object
        result_value = new CallResult ( result_code, result_data );

        return result_value;
      }
    });
  }

  return result_value;
}


/*
   treeAjaxPostCall()

   This is an utility function which sends URL with form data to server and
   wait for URL response. The URL status code and response data are stored
   in CallResult object. CallResult object handle is returned as function return value.

   Parameters:
   url - is a tree resultful API URL
   form_data - is the form data object.
*/

function treeAjaxPostCall ( request_url, form_data, postprocessing ) {
  var result_data = null;
  var result_code = 0;
  var result_value = null;

  var async_flag = false;
  if ( postprocessing != null ) {
    async_flag = true;
  }

  // prepare and make Ajax call
  $.ajax({
    async: async_flag,
    type: "POST",
    enctype: 'multipart/form-data',
    dataType: "xml",
    url: request_url,
    data: form_data,
    processData: false,
    contentType: false,
    cache: false,
    timeout: 600000,
    success: function (data) {
      result_data = data;

      // check Ajax return code
      if ( jQuery.isXMLDoc( data ) ) {
        var ecode_nodes = data.getElementsByTagName("error")[0];
        if ( ecode_nodes != null ) {
          var first_ecode = ecode_nodes.childNodes[0];
          var sub_code_start = first_ecode.nodeValue.indexOf("-");
          result_code = parseInt(first_ecode.nodeValue, 10);
          if ( result_code == 0 && sub_code_start > 0 ) {
            // extract sub error code
            result_code = parseInt(first_ecode.nodeValue.substring(sub_code_start+1), 10);
          }
        }

        // prepare result object
        result_value = new CallResult ( result_code, result_data );

        if ( postprocessing != null ) {
          // perform caller posprocessing
          postprocessing (result_value);
        }

        return result_value;
      }
    },
    error: function (xhr, status, error) {
      result_code = 4100;

      // prepare result object
      result_value = new CallResult ( result_code, result_data );

      return result_value;
    }
  });

  return result_value;
}


/*
  CallResult()

  This is the result object which contains the URL status code and URL response.
  The treeAjaxCall function saves and returns the result in this object.
*/

function CallResult ( result_code, result_value ) {
  this.m_result_code = result_code;
  this.m_xml_result = null;
  this.m_html_result = null;

  if ( result_value != null ) {
    if ( jQuery.isXMLDoc( result_value ) ) {
      this.m_xml_result = result_value;
    }
    else {
      this.m_html_result = result_value;
    }
  }

  // mehtod to check whether result is in XML format
  this.isXMLresult = function () {
    var bool_rc = false;

    if ( this.m_xml_result ) {
      bool_rc = true;
    }
    return bool_rc;
  }

  // mehtod to check whether result is in HTML format
  this.isHTMLresult = function () {
    var bool_rc = false;

    if ( this.m_html_result ) {
      bool_rc = true;
    }
    return bool_rc;
  }
} // end of CallResult class


/*
  tree_clear_treenode

  This utility finction clears child tree node objects of parent tree node.
*/

function tree_clear_treenode ( tree_node )
{
  var num_children = tree_node.m_child_nodes.length;

  if ( num_children > 0 ) {
    var i = 0;
    for ( i = num_children - 1 ; i >= 0 ; i-- ) {
      tree_clear_treenode ( tree_node.m_child_nodes[i] );
      delete tree_node.m_child_nodes[i];
    }
  }

  tree_node.m_child_nodes = [];
  tree_node.m_loaded = false;
}

// This utility function parses value and breaks value into components. Component
// is separated with special character. Component value starts with alphabet character, followed
// by numeric characters. Alphabet characters are left-justified and numeric characters are
// right-justified.

function parseValue ( id_value ) {
  var raw_id_value = "";
  var raw_comp_value = "";
  var comp_value = "";
  var zero_value = "";
  var temp_value = "";
  var component_array = [];
  var i = 0;
  var n = 0;
  var leng = 0;
  var copy_size = 0;
  var charvalue = "";
  var raw_id_size = 0;

  // extract reference ID
  i = id_value.indexOf( m2a_tree.m_separator );
  if ( i > 0 ) {
    raw_id_value = id_value.substring ( 0, i );
    raw_id_size = i;

    // set zero string
    zero_value = zeros_string;

    // Is end of string?
    while ( raw_id_size > 0 ) {
      // find separator and extract component value
      i = raw_id_value.search ( /(\/|\.|:|-)/ );
      if ( i < 0 ) {
        raw_comp_value = raw_id_value;

        // set id value empty
        raw_id_value = "";
        raw_id_size = 0;
      }
      else {
        raw_comp_value = raw_id_value.substring ( 0, i );

        // exclude component value from ID value
        raw_id_value = raw_id_value.substring ( i+1 );
        raw_id_size = raw_id_value.length;
      }

      // count digits on left of component value
      i = raw_comp_value.length;
      leng = i;
      n = 0;
      while ( i > 0 ) {
        charvalue = raw_comp_value.charAt ( i-1 );
        // is value between 0-9?
        if ( charvalue >= "0" && charvalue <= "9" ) {
          n++;
        }
        else {
          break;
        }
        i--;
      }

      // extract ans save alphabet string
      if ( n < leng ) {
        copy_size = leng - n;
        if ( copy_size > MAX_COMP_SIZE ) {
          copy_size = MAX_COMP_SIZE;
        }
        temp_value = raw_comp_value.slice(0, copy_size) + zero_value.slice(0, MAX_COMP_SIZE-copy_size ) ;
        temp_value = temp_value.toUpperCase();
      }
      else {
        temp_value = zero_value;
      }

      // extract numeric string and concatenate alphabet string and numeric sring
      if ( n > 0 ) {
        copy_size = n;
        if ( n > MAX_COMP_SIZE ) {
          copy_size = MAX_COMP_SIZE;
        }
        comp_value = temp_value.slice(0, MAX_COMP_SIZE-copy_size) +
          raw_comp_value.slice(leng-n, leng);
      }
      else {
        comp_value = temp_value;
      }

      // push component value to array
      component_array.push ( comp_value );
    }
  }
  else {
    comp_value = zeros_string;

    // push component value to array
    component_array.push ( comp_value );
  }

  return component_array;
}


// This utility function compares two sort values and return result in
// function return value. The return values are: 0 means value1 equal to
// value2; 1 means value1 greater than value2, and -1 means value1 less
// than value2.

function compareValue ( value1, value2 ) {
  var  compare_result = 0;
  var  sort_refd = false;

  if ( m2a_tree ) {
    sort_refd = m2a_tree.m_sort_id;
  }

  if ( value1 !== value2 ) {
    if ( value1 === PREV_LABEL ) {
      // ensure <previous page> appears on the top
      compare_result = -1;
    }
    else if ( value2 === NEXT_LABEL ) {
      // ensure <next page> appears on the bottom
      compare_result = -1;
    }
    else if ( value1 === NEXT_LABEL ) {
      // ensure <next page> appears on the bottom
      compare_result = 1;
    }
    else if ( value2 === PREV_LABEL ) {
      // ensure <previous page> appears on the top
      compare_result = 1;
    }
  }

  if ( compare_result == 0 ) {
    // compare values
    if ( sort_refd ) {
      // parse first operand
      var a_array = parseValue ( value1 );
      var a_size = a_array.length;

      // parse second operand
      var b_array = parseValue ( value2 );
      var b_size = b_array.length;

      // compare two values
      var num_comp = (a_size > b_size) ? b_size : a_size;
      var i = 0;
      for ( i = 0 ; i < num_comp ; i++ ) {
        if ( a_array[i] > b_array[i] ) {
          compare_result = 1;
          break;
        }
        else if ( a_array[i] < b_array[i] ) {
          compare_result = -1;
          break;
        }
      }
      if ( compare_result == 0 ) {
         if ( a_size > b_size ) {
          compare_result = 1;
        }
        else if ( a_size < b_size ) {
          compare_result = -1;
        }
      }
    }
    else {
      var a_text = value1.toUpperCase();
      var b_text = value2.toUpperCase();
      if ( a_text === b_text ) {
        compare_result = 0;
      }
      else if ( a_text > b_text ) {
        compare_result = 1;
      }
      else {
        compare_result = -1;
      }
    }
  }

  return compare_result;
}


/*
  tree_delete_single_node()

  This function removes a jstree tree node and memory tree node object.
*/

function tree_delete_single_node ( tree_node )
{
  /* find jstree tree node */
  var jstree_node = $(jtree_variable).jstree(true).get_node(tree_node.m_id);
  if ( jstree_node ) {
    var bool = $(jtree_variable).jstree(true).delete_node( jstree_node );
    if ( !bool ) {
      var error = $(jtree_variable).jstree(true).last_error();
      alert ( error.reason );
    }
  }

  // delete tree node object
  delete tree_node;
}


/*
  tree_delete_node()

  This function remvoes tree node from memory and jstree.
*/

function tree_delete_node ( tree_node )
{
  if ( tree_node.m_child_nodes.length > 0 ) {
    var i = 0;

    // delete children
    for ( i = 0 ; i < tree_node.m_child_nodes.length ; i++ ) {
      tree_delete_node ( tree_node.m_child_nodes[i] );
    }
    tree_node.m_child_nodes.length = 0;
  }

  // delete tree node
  tree_delete_single_node ( tree_node );
}


/*
  delete_tree_node_refs()

  this function deletes tree node and its children if any. Tree node
  is removed from the child list of the parent tree node.
*/

function delete_tree_node_refs ( parent_tree_node, tree_node )
{
  // remove tree node from parent tree node
  if ( parent_tree_node && parent_tree_node.m_child_nodes.length > 0 ) {
    var i = 0;
    var found = false;

    for ( i = 0 ; i < parent_tree_node.m_child_nodes.length ; i++ ) {
      if ( parent_tree_node.m_child_nodes[i].m_id == tree_node.m_id ) {
        found = true;
        break;
      }
    }
    if ( found ) {
      for ( ++i ; i < parent_tree_node.m_child_nodes.length ; i++ ) {
        // shuffle after entries up by one
        parent_tree_node.m_child_nodes[i-1] = parent_tree_node.m_child_nodes[i];
      }
      parent_tree_node.m_child_nodes.length--;
    }
  }

  // remove tree nodes and children(if any) from jstree
  tree_delete_node ( tree_node );
}


/*
  tree_get_data()

  This function is called back from the jstree.  It returns the json array of jstree tree
  nodes.
*/

function tree_get_data ( id )
{
  var      jsonArray = [];
  var      index = 0;

  if ( m2a_tree != null ) {
    // extract start entry number if defined
    var i = id.indexOf(PAGE_SEPARATOR);
    if ( i > 0 ) {
      index = parseInt(id.substring(i+1));
    }

    jsonArray = m2a_tree.getData ( id, index );
  }

  return jsonArray;
}

/*
  pagination_handler()

  This function handles the paging of tree branch.  The ID
  of tree node contains the parent record SISN and starting
  index of page.  The ID is in format of <sisn>/<index>.
*/

function pagination_handler ( id ) {
  var i = id.indexOf(PAGE_SEPARATOR);
  var parent_id = "";
  var page_index = 0;
  var parent_tree_node = "";

  // does parent ID contain pag startign index?
  if ( i >= 0 ) {
    // extract parent record SISN
    parent_id = id.substring( 0, i );

    // extract page index
    page_index = parseInt(id.substring( i+1 ));

    // search parent tree node
    parent_tree_node = m2a_tree.m_root_tree_node.searchNodeById(parent_id);
    if ( parent_tree_node == null ) {
      alert ( "Tree node " + parent_id + "is not found." );
    }
    else {
      // clear child tree nodes
      tree_clear_treenode ( parent_tree_node );

      // reload child array of parent tree node
      parent_tree_node.loadChildren( false, page_index );

      // refresh parent tree node
      var jstree_node = $(jtree_variable).jstree(true).get_node(parent_id);
      if ( jstree_node ) {
        // refresh jstree node and chidlren if any
        $(jtree_variable).jstree(true).refresh_node(jstree_node);

        // set tree node in focus
        m2a_tree.setFocus ( parent_id );
      }
    }
  }
}


/*
  edit_tree_node()

  This function either add node to jstree or changes node of jstree.
*/

function edit_tree_node ( parent_id,
                          node_id,
                          node_title,
                          node_level,
                          loweest_level,
                          has_child,
                          add_child_node,
                          insert_before,
                          target_position )
{
  var final_rc = 0;
  var parent_node = null;
  var updated_node = null;
  var title_updated = false;
  var level_updated = false;
  var result;
  var icon_level = 0;

  if ( m2a_tree == null ) {
    final_rc = 1500;
  }
  else {
    // search parent node
    if ( parent_id === ROOT_ID ) {
      parent_id = TOP_ID;
    }
    parent_node = m2a_tree.m_root_tree_node.searchNodeById(parent_id);
    if ( parent_node == null ) {
      final_rc = 1501;
    }
    else {
      icon_level = parseInt( node_level, 10 );
      if ( icon_level < 0 || icon_level > 9 ) {
        icon_level = 0;
      }

      if ( !add_child_node ) {
        updated_node = m2a_tree.m_root_tree_node.searchNodeById(node_id);
        if ( updated_node ) {
          if ( node_title !== updated_node.m_title ) {
            title_updated = true;
          }
          if ( icon_level !== updated_node.m_level ) {
            level_updated = true;
          }
        }
      }

      if ( add_child_node ) {
        // initialize json entry for tree node
        var jsonEntry = {};
        jsonEntry.text = node_title;
        jsonEntry.id = node_id;
        jsonEntry.children = has_child;
        jsonEntry.icon = icons_list[icon_level];

        // insert child tree node to parent node
        if ( insert_before ) {
          result = $(jtree_variable).jstree(true).create_node(parent_id, jsonEntry, target_position, false, false );
        }
        else {
          result = $(jtree_variable).jstree(true).create_node(parent_id, jsonEntry, "last", false, false );
        }
        if ( !result ) {
          var error = $(jtree_variable).jstree(true).last_error();
          alert ( error.reason );
        }

        // add child tree node to parent tree_node
        parent_node.addChild ( node_id, node_title, node_level, node_level, has_child, loweest_level );

        // Is parent node opened?
        var jstree_node = $(jtree_variable).jstree(true).get_node(parent_node.m_id);
        if ( jstree_node ) {
          result = $(jtree_variable).jstree(true).is_open(jstree_node);
          if ( !result ) {
            // no, open parent node
            $(jtree_variable).jstree(true).open_node(jstree_node);
          }
        }

        // select new jstree tree node in focus
        m2a_tree.setFocus ( node_id );
      }
      else {
        if ( updated_node ) {
          var jstree_node = $(jtree_variable).jstree(true).get_node(updated_node.m_id);
          if ( jstree_node ) {
            if ( title_updated ) {
              result = $(jtree_variable).jstree(true).rename_node( jstree_node, node_title );
              if ( !result ) {
                var error = $(jtree_variable).jstree(true).last_error();
                alert ( error.reason );
              }
              // $(jtree_variable).jstree(true).redraw_node( jstree_node, false, false, false );

              // update tree node object
              updated_node.m_title = node_title;
            }

            if ( level_updated ) {
              $(jtree_variable).jstree(true).set_icon(jstree_node, icons_list[icon_level]);

              // update tree node object
              updated_node.m_level = icon_level;
              updated_node.m_icons_id = icon_level;
            }

            // set jstree tree node in focus
            m2a_tree.setFocus ( updated_node.m_id );
          }
        }
      }
    }
  }

  return final_rc;
}

/*
  searchTree()

  This function searches jstree tree node title for the
  value that is entered in the input tag whose is passed in
  the input_id parameter.
*/

function searchTree( input_id )
{
  if ( m2a_tree ) {
    if ( input_id != null && input_id != "" ) {
      // get search value
      var v = $("#" + input_id).val();
      if ( v != null && v != "" ) {
        // search jstree tree nodes
        // $(jtree_variable).jstree(true).clear_search();
        $(jtree_variable).jstree(true).search(v);

        // clear search value
        // $("#" + input_id).attr("value", "");
      }
      else {
        alert ( "Search value is not specified." );
      }
    }
  }
}

// get position of target node within the parent node. If target node is not found, -1 is returned.
function getPosition ( target_parent_id, seek_id ) {
  var position = -1;
  var parent_node =  m2a_tree.m_root_tree_node.searchNodeById(target_parent_id);
  if ( parent_node != null ) {
    position = parent_node.getChildPosition(seek_id);
  }

  return position;
}

/*
  This function displays error message of ajax call.
*/

function showAjaxError ( error_code, action_text ) {
  var error_message = "";

  switch ( error_code ) {
    case 533:
      error_message = "Missing parameter.";
      break;
    case 1012:
      error_message = "Invalid or unknown session ID.";
      break;
    default:
      error_message = "Error " + error_code + " is encountered while " + action_text + ".";
      break;
  }

  alert ( error_message );
}


/* -----------------------------------------------------------
   TreeNode class
-------------------------------------------------------------- */

/*
  The TreeNode class manges a node of tree hierarchy.  It consists of tree node attribute
  and assoicated methods for manipulating tree node.

  The attrobites are:
    m_parent_node - is parent tree node object handle
    m_id    - is tree node ID which is used to retrieve child tree nodes of this tree node.
              the valid values are: $ROOT, $TOP and record SISN.
    m_title - is tree title string object.  ttitle consists of refernece ID and title.
    m_level - is desriptive level. Valid value is between 0 and 9.
    m_icons_id - is icons id of tree node. Valid values is between 0 and 9.
    m_has_child - specifes tree node has clidlren.
    m_child_nodes - is array of child tree node objects
    m_bottom_level - indciates that tree node is lowest level record
    m_node_type - is type of tree node. Valid values are: NODE_TYPE, NEXT_TYPE and PREV_TYPE.
                  NEXT_TYPE and PREV_TYPE creates a hypertext links to read previous page and
                  next page of children tree nodes.
*/

function TreeNode ( parent, id, title, level, icons_id, has_child, bottm_level, node_type ) {
  this.m_parent_node = parent;
  this.m_id = id;
  this.m_title = title;
  this.m_level = parseInt(level, 10);
  this.m_icons_id = parseInt(icons_id, 10);
  this.m_has_child = has_child;
  this.m_bottom_level = bottm_level;
  this.m_loaded = false;
  this.m_node_type = node_type;
  this.m_child_nodes = [];

  // if level is invalid, default level to 0
  if ( this.m_level < 0 || this.m_level > 9 ) {
    this.m_level = 0;
  }

  // if icons ID is invalid, default icons ID to 0
  if ( this.m_icons_id < 0 || this.m_icons_id > 9 ) {
    this.m_icons_id = 0;
  }

  if ( id === ROOT_ID ) {
    // if root ttee node, setup top-level nodes as children of root node
    let top_node = new TreeNode ( this, TOP_ID, title, "0", "0", true, false, NODE_TYPE );
    if ( top_node != null ) {
      this.m_child_nodes.push ( top_node );
      this.m_loaded = true;
    }
  }

  // refresh tree node
  this.refreshTreeNode = function ( ) {
    tree_clear_treenode ( this );
  }

  // read XML entries and load them in child_nodes array
  this.loadChildren = function(reload, index) {
    var home_sessid = treeGetCookie ( "HOME_SESSID" );
    var child_tree_node = null;
    var num_children = 0;
    var from_entry = 0;
    var to_entry = 0;
    var total_entries = 0;
    var i = 0;
    var extra_option = "";
    var tree_label = "";
    var tree_page_id = "";

    if ( home_sessid != "" ) {
      if ( this.m_loaded && reload ) {
        // clear old child tree nodes
        this.refreshTreeNode ();
      }

      if ( !this.m_loaded ) {
        var start_entry = 1;
        var end_entry = ITEM_PER_PAGE;

        start_entry = index;
        if ( start_entry < 1 ) {
          start_entry = 1;
        }
        end_entry = start_entry + ITEM_PER_PAGE - 1;
        extra_option = "&start=" + start_entry + "&end=" + end_entry;

        // if children not yet loaded, retrieve child information from server
        var url = home_sessid + "?GETTREEDATA" + "&select=" + this.m_id + extra_option + "&xmlresponse";
        var ajax_result = treeAjaxCall ( url, "xml" );

        // check status code
        if ( ajax_result.m_result_code != 0 ) {
          alert ( "Error " + ajax_result.m_result_code + " is encountered while retrieving tree information." );
        }
        else {
          if ( jQuery.isXMLDoc( ajax_result.m_xml_result ) ) {
            // determine number of children
            num_children = countXmlTag( ajax_result.m_xml_result, "lower_level" );
            from_entry = parseInt(getXMLTagValue(ajax_result.m_xml_result, "from"));
            to_entry = parseInt(getXMLTagValue(ajax_result.m_xml_result, "to"));
            total_entries = parseInt(getXMLTagValue(ajax_result.m_xml_result, "count"));

            if ( num_children > 0 ) {
              // extract child information
              var lower_title = ajax_result.m_xml_result.getElementsByTagName("lower_title");
              var lower_level = ajax_result.m_xml_result.getElementsByTagName("lower_desc_level");
              var lower_has_child = ajax_result.m_xml_result.getElementsByTagName("lower_has_children");
              var lower_child_sisn = ajax_result.m_xml_result.getElementsByTagName("lower_child_sisn");
              var lower_bottom_level = ajax_result.m_xml_result.getElementsByTagName("lowest_level");

              var has_child_flag = false;
              var bottom_level = false;

              if ( total_entries > ITEM_PER_PAGE && from_entry > ITEM_PER_PAGE ) {
                // add <Previous Page> tree node
                tree_label = PREV_LABEL;
                tree_page_id = this.m_id + PAGE_SEPARATOR + (from_entry-ITEM_PER_PAGE);
                child_tree_node = new TreeNode (
                   this,
                   tree_page_id,
                   tree_label,
                   this.m_level.toString(),
                   this.m_icons_id.toString(),
                   false,
                   this.m_bottom_level,
                   PREV_TYPE
                   );

                // save <previous page> tree node in child tree node array
                this.m_child_nodes.push(child_tree_node);
                child_tree_node = null;
              }

              // map XML child entries to child tree nodes objects
              for ( i = 0 ; i < num_children ; i++ ) {
                if ( lower_has_child[i].textContent == "Y" ) {
                  has_child_flag = true;
                }
                else {
                  has_child_flag = false;
                }
                if ( lower_bottom_level[i].textContent == "Y" ) {
                  bottom_level = true;
                }
                else {
                  bottom_level = false;
                }

                child_tree_node = new TreeNode (
                   this,
                   lower_child_sisn[i].textContent,
                   lower_title[i].textContent,
                   lower_level[i].textContent,
                   lower_level[i].textContent,
                   has_child_flag,
                   bottom_level,
                   NODE_TYPE
                   );

                // save child tree node in child tree node array
                this.m_child_nodes.push(child_tree_node);
                child_tree_node = null;
              }

              if ( total_entries > ITEM_PER_PAGE && to_entry < total_entries ) {
                // add <Next Page> tree node
                tree_label = NEXT_LABEL;
                tree_page_id = this.m_id + PAGE_SEPARATOR + (from_entry + ITEM_PER_PAGE);
                child_tree_node = new TreeNode (
                   this,
                   tree_page_id,
                   tree_label,
                   this.m_level.toString(),
                   this.m_icons_id.toString(),
                   false,
                   this.m_bottom_level,
                   NEXT_TYPE
                );

                // save <next page> tree node in child tree node array
                this.m_child_nodes.push(child_tree_node);
                child_tree_node = null;
              }
            }
          }
          this.m_loaded = true;
        }
      }
    }
  } // end of loadChildren method

  // convert child_node array to Json array
  this.JsonData = function ( index ) {
    var  jsonArray = [];
    var  jsonEntry = {};
    var  i = 0;

    if ( !this.m_loaded ) {
      this.loadChildren ( false, index );
    }

    if ( this.m_loaded && this.getChildCount() > 0 ) {
      if ( this.m_id === ROOT_ID ) {
        // set root tree node opened so top-level tree nodes are visible
        jsonEntry = {};
        jsonEntry.text = this.m_child_nodes[0].m_title;
        jsonEntry.id = this.m_child_nodes[0].m_id;
        jsonEntry.children = true;
        jsonEntry.icon = icons_list[this.m_child_nodes[0].m_icons_id];

        // save json entry in array
        jsonArray.push(jsonEntry);
      }
      else {
        for ( i = 0 ; i < this.m_child_nodes.length ; i++ ) {
          jsonEntry = {};
          jsonEntry.text = this.m_child_nodes[i].m_title;
          jsonEntry.id = this.m_child_nodes[i].m_id;
          jsonEntry.children = this.m_child_nodes[i].m_has_child;

          if ( this.m_child_nodes[i].m_node_type == PREV_TYPE
          ||   this.m_child_nodes[i].m_node_type == NEXT_TYPE ) {
            // add a_attr to json entry = { "href" : "#", "onclick" : "...." }
            // jsonEntry.li_attr = {class: "next_pagination_button"}
            jsonEntry.li_attr = {class: "li_testing"};

            jsonEntry.a_attr = {class: "testing"};
            jsonEntry.a_attr.href = "#";
            jsonEntry.a_attr.onclick = "pagination_handler('" + this.m_child_nodes[i].m_id + "');"

            jsonEntry.icon = REFRESH_ICONS;
          }
          else {
            jsonEntry.icon = icons_list[this.m_child_nodes[i].m_icons_id];
          }

          // save json entry in array
          jsonArray.push(jsonEntry);
        }
      }
    }

    return jsonArray;
  }  // end of JsonData method

  // get length of child_nodes array
  this.getChildCount = function ( ) {
    var  count = this.m_child_nodes.length;

    return count;
  }  // end of getChildCount method

  // search Tree node in parent node and subordinate nodes
  this.searchNodeById = function ( seek_id ) {
    var seek_node = null;
    var test_id = "";
    var i = 0;

    // Is it root node ID?
    if ( seek_id === "#" ) {
      if ( this.m_id === ROOT_ID ) {
        seek_node = this;
      }
      else {
        var parent_node = this.m_parent_node;
        var last_node = parent_node;

        // go up until reach root node
        while ( parent_node != null ) {
          last_node = parent_node;
          parent_node = parent_node.m_parent_node;
        }
        seek_node = last_node;
      }
    }
    else {
      // ignore starting index number from parent record SISN
      i = seek_id.indexOf(PAGE_SEPARATOR);
      if ( i > 0 ) {
        test_id = seek_id.substring(0, i);
      }
      else {
        test_id = seek_id;
      }

      if ( this.m_id === test_id ) {
        seek_node = this;
      }
      else {
        if ( this.m_loaded ) {
          for ( i = 0 ; i < this.m_child_nodes.length ; i++ ) {
            if ( this.m_child_nodes[i].m_node_type == NODE_TYPE ) {
              seek_node = this.m_child_nodes[i].searchNodeById ( test_id );
              if ( seek_node != null ) {
                // if node is found, exit loop
                break;
              }
            }
          }
        }
      }
    }

    return seek_node;
  }  // end of searchNodeById method

  // add treeNode object to child_nodes array
  this.addChild = function ( id, title, level, icons_id, has_child, bottom_level ) {
    var child_tree_node = new TreeNode (
       this,
       id,
       title,
       level,
       icons_id,
       has_child,
       bottom_level,
       NODE_TYPE );

    // push child tree node to child array
    this.m_child_nodes[this.m_child_nodes.length] = child_tree_node;
    this.m_has_child = true;
    this.m_loaded = true;
  }  // end of addChild method

  // remove treeNode object from child_nodes array
  this.deleteChild = function ( id ) {
    var i = 0;
    var found = false;

    if ( this.m_loaded ) {
      for ( i = 0 ; i < this.m_child_nodes.length ; i++ ) {
        if ( this.m_child_nodes[i].m_id === id ) {
          found = true;
          break;
        }
      }

      if ( found ) {
        delete this.m_child_nodes[i];
        for ( ++i ; i < this.m_child_nodes.length ; i++ ) {
          // shuffle entries after deleted nodes up by one
          this.m_child_nodes[i] = this.m_child_nodes[i-1];
        }

        // reduce array length by one
        if ( this.m_child_nodes.length > 0 ) {
          this.m_child_nodes.length--;
        }
        if ( this.m_child_nodes.length == 0 ) {
          this.m_has_child = false;
          this.m_loaded = false;
        }
      }
    }  // end of deleteChild method

    return found;
  }

  // get position of child node.  Position is relatvie to zero.
  this.getChildPosition = function ( seek_id ) {
    var position = -1;
    var parent_node = this;
    var ix;
    for ( ix = 0 ; ix < parent_node.m_child_nodes.length ; ix++ ) {
      if ( parent_node.m_child_nodes[ix].m_node_type == NODE_TYPE
      &&   parent_node.m_child_nodes[ix].m_id == seek_id ) {
        // If entry is found, exit loop
        position = ix;
        break;
      }
    }
    return position;
  }

} // end of TreeNode class


/* -----------------------------------------------------------
   TreeControl class
-------------------------------------------------------------- */

/*
  The TreeControl class presents description database in tree hierarchy and provides user
  with interface for manipulating description database.  It consists of tree control
  attribute and assoicated methods for interfacing with tree hierarchy.

  The attrobites are:
    m_root_tree_node - is root tree node of tree control object
    m_initialized - indciates the treee initialization is done.
    m_tree_location_id - is id of div tag where tree hierarchy is shown.
    m_tree_parameter_file - is tree user routine parameter file path.
    m_home_sessid - is home sesson ID.
    m_delete_bottom - indicates that deletion is at bottom item only
    m_reseq_id - indicates that resequencing child tree node ID is automatic after child tree node is removed.
    m_sort_id - indicates that sorting ID optionis allowed
    m_front_id - indicates that REFD appears at beginning od tree ttitle
    m_icons_base - specifis base of tree icons. 170 is LMA tree icons.
    m_root_front_id indicates that REFD appears at the beginning of tree title of top-level tree node
    m_sorted - indicates that tree nodes are already sorted by tree user routine.
    m_paste_before - indiicates that paste-before option is enabled.
    m_renumber - indicates that renumbering option is allowed
    m_separator - specifies the separator between REFD and title in tree title.
    m_auto_id - specifies the root ID is auto-generated or not.
    m_cut_tree_node - spcifies the cut tre node object handle
    m_select_node_id - specifies the ID of selected tree node
    m_refresh_root - indicates to clear search result before searching tree
    m_num_hits - number of records are found in recent search method
    m_retrieve_top_node - indicates that the node being retrieved is top node.
*/

function TreeControl ( parm_file, location_id ) {
  this.m_current_jstree_node = null;
  this.m_root_tree_node = null;
  this.m_initialized = false;
  this.m_tree_location_id = location_id;
  this.m_tree_parameter_file = parm_file;
  this.m_home_sessid = treeGetCookie ( "HOME_SESSID" );
  this.m_delete_bottom = "N";
  this.m_reseq_id = "Y";
  this.m_sort_id = "Y";
  this.m_front_id = "Y";
  this.m_icons_base = 0;
  this.m_root_front_id = "Y";
  this.m_sorted = "N";
  this.m_paste_before = "Y";
  this.m_renumber = "Y";
  this.m_separator = " - ";
  this.m_auto_id = false;
  this.m_cut_tree_node = null;
  this.m_select_node_id = "";
  this.m_refresh_root = false;
  this.m_num_hits = 0;
  this.m_colorbox = true;
  if ( typeof dialog_in_colorbox != 'undefined' ) {
    this.m_colorbox = dialog_in_colorbox;
  }
  this.m_retrieve_top_node = false;

  jtree_variable = "#" + this.m_tree_location_id;

  // initialize tree user routine
  var url = this.m_home_sessid + "?STARTTREE" + "&parm_file=" + this.m_tree_parameter_file + "&xmlresponse";
  var ajax_result = treeAjaxCall ( url, "xml" );

  // check status code
  if ( ajax_result.m_result_code != 0 ) {
    alert ( "Error " + ajax_result.m_result_code + " is encountered while initializing tree user routine." );
  }
  else {
    this.m_initialized = true;

    // costruct root tree node
    this.m_root_tree_node = new TreeNode (
      null,
      ROOT_ID,
      "Description",
      "0",
      "0",
      true,
      false,
      NODE_TYPE
    );

    // extract attrivutes of tree user routine
    url = this.m_home_sessid + "?GETTREEATTRIBUTE" + "&xmlresponse";
    ajax_result = treeAjaxCall ( url, "xml" );
    if ( ajax_result.m_result_code != 0 ) {
      alert ( "Error " + ajax_result.m_result_code + " is encountered while retrieving tree user routine attributes." );
    }
    else {
      // save tree user routine attributes
      try {
        // save tree user routine attributes
        this.m_delete_bottom = ajax_result.m_xml_result.getElementsByTagName("delete_bottom_only")[0].textContent;
        this.m_reseq_id = ajax_result.m_xml_result.getElementsByTagName("reseq_id")[0].textContent;
        this.m_sort_id = ajax_result.m_xml_result.getElementsByTagName("sort_id")[0].textContent;
        this.m_front_id = ajax_result.m_xml_result.getElementsByTagName("front_id")[0].textContent;
        this.m_icons_base = parseInt(ajax_result.m_xml_result.getElementsByTagName("icons_base")[0].textContent, 10);
        this.m_root_front_id = ajax_result.m_xml_result.getElementsByTagName("root_front_id")[0].textContent;
        this.m_sorted = ajax_result.m_xml_result.getElementsByTagName("sorted")[0].textContent;
        this.m_paste_before = ajax_result.m_xml_result.getElementsByTagName("paste_before")[0].textContent;
        this.m_renumber = ajax_result.m_xml_result.getElementsByTagName("renumbering")[0].textContent;
        this.m_separator = ajax_result.m_xml_result.getElementsByTagName("separator")[0].textContent;
        this.m_auto_id = (ajax_result.m_xml_result.getElementsByTagName("auto_id")[0].textContent == "Y") ? true : false;
      }
      catch ( error ) {
        alert ( "Unable to parse tree attrbute because " + error.message );
      }

      if ( this.m_icons_base == LMA_ICONS ) {
        //icons_list = lma_desc_icon;
        icons_list = minisis_online_default_icon;
      }
      else {
        icons_list = default_desc_icon;
      }
    }
  }

  // destruct tree control
  this.close = function ( ) {
    var success = false;

    if ( this.m_initialized ) {
      var url = this.m_home_sessid + "?STOPTREE" + "&xmlresponse";
      var ajax_result = treeAjaxCall ( url, "xml" );

      // check status code
      if ( ajax_result.m_result_code != 0 ) {
        alert ( "Error " + ajax_result.m_result_code + " is encountered while wrapping up tree user routine." );
      }
      else {
        success = true;
        this.m_initialized = false;
      }
    }

    return success;
  }  // end of close method


  // utility method to set tree node in focus
  this.setFocus = function ( current_node_id ) {
    // un-select tree nodes in focus
    if ( this.m_current_jstree_node != null ) {
      this.m_current_jstree_node = null;
    }
    $(jtree_variable).jstree(true).deselect_all();

    // search current jstree node
    if ( current_node_id != null && current_node_id != "" ) {
      var seek_jstree_node = $(jtree_variable).jstree(true).get_node(current_node_id);

      // set current jstree node
      if ( seek_jstree_node ) {
        $(jtree_variable).jstree(true).select_node(seek_jstree_node);
        this.m_current_jstree_node = seek_jstree_node;
      }

      // make selected node visible in jstree view
      var jtree_node = $(jtree_variable).jstree(true).get_node(current_node_id, true);
      if ( jtree_node != null ) {
        if ( jtree_node.children('.jstree-anchor') != null ) {
          jtree_node.children('.jstree-anchor').focus();
        }
      }
    }
  }

  // edit record or view record in modal dialog
  this.dataEntryModaldialog = function ( url, dialog_width, dialog_height, closeFunc ) {
    if ( dialog_width == 0 ) {
      // calculate modal window width
      dialog_width = window.innerWidth - 8; // leave spaces in left and right margin
    }

    if ( dialog_height == 0 ) {
      // calculate modal window height
      dialog_height = window.innerHeight - 13;  // leave spaces in top and bottom margin
    }

    if ( this.m_colorbox ) {
      $popup = "Y";
    }

    $.colorbox({
      iframe: true,
      href: url,
      transition: "elastic",
      width: dialog_width,
      height: dialog_height,
      onClosed: function() {
        if ( closeFunc != null ) {
          closrFunc ( url );
        }
        // parent.$.colorbox.close();

        if ( this.m_colorbox ) {
          delete parent.$popup;
        }
      }
    });
  }


  // handler for adding description record
  this.addRecord = function (obj) {
    this.m_cut_tree_node = null;

    // search TreeNode by ID
    var tree_node = this.m_root_tree_node.searchNodeById ( obj.id );

    // determine parent ID
    if ( tree_node != null ) {
      // if tree node is lowest-level record, add record to parent tree node
      if ( tree_node.m_bottom_level && tree_node.m_parent_node != null ) {
        tree_node = tree_node.m_parnt_node;
      }
    }

    // get node ID
    var node_id = tree_node.m_id;
    if ( node_id == TOP_ID ) {
      node_id = ROOT_ID;
    }

    // prepare ADDTREE command
    var url = this.m_home_sessid + "?ADDTREE" + "&parent=" + node_id + "&RECORD_DEFAULT=Y&xmlresponse";

    if ( this.m_colorbox ) {
      // show record in colorbox
      this.dataEntryModaldialog ( url, 0, 0, null );
    }
    else {
      // open browser tab to show data entry worksheet
      var win = window.open ( url, "_blank" );
    }
  }

  // handler for changing decription record
  this.changeRecord = function (obj) {
    this.m_cut_tree_node = null;

    // get node ID
    var node_id = obj.id;

    // search tree node object and parent tree node object
    if ( node_id !== TOP_ID && node_id !== ROOT_ID ) {
      // search TreeNode by ID
      var url = "";
      var go_ahead = true;
      var tree_node = this.m_root_tree_node.searchNodeById ( node_id );
      var parent_tree_node = null;
      if ( tree_node ) {
        parent_tree_node = tree_node.m_parent_node;

        var parent_id = parent_tree_node.m_id;
        if ( parent_id == TOP_ID ) {
          parent_id = ROOT_ID;
        }

        // set tree node in focus
        this.setFocus ( node_id );

        // check to see whether record is in use
        url = this.m_home_sessid + "?RECORDSTATUS" +
          "&FIELD=SISN" +
          "&VALUE=" + tree_node.m_id +
          "&xmlresponse";
        var ajax_result = treeAjaxCall ( url, "xml" );
        if ( ajax_result.m_result_code != 0 ) {
          if ( ajax_result.m_result_code == 599 ) {
            alert ( "Record is in use." );
            go_ahead = false;
          }
        }
        if ( go_ahead ) {
          // prepare CHANGETREE command
          url = this.m_home_sessid + "?CHANGETREE" +
            "&parent=" + parent_id +
            "&record=" + tree_node.m_id +
            "&title=" + encodeURIComponent(tree_node.m_title) +
            "&xmlresponse";

          if ( this.m_colorbox ) {
            // show record in colorbox
            this.dataEntryModaldialog ( url, 0, 0, null );
          }
          else {
            // open browser tab to show data entry worksheet
            var win = window.open ( url, "_blank" );
          }
        }
      }
    }
  }


  // handler for viewing decription record
  this.viewRecord = function (obj) {
    this.m_cut_tree_node = null;

    // get node ID
    var node_id = obj.id;

    // search tree node object
    if ( node_id !== TOP_ID && node_id !== ROOT_ID ) {
      // search TreeNode by ID
      var tree_node = this.m_root_tree_node.searchNodeById ( node_id );

      if ( tree_node ) {
        // prepare VIEWTREE command
        var url = this.m_home_sessid + "?VIEWTREE" +
          "&record=" + tree_node.m_id +
          "&xmlresponse";

        if ( this.m_colorbox ) {
          // show record in colorbox
          this.dataEntryModaldialog ( url, 0, 0, null );
        }
        else {
          // open browser tab to show record
          var win = window.open ( url, "_blank" );
        }
      }

      // set jstree tree node in focus
      this.setFocus ( node_id );
    }
  }

  // handler for deleting decription record
  this.deleteRecord = function (obj) {
    // prompt to confirm deletion
    var confirm_delete = confirm ( "Do you really want to delete the record?" );

    if ( confirm_delete ) {
      // get node ID
      var node_id = obj.id;

      if ( node_id !== TOP_ID && node_id !== ROOT_ID ) {
        // search treenode object and parent treenode object
        var tree_node = this.m_root_tree_node.searchNodeById ( node_id );
        var parent_tree_node = null;
        if ( tree_node ) {
          parent_tree_node = tree_node.m_parent_node;

          var parent_id = parent_tree_node.m_id;
          if ( parent_id == TOP_ID ) {
            parent_id = ROOT_ID;
          }

          var has_child = "N";
          if ( tree_node.m_child_nodes.length > 0 ) {
            has_child = "Y";
          }

          // prepare DELETETREE command
          var url = this.m_home_sessid + "?DELETETREE" +
            "&parent=" + parent_id +
            "&record=" + tree_node.m_id +
            "&title=" + encodeURIComponent(tree_node.m_title) +
            "&has_child=" + has_child +
            "&xmlresponse";

          // send Ajax call and wait for repose
          var ajax_result = treeAjaxCall ( url, "xml" );

          // check status code
          if ( ajax_result.m_result_code != 0
          &&   ajax_result.m_result_code != 4300
          &&   ajax_result.m_result_code != 4301 ) {
            alert ( "Error " + ajax_result.m_result_code + " is encountered while deleting tree node." );
          }
          else {
            if ( ajax_result.m_result_code == 4301 ) {   // refresh tree branch
              var jstree_node = $(jtree_variable).jstree(true).get_node(parent_tree_node.m_id);
              if ( jstree_node ) {
                // refresh tree node object
                parent_tree_node.refreshTreeNode ();

                // refresh jstree node and chidlren if any
                $(jtree_variable).jstree(true).refresh_node(jstree_node);
              }
            }
            else {
              // remove tree node references
              delete_tree_node_refs ( parent_tree_node, tree_node );
            }

            // reset focused jstree tree node
            this.setFocus ( "" );
          }
        }
      }
    }
  }

  // handler for refreshing decription record
  this.refreshRecord = function (obj) {
    this.m_cut_tree_node = null;

    if ( m2a_tree != null ) {
      // get node ID
      var node_id = TOP_ID;
      if ( obj != null ) {
        node_id = obj.id;
      }
      else {
        this.m_refresh_root = false;
      }

      // search tree node object by ID
      if ( node_id !== ROOT_ID ) {
        if ( node_id.indexOf(PAGE_SEPARATOR) < 0 ) {
          // not previous page link or next page link
          var tree_node = this.m_root_tree_node.searchNodeById ( node_id );
          if ( tree_node ) {
            if ( tree_node.m_node_type == NODE_TYPE ) {
              // find jstree tree node
              var jstree_node = $(jtree_variable).jstree(true).get_node(node_id);
              if ( jstree_node ) {
                // refresh tree node object
                tree_node.refreshTreeNode ();

                // refresh jstree node and chidlren if any
                $(jtree_variable).jstree(true).refresh_node(jstree_node);

                // set focused jstree tree node
                this.setFocus ( node_id );
              }
            }
          }
        }
      }
    }
  }

  // handler for searching decription record
  this.searchRecord = function (obj) {
    if ( obj != null ) {
      this.m_cut_tree_node = null;
    }

    this.m_num_hits = 0;

    // search tree nodes
    searchTree ( SEARCH_INPUT );
    this.m_refresh_root = true;

    if ( obj != null ) {
      // clear tree node in focus
      this.setFocus ( "" );
    }

    if ( this.m_num_hits == 0 ) {
      alert ( "No description title matches the keyword(s)." );
    }
  }

  // handler for duplicating decription record
  this.duplicateRecord = function (obj) {
    this.m_cut_tree_node = null;

    if ( m2a_tree != null ) {
      var tree_node = null;
      var parent_tree_node = null;
      var num_copies = 0;
      var i = 0;
      var rc = 0;

      // get node ID
      var node_id = obj.id;

      // search tree node object by ID
      if ( node_id !== ROOT_ID && node_id !== TOP_ID ) {
        tree_node = this.m_root_tree_node.searchNodeById ( node_id );
        if ( tree_node ) {
          // get parent tree node
          parent_tree_node = tree_node.m_parent_node;

          var parent_id = parent_tree_node.m_id;
          if ( parent_id === TOP_ID ) {
            parent_id = ROOT_ID;
          }

          var lowest = "N";
          if ( tree_node.m_bottom_level == true ) {
            lowest = "Y";
          }

          // get number of copies
          num_copies = 1;
          var user_input = prompt ( "Please enter number of copies", "1" );
          if ( user_input != null ) {
            num_copies = parseInt(user_input, 10);
            if ( num_copies <= 0 ) {
              num_copies = 1;
            }
          }

          // call DUPLICATETREE for each copy
          for ( i = 1 ; i <= num_copies ; i++ ) {
            // prepare DUPLICATETREE command
            var url = this.m_home_sessid + "?DUPLICATETREE" +
              "&parent=" + parent_id +
              "&record=" + tree_node.m_id +
              "&lowest=" + lowest +
              "&xmlresponse";

            // submit DUPLICATETREE command
            var ajax_result = treeAjaxCall ( url, "xml" );

            // check status code
            if ( ajax_result.m_result_code != 0 ) {
              alert ( "Error " + ajax_result.m_result_code + " is encountered while duplicating tree node." );
            }
            else {
              // add child tree node to target parent tree node and add node to jstree
              var lowest_level = true;
              if ( getXMLTagValue(ajax_result.m_xml_result, "desc_folder") === "Y" ) {
                lowest_level = false;
              }

              // extract desc_level tag
              var desc_level = getXMLTagValue(ajax_result.m_xml_result, "desc_level");

              // extract desc_title tag
              var desc_title = getXMLTagValue(ajax_result.m_xml_result, "desc_title");

              // extract desc_parent tag
              var desc_parent = getXMLTagValue(ajax_result.m_xml_result, "desc_parent");

              // extract desc_sisn tag
              var desc_sisn = getXMLTagValue(ajax_result.m_xml_result, "desc_sisn");

              // add tree node to jstree
              rc = edit_tree_node ( desc_parent, desc_sisn, desc_title, desc_level, lowest_level, false, true, false, 0 );
              if ( rc != 0 ) {
                alert ( "Unable to add node to tree hierarchy because of error " + rc );
              }
            }
          }
        }
      }
    }
  }

  // handler for sorting decription record
  this.sortRecord = function (obj) {
    this.m_cut_tree_node = null;

    if ( m2a_tree != null ) {
      // get node ID
      var node_id = obj.id;

      // search tree node object by ID
      if ( node_id !== ROOT_ID && node_id !== TOP_ID ) {
        var tree_node = this.m_root_tree_node.searchNodeById ( node_id );
        if ( tree_node ) {
          var url = this.m_home_sessid + "?SORTTREE" +
                    "&parent=" + node_id +
                    "&xmlresponse";

          // submit MOVETREE command
          var ajax_result = treeAjaxCall ( url, "xml" );

          // check status code
          if ( ajax_result.m_result_code != 0 ) {
            alert ( "Error " + ajax_result.m_result_code + " is encountered while sorting tree node." );
          }
          else {
            // find jstree tree node
            var jstree_node = $(jtree_variable).jstree(true).get_node(obj.id);
            if ( jstree_node ) {
              // refresh tree node object
              tree_node.refreshTreeNode ();

              // refresh jstree node and chidlren if any
              $(jtree_variable).jstree(true).refresh_node(jstree_node);

              // set tree node in focus
              this.setFocus ( obj.id );
            }
          }
        }
      }
    }
  }

  // handler for cutting decription record
  this.cutRecord = function (obj) {
    if ( m2a_tree != null ) {
      // get node ID
      var node_id = obj.id;

      // search tree node object by ID
      if ( node_id !== ROOT_ID && node_id !== TOP_ID ) {
        var tree_node = this.m_root_tree_node.searchNodeById ( node_id );
        if ( tree_node ) {
          this.m_cut_tree_node = tree_node;

          // set tree node in focus
          this.setFocus ( node_id );
        }
      }
    }
  }

  // handler for pasting decription record
  this.pasteRecord = function (obj, paste_before) {
    var source_tree_node = null;
    var target_tree_node = null;
    var source_parent_tree_node = null;
    var target_parent_tree_node = null;
    var target_parent_node_id = "";
    var source_parent_node_id = "";
    var source_has_child = "N";
    var url = "";
    var command_name = "";
    var extra_option1 = "";
    var extra_option2 = "";
    var new_id = "";
    var target_position = 0;

    target_tree_node = this.m_root_tree_node.searchNodeById ( obj.id );
    if ( target_tree_node != null ) {
      if ( !paste_before ) {
        target_parent_tree_node = target_tree_node;
      }
      else {
        target_parent_tree_node = target_tree_node.m_parent_node;
      }
      target_parent_node_id = target_parent_tree_node.m_id;
      if ( target_parent_node_id === TOP_ID ) {
        target_parent_node_id = ROOT_ID;
      }

      if ( this.m_auto_id && target_parent_node_id == ROOT_ID ) {
        // prompt and extract new node ID
        var v = $("#"+SEARCH_INPUT).val();
        if ( v == null || v == "" ) {
          alert ( "Tree node ID is not yet specified." );
        }
        else {
          new_id = v;
          $("#"+SEARCH_INPUT).val('').change();
        }
      }
    }

    if ( !this.m_auto_id || target_parent_node_id != ROOT_ID || new_id != "" ) {
      if ( this.m_cut_tree_node != null  ) {
        source_tree_node = this.m_cut_tree_node;
        this.m_cut_tree_node = null;
        source_parent_tree_node = source_tree_node.m_parent_node;
        source_parent_node_id = source_parent_tree_node.m_id;
        if ( source_parent_node_id === TOP_ID ) {
          source_parent_node_id = ROOT_ID;
        }

        if ( paste_before ) {
          target_position = getPosition( target_parent_tree_node.m_id, obj.id );
          if ( target_position == -1 ) {
            target_position = 0;
          }
          if ( source_parent_node_id == target_parent_node_id ) {
            // move within the node
            var source_position = getPosition( source_parent_node_id, source_tree_node.m_id );
          }
        }

        if ( target_tree_node != null ) {
          // if source tree node and target tree noe resides in the same folder, do nothing
          if ( source_parent_node_id !== target_parent_node_id || paste_before ) {
            if ( source_tree_node.m_has_child ) {
              source_has_child = "Y";
            }

            // prepare MOVETREE command
            if ( !paste_before || target_parent_node_id == ROOT_ID ) {
              command_name = "?MOVETREE";
            }
            else {
              command_name = "?MOVEBEFORETREE";
              extra_option1 = "&target_record=" + target_tree_node.m_id;
            }

            if ( new_id != "" ) {
              // new NEW_ID option
              extra_option2 = "&new_id=" + new_id;
            }

            url = this.m_home_sessid + command_name +
                  "&source_parent=" + source_parent_node_id +
                  "&source_record=" + source_tree_node.m_id +
                  "&source_title=" + encodeURIComponent(source_tree_node.m_title) +
                  "&has_child=" + source_has_child +
                  "&target_parent=" + target_parent_node_id +
                  extra_option1 + extra_option2 +
                  "&target_title=" + encodeURIComponent(target_tree_node.m_title) +
                  "&xmlresponse";

            // submit MOVETREE command
            var ajax_result = treeAjaxCall ( url, "xml" );

            // check status code
            if ( ajax_result.m_result_code != 0
            &&   ajax_result.m_result_code != 4301     // refresh source parent tree node
            &&   ajax_result.m_result_code != 4302     // refresh target parent tree node
            &&   ajax_result.m_result_code != 4303 ) { // refresh source and target parent tree node
              alert ( "Error " + ajax_result.m_result_code + " is encountered while moving tree node." );
            }
            else {
              // extract count
              var move_count = getXMLTagValue(ajax_result.m_xml_result, "count");

              // delete source tree node
              delete_tree_node_refs ( source_parent_tree_node, source_tree_node );

              // add child tree node to target parent tree node and add node to jstree
              var lowest_level = true;
              if ( getXMLTagValue(ajax_result.m_xml_result, "desc_folder") === "Y" ) {
                lowest_level = false;
              }

              // extract desc_level tag
              var desc_level = getXMLTagValue(ajax_result.m_xml_result, "desc_level");

              // extract desc_title tag
              var desc_title = getXMLTagValue(ajax_result.m_xml_result, "desc_title");

              // extract desc_parent tag
              var desc_parent = getXMLTagValue(ajax_result.m_xml_result, "desc_parent");
              if ( desc_parent == ROOT_ID ) {
                desc_parent = TOP_ID;
              }

              // extract desc_sisn tag
              var desc_sisn = getXMLTagValue(ajax_result.m_xml_result, "desc_sisn");

              var has_children = false;
              if ( source_has_child === "Y" ) {
                has_children = true;
              }

              // add tree node to jstree
              rc = edit_tree_node ( desc_parent, desc_sisn, desc_title, desc_level, lowest_level, has_children, true,
                paste_before, target_position );
              if ( rc != 0 ) {
                alert ( "Unable to move tree node to new location because of error " + rc );
              }
              else {
                var jstree_node = null;

                if ( ajax_result.m_result_code == 4301 || ajax_result.m_result_code == 4303 ) {
                  // find jstree tree node
                  jstree_node = $(jtree_variable).jstree(true).get_node(source_parent_tree_node.m_id);
                  if ( jstree_node ) {
                    // refresh source parent tree node
                    source_parent_tree_node.refreshTreeNode ();

                    // refresh jstree node and chidlren if any
                    $(jtree_variable).jstree(true).refresh_node(jstree_node);

                    // set tree node in focus
                    this.setFocus ( source_parent_tree_node.m_id );
                  }
                }

                if ( ajax_result.m_result_code == 4302 || ajax_result.m_result_code == 4303 ) {
                  // find jstree tree node
                  jstree_node = $(jtree_variable).jstree(true).get_node(target_parent_tree_node.m_id);
                  if ( jstree_node ) {
                    // refresh target parent tree node
                    target_parent_tree_node.refreshTreeNode ();

                    // refresh jstree node and chidlren if any
                    $(jtree_variable).jstree(true).refresh_node(jstree_node);

                    // set tree node in focus
                    this.setFocus ( target_parent_tree_node.m_id );
                  }
                }

                if ( move_count != "" ) {
                  alert ( move_count + " record(s) are moved." );
                }
              }
            }
          }
        }
      }
    }
  }

  // handler for resequencing decription record
  this.reseqRecord = function (obj) {
    this.m_cut_tree_node = null;

    if ( m2a_tree != null ) {
      // get node ID
      var node_id = obj.id;

      // search tree node object by ID
      if ( node_id !== ROOT_ID && node_id !== TOP_ID ) {
        var tree_node = this.m_root_tree_node.searchNodeById ( node_id );
        if ( tree_node ) {
          var url = this.m_home_sessid + "?RENUMBERTREE" +
                    "&parent=" + node_id +
                    "&xmlresponse";

          // submit MOVETREE command
          var ajax_result = treeAjaxCall ( url, "xml" );

          // check status code
          if ( ajax_result.m_result_code != 0 ) {
            if ( ajax_result.m_result_code != 2207 ) { // no action
              alert ( "Error " + ajax_result.m_result_code + " is encountered while renumbering tree node." );
            }
          }
          else {
            // find jstree tree node
            var jstree_node = $(jtree_variable).jstree(true).get_node(obj.id);
            if ( jstree_node ) {
              // refresh tree node object
              tree_node.refreshTreeNode ();

              // refresh jstree node and chidlren if any
              $(jtree_variable).jstree(true).refresh_node(jstree_node);

              // set tree node in focus
              this.setFocus ( obj.id );
            }
          }
        }
      }
    }
  }

  // utility mehtod to prompt import file
  this.promptImportFile = function (obj) {
    var tree_node = null;
    var node_id = "";
      this.m_cut_tree_node = null;

      if ( runImportBtn == null ) {
        m2a_tree.importRecord ( obj.id );
      }
      else {
        var realFileBtn = document.getElementById( 'real-file' );
        if ( realFileBtn != null ) {
          // clear selected file
          $('#real-file').val('').change();

          tree_node = this.m_root_tree_node.searchNodeById ( obj.id );
          if ( tree_node != null ) {
            this.m_select_node_id = obj.id;

            $(runImportBtn).on("click", function (e) {
              e.preventDefault();

              var fileBtn = document.getElementById( 'real-file' );
              var v = "";
              // extract file path
              if ( fileBtn.files.length > 0 ) {
                v = fileBtn.files.item(0).name;
              }

              if ( v != "" ) {
                m2a_tree.importRecord ( m2a_tree.m_select_node_id );
              }

              this.m_select_node_id = "";
            });
          }
        }

        // Opens import Modal
        $(MODALDIALOG).modal();
      }
  }

  // show import status report
  function show_popup_window ( url, win_title, win_width, win_height )
  {
      $.colorbox({
      iframe: true,
      href: url,
      title: win_title,
      width: win_width,
      height: win_height,
      fastIframe: true,
      transition: "elastic",
      overlayClose: false,
      onCleanup: function () {
        $.colorbox.close();
      },
    });
  }

  // handler for importing decription record
  this.importRecord = function (node_id) {
    var tree_node = null;
    var org_node_id = node_id;
    var realFileBtn = null;
    var file_field_id = "";
    var form_data = null;
    var mytree = this;

    this.m_cut_tree_node = null;

    var import_icon = document.getElementById( 'running' );

    var import_postprocessing = function (ajax_result) {
      // check status code
      if (  ajax_result == null ) {
        if ( import_icon != null ) {
          $(import_icon).css('display', 'none' );
        }

        if ( runImportBtn != null ) {
          // close modal dialog
          if ( $(MODALDIALOG).hasClass('show') ) {
            $(MODALDIALOG).modal('toggle');
          }
        }
      }
      else if ( ajax_result.m_result_code != 0 ) {
        if ( import_icon != null ) {
          $(import_icon).css('display', 'none' );
        }

        if ( runImportBtn != null ) {
          // close modal dialog
          if ( $(MODALDIALOG).hasClass('show') ) {
            $(MODALDIALOG).modal('toggle');
          }
        }
        showAjaxError ( ajax_result.m_result_code, "importing tree node" );
      }
      else {
        // find jstree tree node
        var jstree_node = $(jtree_variable).jstree(true).get_node(org_node_id);
        if ( jstree_node ) {
          // refresh tree node object
          tree_node.refreshTreeNode ();

          // refresh jstree node and chidlren if any
          $(jtree_variable).jstree(true).refresh_node(jstree_node);

          // set tree node in focus
          mytree.setFocus ( org_node_id );

          if ( import_icon != null ) {
            $(import_icon).css('display', 'none' );
          }

          if ( runImportBtn != null ) {
            // close modal dialog
            if ( $(MODALDIALOG).hasClass('show') ) {
              $(MODALDIALOG).modal('toggle');
            }
          }

          // extract status_report tag
          v = getXMLTagValue ( ajax_result.m_xml_result, "status_report" );
          if ( v != null && v != "" ) {
            var confirm_view = confirm ( "Do you want to view status report ?" );
            if ( confirm_view ) {
              url = mytree.m_home_sessid + "?VIEWTEXTFILE" + "&file=" + v;
              show_popup_window ( url, "Import Status", 800, 600 );
            }
          }
        }
        else {
          if ( import_icon != null ) {
            $(import_icon).css('display', 'none' );
          }

          if ( runImportBtn != null ) {
            // close modal dialog
            if ( $(MODALDIALOG).hasClass('show') ) {
              $(MODALDIALOG).modal('toggle');
            }
          }
        }
      }
    }

    tree_node = this.m_root_tree_node.searchNodeById ( node_id );
    if ( tree_node != null ) {
      if ( node_id == TOP_ID ) {
        node_id = ROOT_ID;
      }

      if ( runImportBtn == null ) {
        file_field_id = 'SELECT_FILE';
        realFileBtn = document.getElementById( file_field_id );
        if ( realFileBtn != null ) {
          form_data = new FormData($('#jstree_select_form')[0]);
        }
      }
      else {
        file_field_id = 'real-file';
        realFileBtn = document.getElementById( file_field_id );
        if ( realFileBtn != null ) {
          var file = realFileBtn.files[0];
          form_data = new FormData();
          form_data.append ( file_field_id, file );
        }
      }
      if ( realFileBtn != null ) {
        // extract file path
        var v = "";
        if ( realFileBtn != null && realFileBtn.files.length > 0 ) {
          v = realFileBtn.files.item(0).name;
        }
        if ( v == null || v == "" ) {
          alert ( "Import file is not selected." );
        }
        else {
          if ( runImportBtn != null ) {
            // close modal dialog
            if ( $(MODALDIALOG).hasClass('show') ) {
              $(MODALDIALOG).modal('toggle');
            }
          }

          if ( import_icon != null ) {
            $(import_icon).css('display', 'block' );
          }

          // prepare IMPORTTREE command
          var url = this.m_home_sessid + "?IMPORTTREE" +
               "&parent=" + node_id +
               "&file=" + file_field_id +
               "&xmlresponse";

          // submit IMPORTTREE command
          var result_value = treeAjaxPostCall ( url, form_data, import_postprocessing );
          if ( result_value != null ) {
            if ( ajax_result.m_result_code != 0 ) {
              if ( import_icon != null ) {
                $(import_icon).css('display', 'none' );
              }

            if ( runImportBtn != null ) {
              // close modal dialog
              if ( $(MODALDIALOG).hasClass('show') ) {
                $(MODALDIALOG).modal('toggle');
              }
            }

              showAjaxError ( ajax_result.m_result_code, "importing tree node" );
            }
          }

          // clear uploaded file name
          $('#'+file_field_id).val('').change();
        }
      }
    }
  }

  // contextmneu callback function
  this.treeMenu = function (node) {
    var root_menu = false;
    var menu_list = {};

    if ( node.id === TOP_ID ) {
      root_menu = true;
    }

    // Is it  prevous page or next page link?
    if ( node.id.indexOf(PAGE_SEPARATOR) >= 0 ) {
      // yes, set menu option to refresh only
      menu_list.refreshItem = {};
      menu_list.refreshItem.label = "Refresh";
      menu_list.refreshItem.action = function (obj) { m2a_tree.refreshRecord(node); };
      menu_list.refreshItem.icon = "fa fa-refresh";
      menu_list.refreshItem._disabled = false;
    }
    else {
      if ( !root_menu ) {
        menu_list.viewItem = {};
        menu_list.viewItem.label = "View Record";
        menu_list.viewItem.action = function (obj) { m2a_tree.viewRecord(node); };
        menu_list.viewItem.icon = "fa fa-eye";
        menu_list.viewItem._disabled = false;
      }
      menu_list.createItem = {};
      menu_list.createItem.label = "Add Record";
      menu_list.createItem.action = function (obj) { m2a_tree.addRecord(node); };
      menu_list.createItem.icon = "fa fa-plus";
      menu_list.createItem._disabled = false;
      if ( !root_menu ) {
        menu_list.changeItem = {};
        menu_list.changeItem = {};
        menu_list.changeItem.label = "Change Record";
        menu_list.changeItem.action = function (obj) { m2a_tree.changeRecord(node); };
        menu_list.changeItem.icon = "fa fa-edit";
        menu_list.changeItem._disabled = false;
        menu_list.deleteItem = {};
        menu_list.deleteItem.label = "Delete Record";
        menu_list.deleteItem.action = function (obj) { m2a_tree.deleteRecord(node); };
        menu_list.deleteItem.icon = "fa fa-times";
        menu_list.deleteItem._disabled = false;
      }
      menu_list.refreshItem = {};
      menu_list.refreshItem.label = "Refresh";
      menu_list.refreshItem.action = function (obj) { m2a_tree.refreshRecord(node); };
      menu_list.refreshItem.icon = "fa fa-refresh";
      menu_list.refreshItem._disabled = false;
      // menu_list.searchItem = {};
      // menu_list.searchItem.label = "Search";
      // menu_list.searchItem.action = function (obj) { m2a_tree.searchRecord(node); };
      // menu_list.searchItem.icon = "fa fa-search";    menu_list.searchItem._disabled = false;
      if ( root_menu ) {
        if ( m2a_tree.m_cut_tree_node != null ) {
          menu_list.pasteItem = {};
          menu_list.pasteItem.label = "Paste";
          menu_list.pasteItem.action = function (obj) { m2a_tree.pasteRecord(node, false); };
          menu_list.pasteItem.icon = "fa fa-clipboard";
          menu_list.pasteItem._disabled = false;
          menu_list.pasteItem.separator_before = true;
        }
      }
      else {
        menu_list.duplicateItem = {};
        menu_list.duplicateItem.label = "Duplicate";
        menu_list.duplicateItem.action = function (obj) { m2a_tree.duplicateRecord(node); };
        menu_list.duplicateItem.icon = "fa fa-clone";
        menu_list.duplicateItem._disabled = false;
        if ( m2a_tree.m_sorted !== "Y" ) {
          menu_list.sortItem = {};
          menu_list.sortItem.label = "Sort";
          menu_list.sortItem.action = function (obj) { m2a_tree.sortRecord(node); };
          menu_list.sortItem.icon = "fa fa-sort";
          menu_list.sortItem._disabled = false;
        }
        menu_list.cutItem = {};
        menu_list.cutItem.label = "Cut";
        menu_list.cutItem.action = function (obj) { m2a_tree.cutRecord(node); };
        menu_list.cutItem.icon = "fa fa-scissors";
        menu_list.cutItem._disabled = false;
        menu_list.cutItem.separator_before = true;
        if ( m2a_tree.m_cut_tree_node != null ) {
          menu_list.pasteItem = {};
          menu_list.pasteItem.label = "Paste";
          menu_list.pasteItem.action = function (obj) { m2a_tree.pasteRecord(node, false); };
          menu_list.pasteItem.icon = "fa fa-clipboard";
          menu_list.pasteItem._disabled = false;
          if ( m2a_tree.m_paste_before === "Y" ) {
            menu_list.pastebeforeItem = {};
            menu_list.pastebeforeItem.label = "Paste before";
            menu_list.pastebeforeItem.action = function (obj) { m2a_tree.pasteRecord(node, true); };
            menu_list.pastebeforeItem.icon = "fa fa-clipboard";
            menu_list.pastebeforeItem._disabled = false;
          }
        }
        if ( m2a_tree.m_renumber === "Y" && m2a_tree.m_reseq_id !== "Y" ) {
          menu_list.resequenceItem = {};
          menu_list.resequenceItem.label = "Resequence";
          menu_list.resequenceItem.action = function (obj) { m2a_tree.reseqRecord(node, false); };
          menu_list.resequenceItem.icon = "fa fa-sort-asc";
          menu_list.resequenceItem._disabled = false;
        }
      }
      menu_list.importItem = {};
      menu_list.importItem.label = "Import";
      menu_list.importItem.action = function (obj) { m2a_tree.promptImportFile(node); };
      menu_list.importItem.icon = "fa fa-floppy-o";
      menu_list.importItem._disabled = false;
      menu_list.importItem.separator_before = true;
    } // else of if ( node.id.indexOf(PAGE_SEPARATOR) >= 0 )

    return menu_list;
  }

  // get child tree nodes of tree branch
  this.getData = function ( id, index ) {
    var JsonArray = [];

    if ( this.m_initialized ) {
      if ( this.m_root_tree_node != null ) {
        var seek_tree_node = null;
        if ( id === "#" ) {
          seek_tree_node = this.m_root_tree_node;
        }
        else {
          seek_tree_node = this.m_root_tree_node.searchNodeById(id);
        }
        if ( seek_tree_node != null ) {
          // if tree node is found, convert child tree nodes to json array
          JsonArray = seek_tree_node.JsonData( index );
        }
      }
    }

    return JsonArray;
  } // end of getData method


  // run tree control to show tree hierarchy and accept user input
  this.run = function() {
    // var to = false; // need for searching
    if ( this.m_initialized ) {
      var plugin_list = ["contextmenu", "checkbox", "dnd", "html_data", "ui", "crrm", "hotkeys", "theme", "types", "search", "state", "json_data"];
      if ( this.m_sorted !== "Y" || this.m_sort_id === "Y" ) {
        plugin_list.push("sort");
      }

      $(jtree_variable).jstree({
        'core' : {
          'check_callback' : true,
          'data' :
            function (node, cb) {
              if ( node.id == ROOT_ID || node.id == TOP_ID ) {
                if ( m2a_tree.m_sort_id === "Y" ) {
                  m2a_tree.m_retrieve_top_node = true;
                }
              }
              else {
                m2a_tree.m_retrieve_top_node = false;
              }

              var json_array = tree_get_data ( node.id );
              cb(json_array);
            },
          'themes': {
            'variant': "medium",
            'dots': true,
            //"responsive": true,
            'stripes': true
          },
          "dblclick_toggle" : false
        }, // 'core'
        'plugins': plugin_list,
        'contextmenu': {
          'select_node': false,
          'items' : this.treeMenu
        },
        'state': {
          //"key": ,
        },
        "search": {
          "case_sentsitive": false,
          "fuzzy" : false,
          "show_only_matches": true,
          "search_callback": function ( str, node ) {
            return searchNodeText ( str, node );
          }
        },
        "checkbox": {
          three_state: false,
          cascade: ""
        },
        "ui": {
          //"initially_select": ["parents"]
        },
        'sort' : function(a, b) {
          var rc = 0;
          if ( m2a_tree.m_sort_id === "Y" && (m2a_tree.m_sorted !== "Y" || m2a_tree.m_retrieve_top_node) ) {
            rc = compareValue ( this.get_node(a).text, this.get_node(b).text );
          }
          return rc;
        }
      })

      // $(jtree_variable).jstree(
      $(jtree_variable).bind('loaded.jstree', function(e, data) {
        // show top-level nodes after root node of jstree has loaded
        var root_node = $(jtree_variable).jstree(true).get_node(TOP_ID);
        $(jtree_variable).jstree(true).open_node( root_node );
      });

      // $(jtree_variable).jstree(
      $(jtree_variable).bind("dblclick.jstree", function (event) {
         var tree = $(this).jstree();
         var node = tree.get_node(event.target);
         m2a_tree.changeRecord(node);
      });

      // Search tree
      $('#searchBtn').click(function (e) {
        // $('#jstree_display_search').val('').change().focus();
        if ( m2a_tree != null ) {
          if ( m2a_tree.m_refresh_root ) {
            // clear last search
            $(jtree_variable).jstree(true).clear_search();
          }
          m2a_tree.searchRecord(null);
        }
      });


      // Clear Search Bar
      $('#clearSearchBtn').click(function (e) {
        // reload child nodes of top node
        var search_value = $('#jstree_display_search').val();
        var jstree_node = $(jtree_variable).jstree(true).get_node(TOP_ID);
        if ( jstree_node != null && search_value != "" ) {
          m2a_tree.refreshRecord(jstree_node);
        }
        $('#jstree_display_search').val('').change().focus();
        $('#jstree_display').jstree(true).deselect_all();
      });

      // Deselects all checked records
      $('#deselectBtn').click(function (e) {
        $('#jstree_display').jstree(true).deselect_all();
      });

      // Node/Record Counter
      $(jtree_variable).on("changed.jstree", function (e, data) {
        var i, j, r = [];
        for(i = 0, j = data.selected.length; i < j; i++) {
            r.push(data.instance.get_node(data.selected[i]).text);
        }
        // console.log(r)
        var count = r.length;
        document.getElementById("countOfRecord").innerHTML = count;
        //$('#hello_world').html(r.join(', '));
      });

      $('#node_test').on('click','node_test',function(){
        window.location=$(this).attr('href');
      });

      $(jtree_variable).on('uncheck_node', function (e, data) {
        // console.log(data.selected);
      });
    }
  } // end of run method

} // end of TreeControl class


/* -----------------------------------------------------------
   global variables
-------------------------------------------------------------- */

var m2a_tree = null;
var jtree_variable = "";
var runImportBtn = null;

/* -----------------------------------------------------------
   main line codes of tree web page
-------------------------------------------------------------- */

$(document).ready( function() {
  // alert ( "start tree control" );

  runImportBtn = document.getElementById("run-import");

  // construct tree control object
  m2a_tree = new TreeControl ( "[cams_m2a_script]m2a_tree.par", "jstree_display" );

  if ( m2a_tree == null ) {
    alter ( "Unable to create description tree hierarchy." );
  }
  else {
    // execute tree control object until web page is closed.
    m2a_tree.run ();
  }
});
$(document).ready(function(){
  $("#myBtn").click(function(){
    $("#myModal").modal();
  });
});
