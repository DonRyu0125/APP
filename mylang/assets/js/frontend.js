const G_MAX_WEB_CHARS         = 62;
const G_MAX_BYTE2_VALUE       = (256-G_MAX_WEB_CHARS);

// declare global constants
const DESCRIPTION_DBNAME    = 'description';
const COLLECTIONS_NAME      = 'collections';
const MULTI_SELECTION       = 'multi_selection';

// detail records id
const detail_record_id      = "detail_record_display";


// declare global constants
const MARC_REPEAT_FLAG        = "*";


/**
 * By Default the summary page will be displayed in List View
 */
let isList = true;

// RL-2020-12-10
/*
 * By Default the view/edit data entry page will be displayed in modal dialog
 */
var dialog_in_colorbox = true;

/*
 * flag for control of unlocking reord. By Default is set to false
 */
var already_unlocked = false;

/*
 * URL for unlocking data entry record. by Default is se to empty and is set populated in
 * the populateSearchMetadata function
 */
var modal_skip_record_link = "";

/*
 * URL for current summary page. by Default is set to empty and is populated in
 * the constructor of ApplicationInterface object
 */
var current_page_link = "";

/*
 * flag indicates reocrd has been edited
 */
var edit_done = false;

// RL-2021-03-13
/*
 * base url for remove bookmarked item
 */
var bookmark_base_url = "";

// RL-2021-08-13
/*
 *  first summary page URL
 */
var first_page_url = "";

/*
 *  current_ report specification
 */
var current_report_spec = "";


/**********************************************************************************************************************************
 add pad method to Number object
***********************************************************************************************************************************/
Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}


/**********************************************************************************************************************************
 *
 *  loadedSearchInNewWindow : Grabs inputed search query from user and is sent to handleSearchResults(Search Word) to display error or found result
 *
 ***********************************************************************************************************************************/
var loadedSearchInNewWindow = function () {
  if ($('div#query_payload').length > 0) {
    handleSearchResults($('div#query_payload'));
  }
};

var pageType = "";
var loadedDetailedReportInNewWindow = function () {
  if ($('div#drd_payload').length > 0) {
    handleDetailedRecordDisplay($('div#drd_payload').find('xml'));

    // RL-2020-12-10
    if ( popupWindow() ) {
      removeModalLinks(true);
    }
  }
};


// M2A codes
var toggleNavIcon = function () {
  if ( $("body").attr("data-database") == DESCRIPTION_DBNAME ) {
    // Description - Search Home Page, Summary, Summary Grid
    if ($("section.query_form").length > 0){
      $("#dba_edit a").addClass("disabled");
      $("#dba_new a").addClass("disabled");
    }

    // Description - Edit Page/Data Entry Form
    if ($("section#data_entry_forms").length > 0) {
      $("#dba_tree a").addClass("disabled");
      $("#dba_edit a").addClass("disabled");
      $("#dba_new a").addClass("disabled");
      $("#dba_search").addClass("disabled");
      $("#dba_global_change").addClass("disabled");

      // RL-20220120
      var remove_logoff = false;
      if ( typeof enable_tree != 'undefined' && enable_tree ) {
        remove_logoff = true;
      }
      else {
        if ( parent != null
        &&   typeof parent.$disable_logoff != 'undefined'
        &&   parent.$disable_logoff ) {
          remove_logoff = true;
        }
      }

      if ( remove_logoff && popupWindow() ) {
        // remove logoff link
        if ( $("a.logout").closest("li").length > 0 ) {
          dba_link = $("a.logout").closest("li")[0];
          if ( dba_link != null ) {
            dba_link.innerHTML = '';
          }
        }
      }
    }

    if ( typeof enable_tree != 'undefined' && enable_tree ) {
      // Description - M2A Tree
      if ($("div#jstree_display").length > 0){
        $("#dba_edit a").addClass("disabled");
        $("#dba_new a").addClass("disabled");
      }
    }
  }
}

/**********************************************************************************************************
 * multipleRecordSelection : turns the edit button on/off if there are multiple records selected
 *
 * notes:
 *   - Single record, enables the edit button to be href to new window to load the record into dataentry form
 *        Ways of editing:
 *           1. Select single record. Click "Edit Icon" in actions_nav
 *           2. Right Click single record for Context Menu for "Edit"
 *   - Multiple record selection, disables the ability to edit. Can only have 1 record window open at a time.
 *
 **********************************************************************************************************/
var multipleRecordSelection = function () {
  if ($('table#search_results input:checked').length) {
    // check if search_results input is checked and greater than 0
    if ($('#dba_edit a').hasClass('disabled')) {
      $('#dba_edit a').removeClass('disabled');

      $('#dba_edit a').on('click', function (e) {
        e.preventDefault();
        $('#multi_record').submit();
      });

      // M2A codes
      $("#dba_new_record a").addClass("disabled");
      $("#dba_edit a").addClass("disabled");
    }
  } else {
    $('#dba_edit a').off();
    if (!$('#dba_edit a').hasClass('disabled')) {
      $('#dba_edit a').addClass('disabled');
    }
  }
};

/*****
 **
 **  getUsername : returns a string based on the username that the user logged in with
 **
 **  notes:
 **    - requires 'jquery-cookie.js'
 **    - cookie is set at login by the MINISIS login form
 **
 *****/
var getUserName = function () {
  return $.cookie('USERNAME') || 'User';
};
var getHomeSessId = function () {
  return $.cookie("HOME_SESSID") || "HOME_SESSID"
}

/*****
 **
 **  setActiveDatabase : highlights the currently active database tab by adding an 'active' class to it
 **
 *****/
var setActiveDatabase = function () {
  // RL-2021-03-28
  var db = $('body').data('db-title');
  if ( db == undefined ) {
    db = $('body').data('database');
  }
  $('#database_selection').find('li.' + db).find('a').addClass('active');
};

/*****
 **
 **  hideSearch : hides the query form from view while retaining visibility of the query form controls
 **
 **  params:
 **    - caller : The element which fired the click event
 **
 *****/
var hideSearch = function (caller) {
  $('section.query_form').slideToggle(250);

  var icon = $('<i class="fa fa-2x"/>');

  if ($(caller).children('i').hasClass('fa-eye-slash')) {
    icon.addClass('fa-eye');
  } else {
    icon.addClass('fa-eye-slash');
  }

  $(caller).children('i').first().replaceWith(icon);
};

/*****
 **
 **  toggleLineMode : Either hides or shows the "Line Mode" search field
 **
 *****/
var toggleLineMode = function () {
  if ($('div.simple_search').is(':visible')) {
    $('div.key_search').slideToggle(250, function () {
      $('a.key_search').removeClass('active');
      $('div.key_search :input').val('');
      $('a.line_search').addClass('active');

      // RL-2020-09-29
      linemode_count = 0;
      refreshHistory(true);

      $('div.linemode').slideToggle(250);
    });
  }
};

// RL-2020-09-29
/****
**
** lastHits : return number of hits of last search
**
 ****/
function lastSearchHits ()
{
  var result = "";
  var dbname = $('body').data('database');
  var url = getHomeSessId() + "?QUERYHISTORY&XML_DOC=Y&SHOWALL=Y";
  if ( typeof dbname != 'undefined' && dbname != "" ) {
    url = url + "&DATABASE=" + dbname;
  }

  var num_exps = 0;
  var result_string = "";
  var hits = 0;
  var exp_no = "0";

  result_string = callMwiApi(url);
  if ( jQuery.isXMLDoc( result_string ) ) {
    num_exps = countXmlTag ( result_string, "statement" );
    if ( num_exps > 0 ) {
      var statements = result_string.getElementsByTagName("statement");
      result = getXmlFieldValue (statements[num_exps-1], "count");
      hits = parseInt(result, 10);
      exp_no = statements[num_exps-1].getAttribute("expno");
    }
  }

  var json_result = {};
  json_result['num_exps'] = num_exps.toString();
  json_result['hits'] = hits.toString();
  json_result['last_expno'] = exp_no;

  return json_result;
}

// RL-2020-09-29
/****
**
** loadQueryHistory : read query expression from server and reformat XML string to HTML string
**
 ****/
function loadQueryHistory (empty_table)
{
  var result = "";
  var dbname = $('body').data('database');
  var url = getHomeSessId() + "?QUERYHISTORY&XML_DOC=Y&SHOWALL=Y";
  if ( typeof dbname != 'undefined' && dbname != "" ) {
    url = url + "&DATABASE=" + dbname;
  }

  var num_exps = 0;
  var result_string = "";

  if ( !empty_table ) {
    result_string = callMwiApi(url);
    if ( !jQuery.isXMLDoc( result_string ) ) {
      result = "Error: " + result_string;
    }
    else {
      num_exps = countXmlTag ( result_string, "statement" );
    }
  }

  // add table header
  result = "<table>" +
             "<tr><td><b>#</b></td><td>&nbsp;</td><td><b>Hits</b></td><td>&nbsp;</td><td><b>Query</b></td></tr>";

  // add search history lines
  if ( num_exps > 0 ) {
    var statements = result_string.getElementsByTagName("statement");
    var exp_no = "";
    var expression = "";
    var hits = "";
    for ( ix = 0 ; ix < num_exps ; ix++ ) {
      exp_no = statements[ix].getAttribute("expno");
      expression = getXmlFieldValue (statements[ix], "expression");
      expression = expression.replace(/%2F/gi, '/');
      hits = getXmlFieldValue (statements[ix], "count");
      result = result + "<tr><td>" + exp_no + "</td><td>&nbsp;</td><td>" + hits + "</td><td>&nbsp;</td><td>" + expression + "</td></tr>";
    }
  }

  // add table footer
  result = result +  "</table>";

  return result;
}

// RL-2020-09-29
/****
**
** refreshHistory : refresh query history window after searching
**
 ****/
function refreshHistory (empty_table)
{
  var query_history = document.getElementById("history-section");
  if ( query_history != null ) {
    var history_table = loadQueryHistory(empty_table);
    query_history.innerHTML = history_table;
  }
}

/*******************************************************************************************
 **
 **  toggleSimpleAdvancedSearch : Either hides or shows the simple or advanced search fields
 **
 *******************************************************************************************/
var toggleSimpleAdvancedSearch = function () {
  if ($('div.linemode').is(':visible')) {
    $('div.linemode').slideToggle(250, function () {
      $('a.line_search').removeClass('active');
      $('div.linemode :input').val('');
      $('a.key_search').addClass('active');
      $('div.key_search').slideToggle(250);
    });
  } else {
    $('a.key_search').toggleClass('adv_active');
    $('div.advanced_search').slideToggle(250);
  }
};

/*****
**
**  setupSearchCall : sends an AJAX query form post to MINISIS, and then calls `handleSearchResults` to deal with the result of that form post
**
**  params:
**    - e : The firing event, used to prevent the form from POSTing normally
**    - form : The form to be POSTed to MINISIS
**
 *****/
var setupSearchCall = function (e, form, title) {  // RL-2021-06-21
  if ( e ) { // RL-2021-03-26
    e.preventDefault();
  }

  $('.results_container').html('<div class="loading"><i class="fa fa-spin fa-gear fa-4x"></i></div>');
  var query_data = $(form).serialize();
  var url = $(form).attr('action');

  // RL-2020-09-29
  if ( document.getElementById("history-section") != null
  &&   $('div.linemode').is(':visible') && linemode_count > 0 ) {
    // remove clear option to previous query expressions
    url = url.replace( "&CLEAR=Y", "" );
  }

  // RL-2021-06-21
  if ( title != null && title != '' ) {
    url = url + "&DISPLAY=" + escapeUrlchars(title);
  }

  var state_params = {
    form_action: url,
    serialized_form: query_data
  };

  var search_state = generateState('query_form', url, state_params);
  history.pushState(search_state, '', url);

  if ($(form).hasClass('gc_search')) {
    performGlobalChangeSearch(url, query_data);
  } else {
    // RL-2020-09-29
    performSearch(url, query_data, true);
  }
};

/*****
 **
 **  performSearch : sends an AJAX query form post to MINISIS, and then calls `handleSearchResults` to deal with the result of that form post
 **
 **  params:
 **    - e : The firing event, used to prevent the form from POSTing normally
 **    - form : The form to be POSTed to MINISIS
 **
 *****/
var performSearch = function (action, form_data, refresh_history) {

  var search = $.post(action, form_data);
  search.done(function (data) {
    handleSearchResults($.parseHTML(data));

    // RL-2020-09-29
    if (refresh_history) {
      if ( $('div.linemode').is(':visible') ) {
        linemode_count++;
        refreshHistory(false);
      }
    }
  });
};

var performGlobalChangeSearch = function (action, form_data) {
  var search = $.post(action, form_data);
  search.done(function (gc_url) {
    if (gc_url.length > 200) {
      var html = $('<div id="search_metadata"/>');
      html.append('<p style="font-size: 1rem;">Your search returned no results.</p>');
      html.append('<p style="font-size: 1rem; padding-bottom: 2rem;">Please try another set of query criteria.</p>');
      $('.results_container').html(html);
      return false;
    } else {
      // normal request
      $.get(gc_url, function (data) {
        $('div.results_container').html(data);
        $('#gc_submit').on('click', function (e) {
          e.preventDefault();
          submitGlobalChange($(this));
        });
      });
    }
  });
};

var submitGlobalChange = function (caller) {
  var form = $(caller).parents('form').first();

  var submission = $.post(form.attr('action'), form.serialize());
  submission.done(function (data) {
    populateGlobalChangeResults($.parseHTML(data));
  });
};

var populateGlobalChangeResults = function (data) {
  $('div.results_container').html(data);

  $('p.global_change_info a').on('click', function (e) {
    e.preventDefault();
    $.get($(this).attr('href'), function (data) {
      var parsedData = $.parseHTML(data);
      $('div.results_container').html($(parsedData).find('table#global_change_status'));

      $('a#hideJob').on('click', function (e) {
        e.preventDefault();
        $(this).parents('tr').hide();
      });

      $('a#viewJob').on('click', function (e) {
        e.preventDefault();

        $.get($(this).attr('href'), function (data) {
          $('div.results_container').html($.parseHTML(data));
        });
      });
    });
  });
};

/*************************************************************************************************************
 **
 **  handleSearchResults : populates a summary report page based on a payload from a MINISIS query form post
 **
 **  params:
 **    - data : The payload returned from MINISIS from a query form submission:
 **      - 'search_statement' : Equivalent to MINISIS ^SEARCH_STATEMENT^ routine, inside of a <div> container
 **      - 'search_page_numbers' : A string containing the current result set inside of a <div> container (ie. 10 to 20)
 **      - 'total_results' : A string containing the total amount of results returned inside of a <div> container
 **      - 'multi_form_action' : A string containing the form action for MINISIS for use with ^SAVE_N_NEXT^ routines.
 **      - 'returned_results' : An HTML table containing the current page of search results
 **      - 'pagination' : An HTML <div> element containing links for pagination of the search results
 **
 *************************************************************************************************************/
var handleSearchResults = function (data) {
  // MH-2021-10-02

  var populatePageOption = function (data, database, totalRecords) {
    // RL-2021-03-28 - generalize the logic for any database
    // - page options must appear before other option
    // - id of page option must start with 'size'
    // - page size specified aftr "size". for example id="size10"
    var  found_page_option = false;
    if ( data.pageOption.length > 0 ) {
      found_page_option = true;
    }

    if (found_page_option && totalRecords !== "") {
      let html = $('<div id="page_option" />');

      var ul_tag = '<ul class="dropdown-menu">';
      var ix;
      for ( ix = 0 ; ix < data.pageOption.length ; ix++ ) {
        ul_tag = ul_tag.concat('<li><a href=' + data.pageOption[ix].url + '>' + data.pageOption[ix].size + ' records</a></li>');
      }
      ul_tag = ul_tag.concat('</ul>');

      html.append('<div class="dropdown"> <button class="pageOptionBtn" href="#" data-toggle="dropdown" class="dropdown-toggle">Page Options <b class="caret"></b> </button> ' + ul_tag + '</div>');

      $("#search_metadata").after(html);
    }
  };
  /*****
   **
   **  populateSearchMetadata : Generates the HTML to provide metadata about the currently performed search
   **
   **  params:
   **    - data : A javascript object containing the following properties:
   **      - 'query' : The user's search statement
   **      - 'total_results' : The total amount of results returned from the search
   **      - 'first_result' : The position of the first result on the page in the context of the full search
   **      - 'last_result' : The position of the last result on the page in the context of the full search
   **
   *****/

  var populateSearchMetadata = function (data, sizeList, database) {
    // RL-2020-12-10
    // save current page url
    if ( data.current_page_url != null ) {
      current_page_link = data.current_page_url.trim();
    }

    var html = $('<div id="search_metadata" />');
    var gridListView = pageType != undefined? '<div class="right-float"><a href="' +
                                              data.list_view_url +
                                              '" class="btn btn-link" id="summary-list-view"><i class="fa fa-list"></i></a><a href="'
                                              + data.grid_view_url +
                                              '" class="btn btn-link" id="summary-grid-view"><i class="fa fa-th"></i></a></div>':"";
    if (data.query.length > 0) {
      html.append('<p>Your search for <span class="search_entered_query">' + '"' +
                  data.query.trim() + '"' +
                  '</span> returned <span class="search_results_total">' +
                  data.total_results +
                  "</span> results.</p>");
      html.append('<p>Showing results <span class="search_first_result_on_page">' +
                   data.first_result +
                   '</span> through <span class="search_last_result_on_page">' +
                   data.last_result +
                   "</span>.</p><span>");

      // M2A codes
      // RL-2021-03-13
      var has_sel_items = false;
      var has_all_items = false;
      var has_page_items = false;
      var has_clear_items = false;
      var has_page_option = false;
      if ( data.bookmark_selective_items != 'undefined' && data.bookmark_selective_items != '' ) {
        has_sel_items = true;
        bookmark_base_url = data.bookmark_selective_items;
      }
      if ( data.bookmark_page_items != 'undefined' && data.bookmark_page_items != '' ) {
        has_page_items = true;
      }
      if ( data.bookmark_all_items != 'undefined' && data.bookmark_all_items != '' ) {
        has_all_items = true;
      }
      if ( data.bookmark_clear != 'undefined' && data.bookmark_clear != '' ) {
        has_clear_items = true;
      }

      var page_option_html = '';
      if ( sizeList.pageOption.length > 0 ) { // RL-20211124
        if (data.total_results !== "") {
          if ( has_type ) {
            page_option_html = page_option_html + "<span style='font-size:2em; margin-right:10px; margin-left:10px'>|</span>";
          }
          var ul_tag = '<ul class="dropdown-menu">';
          var ix;
          for ( ix = 0 ; ix < sizeList.pageOption.length ; ix++ ) {
            ul_tag = ul_tag.concat('<li><a href=' + sizeList.pageOption[ix].url + '>' + sizeList.pageOption[ix].size + ' records</a></li>');
          }
          ul_tag = ul_tag.concat('</ul>');

          page_option_html = page_option_html + '<div id="page_option" class="dropdown" style="display: inline"><button class="pageOptionBtn dropdown-toggle" href="#" data-toggle="dropdown">Page Options <b class="caret"></b> </button> ' + ul_tag + '</div>';
          // html_part += page_option_html; // RL-20220111
          has_page_option = true;
        }
      }

      if ($("body").data("database") === DESCRIPTION_DBNAME
      ||  $("body").data("database") === COLLECTIONS_NAME
      ||  $('body').hasClass(MULTI_SELECTION)
      ||  has_sel_items
      ||  has_page_items
      ||  has_all_items
      ||  has_clear_items
      ||  has_page_option ) {
        var has_bookmark = false;
        var has_type = false;

        var html_part = '<p style="display: inline">';
        if ($("body").data("database") === DESCRIPTION_DBNAME || $("body").data("database") === COLLECTIONS_NAME) {
          has_type = true;
          html_part += "<span id='grid-icon' title='Grid View' style='font-size:2em;cursor:pointer; margin-right:5px'><i class='fa fa-th'></i></span> " +
                       "<span id='list-icon' title='List View' style='font-size:2em;cursor:pointer; margin-right:5px'><i class='fa fa-list'></i></span>";
          // RL-20220201
          if ( data.columns_view_report != null && data.columns_view_report ) {
            html_part += " <span id='columns-icon' title='Column View' style='font-size:2em;cursor:pointer; margin-right:5px' data-report='" + data.columns_view_report + "'><i class='fa fa-columns'></i></span>";
          }
        }

        // insert page option - RL-20220111
        if ( has_page_option ) {
          if ( has_type ) {
            html_part += "<span style='font-size:2em; margin-right:10px; margin-left:10px'>|</span>"
          }
          html_part += page_option_html;
        }

        if ( (has_type || has_page_option) && (has_sel_items || has_page_items || has_all_items || has_clear_items) ) {
          html_part += "<span style='font-size:2em; margin-right:10px; margin-left:10px'>|</span>"
        }

        if ( has_sel_items ) {
          // add selective items - RL-2021-03-13
          html_part += "<a href='#' style='display:none' onclick='bookmark_selective(" + '"' + data.bookmark_selective_items + '");' + "' title='Bookmark Selective item(s)'><span style='font-size:2em; margin-right:5px'><i class='fa fa-check'></i></span></a>";
          has_bookmark = true;
        }
        if ( has_page_items ) {
          // add page items
          html_part += "<a href='#' onclick='bookmark_page(" + '"' + data.bookmark_page_items + '");' + "' title='Bookmark page item(s)'><span style='font-size:2em; margin-right:5px'><i class='fa fa-check-circle'></i></span></a>";
          has_bookmark = true;
        }
        if ( has_all_items ) {
          // add all items
          html_part += "<a href='#' onclick='bookmark_all(" + '"' + data.bookmark_all_items + '");' + "' title='Bookmark all item(s)'><span style='font-size:2em; margin-right:5px'><i class='fa fa-check-square-o'></i></span></a>";
          has_bookmark = true;
        }
        if ( has_clear_items ) {
          // clear items
          html_part += "<a href='#' id='clear_bookark_link' onclick='bookmark_clear(" + '"' + data.bookmark_clear + '");' + "' title='Clear Bookmarked item(s)'><span style='font-size:2em; margin-right:5px'><i class='fa fa-square-o'></i></span></a>";
          has_bookmark = true;
        }
        if ( has_bookmark ) {
          html_part += "<span id='bookmark_count' style='font-size:1.25em;'>" + bookmark_text(data.bookmark_count) + "</span>";
        }
        html_part += '</p>';
        html.append(html_part);
      }

      // insert multi-selection submit button - RL-20220902
      if ( $('body').hasClass('validated_search') ) {
        if ( $('body').hasClass(MULTI_SELECTION) ) {
          var html_part = '<p style="display: inline"><a class="submit_record"><button>Submit</button></a></p>';
          html.append(html_part);
        }
      }
    }
    else {
      html.append('<p style="font-size: 1rem;">Your search returned no results.</p>');
      html.append('<p style="font-size: 1rem;">Please try another set of query criteria.</p>');
    }

    $('.results_container').prepend(html);
    if (typeof pageType != 'undefined' && pageType == "grid") {
      $("i.fa-th").css("color", "black")
    }
    else {
      $("i.fa-list").css("color", "black")
    }
  }  // end of populateSearchMetadata

  /*****
   **
   **  populateSearchResults : Generates the HTML to appropriately show the current page of returned search results
   **
   **  params:
   **    - data : A jQuery object containing a table of search results
   **    - database : A string representing the current database
   **
   *****/
  var populateSearchResults = function (data, database, multi_form_action, type, search_results_metadata) {  // RL-20211201
    if (typeof type != 'undefined' && type == "grid") {
      if (data.length > 0) {
        var multi_record = $('<form id="multi_record" method="post" action="' + multi_form_action + '"/>');
        var html = $('<ul id="search_results">');
        html.append($(data).children());
        multi_record.append(html);
        $('div.results_container').html(multi_record);
      }
    }
    else {
      var generateNoResultsBody = function (num_columns) {
        return $('<tbody><tr><td colspan="' + num_columns +'" class="no_results">No Results Found</td></tr></tbody>' );
      };

      var multi_record = $('<form id="multi_record" method="post" action="' + multi_form_action +'"/>');
      var html = $('<table id="search_results"/>');

      /* RL-20211103 */
      var enable_x_scroll = $('div.results_container').data('xscroll');
      if ( typeof enable_x_scroll == 'undefined') {
        enable_x_scroll = '';
      }
      if ( enable_x_scroll.toUpperCase() == 'Y' ) {
         html = $('<table id="search_results" class="x_scroll" />');
      }

      // Is caller handled heading ?  // RL-20211207
      if ( !search_results_metadata.no_heading ) { // RL-20220311
        if ( search_results_metadata.own_heading != '' ) {
          if (data.length === 0) {
            html.append('<thead><tr><th width="100%">&nbsp;</th></tr></thead>');
            html.append(generateNoResultsBody(1));
          }
          else {
            html.append(search_results_metadata.own_heading);
          }
        }
        else {
          switch (database) {
            case "accession":
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Accession No</th><th>Title</th><th>Date(s)</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(5));
              break;
            case "acc_valid":
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Accession No</th><th>Title</th><th>Location</th><th>Date(s)</th><th>Box No</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(6));
              break;
            case "description":
              if (data.length === 0) html.append(generateNoResultsBody(5));
              break;
            case "des_valid":
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Reference code</th><th>Barcode</th><th>Title</th><th>Level</th><th>Date(s)</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(6));
              break;
            case "people":
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Person ID</th><th>Full Name</th><th>Date of Birth</th><th>Date of Death</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(5));
              break;
            case "organizations":
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Organization ID</th><th>Organization Name</th><th>City</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(4));
              break;
            case 'properties':
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Property ID</th><th>Property Name</th><th>City</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(4));
              break;
            case 'buildings':
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Building ID</th><th>Building Name</th><th>City</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(4));
              break;
            case "locations":
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Location Code</th><th>Location Type</th><th>Building</th><th>Container ID</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(5));
              break;
            case "artlocations": // KN 2022-05-28
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Location Code</th><th>Building</th><th>Room</th><th>Unit</th><th>Shelf</th><th>Container</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(8));
              break;
            case "events":
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Event Name</th><th>Event Date</th><th>Event Organization</th><th>Event Place</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(5));
              break;
            case "loans":
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Loan ID</th><th>Loan Type</th><th>Loan Status</th><th>Outgoing Date</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(5));
              break;
            case "restrictions":
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Restriction</th><th>Restriction Category</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(3));
              break;
            case "nomenclature":
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Term</th><th>Term Type</th><th>Level 1</th><th>Level 2</th><th>Level 3</th><th>Level 4</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(7));
              break;
            case "language":
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>English</th><th>French</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(5));
              break;
            case 'project':
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Project ID</th><th>Project Title</th><th>Project Status</th><th>Date</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(5));
              break;
            case 'incident':
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Incident ID</th><th>Reported Date</th><th>Status</th><th>Due Date</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(5));
              break;
            case 'collectioncode':
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Description</th><th>Material Type</th><th>Code List</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(5));
              break;
            case 'sites':
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Site ID</th><th>Name</th><th>Borden Number</th><th>Jurisdication</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(5));
              break;
            case 'servicedesk_summary':  // RL-2021-08-13
              html.append($('<thead><tr><th><a onclick="sort_column($(this),\'WEB_SD_SUM_REP_NO\');">Order #</a></th>' +
                                   '<th><a onclick="sort_column($(this),\'WEB_SD_SUM_REP_ID\');">Item ID</a></th>' +
                                   '<th><a onclick="sort_column($(this),\'WEB_SD_SUM_REP_NAM\');">Client</a></th>' +
                                   '<th><a onclick="sort_column($(this),\'WEB_SD_SUM_REP_RS\');"> Status</a></th>' +
                                   '<th><a onclick="sort_column($(this),\'WEB_SD_SUM_REP_TPC\');">Topic</a></th>' +
                                   '<th><a onclick="sort_column($(this),\'WEB_SD_SUM_REP_TIT\');">Title</a></th>' +
                            '</tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(6));
              break;
            case 'servicedesk':  // RL-2021-08-13
              html.append($('<thead><tr><th><a onclick="sort_column($(this),\'WEB_SD_REQ_SUM_REP_NO\');">Order #</a></th>' +
                                   '<th><a onclick="sort_column($(this),\'WEB_SD_REQ_SUM_REP_ID\');">Item ID</a></th>' +
                                   '<th><a onclick="sort_column($(this),\'WEB_SD_REQ_SUM_REP_NAM\');">Client</a></th>' +
                                   '<th><a onclick="sort_column($(this),\'WEB_SD_REQ_SUM_REP_TIT\');">Title</a></th>' +
                                   '<th><a onclick="sort_column($(this),\'WEB_SD_REQ_SUM_REP_RCS\');">Aone Status</a></th>' +
                                   '<th><a onclick="sort_column($(this),\'WEB_SD_REQ_SUM_REP_RS\');">Request Status</a></th>' +
                                   '<th><a onclick="sort_column($(this),\'WEB_SD_REQ_SUM_REP_RT\');">Topic</a></th>' +
                                   '<th><a onclick="sort_column($(this),\'WEB_SD_REQ_SUM_REP_HDL\');">Assigned To</a></th>' +
                            '</tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(8));
              break;
            case 'client_valtab':  // RL-2021-03-28
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Client #</th><th>Client Name</th><th>Organization</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(4));
              break;
            case 'servicedesk_hold':  // RL-2021-03-28
              html.append($('<thead><tr><th width="5%"><i class="fa fa-check"></i></th>' +
                                        '<th width="10%">Request #</th>' +
                                        '<th width="10%">Loc Type</th>' +
                                        '<th width="10%">Loc Code</th>' +
                                        '<th width="8%">Status</th>' +
                                        '<th width="28%">Request Title</th>' +
                                        '<th width="18%">Building</th>' +
                                        '<th width="6%">Floor</th>' +
                                        '<th width="6%">Room</th>' +
                                        '<th width="10%">Call No.</th>' +
                                        '<th width="10%">Volume</th>' +
                                   '</tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(11));
              break;
            case 'servicedesk_return':  // RL-2021-03-28
              html.append($('<thead><tr><th width="5%"><i class="fa fa-check"></i></th width="10%"><th>Order #</th width="15%"><th>Location Code</th><th width="35%">Request Title</th><th width="15%">Building code</th width="10%"><th>Floor #</th><th width="10%">Room #</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(7));
              break;
            case 'enquiries':  // RL-2021-05-20
            html.append($('<thead><tr><th width="8%"><a onclick="sort_column($(this),\'WEB_ENQ_SUM_REP_ID\');">Inquiry #</a></th>' +
                                 '<th width="13%"><a onclick="sort_column($(this),\'WEB_ENQ_SUM_REP_CLI\');">Client</a></th>' +
                                 '<th width="13%"><a onclick="sort_column($(this),\'WEB_ENQ_SUM_REP_TPC\');">Topic</a></th>' +
                                 '<th width="25%"><a onclick="sort_column($(this),\'WEB_ENQ_SUM_REP_TIT\');">Title</a></th>' +
                                 '<th width="8%"><a onclick="sort_column($(this),\'WEB_ENQ_SUM_REP_SC\');">Status</a></th>' +
                                 '<th width="8%"><a onclick="sort_column($(this),\'WEB_ENQ_SUM_REP_SDT\');">Submitted Date</a></th>' +
                                 '<th width="8%"><a onclick="sort_column($(this),\'WEB_ENQ_SUM_REP_DDT\');">Due Date</a></th>' +
                                 '<th width="8%"><a onclick="sort_column($(this),\'WEB_ENQ_SUM_REP_PRI\');">Rush</a></th>' +
                                 '<th width="8%"><a onclick="sort_column($(this),\'WEB_ENQ_SUM_REP_HDL\');">Assigned To</a></th>' +
                                 '<th width="8%"><a onclick="sort_column($(this),\'WEB_ENQ_SUM_REP_RSG\');">Reassigned To</a></th>' +
                            '</tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(9));
              break;
            case "accession_valtab":
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Accession No</th><th width="40%">Title</th><th>Location</th><th>Box No</th><th>Date(s)</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(6));
              break;
            case 'col_valtab':
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Accession</th><th>Title</th><th>Location</th><th style="text-align: left;">Contain Files</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(5));
              break;
            case 'biblio_valtab':
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Acc. #</th><th>Title</th><th>Author</th><th>ISBN/ISSN</th><th>Barcode</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(6));
              break;
            case 'collections':
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Accession</th><th>Title</th><th>Location</th><th style="text-align: left;">Contain Files</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(5));
              break;
            case 'catalogue':
              // 2021-02-12
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Acc. #</th><th>Title</th><th>Author</th><th>Cover</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(5));
              break;
            case 'client':
              html.append($('<thead><tr><th><a onclick="sort_column($(this),\'WEB_CLIENT_SUM_REP_NO\');">Client #</a></th>' +
                                   '<th><a onclick="sort_column($(this),\'WEB_CLIENT_SUM_REP_NAME\');">Client Name</a></th>' +
                                   '<th><a onclick="sort_column($(this),\'WEB_CLIENT_SUM_REP_ORG\');">Organization</a></th>' +
                                   '<th><a onclick="sort_column($(this),\'WEB_CLIENT_SUM_REP_EM\');">Email</a></th>' +
                            '</tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(4));
              break;
            case 'comments':
              html.append($('<thead><th width="25%">Item ID</th><th width="25%">Item Source</th><th width="20%">Created By</th><th width="15%">Created On</th><th width="15%">Status</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(5));
              break;
            case 'questions':
              html.append($('<thead><th width="10%">ID</th><th width="30%">Question</th><th width="30%">Category</th><th width="15%">Created On</th><th width="15%">Status</th></tr></thead>'));0
              if (data.length === 0) html.append(generateNoResultsBody(5));
              break;
            case 'sched_valtab':
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Schedule #</th><th>Title</th><th>Disposition</th><th>Adopted Date</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(5));
              break;
            case "forbiddenword":
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Forbidden Word</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(2));
              break;
            case "lookup_email_template":
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Email Template Name</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(2));
              break;
            case 'record_series':
              html.append($('<thead><tr><th width="10%"><a onclick="sort_column($(this),\'WEB_RS_SUM_REP_ID\');">ID</a></th>' +
                                   '<th width="40%"><a onclick="sort_column($(this),\'WEB_RS_SUM_REP_TIT\');">Title</a></th>' +
                                   '<th width="30%"><a onclick="sort_column($(this),\'WEB_RS_SUM_REP_AFF\');">Affiliation</a></th>' +
                                   '<th width="10%"><a onclick="sort_column($(this),\'WEB_RS_SUM_REP_ACT\');">Function</a></th>' +
                                   '<th width="10%"><a onclick="sort_column($(this),\'WEB_RS_SUM_REP_STA\');">Status</a></th>' +
                            '</tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(5));
              break;
            case "public_body_request":
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th>' +
                                       '<th>Accession No</th>' +
                                       '<th>Title</th>' +
                                       '<th>Date(s)</th>' +
                            '</tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(5));
              break;
            case 'recseries_valtab': // rl-2021-09-07
              html.append($('<thead><tr><th width="6%"><i class="fa fa-check fa-lg"></i></th>' +
                                   '<th width="8%"><a onclick="sort_column($(this),\'WEB_RS_SUM_REP_ID\');">ID</a></th>' +
                                   '<th width="40%"><a onclick="sort_column($(this),\'WEB_RS_SUM_REP_TIT\');">Title</a></th>' +
                                   '<th width="30%"><a onclick="sort_column($(this),\'WEB_RS_SUM_REP_AFF\');">Affiliation</a></th>' +
                                   '<th width="8%"><a onclick="sort_column($(this),\'WEB_RS_SUM_REP_ACT\');">Function</a></th>' +
                                   '<th width="8%"><a onclick="sort_column($(this),\'WEB_RS_SUM_REP_STA\');">Status</a></th>' +
                            '</tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(6));
              break;
            case 'schedule_val': // RL-2021-09-07
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Schedule #</th><th>Schedule Name</th><th>Disposition</th><th>Adopted Date</th></tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(5));
              break;
            case "ministry":
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th>' +
                                       '<th width="10%">Ministry ID</th>' +
                                       '<th width="90%">Ministry Name</th>' +
                            '</tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(3));
              break;
            case "ministry_valtab":
              html.append($('<thead><tr><th><i class="fa fa-check fa-lg"></i></th>' +
                                       '<th width="10%">Ministry ID</th>' +
                                       '<th width="90%">Ministry Name</th>' +
                            '</tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(3));
              break;
            case 'servicedesk_reproduction':
              html.append($('<thead><tr><th width="6%"><i class="fa fa-check fa-lg"></i></th>' +
                                   '<th width="8%"><a onclick="sort_column($(this),\'WEB_RP_SUM_REP_ID\');">Order #</a></th>' +
                                   '<th width="20%"><a onclick="sort_column($(this),\'WEB_RP_SUM_REP_CLI\');">Client</a></th>' +
                                   '<th width="8%">Item ID</a></th>' +
                                   '<th width="25%">Request Title</a></th>' +
                                   '<th width="8%"><a onclick="sort_column($(this),\'WEB_RP_SUM_REP_DDE\');">Request Date</a></th>' +
                                   '<th width="8%">Request Status</a></th>' +
                                   '<th width="8%"><a onclick="sort_column($(this),\'WEB_RP_SUM_REP_JOB\');">Rush Job</a></th>' +
                                   '<th width="20%"><a onclick="sort_column($(this),\'WEB_RP_SUM_REP_HDL\');">Assigned To</a></th>' +
                            '</tr></thead>'));
              if (data.length === 0) html.append(generateNoResultsBody(9));
              break;
            default:
              break;
          }
        }
      }

      if (data.length > 0) {
        // M2A codes
        if (database === DESCRIPTION_DBNAME || database === COLLECTIONS_NAME) {
          // RL-20211201;
          var img_tag_header = '<img src="';
          if ( search_results_metadata.image_height != '' && search_results_metadata.image_width != '' ) {
            img_tag_header = '<img style="object-fit: contain;" width="' + search_results_metadata.image_width + '" height="' + search_results_metadata.image_height + '" src="';
          }

          let resultObject = $(data)
            .children()
            .get(0).childNodes;
          let output = '<div class="row" id="grid_view" style="display:none">';
          for (let i = 0; i < resultObject.length; i++) {
            if (resultObject[i].children) {
              var tr_class = resultObject[i].className;
              if ( tr_class != null && tr_class != "sum-heading" ) {  // RL-20220131
                var image_path = "/mylang/assets/img/image-placeholder.png";
                var result = resultObject[i].querySelector("td.image-path");
                if ( result != null ) {
                  image_path = result.innerText;
                }
                var image_title = "";
                result = resultObject[i].querySelector("td.image-title");
                if ( result != null ) {
                  image_title = result.innerText;
                  if ( image_title.length > 70 ) { // RL-20220504
                    image_title = image_title.substring(0, 67) + "...";
                  }
                }

                // RL-20211201
                var image_tag = img_tag_header + image_path + '" alt="image" onError="this.onerror=null;this.src=\'/mylang/assets/img/image-placeholder.png\'">';

                var a_tag = '';
                var titleLink = resultObject[i].querySelector("td a");
                if ( titleLink != null ) {  // RL-20220131
                  a_tag = '<a href="#" onclick="getDetailedRecordDisplay(\'' + $(titleLink).attr('href') + '\',null);">' + $(titleLink).text() + '</a>';
                }

                output += '<div class="col-md-4"><div class="row" style="text-align:center">';
                output += '<div class="summary-image col-sm-12">' + image_tag + '</div>'; // RL-20211124
                if ( image_title != '' ) { // RL-20211124
                  output += '<div class="col-sm-12" style="height:60px">' + image_title + "</div>";
                }
                output += '<div class="col-sm-12" style="height:60px">' + a_tag + "</div>";
                output += "</div></div>";
              }
            }
          }

          output += "</div>";
          html.append(output);
        }

        html.append($(data).children());
      }

      multi_record.append(html);
      $('div.results_container').html(multi_record);
    }
  }  // end of populateSearchResults

  /*****
   **
   **  handleSearchStatement : returns a semi-cleaned up version of the user's search statement
   **
   **  params:
   **    - data : The user's raw search statement from MINISIS
   **
   *****/
  var handleSearchStatement = function (data) {
    return $(data).text().replace('KEYWORD_CLUSTER', '');
  };

  /*****
   **
   **  handleSearchNumbers : returns the search numbers (first result of the page, and last result of the page) as an array
   **
   **  params:
   **    - data : The raw search numbers from MINISIS
   **
   *****/
  var handleSearchNumbers = function (data) {
    return $(data).text().split(' to ');
  };

  /*****
   **
   **  handleMultiFormAction : returns a string containing the URL to POST the multi-record form to
   **
   **  params:
   **    - data : The original string returned from MINISIS, which is wrapped in double-quotes (needing to be removed)
   **
   *****/
  var handleMultiFormAction = function (data) {
    if ( $(data).text().indexOf('"') == -1 ) {
      return $(data).text();
    }

    return $(data).text().split('"')[1];
  };

  /*****
   **
   **  handlePagination : populates the pagination part of search results
   **
   **  params:
   **    - data : The raw pagination element returned from MINISIS
   **
   **  notes:
   **    - There is currently a check in here to make sure that only one set of pagination links is appended to the container
   **    - MINISIS currently returns weird and unpredictable pagination results if there are gaps in SISN ranges, so this is
   **      a necessary step at the moment to avoid having multiple pagination sets for a result set.
   **
   *****/
  var handlePagination = function (data) {
    $(data).addClass('pagination');

    $('#pagination a').off();
    if ($('.results_container').find('#pagination').length > 0) {
      $('#pagination').replaceWith(data);
    }
    else {
      $('.results_container').append(data);

      // NW-2021-03-11
      // if ($("body").hasclass("data-database") == "col_valid") {
      // if ($("body").hasClass(MULTI_SELECTION)) {  // 20211201
      //   $("form#multi_record").prepend(
      //     "<div class='loan_out_attach_submit'><a class='submit_record disabled'>Submit</a></div>"
      //   );
      // }
    }
  }

  // M2A codes
  /***************************************************************************************************************************
  **
  **  handleSort : populate selected sort category
  **
  **  params:
  **    - data : report html
  **    - database : string representing database
  **
  **  notes:
  **
  **
   ***************************************************************************************************************************/

  var handleSort = function (data, database) {
    var sort_arr = ['sort_title', 'sort_year_asc', 'sort_year_desc', 'sort_refd', 'sort_box',
                    'sort_folder' ,'sort_item', 'sort_location_asc', 'sort_location_desc', 'sort_sisn'];
    // Enter more sort fields into array
    if(database != DESCRIPTION_DBNAME && database != COLLECTIONS_NAME) {
      return;
    }

    // count sort options - RL-20211124
    var has_sort_option = false;
    if ( $(data).length > 0 ) {
      has_sort_option = true;

      $('.results_container').prepend('<div id="sort_list_container"></div>');
      $('#sort_list_container').append("<ul id='sort_ul'></ul>");
      for(i = 0; i < sort_arr.length; i++)
      {
        var sort_category = "";
        sort_category = $(data)[0].querySelector("#" + sort_arr[i]).innerHTML;
        if ( typeof sort_category != 'undefined' ) {  // RL-20211124
          $('#sort_ul').append("<li id='sort_li'>" + sort_category + "</li>");
        }
      }
    }
  }; // handleSort End

  // RL-2020-12-13 - M2A codes
  /****************************************************
  **
  **  handleFilter
  **
  **  data: is filter_results filter xml
  **
  **  description: parses xml and append filter into report page
  **
  **  css: app.css
  **
  *****************************************************/
  var handleFilter = function (data, database) {
    // M2A codes
    if (database != DESCRIPTION_DBNAME && database != COLLECTIONS_NAME) {
      return;
    }
    else {
      var filter_inner_xml = "";
      if ( $(data).find('#filter_xml').length > 0 ) {
        filter_inner_xml = $(data).find('#filter_xml')[0].innerHTML; // grab whole filter_xml
      }
      let filter_xml = "<filter_xml>\n" + filter_inner_xml + "</filter_xml>\n";

      parser = new DOMParser();
      var xml_doc = parser.parseFromString(filter_xml,"text/xml");

      var filter_tag_list = xml_doc.getElementsByTagName("filter");
      var filter_count = filter_tag_list.length;
      if ( filter_count > 0 ) {   // RL-20211124
        $('.results_container').prepend($("<div class='filter_list_container'></div>"));

        // manipulation of filter data
        for (x = 0; x < filter_count; x++) {
          var filter_group = filter_tag_list[x];//xml_doc.getElementsByTagName("filter")[x];
          var item_group_list = filter_group.getElementsByTagName("item_group");
          //item_group_list = xml_doc.getElementsByTagName("filter")[x].getElementsByTagName("item_group")
          var item_group_count = item_group_list.length;

          var filter_name = xml_doc.getElementsByTagName("filter")[x].getAttribute("name");
          var filter_title = xml_doc.getElementsByTagName("filter")[x].getAttribute("title");

          var filter_dropdown_id = "filter_dropdown";
          var newline = "";
          if ( x > 0 ) {
            filter_dropdown_id += x.toString(); // create different filter id in order to append next ul
            newline = "<br/>";
          }

          $('.filter_list_container').append($( newline + "<div class='filter_list_container_inner'><ul id='filter_ul_main'><li id='filter_li_main'><div id='filter_title'><a href='#' name='filter_title'>" + filter_title + " <i class='fa fa-caret-down'/></a></div><ul id=" + filter_dropdown_id + " style='padding-left:0;'></ul></li></ul></div>"));

          for (i = 0; i < item_group_count; i++) {
            var item_group = item_group_list[i];
            var item_value = item_group.getElementsByTagName("item_value")[0].childNodes[0].nodeValue;
            var item_frequency = item_group.getElementsByTagName("item_frequency")[0].childNodes[0].nodeValue;
            var item_link = item_group.getElementsByTagName("item_link")[0].childNodes[0].nodeValue;
            var item_selected = item_group.getElementsByTagName("item_selected")[0].childNodes[0].nodeValue;
            if ( item_selected == 'Y' ) {
              selection_sign = " - ";
            }

            if (item_value == 'X' ) {
              item_value = "Yes";
            }

            var onclick_option = "onclick='filter_search(" + '"' + item_link + '"' + ");'";
            $('#' + filter_dropdown_id).append($( "<li><a href='#' " + onclick_option + ">" + item_value + " (" + item_frequency + ") " +   "</a></li>" ));
          }
        }
      }
    }
  } // handleFilter End

  // handle third summary report
  var handle3rdReport = function (database, report) { // RL-20220311
    if ( current_page_link != '' ) {
      if ( report != null ) {
        window.location = current_page_link + '&REPORT=' + report;
      }
    }
    else {
      alert ( 'Report name is undefined.' );
    }
  }

  var database = $('body').data('database');
  var search_results_metadata = {};
  var payload;

  for (var i = 0; i < data.length; i++) {
    if ($(data[i]).attr('id') === 'query_payload') {
      payload = $(data[i]);
    }
  }

  // MH-2021-02-10
  // RL-2021-03-28 - generalize the logic for any database
  // - page options must appear before other option
  // - id of page option must start with 'size'
  // - page size specified aftr "size". for example id="size10"

  var sizeList = { 'pageOption': [] };
  var sizeOptions = $(payload).find('div[id^="size"]');
  if ( sizeOptions.length > 0 ) {
    var ix;
    for ( ix = 0 ; ix < sizeOptions.length ; ix++ ) {
      var pageSize = $(sizeOptions[ix]).attr('id').substring(4);
      var pageUrl =  $(sizeOptions[ix]).text();
      sizeList.pageOption.push({'size': pageSize, 'url': pageUrl});
    }
  }

  var multi_form_action = $(payload).find('#multi_form_action').text();
  $('li#dba_reports a').removeClass('disabled');
  searchresult = $(payload).find('#results_link').text();
  search_results_metadata.query = handleSearchStatement($(payload).find('#search_statement'));
  var search_numbers = handleSearchNumbers($(payload).find('#search_page_numbers'));
  search_results_metadata.first_result = search_numbers[0];
  search_results_metadata.last_result = search_numbers[1];
  search_results_metadata.total_results = $(payload).find('#total_results').text();

  // RL-2021-03-13
  search_results_metadata.bookmark_selective_items = $(payload).find('#bookmark_selective_items').text();
  search_results_metadata.bookmark_page_items = $(payload).find('#bookmark_page_items').text();
  search_results_metadata.bookmark_all_items = $(payload).find('#bookmark_all_items').text();
  search_results_metadata.bookmark_clear = $(payload).find('#bookmark_clear').text();
  search_results_metadata.bookmark_count = $(payload).find('#bookmark_count').text();
  if ( typeof search_results_metadata.bookmark_count == 'undefined' || search_results_metadata.bookmark_count == '' ) {
    search_results_metadata.bookmark_count = '0';
  }

  // RL-20211201
  search_results_metadata.image_height = $(payload).find('#image_height').text();
  search_results_metadata.image_width = $(payload).find('#image_width').text();
  if ( search_results_metadata.image_height == '' ) {
    search_results_metadata.image_height = '200';
  }

  if ( search_results_metadata.image_width == '' ) {
    search_results_metadata.image_width = '300';
  }

  // RL-20211207
  var own_heading = $(payload).find('#own_heading');
  search_results_metadata.no_heading = false;  // RL-20220311
  search_results_metadata.own_heading = '';
  if ( own_heading.length > 0 ) {
    if ( $(own_heading).text().toUpperCase() == 'Y' ) {
      var own_heading_text = $(own_heading).data('value');
      if ( typeof own_heading_text != 'undefined' ) {
        // convert \' characters to " character
        search_results_metadata.own_heading = own_heading_text.replace( /\\'/g, '"');
      }
    }
  }
  else { // RL-20220311
    own_heading = $(payload).find('#no_heading');
    if ( own_heading.length > 0 && $(own_heading).text().toUpperCase() == 'Y' ) {
      search_results_metadata.no_heading = true;
    }
  }

  // RL-2021-08-13
  search_results_metadata.first_page = $(payload).find('#first_page').text();
  if ( search_results_metadata.first_page != 'undefined' && search_results_metadata.first_page != '' ) {
    first_page_url = search_results_metadata.first_page;
  }
  search_results_metadata.report_spec = $(payload).find('#report_spec').text();
  if ( search_results_metadata.report_spec != 'undefined' && search_results_metadata.report_spec != '' ) {
    current_report_spec = search_results_metadata.report_spec;
  }

  // RL-2020-12-10
  search_results_metadata.current_page_url = $(payload).find("#current_page_url").text();

  search_results_metadata.multi_form_action = handleMultiFormAction($(payload).find('#multi_form_action'));

  // extract report type
  var report_type = $(payload).find('#returned_results').data("type");  // RL-20220311
  if ( typeof report_type == 'undefined' ) {
    report_type = 'list';
  }

  populateSearchResults($(payload).find('#returned_results'), database, multi_form_action, report_type,  // RL-20211201
                        search_results_metadata);

  // RL-2020-12-10
  search_results_metadata.grid_view_url = $(payload).find("#grid-view-link").text();
  search_results_metadata.list_view_url = $(payload).find("#sum_list_view").text();
  pageType = $(payload).find('#returned_results').data("type");

  search_results_metadata.columns_view_report = $(payload).find("#columns_view").text();   // RL-20220201

  // RL-2020-12-10
  handleFilter($(payload).find('#filter_results'), database); // displays filter
  handleSort($(payload).find('#sort_list'), database); // displays sort
  handlePagination($(payload).find('#pagination').first());

  populateSearchMetadata(search_results_metadata, sizeList, database ); // RL-20211124
  // MH-2021-02-10
  // populatePageOption(
  //  sizeList,   // RL-2021-03-28
  //  database,
  //   $(payload).find("#total_results").text()
  // );
  handleCheckboxes();
  initiateDynamicTriggers();

  if ($('body').hasClass('validated_search')) {
    // determine single copy or multi copy  - RL-20211201
    if ( $('body').hasClass(MULTI_SELECTION) ) {
      parent.$multi_selection = true;
      handleMultiCopyToRecord();
    }
    else {
      handleCopyToRecord();
    }
  }

  var savedType = localStorage.getItem("view");  // RL-20220311
  if ( !savedType ) {
    savedType = '';
  }

  if ( database == DESCRIPTION_DBNAME || database == COLLECTIONS_NAME ) {  // RL-20220311
    $('#grid-icon').on('click', function () {
      isList = false;
      if ( $('#collections_heading').length > 0 ) {  // RL-20211124
        $('#collections_heading').css('display', 'none');
      }
      $('#list-icon').css('color', ' #97a6b8');
      $('#columns-icon').css('color', ' #97a6b8');  // RL-20220201
      $('#grid-icon').css('color', ' black');
      $('#grid_view').css('display', 'block');
      $('#search_results tbody').css('display', 'none');
      localStorage.setItem("view", "grid");
    });
    $('#list-icon').on('click', function () {
      isList = true;
      if ( savedType == "columns" ) {  // RL-20220311
        // reload default summary report
        if ( current_page_link != '' ) {
          localStorage.setItem("view", "list");
          window.location = current_page_link + '&REPORT=$';  // REPORT =$ means default summary report
        }
        else {
          alert ( "current page link is undefined." );
        }
      }
      else {
        if ( $('#collections_heading').length > 0 ) {  // RL-20211124
          $('#collections_heading').css('display', 'block');
        }
        $('#grid-icon').css('color', ' #97a6b8');
        $('#grid-columns').css('color', ' #97a6b8');  // RL-20220201
        $('#list-icon').css('color', ' black');
        $('#grid_view').css('display', 'none');
        $('#search_results tbody').css('display', 'table-row-group');
        localStorage.setItem("view", "list");
      }
    });

    // RL-20220201
    $('#columns-icon').on('click', function () {
      if ( savedType != "columns" ) {
        isList = true;
        if ( $('#collections_heading').length > 0 ) {  // RL-20211124
          $('#collections_heading').css('display', 'none');
        }
        $('#grid-icon').css('color', ' #97a6b8');
        $('#list-icon').css('color', ' #97a6b8');
        $('#columns-icon').css('color', ' black');
        $('#grid_view').css('display', 'none');
        $('#search_results tbody').css('display', 'table-row-group');
        localStorage.setItem("view", "columns");

        // run report
        handle3rdReport(database, $('#columns-icon').data('report'));
      }
    });

    // RL-20220311
    if (savedType == '') {
      localStorage.setItem("view", "list");
    }
    else {
      if ( savedType != report_type ) {
        if (savedType === "list") {
          $("#list-icon").click();
        }
        else if (savedType === "grid") {
          $("#grid-icon").click();
        }
        else if (savedType === "columns") {  // RL-20220201
          $("#columns-icon").click();
        }
      }
    }
  }
}  // end of handleSearchResults

// RL-2021-06-21
// extract and append repeating field selection info
var appendSelectionInfo = function (xml_record, calling_field)
{
  // get TR object
  var select_group;
  var group_occ;
  var tr_object = $(calling_field).parents('tr');
  if ( tr_object.length > 0 ) {
    // get td objects
    var td_objects = $(tr_object).find('td');
    if ( td_objects.length > 0 ) {
      // for each td object
      var ix = 0;
      for ( ix = 0 ; ix < td_objects.length ; ix++ ) {
        // is data-select option defined
        select_group = null;
        if ( $(td_objects[ix]).data('select') != null ) {
          // yes, save data-select option value
          select_group = $(td_objects[ix]).data('select');
        }

        // is select tag defined
        var select_object = $(td_objects[ix]).find('select');
        if ( select_group != null && select_object.length > 0 ) {
          // yes, find selected option
          var option = $(select_object).find("option");
          $(option).each(function() {
            if ( $(this).is(':selected') ) {
              group_occ = $(this).data('occ');

              // save data-select option and data-occ option in xml record
              var xml_record_node = $(xml_record).find('record').first();
              var tempstring = '<_occinfo></_occinfo>';
              $(tempstring).appendTo(xml_record_node);
              var occ_info = $(xml_record_node).find('_occinfo').first();
              tempstring = '<groupName>' + select_group + '</groupName><groupOcc>' + group_occ + '</groupOcc>';
              $(tempstring).appendTo(occ_info);
            }
          });
        }
      }
    }
  }
}

// function saves single selected record in the parent workspace.
var handleCopyToRecord = function () {
  $('span.copy_to_record').on('click', function () {
    // RL-2021-02-27
    // The below code expects the calling function sets the following variables in the parent workspace
    // $record - the record object of target record
    // $map - the json variable for mapping fields between source record and target record
    // $parent_field_id - parent field mnemonic
    // $selected_field_value - slected field ocurrence list   // RL-20220922
    var go_ahead = true;

    // RL-20220922
    // Is selected column defined?
    var td_cell_array = $(this).parent('td');
    var selected_cloumn = $(td_cell_array).data('select-col');
    if ( typeof selected_cloumn == 'undefined' ) {
      selected_cloumn = '';
    }

    // Is duplicate check enabled?
    var source_check = $(this).parent('td').data('dupcheck');
    if ( typeof source_check !== 'undefined' ) {    // RL-20211207
      var target_check = "";
      var source_value = "";
      var target_value = "";
      if ( typeof parent.$map !== 'undefined'
      &&   typeof parent.$record !== 'undefined' ) {    // RL-20211207
        var xml_source_record = $(this).parent('td').find('xml.record_xml').first();
        var i = 0;

        // search for source link field
        for ( i = 0 ; i < parent.$map.length ; i++ ) {
          if ( parent.$map[i].key == source_check ) {
            target_check = parent.$map[i].value;
            break;
          }
        }
        if ( target_check != "" ) {
          // extract source link field
          var source_xml_obj = xml_source_record.clone();
          source_value = $(source_xml_obj).find(source_check).text();
          if ( typeof source_value == 'undefined' ) {    // RL-20211207
            source_value = "";
          }

          if ( source_value != "" ) {
            // count # of ocurrences of parent field in target record
            var numocc = parent.$record.getOccurrenceCount( parent.$parent_field_id, null );
            // for each parent occurrence
            for ( i = 1 ; i <= numocc ; i++ ) {
              // get target parent group
              var parent_group = parent.$record.getGroup(parent.$parent_field_id, i, null);

              // extract target link field
              if ( typeof parent_group !== 'undefined' ) {  // RL-20211207
                var target_field = parent.$record.getElement(target_check, 1, parent_group);
                if ( target_field == false ) {
                  target_value = "";
                }
                else {
                  target_value = target_field.text();
                }

                // compare target line field
                if ( source_value == target_value ) {
                  // if found, show message and set go_ahead flag to false
                  go_ahead = false;
                  alert ( "Record is already selected." );
                  break;
                }
              }
            }
          }
        }
      }
    }

    if ( go_ahead ) {
      // RL-20220922
      if ( selected_cloumn == 'Y' ) {
      }

      parent.$tmp_data = $(this).parent('td').find('xml.record_xml').first();
      appendSelectionInfo ( parent.$tmp_data, $(this) );  // RL-2021-06-21

     parent.$.colorbox.close();
    }
  });
};

// NW-2021-03-11 handleMultiCopyToRecord
/****************************************************
 **
 **  handleMultiCopyToRecord
 **
 **  description: creates a temp array to copy existing checked records objects in Edit Mode
 **
 **  related functions: handleCheckboxes(),
 **
 *****************************************************/
var handleMultiCopyToRecord = function () {
  let map = parent.$map;
  let parent_group_id = parent.$parent_group_id;
  console.log("Enter handleCopyToRecord()");
  // isExisted checks selected item's array to find
  function isExisted(array, xml) {
    let xmlDOM = xml[0];
    let xmlSISN = xmlDOM.getElementsByTagName("sisn")[0].innerText;

    let found = array.filter((el) => {
      let sisn = el[0].getElementsByTagName("sisn")[0].innerText;
      console.log(xmlSISN, sisn);
      return sisn === xmlSISN;
    });
    return found.length !== 0;
  }

  // function addXml adds selected items into temp array when user clicks checkbox
  function addXml(array, xml) {
    if (!isExisted(array, xml)) {
      array.push(xml);
    }
  }

  // function removeXml remove items from array when user deselects items checkbox
  function removeXml(array, xml) {
    if (isExisted(array, xml)) {
      let xmlDOM = xml[0];
      console.log("remove");
      let xmlSISN = xmlDOM.getElementsByTagName("sisn")[0].innerText;
      let result = array.filter((el) => {
        let sisn = el[0].getElementsByTagName("sisn")[0].innerText;
        return sisn !== xmlSISN;
      });
      return result;
    }
    return array;
  }

  function checkArrayLength() {
    if (parent.$tmp_data.length === 0) {
      console.log("ARRAY EMPTY");
      $("a.submit_record").addClass("disabled");
    } else {
      if ($(".submit_record").length > 0) console.log("ARRAY NOT EMPTY");
      $("a.submit_record").removeClass("disabled");
    }
    //$("form#multi_record").prepend("<a class='submit_record'>Submit</a>");
    $("a.submit_record").on("click", function () {
      parent.$is_done = true;
      parent.$multi_selection = true;
      parent.$.colorbox.close();
      console.log("Submit Record. Pagin Remove");
      sessionStorage.removeItem("pagination_checker");
    });
  }

  let isDuplicated = (xml, source_check) => {
    let target_check,
      source_value,
      target_value = "";
    if (source_check !== "undefined") {
      if (map !== "undefined" && parent.$record !== "undefined") {
        console.log(map, source_check);
        target_check = map.filter((e) => e.key === source_check)[0].value;

        if (target_check !== "") {
          source_value = xml[0].getElementsByTagName(source_check)[0].innerText;
        }
        if (source_value !== "") {
          let num_occ = parent.$record.getOccurrenceCount(
            parent_group_id,
            null
          );
          console.log(num_occ);
          for (let i = 0; i < num_occ; i++) {
            let parent_group = parent.$record.getGroup(
              parent_group_id,
              i + 1,
              null
            );
            let target_field = parent.$record.getElement(
              target_check,
              1,
              parent_group
            );
            console.log(target_field);
            if (target_field !== false) {
              target_value = target_field.text();
            }
            if (source_value === target_value) {
              return true;
            }
          }
          return false;
        }
      }
    }
    return false;
  };

  function checkTempArray(array) {
    let source_check = array[0].parent("tr").find("td").eq(0).data("dupcheck");
    console.log("Array Length: " + array.length);
    var tmparray = [];
    array.filter((el) => {
      tmparray.push(el[0].getElementsByTagName("sisn")[0].innerText);
    });

    for (i = 0; i < array.length; i++) {
      if ($("td#sisn_" + tmparray[i]).length) {
        console.log("Array " + i + ": " + tmparray[i]);
        $("td#sisn_" + tmparray[i]).addClass("selected");
        $("td#sisn_" + tmparray[i] + " i")
          .removeClass("fa-circle-o")
          .addClass("fa-check-circle");
      }
    }
  } // End checkTempArray()
  let source_check = $("td.copy_td")
    .first()
    .parent("tr")
    .find("td")
    .eq(0)
    .data("dupcheck");
  $("td.copy_td").map(function (m, e) {
    let xml = $("td.copy_td").eq(m).find("xml.record_xml").first();
    let isAttached = isDuplicated(xml, source_check);
    if (isAttached) {
      $("td.copy_td").eq(m).find("i").first().remove();
      $("td.copy_td")
        .eq(m)
        .append(
          '<i class="search_result_select fa fa-lg fa-check-circle" aria-hidden="true"></i>'
        );

      $("td.copy_td")
        .eq(m)
        .on("click", function () {
          return false;
        });
    }
  });

  // Pagination Clicked
  $("div.pagination a").mousedown(function () {
    sessionStorage.setItem("pagination_checker", true);
    let source_check = $("td.copy_td")
      .first()
      .parent("tr")
      .find("td")
      .eq(0)
      .data("dupcheck");
    console.log(source_check);
    console.log($("td.copy_td"));

    $("td.copy_td").map(function (m, e) {
      let xml = $("td.copy_td").eq(m).find("xml.record_xml").first();
      //let isTest = isDuplicated(xml, source_check);
      console.log($("td.copy_td").eq(0));
      console.log(isTest);
    });
  });

  //  Click on checkbox push element to array
  $("td.copy_td").on("click", function () {
    // parent.$tmp_data.push($(this).parent("td").find("xml.record_xml").first());
    var isChecked = $(this).hasClass("selected");
    console.log(isChecked);
    let xml = $(this).find("xml.record_xml").first();
    console.log(xml);
    let source_check = $(this).parent("tr").find("td").eq(0).data("dupcheck");

    console.log(isChecked);
    if (isChecked) {
      if (!isDuplicated(xml, source_check)) {
        addXml(parent.$tmp_data, xml);
        checkArrayLength();
      } else {
        console.log("uncheck duplicated");
        $(this).click();
      }
    } else {
      parent.$tmp_data = removeXml(parent.$tmp_data, xml);
      checkArrayLength();
    }
  });
  // NW-2021-03-24
    $('span.copy_to_record').on('click', function () {
    let el = $(this).parent('td').find('xml.record_xml').first();
    parent.$tmp_data.push(el) ;
    parent.$is_done = true;
    parent.$.colorbox.close();
  });

  // handleMultiCopyToRecord main()
  if (sessionStorage.getItem("pagination_checker")) {
    checkTempArray(parent.$tmp_data);
    checkArrayLength();
  }

}; // End handleMultiCopyToRecord


/*****
 **
 **  initiateDynamicTriggers : Initializes some event handlers for data that will be dynamically loaded from AJAX page loads
 **
 *****/
var initiateDynamicTriggers = function () {
  $('#pagination a').on('click', function (e) {
    getPaginatedSearchResults($(this).attr('href'), e);
  });

  $('table#search_results tbody a').on('click', function(e) {
    // RL-2021-03-28
    var default_action = true;
    var callback = $(this).data('callback');
    if ( callback != undefined ) {
      default_action = eval(callback + '(this);' );  // call callback function
    }

    if ( default_action ) {
      getDetailedRecordDisplay($(this).attr('href'), e);
    }
    else {
      e.preventDefault();
    }
    // RL-2021-03-28
  });

  // RL-2021-03-13 - remove bookmarked records
  $('.search_result_select').on('click', function (e) {
    // handle unselect item
    var checkbox = $(this).prev();
    // RL-2021-03-13
    if (checkbox != null ) {
      if ( $(checkbox).prop('checked') ) {
        e.preventDefault();
        bookmark_remove ( $(checkbox).val(), true );
      }
      else {
        e.preventDefault();
        bookmark_remove ( $(checkbox).val(), false );
      }
    }
  });
};

/*****
 **
 **  getDetailedRecordDisplay
 **
 *****/
var getDetailedRecordDisplay = function (url, e) {
  // RL-2020-12-10
  var popup_option = $("body").data("popup");
  if ( dialog_in_colorbox && popup_option != null && popup_option.toUpperCase() == 'Y' ) {
    if (e != null && typeof e == "object" ) {  // RL-2021-03-28, RL-20220504
      e.preventDefault();
    }

    // RL-2021-03-28
    var width = 0;
    var height = 0;
    if ( $("body").data("height") != null ) {
      height = parseInt($("body").data("height"), 10);
    }
    if ( $("body").data("width") != null ) {
      width = parseInt($("body").data("width"), 10);
    }
    showModalDialog(url, width, height );
  }
  else {
    var link_followed_normally = false;

    if (e != null && typeof e == "object") {  // RL-2021-03-28, RL-20220504
      e.preventDefault();
      link_followed_normally = true;
    }

    if ( url.toUpperCase().indexOf("?RECORD") > 0 ) {
      window.location = url;
    }
    else {
      $.get(url, function (data) {
        var payload;

        data = $.parseHTML(data);

        for (var i = 0; i < data.length; i++) {
          if ($(data[i]).attr("id") === "drd_payload") {
            payload = $(data[i]).find("xml");
          }
        }
        handleDetailedRecordDisplay(payload);
      });

      if (link_followed_normally) {
        var page_state = generateState(
          detail_record_id,
          url,
          undefined,
          undefined
        );
        history.pushState(page_state, "", url);
      }
    }
  }
}

/*****
 **
 **  handleCheckboxes : Hides browser's native checkboxes and replaces them with nicer icons
 **
 **  notes:
 **  - This also creates a binding for if a user clicks on the new icon to both toggle the native checkbox,
 **    as well as replacing the open checkbox with a filled in checkbox icon.
 **
 *****/
var handleCheckboxes = function () {
  if (pageType != "grid") {
    $('#search_results').find('input[type=checkbox]').each(function () {
      var check_container = $(this).closest('td.checkbox');
      //  RL-2021-03-28
      if ( check_container.length > 0 ) {
        var checked = $(this).data('checked');
        if ( checked != null && checked == 'Y' ) {
          // hide checkbox
          $(this).addClass('hidden');

          // insert "selected" icon
          check_container.append('<i class="search_result_select fa fa-check-circle fa-lg selected"></i>');

          // say checkbox is checked
          check_container.prop('checked',true);
        }
        else {
          $(this).addClass('hidden');
          check_container.append('<i class="search_result_select fa fa-circle-o fa-lg"></i>');
        }

        $(check_container).on('click', function () {
          $(this).toggleClass('selected');
          $(this).find('i').toggleClass('fa-circle-o').toggleClass('fa-check-circle');
          check_container.find('input[type=checkbox]').prop('checked',!check_container.find('input[type=checkbox]').prop('checked'));
          multipleRecordSelection();
        });
      }
    });
  }
};

/*****
 **
 **  getPaginatedSearchResults : handles loading a page of search results via an AJAX request
 **
 **  params:
 **    - link : The clicked link to be loaded
 **    - e : The firing event, used to prevent following a link normally
 **
 *****/
var getPaginatedSearchResults = function (link, e) {
  var link_followed_normally = false;

  if (typeof e == 'object') {
    e.preventDefault();
    link_followed_normally = true;
  }

  var get_page = $.get(link, function (data) {
    handleSearchResults($.parseHTML(data));
  });

  if (link_followed_normally) {
    var page_state = generateState('query_result', link, undefined, undefined);
    history.pushState(page_state, '', link);
  }
};

/*****
 **
 **  queryFormBooleanOperators : handles when a user clicks on the query form boolean operator buttons (AND/OR/NOT buttons in a query form)
 **
 **  params:
 **    - e : The firing event, used to prevent the button being used as a link
 **    - caller : The clicked button
 **
 *****/
var queryFormBooleanOperators = function (e, caller) {
  e.preventDefault();

  if ($(caller).hasClass('active')) {
    $(caller).parent('ul').find('.active').removeClass('active');
    $(caller).parent('ul').find('input[type=hidden]').val('');
  } else {
    $(caller).parent('ul').find('.active').removeClass('active');
    $(caller).addClass('active');
    var field_value = "";
    if ( $(caller).find('a').attr('title') != null ) {  // RL-2021-02-22
      field_value = $(caller).find('a').attr('title').toLowerCase();
    }
    $(caller).parent('ul').find('input[type=hidden]').val(field_value);
  }
};

/*****
 **
 **  enterFormSubmit : handles submitting a form when the user clicks 'enter' key
 **
 **  params:
 **    - key : The key that was pressed
 **
 *****/
var enterFormSubmit = function (key) {
  if (key.which == 13) {
    setupSearchCall(key, $('.database_search, .gc_search'), null);  // RL-2021-06-21
  } else {
    return false;
  }
};

/*****
 **
 **  getNextRecord : handles a user clicking "save and next" button from detailed report
 **
 *****/
var getNextRecord = function (e) {
  e.preventDefault();

  if (typeof additional_records !== 'undefined') {
    handleDetailedRecordDisplay(additional_records);
  } else {
    return false;
  }
};

/*****
 **
 **  generateDetailedReport : generates the HTML for a detailed record display given a record's XML data
 **
 **  params:
 **    - record_xml : An XML representation of a record, returned by MINISIS
 **
 *****/
var generateDetailedReport = function (record_xml) {
  var container_html = $('<ul class="' + detail_record_id + '" id="' + detail_record_id + '"/>');  // RL-2021-02-16

  var record = $(record_xml);
  record.children("last_modified").children().not(":last").remove();

  var num_records = 0;  // RL-2021-02-16

  $(record_xml).find('*').each(function () {
    if ($(this).children().length === 0) {
      var tag_name = $(this).prop('tagName').toUpperCase();
      // remove MARC__ from tag name
      if ( tag_name.indexOf("MARC__") == 0 ) {
        tag_name = tag_name.replace("MARC__", "");
      }
      // remove _OCCURRENCE from tag name
      var text_loc = tag_name.indexOf("_OCCURRENCE");
      if ( text_loc > 0 && tag_name.length == text_loc+11 ) {
        tag_name = tag_name.replace("_OCCURRENCE", "");
      }

      if ( tag_name == "SISN" ) {  // RL-2021-02-16
        num_records++;
      }

      var element_name = $('<dt>' + tag_name + '</dt>');
      var element_value = $('<dd>' + $(this).text() + '</dt>');
      var html = $('<li/>');
      var container = $('<dl/>');
      var blank_line = $('<br/>'); // RL-2021-02-16

      container.append(element_name);
      container.append(element_value);
      html.append(container);

      if ( num_records > 1 && tag_name == "SISN" ) {  // RL-2021-02-16
        container_html.append(blank_line);
      }

      container_html.append(html);
    }
  });

  var div_html = $('<div id="' + detail_record_id + '"/>');
  div_html.append(container_html);

  return div_html;    // container_html;
};

/*****
 **
 **  handleDetailedRecordDisplay : generates and populates a page with a record's detailed information
 **
 **  params:
 **    - record_xml : An XML representation of a record, returned by MINISIS
 **
 **  notes:
 **    - This function hides the query form, and replaces the search results with the generated HTML
 **
 *****/
var handleDetailedRecordDisplay = function (record_xml) {
  if ( record_xml == null ) {
    // if recor source, do nothing
    return;
  }

  if (record_xml.length > 1) {
    $('li#dba_save_next').find('a').removeClass('disabled');
    var tmp_record = record_xml[0];
    additional_records = [];

    for (var i = 1; i < record_xml.length; i++) {
      additional_records.push(record_xml[i]);
    }

    record_xml = tmp_record;
  } else {
    if (!$('li#dba_save_next a').hasClass('disabled')) {
      $('li#dba_save_next a').addClass('disabled');
    }

    if (typeof additional_records !== 'undefined') {
      delete additional_records;
    }
  }

  var edit_link = $(record_xml).find('edit_link').text();
  var copy_link = $(record_xml).find('copy_link').text();
  var delete_link = $(record_xml).find('delete_link').text();
  $('li#dba_edit').find('a').removeClass('disabled').attr('href', edit_link);
  $('li#dba_copy').find('a').removeClass('disabled').attr('href', copy_link); // Within li#dba_copy, find <a> and remove attribute class that contains disabled and replace with copy_link
  $('li#dba_delete').find('a').removeClass('disabled').attr('data-delete-url', delete_link);

  // 2020-12-21
  var search_link = $(record_xml).find('search_link').text();
  if ( search_link != null && search_link != "" ) {
    $('li#dba_search').find('a').removeClass('disabled').attr('href', search_link);
  }

  if (!$('li#dba_reports a').hasClass('disabled')) {
    $('li#dba_reports a').addClass('disabled');
  }

  if (!$('li#dba_global_change a').hasClass('disabled')) {
    $('li#dba_global_change a').addClass('disabled');
  }

  record_xml = $(record_xml).find('record');

  if ( record_xml.length > 1 ) {   // RL-2021-02-16
    $('li#dba_edit a').addClass('disabled');
    $('li#dba_copy a').addClass('disabled');
    $('li#dba_delete a').addClass('disabled');
  }

  // eable print icon
  var  print_a_tag = $('#dba_print a');
  if ( print_a_tag.length > 0 ) {
    print_a_tag.off();

    print_a_tag.on('click', function (e) {
      e.preventDefault();

      var doc_title = $('body').data('database');
      if ( doc_title == null ) {
        doc_title = "Document";
      }

      // print detailed records on printer - RL-2021-02-16
      if ( typeof printJS == 'function' ) {
        printJS(detail_record_id, 'html');
      }
    });
  }

  var nav_html = $('nav#database_actions');

  $('section#body div.container section.query_container').slideUp(150);
  $('section#body div.container div.results_container').html(generateDetailedReport(record_xml));
};

/*****
 **
 **  generateState : Generates a JSON object for use with `history.pushState()`
 **
 **  params:
 **    - page_type : A string containing the type of page to be loaded
 **    - title (optional) : A title to be used with the state
 **    - url : A URL to be displayed with the state
 **    - state_params : A JSON object containing any additional required state parameters (varies by page_type)
 **
 **  notes:
 **    - Valid page_type values are: 'query_form', query_result', 'detail_record_display', or 'data_entry_form'
 **
 *****/
var generateState = function (page_type, url, state_params, title) {
  if (typeof page_type == 'undefined') return false;

  var state = {};
  state.page_type = page_type;
  state.title = title || "";
  state.url = url || "";

  if (page_type === 'query_form') {
    state.serialized_form = state_params.serialized_form;
    state.form_action = state_params.form_action;
  }

  return state;
};

/*****
 **
 **  populateState : Handles directing `history.popstate` events by calling the appropriate
 **                  function to properly load content back into the window when a user clicks
 **                  back, or forward buttons
 **
 **  params:
 **    - state : A JSON object containing a page type, an optional title, and a URL
 **    - title (optional) : A title to be used with the state
 **
 *****/
var populateState = function (state) {
  switch (state.page_type) {
    case 'query_result':
      if (!$('section.query_container').is(':visible')) {
        $('section.query_container').slideDown(150);
      }
      getPaginatedSearchResults(state.url);
      break;
    case detail_record_id:
      getDetailedRecordDisplay(state.url);
      break;
    case 'query_form':
      if (!$('section.query_container').is(':visible')) {
        $('section.query_container').slideDown(150);
      }
      // RL-2020-12-10
      performSearch(state.form_action, state.serialized_form, false);
      break;
    default:
      break;
  }

  initiateDynamicTriggers();
};

var handlePopState = function (e) {
  if (e.state !== null) {
    populateState(e.state);
  }
};

// RL-2020-12-19
/*****
 **
 **  handleNewRecord
 **
 **  params:
 **    - e : The event called from the function (used to disable following the link)
 **    - calling_element : The DOM element the called for a record to be delete
 **
 *****/
var handleNewRecord = function (e, calling_element) {
  e.preventDefault();

  var new_url = $(calling_element).attr('href');
  showModalDialog( new_url, 0, 0 );
}


/*****
 **
 **  handleRecordDeletion
 **
 **  params:
 **    - e : The event called from the function (used to disable following the link)
 **    - calling_element : The DOM element the called for a record to be delete
 **
 *****/
var handleRecordDeletion = function (e, calling_element) {
  e.preventDefault();

  var delete_url = $(calling_element).data('delete-url');
  var datatype = (delete_url.toUpperCase().indexOf('&XML=Y') >= 0) ? "xml" : 'html';
  if (confirm('Are you sure you want to delete this record?  This cannot be undone.')) {
    $.ajax({
      async: true,
      type: "GET",
      dataType: datatype,
      url: delete_url,
      success: function (data) {
        var ecode = 9999;
        var show_success_message = true;
        if ( datatype == 'html' ) {
          if ( data.indexOf('"MWI-error"') >= 0 ) {
            var doc = new DOMParser().parseFromString(data, "text/xml");
            show_success_message = false;
            ecode = doc.getElementById("MWI-error").value;
            alert ( 'Unable to delete record because of error "' + ecode + '".' );
          }
        }
        else {
          if ( jQuery.isXMLDoc( data ) ) {
            var node_value = data.getElementsByTagName("error");
            if ( node_value.length > 0 ) {
              ecode = parseInt(node_value[0].childNodes[0].nodeValue, 10);
              if ( ecode != 0 ) {
                show_success_message = false;
                node_value = data.getElementsByTagName("error-message");
                if ( node_value.length > 0 ) {
                  alert ( "unable to delete record because of error " + ecode );
                }
                else {
                  alert ( "unable to delete record because of " + node_value[0].childNodes[0] );
                }
              }
            }
          }
        }
        if ( show_success_message ) {
          alert('Record has been successfully deleted.');

          // show search form
          var search_link = site_params.search_link;
          if ( search_link == undefined ) {
            $('li#dba_search').find('a').attr('href');
          }
          if ( search_link != null ) {
            if ( parent != null && popupWindow() ) {
              parent.location = search_link;
            }
            else {
              window.location = search_link;
            }
          }
        }
      },
      error: function (xhr, status, error) {
      }
    });
  }
};

/*****
 **
 **  handleReports
 **
 **  params:
 **    - e : The event called from the function (used to disable following the link)
 **    - searchresult : used to generate the URL to download a report from
 **
 *****/
var handleReports = function (e, searchresult) {
  if ( e != null ) {
    e.preventDefault();
  }

  // RL-2020-09-29
  if ( typeof searchresult == 'undefined' || searchresult == '' ) {
    var searchResultInfo = lastSearchHits();
    if ( parseInt(searchResultInfo.hits, 10) <= 0 ) {
      alert ( "Output is not generated because no record has been selected." );
    }
    else {
      searchresult = getHomeSessId() + "/" + searchResultInfo.last_expno;
    }
  }
  if ( typeof searchresult != 'undefined' && searchresult != '' ) {
    // if ($("table#search_results tbody tr").length) {
    $.colorbox({ href: '#report_chooser', inline: true, width: '800px' });

    $('#report_chooser a.button').on('click', function () {
      var url = searchresult + '?OUTPUTFILE&REPORT=' + $('#report_chooser select').val() + '&DOWNLOADPAGE=[CAMS_APP]/mylang/pdf.html';

      $.colorbox({
        href: url
      });
    });
  }
  else {
    alert ( "Output is not generated because search result information is absent." );
  }
}

// RL-2020-09-29

/*****
**
**  confirmSearch()
**
**  The function confirms to use last search result before performing operation.
**
**  params:
**    - purpose_title : operation title for prompt message
**
 *****/

var confirmSearch = function(caller_title, zero_hit_text, question_text) {
  var searchResult = lastSearchHits();
  var query_form = $('body').data('query');
  var new_search = false;
  var skip_search = false;
  var result = false;
  var customized_report_parms = eval("site_params.reports." + caller_title );
  var has_customized_query = false;

  if ( customized_report_parms != null
  &&   customized_report_parms.query != null
  &&   customized_report_parms.query !=  "" ) {
    has_customized_query = true;
  }

  if ( parseInt(searchResult.num_exps, 10) <= 0 ) {
    if ( !has_customized_query ) {
      alert ( zero_hit_text );
    }
    new_search = true;
  }
  else {
    if ( parseInt(searchResult.hits, 10) <= 0 ) {
      if ( !has_customized_query ) {
        alert ( zero_hit_text );
      }
      new_search = true;
    }
    else {
      if ( query_form == null ) {
        if ( has_customized_query ) {
          result = confirm ( question_text );
          if ( result != true ) {
            new_search = true;
          }
        }
      }
      else {
        if ( query_form != caller_title ) {
          result = confirm ( question_text );
          if ( result != true ) {
            new_search = true;
          }
        }
      }
    }
  }

  if ( new_search ) {
    var search_url = site_params.search_link;
    if ( has_customized_query ) {
      search_url = search_url + "&searchform=" + customized_report_parms.query;
    }

    // refresh search page
    window.location = search_url;
  }

  return new_search;
}


// RL-2020-09-29

/*****
**
**  handlePlanMove
**
**  params:
**    - e : The event called from the function (used to disable following the link)
**
 *****/
var handlePlanMove = function(e) {
  e.preventDefault();

  var search_database = confirmSearch ( "plan_move",
    "No record has been selected for Planned Movement.",
    "Do you want to use last search result?" );

  // calculate modal window width/height - RL-20220420
  var dialog_width = window.innerWidth - 8; // leave spaces in left and right margin
  var dialog_height = window.innerHeight - 13; // leave spaces in top and bottom margin

  if (!search_database ) {
    var url = getHomeSessId() + "?get&file=[CAMS_APP]/mylang/dataentry\\globaladd-e.html";

    $.colorbox({
      iframe: true,
      href: url,
      width: dialog_width,
      height: dialog_height,
      fastframe: true,
      onCleanup: function () {
        $.colorbox.close();
      },
      onClosed: function () {
      }
    });

    // window.open ( url, "_blank" );
  }
};

// RL-2020-09-29

/*****
**
**  handleMoveMultiObjects
**
**  params:
**    - e : The event called from the function (used to disable following the link)
**
 *****/
var handleMoveMultiObjects = function(e) {
  e.preventDefault();

  var new_search = confirmSearch ("multi_move",
    "No record has been selected for Multiple Move.",
    "Do you want to use last search result?" );

  if ( !new_search ) {
    var r = confirm("Do you want to proceed with transfer operation?");
    if ( r ) {
      var move_obj_url = getHomeSessId() + "/0?GLOBALTRANSFER&PARM_FILE=[M2A_SCRIPT]GBTRANS.PAR";

      // prepare URL to move multiple objects
      $.ajax({
          async: true,
          type: "get",
          dataType: "xml",
          url: move_obj_url,
          success: function (data) {
            if ( jQuery.isXMLDoc( data ) ) {
              var xml_value = getXmlFieldValue (data, "error_code");
              if ( xml_value != "0" ) {
                alert ( "Unable to transfer planned location because of error " + xml_value );
              }
              else {
                // extract record count
                xml_value = getXmlFieldValue (data, "record-count");
                if ( parseInt(xml_value, 10) == 0 ) {
                  alert ( "No record has been selected." );
                }
                else {
                 alert ( "Planned location in " + xml_value + " record(s) are transferred." );
                }

                // $.colorbox.close();
                window.close();
              }
            }
            else {
              var msg = "Unable to transfer planned location because result is malformed XML response.";

              if ( data == null ) {
                alert ( msg );
              }
              else {
                alert ( msg + "\n" + data );
              }
            }
          },
          error: function (xhr, status, error) {
            alert ( "Unable to transfer planned location" + "\n" + "xhr: " + xhr + '\n' + "status: " + status + '\n' + "error: " + error );
          }
      });
    }
  }
};

// RL-2020-09-29

/*****
**
**  clearSearch
**
**  params:
**    - e : The event called from the function (used to disable following the link)
**
 *****/
var clearSearch = function(e) {
  e.preventDefault();

  if ( site_params.search_link != null ) {
    // clear search session
    var url = getHomeSessId() + "/SEARCH?DBOPTION&CLEAR=Y";
    $.ajax({
      async: true,
      type: "GET",
      dataType: "html",
      url: url,
      success: function (data) {
        window.location = site_params.search_link;
      },
      error: function (xhr, status, error) {
      }
    });
  }
};

/*****
 **
 **  browseColorbox
 **
 **  params:
 **    - caller : The field calling to the function
 **
 **  notes:
 **    - This handles when a user clicks on one of the browse buttons in a query form.
 **
 *****/
var browseColorbox = function (caller) {
  var field = $(caller).parents('ul').first().find('input[type=text]').first();

  // RL-2021-03-28
  var field_name = "";
  var field_title = "";

  if ( $(caller).data('source') != undefined ) {
    field_name = $(caller).data('source');
    if ( $(caller).data('title') != undefined ) {
      field_title = $(caller).data('title');
    }
    else {
      field_title = field_name;
    }
  }
  else {
    field_name = field.attr("name");
    field_title = field
      .attr("placeholder")
      .split(" ")
      .slice(1)
      .join("%20");
  }

  var url = SESS_ID + '/FIRST?INDEXLIST&WINDOW=' + field_name + '&KEYNAME=' + field_name + '&TITLE=' + field_title;

  // calculate modal window width  - RL-2021-02-04
  var dialog_width = window.innerWidth - 8; // leave spaces in left and right margin
  var dialog_height = window.innerHeight - 13;  // leave spaces in top and bottom margin

  var colorbox_params = {
    'href': url,
    'transition': 'elastic',
    'iframe': true,
    'width': dialog_width + 'px',   // RL-2021-02-04
    'height': dialog_height + 'px', // RL-2021-02-04
    'onClosed': function () {
      if (typeof tmp_val === 'undefined') {
        return false;
      } else {
        field.val(tmp_val);
        field.change();    // RL-2021-03-28
      }
    }
  };

  $(caller).colorbox(colorbox_params);
};

/**
 *
 *
 */
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// RL-2020-12-14  - Timeout code
/*
var timeOutInMinutes = 45;//this indicates the SESSION duration
var alertTimeInMinutes = 1;//indicates how many minutes before expiration the alert should be shown

var timeOutInMilliSeconds = timeOutInMinutes * 60 * 1000;
var alerTimeInMilliSeconds = alertTimeInMinutes * 60 * 1000;
var alertStartTime = timeOutInMilliSeconds - alertTimeInMinutes;
var seconds = alertTimeInMinutes * 60;

function incrementSeconds() {
    var x = setInterval(function () {
        if (seconds > 0) {
            seconds -= 1;
            $("#time-out").html(seconds);
            $("#time-out-modal").modal("show")
        } else {
            clearInterval(x);
            $("#time-out-modal").modal("hide");
            window.location = "/m2aonline"
        }
    }, 1000)
}
var alertTimeOut = setTimeout(incrementSeconds, alertStartTime);

function extendSession(){
    clearInterval();
    clearTimeout(alertTimeOut);
     $(".modal#time-out-modal").modal("hide");

     $.ajax({
        type: "GET",
        url: getHomeSessId()+"?noaction",
        success: function (data) {
          location.reload();
        }
      });
}
**End of time out section** */

// rl-2020-09-29

/*****
 **  countXmlTag()
 **
 **  This function counts number of specified XML tag.
*****/

function countXmlTag( xml_result, xml_tag ) {
  var count = 0;

  var xml_nodes = xml_result.getElementsByTagName(xml_tag);
  if ( xml_nodes.length > 0 ) {
    count = xml_nodes.length;
  }

  return count;
}

// decode encoded XML string
function decodeHtml(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  var result = txt.value;
  if ( result.indexOf('&') >= 0 ) {
    txt.innerHTML = result;
    result = txt.value;
  }

  return result;
}

// rl-2020-09-29

/*****
 **  getXmlFieldValue()
 **
 **  This function returns the value of specified XML tag.
 **  If XML tag is not found, empty string is returned.
*****/

function getXmlFieldValue( xml_parent, xml_tag ) {
  var result = "";

  var xml_nodes = xml_parent.getElementsByTagName(xml_tag);
  if ( xml_nodes.length > 0 ) {
    result = decodeHtml(xml_nodes[0].textContent);
    if ( result == null ) {
      result = "";
    }
  }

  return result;
}

/*****
 **  getXmlFieldGroup()
 **
 **  This function returns the array of XML group tag.
 **  If XML tag is not found, null is returned.
*****/

function getXmlFieldGroup( xml_parent, xml_tag )
{
  var xml_nodes = xml_parent.getElementsByTagName(xml_tag);
  if ( xml_nodes.length > 0 ) {
    return xml_nodes;
  }

  return null;
}

/*****
 **
 **  callMwiApi
 **
 **  params:
 **    - url : MWI API command.
 **
 **  notes:
 **    - This function sends MWI API command with HTTP GET verb and waits for response.
 **
 *****/
var callMwiApi = function (url) {
  var result_data = null;

  // prepare and make Ajax call
  $.ajax({
    async: false,
    type: "GET",
    dataType: "xml",
    url: url,
    timeout: 3000,
    success: function (data) {
      if ( data == null || data == "" ) {
        result_data = "HTTP response is empty.";
      }
      else {
        result_data = data;
      }
    },
    error: function (xhr, status, error) {
      result_data = "";
      if (xhr.status === 0) {
        result_data= 'Not connect.\nVerify Network.';
      }
      else if (xhr.status == 404) {
        result_data = 'Requested page not found. [404]';
      }
      else if (xhr.status == 500) {
        result_data = 'Internal Server Error [500].';
      }
      else if (status === 'parsererror') {
        result_data = 'Requested JSON parse failed.';
      }
      else if (status === 'timeout') {
        result_data = 'Time out error.';
      }
      else if (status === 'abort') {
        result_data = 'Ajax request aborted.';
      }
      else {
        result_data = 'Uncaught Error.\n' + xhr.responseText;
      }
    }
  });

  return result_data;
};

/*****
 **
 **  save_hits
 **
 **  params:
 **    - none
 **
 **  notes:
 **    - This handles when a user clicks on the save hits button in a query form.
 **
 *****/
var save_hits = function () {
  // prompt user for hits name
  var input = "";
  var upper_input = "";
  var prompt_message = "Please enter search hits name";
  var regex_result = null;
  while ( true ) {
    input = prompt ( prompt_message, input );
    if ( input == null ) {
      input = "";
      break;
    }
    else {
      var upper_input = input.toUpperCase();

      regex_result = upper_input.match(/^[A-Z][A-Z0-9_]{0,29}$/);
      if ( regex_result != null ) {
        break;
      }
      else {
        input = upper_input;
        prompt_message = "Name is invalid.  Name must begin with an alphabet, followed up to 29 alphanumeric or underscore characters.\nPlease re-enter search hits name.";
      }
    }
  }
  if ( input != "" ) {
    var dbname = $('body').data('database');
    var url = getHomeSessId() + "/0?SAVEHITS&DIRECTORY=[M2A_DB]USERDATA&HITS_NAME=" + input;
    if ( typeof dbname != 'undefined' && dbname != "" ) {
      url = url + "&DATABASE=" + dbname;
    }
    var result = callMwiApi(url);
    if ( jQuery.isXMLDoc( result ) ) {
      var ecode_nodes = result.getElementsByTagName("error_code");
      if ( ecode_nodes.length > 0 ) {
        var first_ecode = ecode_nodes[0].childNodes[0];
        var result_code = parseInt(first_ecode.nodeValue, 10);
        if ( result_code != 0 ) {
          switch ( result_code ) {
            case 648:   // WAPPL_HITFILE_ALREADY_EXIST
              alert ( "Hits name \'" + input + "\' is already defined." );
              break;
            default:
              alert ( "Unable to save search result in hits file because error " + result_code );
              break;
          }
        }
      }
    }
    else {
      alert ( "Unable to save search result in hits file because " + result );
    }
  }
};

/*****
 **
 **  save_strategy
 **
 **  params:
 **    - none
 **
 **  notes:
 **    - This handles when a user clicks on the save strategy button in a query form.
 **
 *****/
var save_strategy = function () {
  // prompt user for strategy name
  var input = "";
  var upper_input = "";
  var prompt_message = "Please enter search strategy name";
  var regex_result = null;
  while ( true ) {
    input = prompt ( prompt_message, input );
    if ( input == null ) {
      input = "";
      break;
    }
    else {
      var upper_input = input.toUpperCase();

      regex_result = upper_input.match(/^[A-Z][A-Z0-9_]{0,29}$/);
      if ( regex_result != null ) {
        break;
      }
      else {
        input = upper_input;
        prompt_message = "Name is invalid.  Name must begin with an alphabet, followed up to 29 alphanumeric or underscore characters.\nPlease re-enter search strategy name.";
      }
    }
  }
  if ( input != "" ) {
    var url = getHomeSessId() + "/0?SAVESTRATEGY&DIRECTORY=[M2A_DB]USERDATA&STRATEGY_NAME=" + input;
    var result = callMwiApi(url);
    if ( jQuery.isXMLDoc( result ) ) {
      var ecode_nodes = result.getElementsByTagName("error_code");
      if ( ecode_nodes.length > 0 ) {
        var first_ecode = ecode_nodes[0].childNodes[0];
        var result_code = parseInt(first_ecode.nodeValue, 10);
        if ( result_code != 0 ) {
          switch ( result_code ) {
            case 650:   // WAPPL_STRATEGYFILE_ALREADY_EXIST
              alert ( "Strategy name \'" + input + "\' is already defined." );
              break;
            default:
              alert ( "Unable to save search strategy because error " + result_code );
              break;
          }
        }
      }
    }
    else {
      alert ( "Unable to save search strategy because " + result );
    }
  }
};

/*****
 **
 **  delete_hits
 **
 **  params:
 **    - none
 **
 **  notes:
 **    - This handles when a user clicks on the delete hits button in a query form.
 **
 *****/
var delete_hits = function () {
  // prompt user for hits name
  var input = "";
  var upper_input = "";
  var prompt_message = "Please enter search hits name";
  var regex_result = null;
  while ( true ) {
    input = prompt ( prompt_message, input );
    if ( input == null ) {
      input = "";
      break;
    }
    else {
      var upper_input = input.toUpperCase();

      regex_result = upper_input.match(/^[A-Z][A-Z0-9_]{0,29}$/);
      if ( regex_result != null ) {
        break;
      }
      else {
        input = upper_input;
        prompt_message = "Name is invalid.  Name must begin with an alphabet, followed up to 29 alphanumeric or underscore characters.\nPlease re-enter search hits name.";
      }
    }
  }
  if ( input != null && input != "" ) {
    var url = getHomeSessId() + "?DELETEHITS&HITS_NAME=" + input;
    var result = callMwiApi(url);
    if ( jQuery.isXMLDoc( result ) ) {
      var ecode_nodes = result.getElementsByTagName("error_code");
      if ( ecode_nodes.length > 0 ) {
        var first_ecode = ecode_nodes[0].childNodes[0];
        var result_code = parseInt(first_ecode.nodeValue, 10);
        if ( result_code != 0 ) {
          switch ( result_code ) {
            case 657:   // WAPPL_UNKNOWN_NAME
              alert ( "Hits name \'" + input + "\' is not defined." );
              break;
            default:
              alert ( "Unable to delete search hits file because error " + result_code );
              break;
          }
        }
      }
    }
    else {
      alert ( "Unable to delete search hits file because " + result );
    }
  }
};

/*****
 **
 **  delete_strategy
 **
 **  params:
 **    - none
 **
 **  notes:
 **    - This handles when a user clicks on the delete strategy button in a query form.
 **
 *****/
var delete_strategy = function () {
  // prompt user for strategy name
  var input = "";
  var upper_input = "";
  var prompt_message = "Please enter search strategy name";
  var regex_result = null;
  while ( true ) {
    input = prompt ( prompt_message, input );
    if ( input == null ) {
      input = "";
      break;
    }
    else {
      var upper_input = input.toUpperCase();

      regex_result = upper_input.match(/^[A-Z][A-Z0-9_]{0,29}$/);
      if ( regex_result != null ) {
        break;
      }
      else {
        input = upper_input;
        prompt_message = "Name is invalid.  Name must begin with an alphabet, followed up to 29 alphanumeric or underscore characters.\nPlease re-enter search strategy name.";
      }
    }
  }
  if ( input != null && input != "" ) {
    var url = getHomeSessId() + "?DELETESTRATEGY&STRATEGY_NAME=" + input;
    var result = callMwiApi(url);
    if ( jQuery.isXMLDoc( result ) ) {
      var ecode_nodes = result.getElementsByTagName("error_code");
      if ( ecode_nodes.length > 0 ) {
        var first_ecode = ecode_nodes[0].childNodes[0];
        var result_code = parseInt(first_ecode.nodeValue, 10);
        if ( result_code != 0 ) {
          switch ( result_code ) {
            case 657:   // WAPPL_UNKNOWN_NAME
              alert ( "Strategy name \'" + input + "\' is not defined." );
              break;
            default:
              alert ( "Unable to delete search strategy because error " + result_code );
              break;
          }
        }
      }
    }
    else {
      alert ( "Unable to delete search strategy because " + result );
    }
  }
};


// rl-2020-09-29

/****
 **
 ** This function shows alert message in customeised message box.
 **
***/

function customizedAlert ( message, options, callbackFunc )
{
  if ( typeof customized_alert == "undefined" ) {
    window.alert ( message );
  }
  else {
    customized_alert.alert ( message, options, callbackFunc );
  }
}


// rl-2020-09-29

/****
 **
 ** This function shows confirm message in customeised message box.
 **
***/

function customizedConfirm ( message, options )
{
  var r = false;
  var h_timeout = null;

  var selectOption = function(ok_selected) {
    r = ok_selected;
    clearTimeout(h_timeout);
  }

  if ( typeof customized_alert == "undefined" ) {
    r = window.confirm ( message );
  }
  else {
    customized_alert.confirm ( message, selectOption, options );
    h_timeout = setTimeout(function() {}, 10000);
  }

  return r;
}

// rl-2020-09-29

/****
 **
 ** This function ensures records are selected before generating report.
 **
***/

function runReportHandler ( caller )
{
  var no_record_text = "No record has been selected for " + caller.textContent + ".";
  var new_search = confirmSearch (caller.id, no_record_text,
    "Do you want to use last search result?" );

  if ( !new_search ) {
    var report_params = eval("site_params.reports." + caller.id );
    if ( report_params == null ) {
      handleReports(null);
    }
    else {
      var customized_report_parms = eval("site_params.reports." + caller.id );
      if ( customized_report_parms != null ) {
        if ( customized_report_parms.report != null
        ||   customized_report_parms.report != "" ) {
          var searchResultInfo = lastSearchHits();
          var url = getHomeSessId() + "/" + searchResultInfo.last_expno +
                    "?OUTPUTFILE&REPORT=" + customized_report_parms.report  +
                    "&DOWNLOADPAGE=[CAMS_APP]/mylang/pdf.html&USE_BOOKMARK=Y"; /* RL-2021-03-09 */
          $.colorbox({
            href: url
          });
        }
      }
    }
  }
}


// RL-2020-09-29

/*****
**
**  setupReportLink : add "click" event handler to report links
**
**  params:
**    - caller : an HTML a element
**
 *****/
var setupReportLink = function(caller) {
  var reportlink = document.getElementById(caller[0].id);
  if ( reportlink != null ) {
    reportlink.setAttribute("onclick", "runReportHandler(this);");
  }
};


// RL-2020-12-10
/**
**
**  edit record or view record in either modal dialog or current brwoser tab
**
**/
function showModalDialog( url, dialog_width, dialog_height, closeFunc ) {
  var  show_popup_flag = false;
  var  popup_option = $("body").data("popup");
  if ( popup_option != null && popup_option.toUpperCase() == 'Y' ) {
    show_popup_flag = true;
  }

  if ( dialog_in_colorbox && show_popup_flag ) {
    if ( dialog_width == null || dialog_width == 0 ) {
      // calculate modal window width
      dialog_width = window.innerWidth - 8; // leave spaces in left and right margin
    }

    if ( dialog_height == null || dialog_height == 0 ) {
      // calculate modal window height
      dialog_height = window.innerHeight - 13;  // leave spaces in top and bottom margin
    }

    already_unlocked = false;
    $popup = "Y";

    // rl-2021-03-28
    $.colorbox({
      iframe: true,
      href: url,
      transition: "elastic",
      width: dialog_width,
      height: dialog_height,
      overlayClose: false,
      title: "<span style='color:black;'>Click <i class='fa fa-times-circle-o'></i> to show summary report</span>",
      onOpen: function(){  // RL-2021-05-31
        $('body').css({ overflow: 'hidden' });
      },
      onClosed: function() {
        $('body').css({ overflow: '' });  // RL-2021-05-31
        try {
          if ( modal_skip_record_link != "" && parent.already_unlocked ) {
            modal_skip_record_link = "";
          }
        }
        catch ( err ) {
          modal_skip_record_link = "";
        }

        if ( closeFunc != null ) {
          closeFunc ( url );
        }

        if ( modal_skip_record_link != "" ) {
          // unlock record
          $.ajax({
            async: false,
            type: "GET",
            url: modal_skip_record_link,
            success: function (data) {
            },
            error: function (xhr, status, error) {
            }
          });
        }
        // parent.$.colorbox.close();

        delete parent.$popup;

        if ( edit_done ) {
          if ( parent.current_page_link != "" ) {
            parent.location = parent.current_page_link;
          }
        }
      }
    });
  }
  else {
    window.location = url;
  }
}

// RL-2020-12-10
/**
**
**  remove database links and logout link from modal dilaog
**
**/
function removeModalLinks(report_page) {
  // remove logoff link
  if ( $("a.logout").closest("li").length > 0 ) {
    dba_link = $("a.logout").closest("li")[0];
    if ( dba_link != null ) {
      dba_link.innerHTML = '';
    }
  }

  // protect non-active databases
  var db = $("body").data("database");
  if ( db != null ) {
    $('#database_selection ul li').each( function() {
      var li_element = this;
      if ( db != li_element.className ) {
        // remove li element
        li_element.innerHTML = "";
      }
    });
  }
  else {
    db = "";  // rl-2021-02-06
  }

  // remove new, edit, copy, save, reports, global change and search icon
  var dba_link = null;
  dba_link = document.getElementById('dba_new');
  if ( dba_link != null ) {
    dba_link.innerHTML = '';
  }

  var search_links = $('li[id^="dba_search"]');
  if ( search_links.length > 0 ) {
    for ( i = 0 ; i < search_links.length ; i++ ) {
      dba_link = search_links[i];
      dba_link.innerHTML = '';
    }
  }

  dba_link = document.getElementById('dba_reports');
  if ( dba_link != null ) {
    dba_link.innerHTML = '';
  }
  dba_link = document.getElementById('dba_global_change');
  if ( dba_link != null ) {
    dba_link.innerHTML = '';
  }
  dba_link = document.getElementById('dba_plan');
  if ( dba_link != null ) {
    dba_link.innerHTML = '';
  }
  dba_link = document.getElementById('dba_move');
  if ( dba_link != null ) {
    dba_link.innerHTML = '';
  }
  dba_link = document.getElementById('dba_save_next');
  if ( dba_link != null ) {
    dba_link.innerHTML = '';
  }

  if ( report_page ) {
    dba_link = document.getElementById('dba_save');
    if ( dba_link != null ) {
      dba_link.innerHTML = '';
    }
    dba_link = document.getElementById('dba_cancel');
    if ( dba_link != null ) {
      dba_link.innerHTML = '';
    }

    // RL-2021-02-06
    if ( db == DESCRIPTION_DBNAME ) {
      dba_link = document.getElementById('dba_tree');
      if ( dba_link != null ) {
        dba_link.innerHTML = '';
      }
      dba_link = document.getElementById('dba_copy');
      if ( dba_link != null ) {
        dba_link.innerHTML = '';
      }
    }
  }
  else {
    dba_link = document.getElementById('dba_delete');
    if ( dba_link != null ) {
      dba_link.innerHTML = '';
    }
    dba_link = document.getElementById('dba_edit');
    if ( dba_link != null ) {
      dba_link.innerHTML = '';
    }
    dba_link = document.getElementById('dba_copy');
    if ( dba_link != null ) {
      dba_link.innerHTML = '';
    }
    dba_link = document.getElementById('dba_tree');
    if ( dba_link != null ) {
      dba_link.innerHTML = '';
    }
  }
}

// RL-2020-12-10
/**
**
**  sumbit Modal dialog form
**
**/

function submitModalForm ( form_action, form ) {
  // prepare and make Ajax call
  var form_data = $(form).serialize();
  $.ajax({
    async: false,
    type: "POST",
    dataType: "html",
    url: form_action,
    data: form_data,
    success: function (data) {
      // convert string to DOM
      var parser = new DOMParser();
      var doc = parser.parseFromString(data, "text/html");
      var seek_field = doc.getElementById('parent_refresh_link');
      var parent_refresh_link = '';

      if ( seek_field != null ) {
        parent_refresh_link = seek_field.innerHTML;
      }

      if ( parent_refresh_link != '' ) {
        parent.location = parent_refresh_link;
        parent.$.colorbox.close();
      }
      else {
        // create document using HTML response
        document.open();
        document.write(data);

        // show dcoument
        document.close();
      }

      // say record has been changed.  summary report is refreshed upon exit colorbox
      parent.edit_done = true;
    },
    error: function (xhr, status, error) {
      alert ( "Re-edit record error " + '\n' + "xhr: " + xhr + '\n' + "status: " + status + '\n' + "error: " + error);
    }

  });
}

// RL-2020-12-10
/**
**
**  check to see whether parent window is popup record page / data entry page.
**
**/

function popupWindow()
{
  var popup = false;
  if ( parent != null ) {
    try {
      var popup_window = typeof parent.$popup;
      if ( popup_window != 'undefined' ) {
        popup = true;
      }
    }
    catch(err) {
      popup = true;
    }
  }

  return popup;
}


// RL-2021-03-28
// This function selects a value from the fast access table

function getValidatedKeyValue ( caller, target_field )
{
  var readonly_field = false;
  if ( currentAppInterface.readonly_record ) {
    readonly_field = true;
  }
  else {
    readonly_field = checkReadOnly( 'body' );
    if ( !readonly_field ) {
      readonly_field = checkReadOnly( target_field );
    }
  }

  if ( !readonly_field ) {
    var calling_database = caller.data('val-database');
    var val_field = caller.data('val-field');
    var title = caller.data('val-label');
    var url = currentAppInterface.interface_params.sessid + "/FIRST?INDEXLIST&WINDOW=" + target_field.attr('id') + "&DATABASE=" + calling_database + "&KEYNAME=" + val_field + "&TITLE=" + title;

    // calculate modal window width  - RL-2021-02-04
    var dialog_width = window.innerWidth - 8; // leave spaces in left and right margin
    var dialog_height = window.innerHeight - 13;  // leave spaces in top and bottom margin

    $(caller).colorbox({
      href: url,
      transition: "elastic",
      iframe: true,
      'width': dialog_width + 'px',   // RL-2021-02-04
      'height': dialog_height + 'px', // RL-2021-02-04
      onClosed: function () {
        if (typeof tmp_val !== 'undefined') {
          $(target_field).val(tmp_val);
          currentAppInterface.updateField($(target_field));
          $(target_field).change();
        }
      }
    });
  }
}

// RL-2020-12-21
/**
**
**  generate movement refernece number after movement date is entered.
**
**  paramerers:
**    caller -  handle of movement date
**    refno_id - HTML tag ID of movement refernece number
**
**/

function setMovementRefNo( caller, refno_id )
{
  var today = new Date();
  var numSeconds = today.getHours() * 3600 + today.getMinutes() * 60 + today.getSeconds();
  var move_ref_no = document.getElementById(refno_id);
  if ( move_ref_no != null ) {
    var ref_no = $(caller).val() + "-" + numSeconds.toString();
    move_ref_no.value = ref_no;
    $("#"+refno_id).change();
  }
}

// RL-2021-05-31
/**
**
**  toggle to show or hide div tag.
**
**  paramerers:
**    div_id -  ID of div tag to be shown/hidden
**
**/

// This function toggles the display of data section of the data entry form.
function hide_show_div( div_id )
{
  var x = document.getElementById(div_id);
  if ( x != null ) {
    if (x.style.display === "none") {
      x.style.display = "block";
    }
    else {
      x.style.display = "none";
    }
  }
}

// RL-2020-09-29
/**
**
**  call server to obtain AI value and return AI value as function return value
**
**/

function read_n_save_ai_value ( ai_scheme_name, ai_field_id )
{
  var get_ai_url = getCookie("HOME_SESSID") + "?GETAIVALUE&NAME=" + ai_scheme_name;

  $.ajax({
      async: true,
      type: "get",
      dataType: "xml",
      url: get_ai_url,
      success: function (data) {
        if ( jQuery.isXMLDoc( data ) ) {
          var xml_value = getXmlFieldValue (data, "error_code");
          if ( xml_value != "0" ) {
            alert ( "Unable to obtain Auto-Increment number because of error " + xml_value );
          }
          else {
            // extract AI value
            xml_value = getXmlFieldValue (data, "value");
            if ( xml_value != '' ) {
              // save AI value in target field
              var ai_field = document.getElementById(ai_field_id);
              if ( ai_field != null ) {
                ai_field.value = xml_value;
                $(ai_field).change();
              }
            }
          }
        }
        else {
          var msg = "Unable to obtain Auto-Increment number because result is malformed XML response.";

          if ( data == null ) {
            alert ( msg );
          }
          else {
            alert ( msg + "\n" + data );
          }
        }
      },
      error: function (xhr, status, error) {
        alert ( "Unable to obtain Auto-Increment number" + "\n" + "xhr: " + xhr + '\n' + "status: " + status + '\n' + "error: " + error );
      }
  });
}

// RL-2021-03-13

// utility function to turn on checkbox fields in the current summary page
function turn_on_checkbox(checked_status)
{
  // get list of checkbox fields
  var checkboxes = $('#multi_record').find('input[type=checkbox]');
  for ( ix = 0 ; ix < checkboxes.length ; ix++ ) {
    var checkbox_field = checkboxes[ix];
    if ( checkbox_field.name.toLowerCase().indexOf("mcheckbox_") == 0 ) {
      if ( checked_status ) {
        // turn on checkbox fields in the form
        if ( !checkbox_field.checked ) {
          $(checkbox_field).trigger("click");
          checkbox_field.checked = true;
        }
      }
      else {
        // turn off checkbox fields in the form
        if ( checkbox_field.checked ) {
          $(checkbox_field).trigger("click");
          checkbox_field.checked = false;
        }
      }
    }
  }
}

// utility function to generate bookmark text
function bookmark_text ( count )
{
  return ( '(' + count + ' bookmarks)' );
}

// utility function to update bookmark counter
function update_bookmark_count(count)
{
  var count_html = document.getElementById('bookmark_count');
  if ( count_html != null ) {
    count_html.innerHTML = bookmark_text(count);
  }
}

// bookmark selective items in the summary page
function bookmark_selective ( bookmark_url )
{
  // clone form data
  var form_data = $('#multi_record').serialize();
  var done = false;
  var max_retry = 2;
  var try_count = 0;

  while ( try_count < max_retry && !done ) {
    done = true;
    try_count++;

    // send 'post' reuqest to server to bookmark selected items in the current summary page
    $.ajax({
      async: false,
      type: "POST",
      dataType: "xml",
      url: bookmark_url,
      data: form_data,
      success: function (data) {
        var show_error = false;
        var first_child;
        var node_value;

        if ( jQuery.isXMLDoc( data ) ) {
          var nodes = data.getElementsByTagName("error");
          if ( nodes.length > 0 ) {
            first_child = nodes[0].childNodes[0];
            node_value = parseInt(first_child.nodeValue, 10);
            if ( node_value != 0 ) {
              alert ( "Unable to bookmark items because of error " + node_value );
            }
            else {
              nodes = data.getElementsByTagName("count");
              if ( nodes.length > 0 ) {
                first_child = nodes[0].childNodes[0];
                node_value = parseInt(first_child.nodeValue, 10);

                // update bookmarked item count
                update_bookmark_count(node_value);
              }
              else {
                show_error = true;
              }
            }
          }
          else {
            show_error = true;
          }
        }
        else {
          show_error = true;
        }
        if ( show_error ) {
          alert ( "Unable to bookmark items because of unknown HTTP response." );
        }
      },
      error: function (xhr, status, error) {
        if ( try_count < max_retry ) {
          done = false;
        }
        else {
          alert ( "Bookmark error " + '\n' + "xhr: " + xhr + '\n' + "status: " + status + '\n' + "error: " + error);
        }
      }
    });
  }
}

// bookmark all items in the summary page
function bookmark_page ( bookmark_url )
{
  // turn on checkbox fields
  turn_on_checkbox(true);

  // clone form data
  var form_data = $('#multi_record').serialize();

  var done = false;
  var max_retry = 2;
  var try_count = 0;

  while ( try_count < max_retry && !done ) {
    done = true;
    try_count++;

    // send reuqest to server to bookmark items in the current summary page
    $.ajax({
      async: false,
      type: "POST",
      dataType: "xml",
      url: bookmark_url,
      data: form_data,
      success: function (data) {
        var show_error = false;
        var first_child;
        var node_value;

        if ( jQuery.isXMLDoc( data ) ) {
          var nodes = data.getElementsByTagName("error");
          if ( nodes.length > 0 ) {
            first_child = nodes[0].childNodes[0];
            node_value = parseInt(first_child.nodeValue, 10);
            if ( node_value != 0 ) {
              alert ( "Unable to bookmark items because of error " + node_value );
            }
            else {
              nodes = data.getElementsByTagName("count");
              if ( nodes.length > 0 ) {
                first_child = nodes[0].childNodes[0];
                node_value = parseInt(first_child.nodeValue, 10);

                // update bookmarked item count
                update_bookmark_count(node_value);
              }
              else {
                show_error = true;
              }
            }
          }
          else {
            show_error = true;
          }
        }
        else {
          show_error = true;
        }
        if ( show_error ) {
          alert ( "Unable to bookmark items because of unknown HTTP response." );
        }
      },
      error: function (xhr, status, error) {
        if ( try_count < max_retry ) {
          done = false;
        }
        else {
          alert ( "Bookmark error " + '\n' + "xhr: " + xhr + '\n' + "status: " + status + '\n' + "error: " + error);
        }
      }
    });
  }
}

// bookmark all items in the searh result
function bookmark_all ( bookmark_url )
{
  var done = false;
  var max_retry = 2;
  var try_count = 0;

  while ( try_count < max_retry && !done ) {
    done = true;
    try_count++;

    // send reuqest to server to bookmark all items in the seatch result
    $.ajax({
      async: false,
      type: "GET",
      dataType: "xml",
      url: bookmark_url,
      success: function (data) {
        var show_error = false;
        var first_child;
        var node_value;

        if ( jQuery.isXMLDoc( data ) ) {
          var nodes = data.getElementsByTagName("error");
          if ( nodes.length > 0 ) {
            first_child = nodes[0].childNodes[0];
            node_value = parseInt(first_child.nodeValue, 10);
            if ( node_value != 0 ) {
              alert ( "Unable to bookmark items because of error " + node_value );
            }
            else {
              nodes = data.getElementsByTagName("count");
              if ( nodes.length > 0 ) {
                first_child = nodes[0].childNodes[0];
                node_value = parseInt(first_child.nodeValue, 10);

                // turn on checkbox fields
                turn_on_checkbox(true);

                // update bookmarked item count
                update_bookmark_count(node_value);
              }
              else {
                show_error = true;
              }
            }
          }
          else {
            show_error = true;
          }
        }
        else {
          show_error = true;
        }
        if ( show_error ) {
          alert ( "Unable to bookmark items because of unknown HTTP response." );
        }
      },
      error: function (xhr, status, error) {
        if ( try_count < max_retry ) {
          done = false;
        }
        else {
          alert ( "Bookmark error " + '\n' + "xhr: " + xhr + '\n' + "status: " + status + '\n' + "error: " + error);
        }
      }
    });
  }
}

// clear bookmark list of the searh result
function bookmark_clear ( bookmark_url )
{
  var done = false;
  var max_retry = 2;
  var try_count = 0;

  while ( try_count < max_retry && !done ) {
    done = true;
    try_count++;

    // send reuqest to clear bookmark list of the seatch result
    $.ajax({
      async: false,
      type: "GET",
      dataType: "xml",
      url: bookmark_url,
      success: function (data) {
        var show_error = false;
        var first_child;
        var node_value;

        if ( jQuery.isXMLDoc( data ) ) {
          var first_child;
          var node_value;
          var nodes = data.getElementsByTagName("error");
          if ( nodes.length > 0 ) {
            first_child = nodes[0].childNodes[0];
            node_value = parseInt(first_child.nodeValue, 10);
            if ( node_value != 0 ) {
              alert ( "Unable to clear bookmark items because of error " + node_value );
            }
            else {
              nodes = data.getElementsByTagName("count");
              if ( nodes.length > 0 ) {
                first_child = nodes[0].childNodes[0];
                node_value = parseInt(first_child.nodeValue, 10);
              }
              else {
                node_value = 0;
              }

              // turn off chckbox fields in the form
              turn_on_checkbox(false);

              // update bookmarked item count
              update_bookmark_count(node_value);
            }
          }
          else {
            show_error = true;
          }
        }
        else {
          show_error = true;
        }
        if ( show_error ) {
          alert ( "Unable to clear bookmark items because of unknown HTTP response." );
        }
      },
      error: function (xhr, status, error) {
        if ( try_count < max_retry ) {
          done = false;
        }
        else {
          alert ( "Bookmark error " + '\n' + "xhr: " + xhr + '\n' + "status: " + status + '\n' + "error: " + error);
        }
      }
    });
  }
}

// remove bookmarked item -
function bookmark_remove ( sisn, remove_item ) // RL-2021-03-13
{
  if ( bookmark_base_url != '' ) {
    var bookmark_url = bookmark_base_url + '&SISN=' + sisn;

    if ( remove_item ) { // RL-2021-03-13
      // replace "BOOKMARKITEM" with "REMOVEBOOKMARK"
      bookmark_url = bookmark_url.replace(/BOOKMARKITEM/i, "REMOVEBOOKMARK");
    }

    var done = false;
    var max_retry = 2;
    var try_count = 0;

    while ( try_count < max_retry && !done ) {
      done = true;
      try_count++;

      // send reuqest to remove bookmarked item
      $.ajax({
        async: false,
        type: "GET",
        dataType: "xml",
        url: bookmark_url,
        success: function (data) {
          var show_error = false;
          var first_child;
          var node_value;

          if ( jQuery.isXMLDoc( data ) ) {
            var nodes = data.getElementsByTagName("error");
            if ( nodes.length > 0 ) {
              first_child = nodes[0].childNodes[0];
              node_value = parseInt(first_child.nodeValue, 10);
              if ( node_value != 0 ) {
                alert ( "Unable to remove bookmarked item because of error " + node_value );
              }
              else {
                nodes = data.getElementsByTagName("count");
                if ( nodes.length > 0 ) {
                  first_child = nodes[0].childNodes[0];
                  node_value = parseInt(first_child.nodeValue, 10);

                  // update bookmarked item count
                  update_bookmark_count(node_value);
                }
                else {
                  show_error = true;
                }
              }
            }
            else {
              show_error = true;
            }
          }
          else {
            show_error = true;
          }
          if ( show_error ) {
            alert ( "Unable to remove bookmarked item because of unknown HTTP response." );
          }
        },
        error: function (xhr, status, error) {
          if ( try_count < max_retry ) {
            done = false;
          }
          else {
            alert ( "Bookmark error " + '\n' + "xhr: " + xhr + '\n' + "status: " + status + '\n' + "error: " + error);
          }
        }
      });
    }
  }
}

// clear bookmark if filter value is selected
function filter_search ( filter_url )
{
  // get handle of clear bookmark link
  var clear_link = $('#clear_bookark_link');
  if ( clear_link != null ) {
    clear_link.trigger('click');
  }

  window.location = filter_url;
}

// RL-2021-03-28
/* ************************************************************************ */
// function submits HTTP request to save record and calls the callback function
// after record is saved successfully. The return value is set to true if record is saved without error.
function submitFormAndCallback ( form_action, form, callback_func, callback_data, no_screen_update )
{
  var return_code = false;

  var record = currentAppInterface.app_record;

  if (typeof form_action == 'undefined' || typeof form == 'undefined') {
    return return_code;
  }
  record.prepareSubmission(undefined, $(form));

  if ( typeof record_unlocked != 'undefined' ) {
    // Is record_unlocked defined in core_interface_handleing.js
    record_unlocked = true;
  }

  if ( popupWindow() ) {
    try {
      if ( typeof parent.already_unlocked != 'undefined' ) {
        parent.already_unlocked = true;
      }
    }
    catch ( err ) {
    }
  }
  var form_data = $(form).serialize();
  $.ajax({
    async: false,
    type: "POST",
    dataType: "html",
    url: form_action,
    data: form_data,
    success: function (data) {
      if ( typeof callback_func == 'function' ) {
        callback_func ( data, callback_data );
      }

      var parser = new DOMParser();
      var doc1 = parser.parseFromString(data, "text/html");
      var mwi_error = doc1.getElementById('MWI-error');
      if ( typeof mwi_error == 'undefined' || mwi_error == null ) {
        return_code = true;
      }

      if ( !no_screen_update ) {
        // create document using HTML response
        document.open();
        document.write(data);

        // show dcoument
        document.close();
      }

      // say record has been changed. summary report is refreshed upon exit colorbox
      if ( popupWindow() ) {
        parent.edit_done = true;
      }
    },
    error: function (xhr, status, error) {
      alert ( "Re-edit record error " + '\n' + "xhr: " + xhr + '\n' + "status: " + status + '\n' + "error: " + error);
    }
  });

  return return_code;
}

// utility function extracts source names of table colums.
function getColSoruceNames ( table_field )
{
  // find <th> tag
  var th_tags = $(table_field).find('th');

  // extract data-source attribute of <td> tag
  var source_names = [];
  var i = 0;
  for ( i = 0 ; i < th_tags.length ; i++ ) {
    if ( $(th_tags[i]).data('source') == 'undefined' ) {
      source_names.push("");
    }
    else {
      source_names.push($(th_tags[i]).data('source'));
    }
  }

  return source_names;
}

// extract source values from the record object and returns them in an array
function getSourceValues ( current_record, group_id, occurrence, source_names )
{
  var source_values = [];
  var source_value = "";

  var group_parent = current_record.getGroup(group_id, occurrence, null);

  for ( i = 0 ; i < source_names.length ; i++ ) {
    source_value = "";
    if ( source_names[i] != '' ) {
      if ( source_names[i].toUpperCase() == "$OCCNUM" ) {
        source_value = occurrence.toString();
      }
      else {
        var source_field = current_record.getElement(source_names[i], 1, group_parent);
        if ( source_field != false ) {
          source_value = source_field.text();
        }
      }
      if ( typeof source_value != 'string' ) {
        source_value = '';
      }
    }
    source_values.push(source_value);
  }

  return source_values;
}
// decode web character string
function decode_string ( input_string )  // decode_string
{
  var  result_string;
  var  temp_array = [];
  var  ix;
  var  temp_ix;
  var  char_value;
  var  char_size;
  var  numchar;
  var  limit;
  var  leng;

  // undo MWI encoding
  leng = input_string.length;
  ix = 0;
  temp_ix = 0;
  while ( ix < leng ) {
    char_value = input_string.charCodeAt(ix);
    if ( get_multipler (char_value) != 0 ) {
      if ( ix+1 < leng ) {
        char_value = decode_web_char ( char_value, input_string.charCodeAt(ix+1) );
        char_size = 2;
      }
      else {
        char_value = decode_web_char ( char_value, 0 );
        char_size = 1;
      }
    }
    else {
      char_value = decode_web_char ( char_value, 0 );
      char_size = 1;
    }

    if ( char_value != -1 ) {
      temp_array[temp_ix] = char_value;
      temp_ix++;
    }
    ix += char_size;
  }

  // undo MINISIS encoding
  leng = temp_ix;
  numchar = (leng- 1) / 2;
  limit = temp_array[leng-1] - 65;   // 65 = "A"
  if ( limit != numchar ) {
    result_string = input_string;
  }
  else {
    limit = Math.floor(limit/2);
    temp_ix = ((numchar-1) * 2);
    for ( ix = 0 ; ix < limit ; ix++ ) {
      // swap character
      char_value = temp_array[ix*2];
      temp_array[ix*2] = temp_array[temp_ix];
      temp_array[temp_ix] = char_value;
      temp_ix -= 2;
    }

    result_string = "";
    for ( ix = 0 ; ix < numchar ; ix++ ) {
      // convert two byte value to one byte value
      char_value = temp_array[ix*2] - (ix * 2) - 1 - 48;  // 48 = "0"
      char_value += (temp_array[ix*2+1] - (ix * 2) - 2 - 48) * 16;  // 48 = "0"
      result_string = result_string + String.fromCharCode(char_value);
    }
  }

  return result_string;
}

// map multipler symbol character to multipler value
function get_multipler ( char_value )
{
  if ( char_value == 124 ) {         // "|"
    return 62;
  }
  else if ( char_value == 63 ) {     // "?"
    return 124;
  }
  else if ( char_value == 64 ) {     // "@"
    return 186;
  }
  else if ( char_value == 91 ) {     // "["
    return 248;
  }

  return 0;
}

// decode base62 web character to base256 character
function decode_web_char ( char1, char2 )   // decode_web_char
{
  var    char_value = -1;

  var multipler = get_multipler ( char1 );
  if ( multipler != 0 ) {
    char_value = map_web_char ( char2 );
    if ( char_value >= G_MAX_BYTE2_VALUE ) {
      char_value = -1;
    }
    if ( char_value != -1 ) {
      char_value += multipler;
    }
  }
  else {
    char_value = map_web_char ( char1 );
  }

  return char_value;
}

// map base62 character code to base256 character code
function map_web_char ( web_char )   // map_web_char
{
  var base256_charvalue;

  if ( web_char >= 48 && web_char <= 57 ) {  // 0-9
    // code range 0-9
    base256_charvalue = web_char - 48;
  }
  else if ( web_char >= 65 && web_char <= 90 ) {   // A-Z
    // code range 10-35
    base256_charvalue = 10 + (web_char - 65);
  }
  else if ( web_char >= 97 && web_char <= 122 ) {  // a-z
    // code range 36-61
    base256_charvalue = 36 + (web_char - 97);
  }
  else {
    // invalid base-62 characters
    base256_charvalue = -1;
  }

  return base256_charvalue;
}

// get MWI access token
function getAccessToken()
{
  var mwi_access_token = getCookie ('MWI_ACCESS_TOKEN');
  var access_token = '';
  if ( mwi_access_token != '' ) {
    var token = mwi_access_token.split(']');
    if ( token.length > 1 ) {
      access_token = decode_string ( token[1] );
    }
  }

  return access_token;
}


/*******************
 *
 *
 *  Web Page Main Line - RL-2020-09-29
 *
 *
 *******************/
var customized_alert = null;

$(document).ready(function () {
  // RL-2020-09-29
  var linemode_count = 0;

  // RL-2020-09-29
  // create customized alert and confirm function
  if ( typeof customAlert == 'function' ) {
    customized_alert = new customAlert(false);
  }

  var messages = new Messages();
  messages.init();

  /* M2A codes
  // Session Expiration Timer
  var checker = getCookie("M2AONLINE");
  if (checker != undefined && checker.length > 0) {
    loggedIn = true
  }
  else {
    loggedIn = false
  }

  var APPLID = getCookie("$APPL");
  var HOME_SESSID = getHomeSessId();

  if (loggedIn === true) {
    $("a#logOutButton").show();
    $("a#logInButton").hide();
  }
  else {
    $("a#logOutButton").hide();
    $("a#logInButton").show();
  }
  // Session Expiration Timer End
  */

  // "span#m2a_username").text(getUserName());
  $('span#m2a_username').text(getUserName());  // M3-2020-12-14 - M3 codes
  $('a.key_search').on('click', function () { toggleSimpleAdvancedSearch(); });
  $('a.line_search').on('click', function () { toggleLineMode(); });
  $('a.hide_search').on('click', function () { hideSearch($(this)); });

  // THESE TWO NEED FIXING:
  $('a.submit_search').on('click', function (e) { setupSearchCall(e, $('.database_search, .gc_search'), null); });
  $('.database_search').on('submit', function (e) { setupSearchCall(e, $(this), null); });

  // Good from here:
  $('.query_form ul').on('click', 'li:lt(3)', function (e) { queryFormBooleanOperators(e, $(this)); });
  $('.query_form input').on('keypress', function (e) { enterFormSubmit(e); });
  $('#dba_delete a').on('click', function (e) { handleRecordDeletion(e, $(this)); });
  $('#dba_save_next a').on('click', function (e) { getNextRecord(e); });
  // RL-2021-06-24
  if ( $('a.db_new').length <= 0 ) {
    $('#dba_new a').on('click', function (e) { handleNewRecord(e, $(this)); });
  }
  else {
    $('a.db_new').on('click', function (e) {
      handleNewRecord(e, $(this));
    });
  }
  // RL-2020-09-29
  if ( $('a.db_report').length <= 0 ) {
    $('#dba_reports a').on('click', function (e) { handleReports(e); });
  }
  else {
    $('a.db_report').each(function() {setupReportLink($(this)); });
  }
  $('a.browse').on('click', function (e) { e.preventDefault(); browseColorbox($(this)); });
  // $("a.field_select").on("click", function (e) { e.preventDefault(); fieldSelectColorbox($(this));  }); // mike-2021-02-03 Added for field selections
  $('#dba_plan a').on('click', function(e) { handlePlanMove(e); });                  // rl-2020-09-29
  $('#dba_move a').on('click', function(e) { handleMoveMultiObjects(e); });          // rl-2020-09-29

  $("a.save_hits").on("click", function (e) {
    save_hits();
  });
  $("a.save_strategy").on("click", function (e) {
    save_strategy();
  });
  $("a.delete_hits").on("click", function (e) {
    delete_hits();
  });
  $("a.delete_strategy").on("click", function (e) {
    delete_strategy();
  });
  $('a.clear_search').on('click', function(e) {
    clearSearch(e);
  });

  // RL-2021-05-31
  // clear search values
  $('a.reset_search').on('click', function(e) {
    var objs = $(body).find('.database_search');
    if ( objs.length > 0 ) {
      objs[0].reset();
    }
  });


  window.onpopstate = handlePopState;

  setActiveDatabase();
  loadedSearchInNewWindow();
  loadedDetailedReportInNewWindow();
  // RL-2020-12-10
  toggleNavIcon();
});

// handle sorting on clumn
function sort_column ( calling_field, report_spec_prefix )
{
  var no_results = $('body').find('.no_results');

  // Is no_result message defined?
  if ( no_results.length <= 0 ) {
    // yes, sort data
    var report_spec = '';
    var current_order = false;
    var pos;

    if ( current_report_spec.length > 0 ) {
      if ( current_report_spec.indexOf(report_spec_prefix) == -1 ) {
        current_order = false;
      }
      else {
        pos = current_report_spec.indexOf("_ASC");
        if ( pos > 0 && pos+4 == current_report_spec.length ) {  // current is ascending report
          current_order = true;
        }
        else {
          pos = current_report_spec.indexOf("_DSC");
          if ( pos > 0 && pos+4 == current_report_spec.length ) {  // curent is descending report
            current_order = false;
          }
        }
      }

      if ( current_order ) {
        // switch to descending report
        report_spec = report_spec_prefix + "_DSC";
      }
      else {
        // switch to ascending report
        report_spec = report_spec_prefix + "_ASC";
      }
    }
    else {
      report_spec = report_spec_prefix + "_ASC";
    }

    // refresh screen with sorted summary page
    if ( report_spec != '' ) {
      var url = first_page_url + "&SHOWSINGLE=Y&KEEP=Y&REPORT=" + report_spec;
      window.location = url;
    }
  }
}
