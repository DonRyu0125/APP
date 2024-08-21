
// declare application-dependent constants
const SITE_ROOT_PATH          = "https://m2auat.minisisinc.com";
const SITE_MEDIA_FOLDER       = "media";
const MEDIA_VD_NAME           = '[MEDIA]';
const DEFAULT_MEDIA_PATH      = "f:\\minisis\\cams\\media\\";
const DEFAULT_MEDIA_WEB_PATH  = "/" + SITE_MEDIA_FOLDER + "/";
const UPLOAD_HTML_FILE        = "[cams_app]\\144\\upload.html";
const IMAGE_GROUP             = 'a_im_ref_grp';
const NOIMAGE_WWW_PATH        = '/144/assets/img/image-placeholder.png';
const DEFAULT_APP_DBNAME      = 'accession';
const MWI_LANG_ID             = '/144/';
const PDF_DOWNLOAD_PAGE       = '[cams_app]\\144\\pdf.html';
const HIT_STRATEGY_PATH       = "[M2A_DB]";

const valid_text_file_types   = '';
const valid_image_file_types  = 'bmp;jpg;png';
const valid_audio_file_types  = '';
const valid_video_file_types  = '';
const valid_misc_file_types   = '';

// application dependent variables
var image_mnemonic            = 'a_im_access';
var c_cur_code_mnemonic       = 'c_cur_code';
var moved_flag_mnemonic       = 'moved_flag';
var planned_loc_grp_mnemonic  = 'planned_loc_grp';
var curators_code_mnemonic    = 'curators_code';
var current_loc_info_mnemonic = 'current_loc_info';

var tree_direct_edit          = true;     // RL-20230330  
var tree_parm_file            = "[CAMS_M2A_SCRIPT]m2a_tree.par";  // RL-20230330

var app_config =
{
  // extract from *_base_scripts.html
  'reports' :
  {
    'xxx'  : { 'query': '',  'report': '' }
  },

  // extract from core_dataentry_scripts.html
  "tdr_parms" :
  {
    "username":           "|2s|2w|6yx|0y|3|5|4u|6u|5|B",
    "userpassword":       "|Fs|Bx|Kv|7x|4z|8|3|1|7|0|5x|7u|Bt|Eu|G|F",
    "tdr_api":            "https://titanapi.minisisinc.com",
    "tdr_ui":             "https://titan.minisisinc.com",
    "login_endpoint":     "/token",
    "search_endpoint":    "/#/discover",
    "bookmark_endpoint":  "/api/Discover/BookmarkLinks",
    "delete_bookmark_ep": "/api/Discover/Bookmarks"
  },

  "databases":
  {
    "sample":
    {
      'database' : 'sample',
      'dup_field_list' :
      {
        'dup_schedule' : [
                           'SAMPLE'
                         ]
      }
    }  // end of "sample"
  }
};

// setTableHeadingLine returns the table heading line of summary report
// developer updates this function when new database summary report is added.
function setTableHeadingLine ( database )
{
  var result = {};
  result.numColums = 0;
  result.headingLine = "";

  switch (database) {
   // case "accession":
      // result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Accession No</th><th>Title</th><th>Date(s)</th></tr></thead>';
      // result.numColums = 5;
      // break;
    case "acc_valid":
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Accession No</th><th>Title</th><th>Location</th><th>Date(s)</th><th>Box No</th></tr></thead>';
      result.numColums = 6;
      break;
    case "description":
      result.numColums = 5;
      break;
    case "des_valid":
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Reference code</th><th>Barcode</th><th>Title</th><th>Level</th><th>Date(s)</th></tr></thead>';
      result.numColums = 6;
      break;
    case "people":
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Person ID</th><th>Full Name</th><th>Date of Birth</th><th>Date of Death</th></tr></thead>';
      result.numColums = 5;
      break;
    case "organizations":
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Organization ID</th><th>Organization Name</th><th>City</th></tr></thead>';
      result.numColums = 4;
      break;
    case 'properties':
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Property ID</th><th>Property Name</th><th>City</th></tr></thead>';
      result.numColums = 4;
      break;
    case 'buildings':
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Building ID</th><th>Building Name</th><th>City</th></tr></thead>';
      result.numColums = 4;
      break;
    case "locations":
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Location Code</th><th>Location Type</th><th>Building</th><th>Container ID</th></tr></thead>';
      result.numColums = 5;
      break;
    case "artlocations": // KN 2022-05-28
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Location Code</th><th>Building</th><th>Room</th><th>Unit</th><th>Shelf</th><th>Container</th></tr></thead>';
      result.numColums = 8;
      break;
    case "events":
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Event Name</th><th>Event Date</th><th>Event Organization</th><th>Event Place</th></tr></thead>';
      result.numColums = 5;
      break;
    case "loans":
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Loan ID</th><th>Loan Type</th><th>Loan Status</th><th>Outgoing Date</th></tr></thead>';
      result.numColums = 5;
      break;
    case "restrictions":
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Restriction</th><th>Restriction Category</th></tr></thead>';
      result.numColums = 3;
      break;
    case "nomenclature":
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Term</th><th>Term Type</th><th>Level 1</th><th>Level 2</th><th>Level 3</th><th>Level 4</th></tr></thead>';
      result.numColums = 7;
      break;
    case "language":
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>English</th><th>French</th></tr></thead>';
      result.numColums = 5;
      break;
    case 'project':
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Project ID</th><th>Project Title</th><th>Project Status</th><th>Date</th></tr></thead>';
      result.numColums = 5;
      break;
    case 'incident':
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Incident ID</th><th>Reported Date</th><th>Status</th><th>Due Date</th></tr></thead>';
      result.numColums = 5;
      break;
    case 'collectioncode':
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Description</th><th>Material Type</th><th>Code List</th></tr></thead>';
      result.numColums = 5;
      break;
    case 'sites':
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Site ID</th><th>Name</th><th>Borden Number</th><th>Jurisdication</th></tr></thead>';
      result.numColums = 5;
      break;
    case 'servicedesk_summary':  // RL-2021-08-13
      result.headingLine = '<thead><tr><th><a onclick="sort_column($(this),\'WEB_SD_SUM_REP_NO\');">Order #</a></th>' +
                           '<th><a onclick="sort_column($(this),\'WEB_SD_SUM_REP_ID\');">Item ID</a></th>' +
                           '<th><a onclick="sort_column($(this),\'WEB_SD_SUM_REP_NAM\');">Client</a></th>' +
                           '<th><a onclick="sort_column($(this),\'WEB_SD_SUM_REP_RS\');"> Status</a></th>' +
                           '<th><a onclick="sort_column($(this),\'WEB_SD_SUM_REP_TPC\');">Topic</a></th>' +
                           '<th><a onclick="sort_column($(this),\'WEB_SD_SUM_REP_TIT\');">Title</a></th>' +
                           '</tr></thead>';
      result.numColums = 6;
      break;
    case 'servicedesk':  // RL-2021-08-13
      result.headingLine = '<thead><tr><th><a onclick="sort_column($(this),\'WEB_SD_REQ_SUM_REP_NO\');">Order #</a></th>' +
                           '<th><a onclick="sort_column($(this),\'WEB_SD_REQ_SUM_REP_ID\');">Item ID</a></th>' +
                           '<th><a onclick="sort_column($(this),\'WEB_SD_REQ_SUM_REP_NAM\');">Client</a></th>' +
                           '<th><a onclick="sort_column($(this),\'WEB_SD_REQ_SUM_REP_TIT\');">Title</a></th>' +
                           '<th><a onclick="sort_column($(this),\'WEB_SD_REQ_SUM_REP_RCS\');">Aone Status</a></th>' +
                           '<th><a onclick="sort_column($(this),\'WEB_SD_REQ_SUM_REP_RS\');">Request Status</a></th>' +
                           '<th><a onclick="sort_column($(this),\'WEB_SD_REQ_SUM_REP_RT\');">Topic</a></th>' +
                           '<th><a onclick="sort_column($(this),\'WEB_SD_REQ_SUM_REP_HDL\');">Assigned To</a></th>' +
                           '</tr></thead>';
      result.numColums = 8;
      break;
    case 'client_valtab':  // RL-2021-03-28
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Client #</th><th>Client Name</th><th>Organization</th></tr></thead>';
      result.numColums = 4;
      break;
    case 'servicedesk_hold':  // RL-2021-03-28
      result.headingLine = '<thead><tr><th width="5%"><i class="fa fa-check"></i></th>' +
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
                                '</tr></thead>';
      result.numColums = 11;
      break;
    case 'servicedesk_return':  // RL-2021-03-28
      result.headingLine = '<thead><tr><th width="5%"><i class="fa fa-check"></i></th width="10%"><th>Order #</th width="15%"><th>Location Code</th><th width="35%">Request Title</th><th width="15%">Building code</th width="10%"><th>Floor #</th><th width="10%">Room #</th></tr></thead>';
      result.numColums = 7;
      break;
    case 'enquiries':  // RL-2021-05-20
      result.headingLine = '<thead><tr><th width="8%"><a onclick="sort_column($(this),\'WEB_ENQ_SUM_REP_ID\');">Inquiry #</a></th>' +
                           '<th width="13%"><a onclick="sort_column($(this),\'WEB_ENQ_SUM_REP_CLI\');">Client</a></th>' +
                           '<th width="13%"><a onclick="sort_column($(this),\'WEB_ENQ_SUM_REP_TPC\');">Topic</a></th>' +
                           '<th width="25%"><a onclick="sort_column($(this),\'WEB_ENQ_SUM_REP_TIT\');">Title</a></th>' +
                           '<th width="8%"><a onclick="sort_column($(this),\'WEB_ENQ_SUM_REP_SC\');">Status</a></th>' +
                           '<th width="8%"><a onclick="sort_column($(this),\'WEB_ENQ_SUM_REP_SDT\');">Submitted Date</a></th>' +
                           '<th width="8%"><a onclick="sort_column($(this),\'WEB_ENQ_SUM_REP_DDT\');">Due Date</a></th>' +
                           '<th width="8%"><a onclick="sort_column($(this),\'WEB_ENQ_SUM_REP_PRI\');">Rush</a></th>' +
                           '<th width="8%"><a onclick="sort_column($(this),\'WEB_ENQ_SUM_REP_HDL\');">Assigned To</a></th>' +
                           '<th width="8%"><a onclick="sort_column($(this),\'WEB_ENQ_SUM_REP_RSG\');">Reassigned To</a></th>' +
                           '</tr></thead>';
      result.numColums = 9;
      break;
    case "accession_valtab":
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Accession No</th><th width="40%">Title</th><th>Location</th><th>Box No</th><th>Date(s)</th></tr></thead>';
      result.numColums = 6;
      break;
    case 'col_valtab':
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Accession</th><th>Title</th><th>Location</th><th style="text-align: left;">Contain Files</th></tr></thead>';
      result.numColums = 5;
      break;
    case 'biblio_valtab':
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Acc. #</th><th>Title</th><th>Author</th><th>ISBN/ISSN</th><th>Barcode</th></tr></thead>';
      result.numColums = 6;
      break;
    case 'collections':
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Accession</th><th>Title</th><th>Location</th><th style="text-align: left;">Contain Files</th></tr></thead>';
      result.numColums = 5;
      break;
    case 'client':
      result.headingLine = '<thead><tr><th><a onclick="sort_column($(this),\'WEB_CLIENT_SUM_REP_NO\');">Client #</a></th>' +
                           '<th><a onclick="sort_column($(this),\'WEB_CLIENT_SUM_REP_NAME\');">Client Name</a></th>' +
                           '<th><a onclick="sort_column($(this),\'WEB_CLIENT_SUM_REP_ORG\');">Organization</a></th>' +
                           '<th><a onclick="sort_column($(this),\'WEB_CLIENT_SUM_REP_EM\');">Email</a></th>' +
                           '</tr></thead>';
      result.numColums = 4;
      break;
    case 'comments':
      result.headingLine = '<thead><th width="25%">Item ID</th><th width="25%">Item Source</th><th width="20%">Created By</th><th width="15%">Created On</th><th width="15%">Status</th></tr></thead>';
      result.numColums = 5;
      break;
    case 'questions':
      result.headingLine = '<thead><th width="10%">ID</th><th width="30%">Question</th><th width="30%">Category</th><th width="15%">Created On</th><th width="15%">Status</th></tr></thead>';
      result.numColums = 5;
      break;
    case 'sched_valtab':
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Schedule #</th><th>Title</th><th>Disposition</th><th>Adopted Date</th></tr></thead>';
      result.numColums = 5;
      break;
    case "forbiddenword":
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Forbidden Word</th></tr></thead>';
      result.numColums = 2;
      break;
    case "lookup_email_template":
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Email Template Name</th></tr></thead>';
      result.numColums = 2;
      break;
    case 'record_series':
      result.headingLine = '<thead><tr><th width="10%"><a onclick="sort_column($(this),\'WEB_RS_SUM_REP_ID\');">ID</a></th>' +
                           '<th width="40%"><a onclick="sort_column($(this),\'WEB_RS_SUM_REP_TIT\');">Title</a></th>' +
                           '<th width="30%"><a onclick="sort_column($(this),\'WEB_RS_SUM_REP_AFF\');">Affiliation</a></th>' +
                           '<th width="10%"><a onclick="sort_column($(this),\'WEB_RS_SUM_REP_ACT\');">Function</a></th>' +
                           '<th width="10%"><a onclick="sort_column($(this),\'WEB_RS_SUM_REP_STA\');">Status</a></th>' +
                    '</tr></thead>';
      result.numColums = 5;
      break;
    case "public_body_request":
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th>' +
                           '<th>Accession No</th>' +
                           '<th>Title</th>' +
                           '<th>Date(s)</th>' +
                           '</tr></thead>';
      result.numColums = 5;
      break;
    case 'recseries_valtab': // rl-2021-09-07
      result.headingLine = '<thead><tr><th width="6%"><i class="fa fa-check fa-lg"></i></th>' +
                           '<th width="8%"><a onclick="sort_column($(this),\'WEB_RS_SUM_REP_ID\');">ID</a></th>' +
                           '<th width="40%"><a onclick="sort_column($(this),\'WEB_RS_SUM_REP_TIT\');">Title</a></th>' +
                           '<th width="30%"><a onclick="sort_column($(this),\'WEB_RS_SUM_REP_AFF\');">Affiliation</a></th>' +
                           '<th width="8%"><a onclick="sort_column($(this),\'WEB_RS_SUM_REP_ACT\');">Function</a></th>' +
                           '<th width="8%"><a onclick="sort_column($(this),\'WEB_RS_SUM_REP_STA\');">Status</a></th>' +
                    '</tr></thead>';
      result.numColums = 6;
      break;
    case 'schedule_val': // RL-2021-09-07
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th><th>Schedule #</th><th>Schedule Name</th><th>Disposition</th><th>Adopted Date</th></tr></thead>';
      result.numColums = 5;
      break;
    case "ministry":
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th>' +
                           '<th width="10%">Ministry ID</th>' +
                           '<th width="90%">Ministry Name</th>' +
                           '</tr></thead>';
      result.numColums = 3;
      break;
    case "ministry_valtab":
      result.headingLine = '<thead><tr><th><i class="fa fa-check fa-lg"></i></th>' +
                           '<th width="10%">Ministry ID</th>' +
                           '<th width="90%">Ministry Name</th>' +
                           '</tr></thead>';
      result.numColums = 3;
      break;
    case 'servicedesk_reproduction':
      result.headingLine = '<thead><tr><th width="6%"><i class="fa fa-check fa-lg"></i></th>' +
                           '<th width="8%"><a onclick="sort_column($(this),\'WEB_RP_SUM_REP_ID\');">Order #</a></th>' +
                           '<th width="20%"><a onclick="sort_column($(this),\'WEB_RP_SUM_REP_CLI\');">Client</a></th>' +
                           '<th width="8%">Item ID</a></th>' +
                           '<th width="25%">Request Title</a></th>' +
                           '<th width="8%"><a onclick="sort_column($(this),\'WEB_RP_SUM_REP_DDE\');">Request Date</a></th>' +
                           '<th width="8%">Request Status</a></th>' +
                           '<th width="8%"><a onclick="sort_column($(this),\'WEB_RP_SUM_REP_JOB\');">Rush Job</a></th>' +
                           '<th width="20%"><a onclick="sort_column($(this),\'WEB_RP_SUM_REP_HDL\');">Assigned To</a></th>' +
                           '</tr></thead>';
      result.numColums = 9;
      break;
    default:
      break;
  }

  return result;
}
