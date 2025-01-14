/*
  extractTreeXmlField()

  This function extracts the XML tag value and returns it as function return value.
*/

function extractTreeXmlField ( xml_data, xml_tag ) {
  // console.log(xml_data)
  var tag_value = "";
  var tag_nodes = xml_data.getElementsByTagName(xml_tag)[0];
  if ( tag_nodes != null ) {
    var first_occ = tag_nodes.childNodes[0];
    tag_value = first_occ.nodeValue;
  }

  return tag_value;
}


/*
  saveTreeRecord

  This funcion saves description record in database.  It either adds new tree node
  to tree hierarchy or changes tree node of tree hierarchy.
*/

function saveTreeRecord (form_action, form) {
  // console.log(form_action)
  // console.log(form)
  var action_success = false;
  var rc = 0;

  // prepare and make Ajax call
  var savetree_url = form_action + "&xmlresponse";
  var form_data = $(form).serialize();
  $.ajax({
    async: false,
    type: "POST",
    dataType: "xml",
    url: savetree_url,
    data: form_data,
    success: function (data) {
      if ( jQuery.isXMLDoc( data ) ) {
        var error_code = extractTreeXmlField ( data, "error" );
        if ( parseInt(error_code, 10) == 0 ) {
          action_success = true;
        }
        else {
          alert ( "Unable to save description record because error " + error_code + " is encountered." );
        }
      }
      else {
        alert ( "Undetermined error because response is not in XML format.");
      }

      if ( action_success ) {
        var win_opener = null;
        if ( window.opener != null ) {
          win_opener = window.opener;
        }

        // extract desc_folder tag
        var lowest_level = true;
        if ( extractTreeXmlField(data, "desc_folder") === "Y" ) {
          lowest_level = false;
        }

        // extract desc_level tag
        var desc_level = extractTreeXmlField(data, "desc_level");

        // extract desc_title tag
        var desc_title = extractTreeXmlField(data, "desc_title");

        // extract desc_parent tag
        var desc_parent = extractTreeXmlField(data, "desc_parent");

        // extract desc_sisn tag
        var desc_sisn = extractTreeXmlField(data, "desc_sisn");

        // extract desc_new tag
        var desc_new = false;
        if ( extractTreeXmlField(data, "desc_new") === "Y" ) {
          desc_new = true;
        }

        // call function in parent page to update jstree
        if ( win_opener == null ) {
          if ( parent ) {
            rc = parent.edit_tree_node ( desc_parent, desc_sisn, desc_title, desc_level, lowest_level, false, desc_new );
          }
          else {
            rc = edit_tree_node ( desc_parent, desc_sisn, desc_title, desc_level, lowest_level, false, desc_new );
          }
        }
        else {
          rc = win_opener.edit_tree_node ( desc_parent, desc_sisn, desc_title, desc_level, lowest_level, false, desc_new );
        }
        if ( rc != 0 ) {
          alert ( "Unable to update tree hierarchy because of error " + rc );

          if ( typeof record_unlocked != 'undefined' ) {
            // Is record_unlocked defined in core_interface_handleing.js
            record_unlocked = false;
          }
        }
        else {
          // close web page
          if ( win_opener != null ) {
            window.close();
          }
          else {
            if ( parent ) {
              parent.$.colorbox.close();
           }
          }
        }
      }
    },
    error: function (xhr, status, error) {
      alert ( "Re-edit record error " + '\n' + "xhr: " + xhr + '\n' + "status: " + status + '\n' + "error: " + error);
    }

  });

  return action_success;
}

/*
 skipTreeRecord

 This funcion unlocks description record and closes web page
 if web page has parent web page.
*/

function skipTreeRecord (skip_url) {
  // prepare and make Ajax call
  $.ajax({
    async: false,
    type: "GET",
    dataType: "html",
    url: skip_url,
    success: function (data) {
      if ( window.opener != null ) {
        window.close();
      }
      else {
        if ( parent ) {
          parent.$.colorbox.close();
        }
      }
    },
    error: function (xhr, status, error) {
      alert ( "Unable to unlock record." );
    }
  });
}
