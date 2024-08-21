// igmore data entry field mnemonics - data entry module ignores changes
// of specified fields
var ignored_mnemonics = ['fullname',
                         'fullname2',
                         'accession_number2',
                         'lo_items_missing'];

var customized_interface_params = {
  // declare MWI command parameter line of authority view link
  'valtable_view_links': {
    'm2a': '/DES_VALTAB/WEB_VALTABLE_DET_REP/REFD%20%3D%3D%20',
    'acc': '/ACC_VALTAB/WEB_VALTABLE_DET_REP/ACCNO%20%3D%3D%20',
    'enq': '/M2A_ENQUIRIES/WEB_VALTABLE_DET_REP/ENQUIRY_NUMBER%20%3D%3D%20',
    'project': '/M2A_PROJECT/WEB_VALTABLE_DET_REP/PROJECT_ID%20%3D%3D%20',
    'incident': '/M2A_INCIDENT/WEB_VALTABLE_DET_REP/INC_ID%20%3D%3D%',
    'prop': '/M2A_PROPERTIES/WEB_VALTABLE_DET_REP/PD_PROPERTY_NO%20%3D%3D%20',
    'bldg': '/M2A_BLDG_VALTAB/WEB_VALTABLE_DET_REP/BD_BUILDING_NO%20%3D%3D%20',
    'org': '/M2A_ORGANIZATIONS/WEB_VALTABLE_DET_REP/ORG_ID%20%3D%3D%20',
    'people': '/M2A_PEOPLE/WEB_VALTABLE_DET_REP/PERSON_ID%20%3D%3D%20',
    'loc': '/M2A_LOCATIONS/WEB_VALTABLE_DET_REP/CURATORS_CODE%20%3D%3D%20',
    'sites': '/M2A_SITES/WEB_VALTABLE_DET_REP/GEO_SITE_ID%20%3D%3D%20',
    'loans': '/M2A_LOAN_OUT/WEB_VALTABLE_DET_REP/LO_ID%20%3D%3D%20',
    'schedule': '/SCHED_VALTAB/WEB_VALTABLE_DET_REP/SCHEDULE_ID%20%3D%3D%20', // RL-2021-07-04
    'restrictions': '/M2A_RES_VALTAB/WEB_VALTABLE_DET_REP/REST_ID%20%3D%3D%20',
    'client': '/CLIENT_VALTAB/WEB_CLIENT_VALTABLE_DET_REP/C_CLIENT_NUMBER%20%3D%3D%20',  // RL-2021-03-28
    'accession': '/ACCESSION_VALTAB/WEB_VALTABLE_DET_REP/ACCNO%20%3D%3D%20',  // RL-2021-03-28
    'lib': '/BIBLIO_VALTAB/WEB_VALTABLE_DET_REP/ACCESSION_NUMBER%20%3D%3D%20',  // RL-2021-03-28
    'm3':  '/COL_VALTAB/WEB_VALTABLE_DET_REP/ACCESSION_NUMBER%20%3D%3D%20',  // RL-2021-05-31
    'forbiddenword':'M2A_FORBIDDEN_WORD/WEB_VALTABLE_DET_REP/LOOKUP_FIELD%20%3D%3D%20', // kn-2021-08-06
    'collectioncode':'M2A_COLLECTION_CODE/WEB_VALTABLE_DET_REP/COLLECT_CODE_DES%20%3D%3D%20', // kn-2021-11-27
    'recseries': '/RECSERIES_VALTAB/WEB_VALTABLE_DET_REP/SERIES_ID%20%3D%3D%20', // RL-2021-09-07
    'ministry': '/M2A_MINISTRY/WEB_VALTABLE_DET_REP/MINISTRY_ID%20%3D%3D%20', // RL-20211207
    'locations': '/M2A_LOCATION_VALTAB/WEB_VALTABLE_DET_REP/CURATORS_CODE%20%3D%3D%20', // RL-20211207
    'artlocations': '/M2A_ART_LOCATION_VALTAB/WEB_VALTABLE_DET_REP/ART_LOC_CODE_ID%20%3D%3D%20', // KN-2022-05-28
    'event': '/M3_EVENTS_VALTAB/WEB_VALTABLE_DET_REP/EVENT_ID%20%3D%3D%20',  // RL-20220106
    'container': '/CONTAINER_VALTAB/WEB_VALTABLE_DET_REP/CONTAINER_ID%20%3D%3D%20'  // RL-20220207
  },

  // declare MWI parameter line of authority search link
  'valtable_query_links' : {
    'm2a': '/DES_VALTAB?DIRECTSEARCH',
    'acc': '/ACC_VALTAB?DIRECTSEARCH',
    'eng': '/M2A_ENQ_VALTAB?DIRECTSEARCH',
    'project': '/M2A_PROJECT_VALTAB?DIRECTSEARCH',
    'incident': '/M2A_INCIDENT_VALTAB?DIRECTSEARCH',
    'prop': '/M2A_PROP_VALTAB?DIRECTSEARCH',
    'bldg': '/M2A_BLDG_VALTAB?DIRECTSEARCH',
    'sites': '/M2A_SITES_VALTAB?DIRECTSEARCH',
    'org': '/M2A_ORG_VALTAB?DIRECTSEARCH',
    'people': '/M2A_PEOPLE_VALTAB?DIRECTSEARCH',
    'loc': '/M2A_LOCATION_VALTAB?DIRECTSEARCH',
    'loans': '/M2A_LOAN_OUT_VALTAB?DIRECTSEARCH',
    'restrictions': '/M2A_RES_VALTAB?DIRECTSEARCH',
    'schedule': '/SCHED_VALTAB?DIRECTSEARCH',  // RL-2021-07-04
    'nomenclature': '/M2A_NOMENCLATURE?DIRECTSEARCH',  // RL-20211207
    'matthes': '/M2A_MATTHES?DIRECTSEARCH',
    'medium'  : '/M2A_MEDIUM?DIRECTSEARCH',
    'relship': '/M2A_RELSHIP?DIRECTSEARCH',
    'client': '/CLIENT_VALTAB?DIRECTSEARCH',   // RL-2021-03-28
    'accession': '/ACCESSION_VALTAB?DIRECTSEARCH',   // RL-2021-03-28
    'lib': '/BIBLIO_VALTAB?DIRECTSEARCH',   // RL-2021-03-28
    'm3' : '/COL_VALTAB?DIRECTSEARCH',   // RL-2021-03-28
    'forbiddenword': '/M2A_FORBIDDEN_WORD_VALTAB?DIRECTSEARCH',  //kn - 2021-08-06
    'collectioncode': '/M2A_COLLECTION_CODE_VALTAB?DIRECTSEARCH',  // KN-2021-11-27
    'recseries': '/RECSERIES_VALTAB?DIRECTSEARCH',  // RL-2021-09-07
    'ministry': '/M2A_MINISTRY?DIRECTSEARCH',  // RL-20211207
    'locations': '/M2A_LOCATION_VALTAB?DIRECTSEARCH',  // RL-20211207
    'artlocations': '/M2A_ART_LOCATION_VALTAB?DIRECTSEARCH',    // KN-2022-05-28
    'event': '/M3_EVENTS_VALTAB?DIRECTSEARCH', //  RL-20220106
    'container': '/CONTAINER_VALTAB?DIRECTSEARCH'
  },

  // declare mapping between TDR attriutes and MINISIS fields
  'tdr_map': {
    'License Textual': // 'License Textual' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "AC_LICTX_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Thumbnail",      "Target": "AC_LICTX_THUMB"},
        {"Source": "Access",         "Target": "AC_LICTX_ACCESS"},
        {"Source": "Original",       "Target": "AC_LICTX_ORIGIN"},
        {"Source": "Preservation",   "Target": "AC_LICTX_PRESER"},
        {"Source": "Thumbnail",      "Target": "AC_LICTX_THUMB"},
        {"Source": "Ocr",            "Target": "AC_LICTX_OCR"},
        {"Source": "Other",          "Target": "AC_LICTX_OTHER"},
        {"Source": "AssetName",      "Target": "AC_LICTX_AST_NAM"}
      ]
    },

    'Copyright Textual': // 'Copyright Textual' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "AC_COPTX_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Thumbnail",      "Target": "AC_COPTX_THUMB"},
        {"Source": "Access",         "Target": "AC_COPTX_ACCESS"},
        {"Source": "Original",       "Target": "AC_COPTX_ORIGIN"},
        {"Source": "Preservation",   "Target": "AC_COPTX_PRESER"},
        {"Source": "Thumbnail",      "Target": "AC_COPTX_THUMB"},
        {"Source": "Ocr",            "Target": "AC_COPTX_OCR"},
        {"Source": "Other",          "Target": "AC_COPTX_OTHER"},
        {"Source": "AssetName",      "Target": "AC_COPTX_AST_NAM"}
      ]
    },

    'Enquiry License Textual': // 'Enquiry License Textual' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "EN_LICTX_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Thumbnail",      "Target": "EN_LICTX_THUMB"},
        {"Source": "Access",         "Target": "EN_LICTX_ACCESS"},
        {"Source": "Original",       "Target": "EN_LICTX_ORIGIN"},
        {"Source": "Preservation",   "Target": "EN_LICTX_PRESER"},
        {"Source": "Thumbnail",      "Target": "EN_LICTX_THUMB"},
        {"Source": "Ocr",            "Target": "EN_LICTX_OCR"},
        {"Source": "Other",          "Target": "EN_LICTX_OTHER"},
        {"Source": "AssetName",      "Target": "EN_LICTX_AST_NAM"}
      ]
    },

    'Enquiry Copyright Textual': // 'Enquiry Copyright Textual' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "EN_COPTX_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Thumbnail",      "Target": "EN_COPTX_THUMB"},
        {"Source": "Access",         "Target": "EN_COPTX_ACCESS"},
        {"Source": "Original",       "Target": "EN_COPTX_ORIGIN"},
        {"Source": "Preservation",   "Target": "EN_COPTX_PRESER"},
        {"Source": "Thumbnail",      "Target": "EN_COPTX_THUMB"},
        {"Source": "Ocr",            "Target": "EN_COPTX_OCR"},
        {"Source": "Other",          "Target": "EN_COPTX_OTHER"},
        {"Source": "AssetName",      "Target": "EN_COPTX_AST_NAM"}
      ]
    },

  'Image Reference': // 'Image Reference' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "A_IM_REF_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "A_IM_PCK_UUID"},
        {"Source": "PackageName",      "Target": "A_IM_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "A_IM_AST_UUID"},
        {"Source": "AssetName",        "Target": "A_IM_AST_NAME"},
        {"Source": "AssetName",        "Target": "A_IM_CAPTION"},
        {"Source": "FileName",         "Target": "A_IM_FILE_NME"},
        {"Source": "Access",           "Target": "A_IM_ACCESS"},
        {"Source": "Original",         "Target": "A_IM_ORIGIN"},
        {"Source": "Preservation",     "Target": "A_IM_PRESER"},
        {"Source": "Thumbnail",        "Target": "A_IM_THUMB"},
        {"Source": "Other",            "Target": "A_IM_OTHER"},
        {"Source": "Ocr",              "Target": "A_IM_OCR"},
        {"Source": "MimeType",         "Target": "A_IM_MIME_TYP"},
        {"Source": "Extension",        "Target": "A_IM_EXTENSON"}
      ]
    },


    'Audio':  // 'Audio' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "A_AD_REF_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "A_AD_PCK_UUID"},
        {"Source": "PackageName",      "Target": "A_AD_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "A_AD_AST_UUID"},
        {"Source": "AssetName",        "Target": "A_AD_AST_NAME"},
        {"Source": "AssetName",        "Target": "A_AD_CAPTION"},
        {"Source": "FileName",         "Target": "A_AD_FILE_NME"},
        {"Source": "Access",           "Target": "A_AD_ACCESS"},
        {"Source": "Original",         "Target": "A_AD_ORIGIN"},
        {"Source": "Preservation",     "Target": "A_AD_PRESER"},
        {"Source": "Thumbnail",        "Target": "A_AD_THUMB"},
        {"Source": "Other",            "Target": "A_AD_OTHER"},
        {"Source": "Ocr",              "Target": "A_AD_OCR"},
        {"Source": "MimeType",         "Target": "A_AD_MIME_TYP"},
        {"Source": "Extension",        "Target": "A_AD_EXTENSON"}
      ]
    },

    'Video':  // 'Video' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "A_VD_REF_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "A_VD_PCK_UUID"},
        {"Source": "PackageName",      "Target": "A_VD_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "A_VD_AST_UUID"},
        {"Source": "AssetName",        "Target": "A_VD_AST_NAME"},
        {"Source": "AssetName",        "Target": "A_VD_CAPTION"},
        {"Source": "FileName",         "Target": "A_VD_FILE_NME"},
        {"Source": "Access",           "Target": "A_VD_ACCESS"},
        {"Source": "Original",         "Target": "A_VD_ORIGIN"},
        {"Source": "Preservation",     "Target": "A_VD_PRESER"},
        {"Source": "Thumbnail",        "Target": "A_VD_THUMB"},
        {"Source": "Other",            "Target": "A_VD_OTHER"},
        {"Source": "Ocr",              "Target": "A_VD_OCR"},
        {"Source": "MimeType",         "Target": "A_VD_MIME_TYP"},
        {"Source": "Extension",        "Target": "A_VD_EXTENSON"}
      ]
    },

    'Textual':  // 'Textual' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "A_TX_REF_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "A_TX_PCK_UUID"},
        {"Source": "PackageName",      "Target": "A_TX_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "A_TX_AST_UUID"},
        {"Source": "AssetName",        "Target": "A_TX_AST_NAME"},
        {"Source": "AssetName",        "Target": "A_TX_CAPTION"},
        {"Source": "FileName",         "Target": "A_TX_FILE_NME"},
        {"Source": "Access",           "Target": "A_TX_ACCESS"},
        {"Source": "Original",         "Target": "A_TX_ORIGIN"},
        {"Source": "Preservation",     "Target": "A_TX_PRESER"},
        {"Source": "Thumbnail",        "Target": "A_TX_THUMB"},
        {"Source": "Other",            "Target": "A_TX_OTHER"},
        {"Source": "Ocr",              "Target": "A_TX_OCR"},
        {"Source": "MimeType",         "Target": "A_TX_MIME_TYP"},
        {"Source": "Extension",        "Target": "A_TX_EXTENSON"}
      ]
    },

    // KN - 2022-08-05
    'Finding Aid':  // 'Finding Aid' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "A_FINTX_REF_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "A_FINTX_PCK_UUID"},
        {"Source": "PackageName",      "Target": "A_FINTX_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "A_FINTX_AST_UUID"},
        {"Source": "AssetName",        "Target": "A_FINTX_AST_NAME"},
        {"Source": "AssetName",        "Target": "A_FINTX_CAPTION"},
        {"Source": "FileName",         "Target": "A_FINTX_FILE_NME"},
        {"Source": "Access",           "Target": "A_FINTX_ACCESS"},
        {"Source": "Original",         "Target": "A_FINTX_ORIGIN"},
        {"Source": "Preservation",     "Target": "A_FINTX_PRESER"},
        {"Source": "Thumbnail",        "Target": "A_FINTX_THUMB"},
        {"Source": "Other",            "Target": "A_FINTX_OTHER"},
        {"Source": "Ocr",              "Target": "A_FINTX_OCR"},
        {"Source": "MimeType",         "Target": "A_FINTX_MIME_TYP"},
        {"Source": "Extension",        "Target": "A_FINTX_EXTENSON"}
      ]
    },

    'Cartographic / Architectural Material': // 'Cartographic / Architectural Material' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "A_CARIM_REF_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "A_CARIM_PCK_UUID"},
        {"Source": "PackageName",      "Target": "A_CARIM_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "A_CARIM_AST_UUID"},
        {"Source": "AssetName",        "Target": "A_CARIM_AST_NAME"},
        {"Source": "AssetName",        "Target": "A_CARIM_CAPTION"},
        {"Source": "FileName",         "Target": "A_CARIM_FILE_NME"},
        {"Source": "Access",           "Target": "A_CARIM_ACCESS"},
        {"Source": "Original",         "Target": "A_CARIM_ORIGIN"},
        {"Source": "Preservation",     "Target": "A_CARIM_PRESER"},
        {"Source": "Thumbnail",        "Target": "A_CARIM_THUMB"},
        {"Source": "Other",            "Target": "A_CARIM_OTHER"},
        {"Source": "Ocr",              "Target": "A_CARIM_OCR"},
        {"Source": "MimeType",         "Target": "A_CARIM_MIME_TYP"},
        {"Source": "Extension",        "Target": "A_CARIM_EXTENSON"}
      ]
    },

    'Conservation Image': // 'Conservation Image' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "A_CONIM_REF_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "A_CONIM_PCK_UUID"},
        {"Source": "PackageName",      "Target": "A_CONIM_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "A_CONIM_AST_UUID"},
        {"Source": "AssetName",        "Target": "A_CONIM_AST_NAME"},
        {"Source": "AssetName",        "Target": "A_CONIM_CAPTION"},
        {"Source": "FileName",         "Target": "A_CONIM_FILE_NME"},
        {"Source": "Access",           "Target": "A_CONIM_ACCESS"},
        {"Source": "Original",         "Target": "A_CONIM_ORIGIN"},
        {"Source": "Preservation",     "Target": "A_CONIM_PRESER"},
        {"Source": "Thumbnail",        "Target": "A_CONIM_THUMB"},
        {"Source": "Other",            "Target": "A_CONIM_OTHER"},
        {"Source": "Ocr",              "Target": "A_CONIM_OCR"},
        {"Source": "MimeType",         "Target": "A_CONIM_MIME_TYP"},
        {"Source": "Extension",        "Target": "A_CONIM_EXTENSON"}
      ]
    },

    'Conservation Audio':  // 'Conservation Audio' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "A_CONAD_REF_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "A_CONAD_PCK_UUID"},
        {"Source": "PackageName",      "Target": "A_CONAD_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "A_CONAD_AST_UUID"},
        {"Source": "AssetName",        "Target": "A_CONAD_AST_NAME"},
        {"Source": "AssetName",        "Target": "A_CONAD_CAPTION"},
        {"Source": "FileName",         "Target": "A_CONAD_FILE_NME"},
        {"Source": "Access",           "Target": "A_CONAD_ACCESS"},
        {"Source": "Original",         "Target": "A_CONAD_ORIGIN"},
        {"Source": "Preservation",     "Target": "A_CONAD_PRESER"},
        {"Source": "Thumbnail",        "Target": "A_CONAD_THUMB"},
        {"Source": "Other",            "Target": "A_CONAD_OTHER"},
        {"Source": "Ocr",              "Target": "A_CONAD_OCR"},
        {"Source": "MimeType",         "Target": "A_CONAD_MIME_TYP"},
        {"Source": "Extension",        "Target": "A_CONAD_EXTENSON"}
      ]
    },

    'Conservation Video':  // 'Conservation Video' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "A_CONVD_REF_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "A_CONVD_PCK_UUID"},
        {"Source": "PackageName",      "Target": "A_CONVD_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "A_CONVD_AST_UUID"},
        {"Source": "AssetName",        "Target": "A_CONVD_AST_NAME"},
        {"Source": "AssetName",        "Target": "A_CONVD_CAPTION"},
        {"Source": "FileName",         "Target": "A_CONVD_FILE_NME"},
        {"Source": "Access",           "Target": "A_CONVD_ACCESS"},
        {"Source": "Original",         "Target": "A_CONVD_ORIGIN"},
        {"Source": "Preservation",     "Target": "A_CONVD_PRESER"},
        {"Source": "Thumbnail",        "Target": "A_CONVD_THUMB"},
        {"Source": "Other",            "Target": "A_CONVD_OTHER"},
        {"Source": "Ocr",              "Target": "A_CONVD_OCR"},
        {"Source": "MimeType",         "Target": "A_CONVD_MIME_TYP"},
        {"Source": "Extension",        "Target": "A_CONVD_EXTENSON"}
      ]
    },

    'Conservation Textual':  // 'Conservation Textual' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "A_CONTX_REF_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "A_CONTX_PCK_UUID"},
        {"Source": "PackageName",      "Target": "A_CONTX_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "A_CONTX_AST_UUID"},
        {"Source": "AssetName",        "Target": "A_CONTX_AST_NAME"},
        {"Source": "AssetName",        "Target": "A_CONTX_CAPTION"},
        {"Source": "FileName",         "Target": "A_CONTX_FILE_NME"},
        {"Source": "Access",           "Target": "A_CONTX_ACCESS"},
        {"Source": "Original",         "Target": "A_CONTX_ORIGIN"},
        {"Source": "Preservation",     "Target": "A_CONTX_PRESER"},
        {"Source": "Thumbnail",        "Target": "A_CONTX_THUMB"},
        {"Source": "Other",            "Target": "A_CONTX_OTHER"},
        {"Source": "Ocr",              "Target": "A_CONTX_OCR"},
        {"Source": "MimeType",         "Target": "A_CONTX_MIME_TYP"},
        {"Source": "Extension",        "Target": "A_CONTX_EXTENSON"}
      ]
    },

    'Book Cover': // 'Book Cover' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "L_IM_REF_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "L_IM_PCK_UUID"},
        {"Source": "PackageName",      "Target": "L_IM_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "L_IM_AST_UUID"},
        {"Source": "AssetName",        "Target": "L_IM_AST_NAME"},
        {"Source": "AssetName",        "Target": "L_IM_CAPTION"},
        {"Source": "FileName",         "Target": "L_IM_FILE_NME"},
        {"Source": "Access",           "Target": "L_IM_ACCESS"},
        {"Source": "Original",         "Target": "L_IM_ORIGIN"},
        {"Source": "Preservation",     "Target": "L_IM_PRESER"},
        {"Source": "Thumbnail",        "Target": "L_IM_THUMB"},
        {"Source": "Other",            "Target": "L_IM_OTHER"},
        {"Source": "Ocr",              "Target": "L_IM_OCR"},
        {"Source": "MimeType",         "Target": "L_IM_MIME_TYP"},
        {"Source": "Extension",        "Target": "L_IM_EXTENSON"}
      ]
    },

    'Edoc': // 'Edoc' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "L_TX_REF_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "L_TX_PCK_UUID"},
        {"Source": "PackageName",      "Target": "L_TX_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "L_TX_AST_UUID"},
        {"Source": "AssetName",        "Target": "L_TX_AST_NAME"},
        {"Source": "AssetName",        "Target": "L_TX_CAPTION"},
        {"Source": "FileName",         "Target": "L_TX_FILE_NME"},
        {"Source": "Access",           "Target": "L_TX_ACCESS"},
        {"Source": "Original",         "Target": "L_TX_ORIGIN"},
        {"Source": "Preservation",     "Target": "L_TX_PRESER"},
        {"Source": "Thumbnail",        "Target": "L_TX_THUMB"},
        {"Source": "Other",            "Target": "L_TX_OTHER"},
        {"Source": "Ocr",              "Target": "L_TX_OCR"},
        {"Source": "MimeType",         "Target": "L_TX_MIME_TYP"},
        {"Source": "Extension",        "Target": "L_TX_EXTENSON"}
      ]
    },

    'Attachments':  // 'Attachments' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "LINK_GROUP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "LINK_PCK_UUID"},
        {"Source": "PackageName",      "Target": "LINK_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "LINK_AST_UUID"},
        {"Source": "AssetName",        "Target": "LINK_AST_NAME"},
        {"Source": "AssetName",        "Target": "LINK_CAPTION"},
        {"Source": "FileName",         "Target": "LINK_FILE_NME"},
        {"Source": "Access",           "Target": "LINK_PATH"},
        {"Source": "Original",         "Target": "LINK_ORIGIN"},
        {"Source": "Preservation",     "Target": "LINK_PRESER"},
        {"Source": "Thumbnail",        "Target": "LINK_THUMB"},
        {"Source": "Other",            "Target": "LINK_OTHER"},
        {"Source": "Ocr",              "Target": "LINK_OCR"},
        {"Source": "MimeType",         "Target": "LINK_MIME_TYP"},
        {"Source": "Extension",        "Target": "LINK_EXTENSON"}
      ]
    },

    'Images': // 'Images' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "EXH_IMAGE_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "EXH_IMAGE_REF"},
        {"Source": "AssetName",      "Target": "EXH_IMAGE_CAP"}
      ]
    },

    'Loans Video': // 'Loans Video' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "EXH_VID_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "EXHIB_VID_REF"}
      ]
    },

    'Loans Audio': // 'Loans Audio' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "EXH_AUD_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "EXHIB_AUDIO_REF"}
      ]
    },

    'Loans Notes': // 'Loans Notes' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "EXH_DOC_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "EXHIB_TEXT_REF"}
      ]
    },

    'Item': // 'item' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "ITEM_INFO",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Thumbnail",      "Target": "BOOK_COVER_TN"},
        {"Source": "Access",         "Target": "BOOK_COVER"}
      ]
    },

    'edoc':  // 'edoc' matches data-tdr-map attribute value in parent <div> tag
    {
      "group_mnemonic":              "ITEM_INFO",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "EDOC_LOCN"}
      ]
    },

    'Image Reference - M3': // 'Image Reference' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "M_IM_REF_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "M_IM_PCK_UUID"},
        {"Source": "PackageName",      "Target": "M_IM_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "M_IM_AST_UUID"},
        {"Source": "AssetName",        "Target": "M_IM_AST_NAME"},
        {"Source": "AssetName",        "Target": "M_IM_CAPTION"},
        {"Source": "FileName",         "Target": "M_IM_FILE_NME"},
        {"Source": "Access",           "Target": "M_IM_ACCESS"},
        {"Source": "Original",         "Target": "M_IM_ORIGIN"},
        {"Source": "Preservation",     "Target": "M_IM_PRESER"},
        {"Source": "Thumbnail",        "Target": "M_IM_THUMB"},
        {"Source": "Other",            "Target": "M_IM_OTHER"},
        {"Source": "Ocr",              "Target": "M_IM_OCR"},
        {"Source": "MimeType",         "Target": "M_IM_MIME_TYP"},
        {"Source": "Extension",        "Target": "M_IM_EXTENSON"}
      ]
    },

    'Audio - M3':  // 'Audio' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "M_AD_REF_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "M_AD_PCK_UUID"},
        {"Source": "PackageName",      "Target": "M_AD_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "M_AD_AST_UUID"},
        {"Source": "AssetName",        "Target": "M_AD_AST_NAME"},
        {"Source": "AssetName",        "Target": "M_AD_CAPTION"},
        {"Source": "FileName",         "Target": "M_AD_FILE_NME"},
        {"Source": "Access",           "Target": "M_AD_ACCESS"},
        {"Source": "Original",         "Target": "M_AD_ORIGIN"},
        {"Source": "Preservation",     "Target": "M_AD_PRESER"},
        {"Source": "Thumbnail",        "Target": "M_AD_THUMB"},
        {"Source": "Other",            "Target": "M_AD_OTHER"},
        {"Source": "Ocr",              "Target": "M_AD_OCR"},
        {"Source": "MimeType",         "Target": "M_AD_MIME_TYP"},
        {"Source": "Extension",        "Target": "M_AD_EXTENSON"}
      ]
    },

    'Video - M3':  // 'Video' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "M_VD_REF_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "M_VD_PCK_UUID"},
        {"Source": "PackageName",      "Target": "M_VD_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "M_VD_AST_UUID"},
        {"Source": "AssetName",        "Target": "M_VD_AST_NAME"},
        {"Source": "AssetName",        "Target": "M_VD_CAPTION"},
        {"Source": "FileName",         "Target": "M_VD_FILE_NME"},
        {"Source": "Access",           "Target": "M_VD_ACCESS"},
        {"Source": "Original",         "Target": "M_VD_ORIGIN"},
        {"Source": "Preservation",     "Target": "M_VD_PRESER"},
        {"Source": "Thumbnail",        "Target": "M_VD_THUMB"},
        {"Source": "Other",            "Target": "M_VD_OTHER"},
        {"Source": "Ocr",              "Target": "M_VD_OCR"},
        {"Source": "MimeType",         "Target": "M_VD_MIME_TYP"},
        {"Source": "Extension",        "Target": "M_VD_EXTENSON"}
      ]
    },

    'Textual - M3':  // 'Notes' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "M_TX_REF_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "M_TX_PCK_UUID"},
        {"Source": "PackageName",      "Target": "M_TX_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "M_TX_AST_UUID"},
        {"Source": "AssetName",        "Target": "M_TX_AST_NAME"},
        {"Source": "AssetName",        "Target": "M_TX_CAPTION"},
        {"Source": "FileName",         "Target": "M_TX_FILE_NME"},
        {"Source": "Access",           "Target": "M_TX_ACCESS"},
        {"Source": "Original",         "Target": "M_TX_ORIGIN"},
        {"Source": "Preservation",     "Target": "M_TX_PRESER"},
        {"Source": "Thumbnail",        "Target": "M_TX_THUMB"},
        {"Source": "Other",            "Target": "M_TX_OTHER"},
        {"Source": "Ocr",              "Target": "M_TX_OCR"},
        {"Source": "MimeType",         "Target": "M_TX_MIME_TYP"},
        {"Source": "Extension",        "Target": "M_TX_EXTENSON"}
      ]
    },

    'Conservation Image - M3': // 'Conservation Image' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "M_CONIM_REF_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "M_CONIM_PCK_UUID"},
        {"Source": "PackageName",      "Target": "M_CONIM_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "M_CONIM_AST_UUID"},
        {"Source": "AssetName",        "Target": "M_CONIM_AST_NAME"},
        {"Source": "AssetName",        "Target": "M_CONIM_CAPTION"},
        {"Source": "FileName",         "Target": "M_CONIM_FILE_NME"},
        {"Source": "Access",           "Target": "M_CONIM_ACCESS"},
        {"Source": "Original",         "Target": "M_CONIM_ORIGIN"},
        {"Source": "Preservation",     "Target": "M_CONIM_PRESER"},
        {"Source": "Thumbnail",        "Target": "M_CONIM_THUMB"},
        {"Source": "Other",            "Target": "M_CONIM_OTHER"},
        {"Source": "Ocr",              "Target": "M_CONIM_OCR"},
        {"Source": "MimeType",         "Target": "M_CONIM_MIME_TYP"},
        {"Source": "Extension",        "Target": "M_CONIM_EXTENSON"}
      ]
    },

    'Conservation Audio - M3':  // 'Conservation Audio' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "M_CONAD_REF_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "M_CONAD_PCK_UUID"},
        {"Source": "PackageName",      "Target": "M_CONAD_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "M_CONAD_AST_UUID"},
        {"Source": "AssetName",        "Target": "M_CONAD_AST_NAME"},
        {"Source": "AssetName",        "Target": "M_CONAD_CAPTION"},
        {"Source": "FileName",         "Target": "M_CONAD_FILE_NME"},
        {"Source": "Access",           "Target": "M_CONAD_ACCESS"},
        {"Source": "Original",         "Target": "M_CONAD_ORIGIN"},
        {"Source": "Preservation",     "Target": "M_CONAD_PRESER"},
        {"Source": "Thumbnail",        "Target": "M_CONAD_THUMB"},
        {"Source": "Other",            "Target": "M_CONAD_OTHER"},
        {"Source": "Ocr",              "Target": "M_CONAD_OCR"},
        {"Source": "MimeType",         "Target": "M_CONAD_MIME_TYP"},
        {"Source": "Extension",        "Target": "M_CONAD_EXTENSON"}
      ]
    },

    'Conservation Video - M3':  // 'Conservation Video' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "M_CONVD_REF_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "M_CONVD_PCK_UUID"},
        {"Source": "PackageName",      "Target": "M_CONVD_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "M_CONVD_AST_UUID"},
        {"Source": "AssetName",        "Target": "M_CONVD_AST_NAME"},
        {"Source": "AssetName",        "Target": "M_CONVD_CAPTION"},
        {"Source": "FileName",         "Target": "M_CONVD_FILE_NME"},
        {"Source": "Access",           "Target": "M_CONVD_ACCESS"},
        {"Source": "Original",         "Target": "M_CONVD_ORIGIN"},
        {"Source": "Preservation",     "Target": "M_CONVD_PRESER"},
        {"Source": "Thumbnail",        "Target": "M_CONVD_THUMB"},
        {"Source": "Other",            "Target": "M_CONVD_OTHER"},
        {"Source": "Ocr",              "Target": "M_CONVD_OCR"},
        {"Source": "MimeType",         "Target": "M_CONVD_MIME_TYP"},
        {"Source": "Extension",        "Target": "M_CONVD_EXTENSON"}
      ]
    },

    'Conservation Textual- M3':  // 'Conservation Textual' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "M_CONTX_REF_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "M_CONTX_PCK_UUID"},
        {"Source": "PackageName",      "Target": "M_CONTX_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "M_CONTX_AST_UUID"},
        {"Source": "AssetName",        "Target": "M_CONTX_AST_NAME"},
        {"Source": "AssetName",        "Target": "M_CONTX_CAPTION"},
        {"Source": "FileName",         "Target": "M_CONTX_FILE_NME"},
        {"Source": "Access",           "Target": "M_CONTX_ACCESS"},
        {"Source": "Original",         "Target": "M_CONTX_ORIGIN"},
        {"Source": "Preservation",     "Target": "M_CONTX_PRESER"},
        {"Source": "Thumbnail",        "Target": "M_CONTX_THUMB"},
        {"Source": "Other",            "Target": "M_CONTX_OTHER"},
        {"Source": "Ocr",              "Target": "M_CONTX_OCR"},
        {"Source": "MimeType",         "Target": "M_CONTX_MIME_TYP"},
        {"Source": "Extension",        "Target": "M_CONTX_EXTENSON"}
      ]
    },

    'Treatment Proposal - M3':  // 'Treatment Proposal' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "M_TRETX_REF_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "M_TRETX_PCK_UUID"},
        {"Source": "PackageName",      "Target": "M_TRETX_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "M_TRETX_AST_UUID"},
        {"Source": "AssetName",        "Target": "M_TRETX_AST_NAME"},
        {"Source": "AssetName",        "Target": "M_TRETX_CAPTION"},
        {"Source": "FileName",         "Target": "M_TRETX_FILE_NME"},
        {"Source": "Access",           "Target": "M_TRETX_ACCESS"},
        {"Source": "Original",         "Target": "M_TRETX_ORIGIN"},
        {"Source": "Preservation",     "Target": "M_TRETX_PRESER"},
        {"Source": "Thumbnail",        "Target": "M_TRETX_THUMB"},
        {"Source": "Other",            "Target": "M_TRETX_OTHER"},
        {"Source": "Ocr",              "Target": "M_TRETX_OCR"},
        {"Source": "MimeType",         "Target": "M_TRETX_MIME_TYP"},
        {"Source": "Extension",        "Target": "M_TRETX_EXTENSON"}
      ]
    },

    'Deaccession Textual - M3':  // 'Deaccession Textual' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "M_DEATX_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "M_DEATX_PCK_UUID"},
        {"Source": "PackageName",      "Target": "M_DEATX_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "M_DEATX_AST_UUID"},
        {"Source": "AssetName",        "Target": "M_DEATX_AST_NAME"},
        {"Source": "AssetName",        "Target": "M_DEATX_CAPTION"},
        {"Source": "FileName",         "Target": "M_DEATX_FILE_NME"},
        {"Source": "Access",           "Target": "M_DEATX_ACCESS"},
        {"Source": "Original",         "Target": "M_DEATX_ORIGIN"},
        {"Source": "Preservation",     "Target": "M_DEATX_PRESER"},
        {"Source": "Thumbnail",        "Target": "M_DEATX_THUMB"},
        {"Source": "Other",            "Target": "M_DEATX_OTHER"},
        {"Source": "Ocr",              "Target": "M_DEATX_OCR"},
        {"Source": "MimeType",         "Target": "M_DEATX_MIME_TYP"},
        {"Source": "Extension",        "Target": "M_DEATX_EXTENSON"}
      ]
    },

    'Reproduction Item(s)': // 'Reproduction Item(s)' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "REQ_REPROD_FILES",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "REQ_REPROD_FILE"},
        {"Source": "AssetName",      "Target": "REPRO_ITEM_CAP"}
      ]
    },

    'Acquisition Textual':  // 'Acquisition Textual' matches data-group-title attribute value in fieldset tag
    {
      "group_mnemonic":              "R_DOC_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "R_DOC_PCK_UUID"},
        {"Source": "PackageName",      "Target": "R_DOC_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "R_DOC_AST_UUID"},
        {"Source": "AssetName",        "Target": "R_DOC_AST_NAME"},
        {"Source": "AssetName",        "Target": "R_DOC_CAPTION"},
        {"Source": "FileName",         "Target": "R_DOC_FILE_NME"},
        {"Source": "Access",           "Target": "R_DOC_ACCESS"},
        {"Source": "Original",         "Target": "R_DOC_ORIGIN"},
        {"Source": "Preservation",     "Target": "R_DOC_PRESER"},
        {"Source": "Thumbnail",        "Target": "R_DOC_THUMB"},
        {"Source": "Other",            "Target": "R_DOC_OTHER"},
        {"Source": "Ocr",              "Target": "R_DOC_OCR"},
        {"Source": "MimeType",         "Target": "R_DOC_MIME_TYP"},
        {"Source": "Extension",        "Target": "R_DOC_EXTENSON"}
      ]
    },
    // RL-20211231
    'Finding Aid Group':
    {
      "group_mnemonic":              "FINDAID_GROUP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "FINDAIDLINK"}
      ]
    },
    // RL-20220104
    'Tape Log':
    {
      "group_mnemonic":              "OH_TAPE_LOG",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "OH_AVFILE"}
      ]
    },

    'Interviewee':
    {
      "group_mnemonic":              "OH_INTERVEE_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "OH_CONSENT_FORM"}
      ]
    },

    'Interviewer':
    {
      "group_mnemonic":              "OH_INTRVIEWER_GP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "OH_RELEASE"}
      ]
    },

    'Media Details':
    {
      "group_mnemonic":              "OH_RECORD_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "OH_REC_FILE"}
      ]
    },

    'Transcription Information':
    {
      "group_mnemonic":              "OH_TRANSCRIPT_GR",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "OH_TRANSCRIPT"}
      ]
    },

    'Treatment Proposal':
    {
      "group_mnemonic":              "TREATMENT_PROP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "PROPOSAL_DOC"}
      ]
    },

    'Container Information':
    {
      "group_mnemonic":              "LOCATION_GROUP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "TDR_PCK_UUID"},
        {"Source": "PackageName",      "Target": "TDR_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "TDR_AD_AST_UUID"},
        {"Source": "AssetName",        "Target": "TDR_AST_NAME"},
        {"Source": "AssetName",        "Target": "TDR_CAPTION"},
        {"Source": "FileName",         "Target": "TDR_FILE_NAME"},
        {"Source": "Access",           "Target": "TDR_ACCESS"},
        {"Source": "Original",         "Target": "TDR_ORIGIN"},
        {"Source": "Preservation",     "Target": "TDR_PRESER"},
        {"Source": "Thumbnail",        "Target": "TDR_THUMB"},
        {"Source": "Other",            "Target": "TDR_OTHER"},
        {"Source": "Ocr",              "Target": "TDR_OCR"},
        {"Source": "MimeType",         "Target": "TDR_MIME_TYP"},
        {"Source": "Extension",        "Target": "TDR_EXTENSON"}
      ]
    },

    'finding-aid':
    {
      "group_mnemonic":              "LOCATION_GROUP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "BOXLIST_LINK"}
      ]
    },

    'Deaccessioned Documents':
    {
      "group_mnemonic":              "DEACC_DOC_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "DEACCESSION_DOCS"}
      ]
    },

    'Links':
    {
      "group_mnemonic":              "LINK_GROUP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "LINK_PATH"}
      ]
    },

    'Image Reference - Dimentsions':
    {
      "group_mnemonic":              "M_DIMIM_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "D_IMAGE_PATH"},
        {"Source": "AssetName",      "Target": "D_IMAGE_NOTES"}
      ]
    },

    'Conservation Textual - M3':
    {
      "group_mnemonic":              "M_CONTX_REF_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "M_CONTX_PCK_UUID"},
        {"Source": "PackageName",      "Target": "M_CONTX_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "M_CONTX_AST_UUID"},
        {"Source": "AssetName",        "Target": "M_CONTX_AST_NAME"},
        {"Source": "AssetName",        "Target": "M_CONTX_CAPTION"},
        {"Source": "FileName",         "Target": "M_CONTX_FILE_NME"},
        {"Source": "Access",           "Target": "M_CONTX_ACCESS"},
        {"Source": "Original",         "Target": "M_CONTX_ORIGIN"},
        {"Source": "Preservation",     "Target": "M_CONTX_PRESER"},
        {"Source": "Thumbnail",        "Target": "M_CONTX_THUMB"},
        {"Source": "Other",            "Target": "M_CONTX_OTHER"},
        {"Source": "Ocr",              "Target": "M_CONTX_OCR"},
        {"Source": "MimeType",         "Target": "M_CONTX_MIME_TYP"},
        {"Source": "Extension",        "Target": "M_CONTX_EXTENSON"}
      ]
    },

    'Facility Report(s)':
    {
      "group_mnemonic":              "FACILITY_RPT_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "E_FAC_REPORT"}
      ]
    },

    'Board-request':
    {
      "group_mnemonic":              "VENUE_GROUP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "BOARD_REQ_DOC"}
      ]
    },

    'Loan-request':
    {
      "group_mnemonic":              "VENUE_GROUP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "LOAN_REQ_DOC"}
      ]
    },

    'Insurance-request':
    {
      "group_mnemonic":              "VENUE_GROUP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "CERT_INSUR_DOC"}
      ]
    },

    'Incoming-receipt':
    {
      "group_mnemonic":              "VENUE_GROUP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "INCOME_REC_DOC"}
      ]
    },

    'Outgoing-receipt':
    {
      "group_mnemonic":              "VENUE_GROUP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "OUTGO_REC_DOC"}
      ]
    },

    'Temporary-loanout-receipt':
    {
      "group_mnemonic":              "VENUE_GROUP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "TEMP_REC_DOC"}
      ]
    },

    'Shipping-receipt':
    {
      "group_mnemonic":              "VENUE_GROUP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "SHIP_REC_DOC"}
      ]
    },

    'Loan-agreement':
    {
      "group_mnemonic":              "VENUE_GROUP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "LOAN_AGREE_DOC"}
      ]
    },

    'Shipping-invoice':
    {
      "group_mnemonic":              "VENUE_GROUP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "SHIP_INV_DOC"}
      ]
    },

    'Loan-invoice':
    {
      "group_mnemonic":              "VENUE_GROUP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "LOAN_INV_DOC"}
      ]
    },

    'Video - Loan Out':
    {
      "group_mnemonic":              "EXH_VID_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "EXHIB_VID_REF"}
      ]
    },

    'Audio - Loan Out':
    {
      "group_mnemonic":              "EXH_AUD_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "EXHIB_AUDIO_REF"}
      ]
    },

    'Notes':
    {
      "group_mnemonic":              "EXH_DOC_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "EXHIB_TEXT_REF"}
      ]
    },

    'Inspection Images - Properties':
    {
      "group_mnemonic":              "PD_INSPECT_IMG_G",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "PD_INSPECT_IMG"}
      ]
    },

    'Video - Properties':
    {
      "group_mnemonic":              "PD_INSPECT_VID_G",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "PD_INSPECT_VIDEO"}
      ]
    },

    'Documents - Properties':
    {
      "group_mnemonic":              "PD_INSPECT_DOC_G",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "PD_INSPECT_DOC"}
      ]
    },

    'Pest Images':
    {
      "group_mnemonic":              "PD_PEST_IMAGES",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "PD_PEST_IMG"}
      ]
    },

    'Pest Video':
    {
      "group_mnemonic":              "PD_PEST_VIDEOS",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "PD_PEST_VID"}
      ]
    },

    'Pest Documents':
    {
      "group_mnemonic":              "PD_PEST_DOC_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "PD_PEST_DOC"}
      ]
    },

    'Repair Images':
    {
      "group_mnemonic":              "PD_REPAIR_IMAGES",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "PD_REPAIR_IMG"}
      ]
    },

    'Repair Video':
    {
      "group_mnemonic":              "PD_REPAIR_VIDEOS",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "PD_REPAIR_VIDEO"}
      ]
    },

    'Repair Documents':
    {
      "group_mnemonic":              "PD_REPAIR_DOCS",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "PD_REPAIR_DOC_PA"}
      ]
    },

    'Inspection Images - Buildings':
    {
      "group_mnemonic":              "BD_INSPECT_IMG_G",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "BD_INSPECT_IMG"}
      ]
    },

    'Video - Buildings':
    {
      "group_mnemonic":              "BD_INSP_VID_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "BD_INSPECT_VIDEO"}
      ]
    },

    'Documents - Buildings':
    {
      "group_mnemonic":              "BD_INSP_DOC_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "BD_INSPECT_DOC"}
      ]
    },

    'Pest Images - Buildings':
    {
      "group_mnemonic":              "BD_PEST_IMAGES",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "BD_PEST_IMG"}
      ]
    },

    'Pest Video - Buildings':
    {
      "group_mnemonic":              "BD_PEST_VID_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "BD_PEST_VIDEO"}
      ]
    },

    'Pest Documents - Buildings':
    {
      "group_mnemonic":              "BD_PEST_DOC_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "BD_PEST_DOC"}
      ]
    },

    'Repair Images - Buildings':
    {
      "group_mnemonic":              "BD_REPAIR_IMAGES",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "BD_REPAIR_IMG"}
      ]
    },

    'Repair Video - Buildings':
    {
      "group_mnemonic":              "BD_REPAIR_VIDEOS",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "BD_REPAIR_VIDEO"}
      ]
    },

    'Repair Documents - Buildings':
    {
      "group_mnemonic":              "BD_REPAIR_DOCS",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "BD_REPAIR_DOC_PA"}
      ]
    },

    'Repair Proposal(s)':
    {
      "group_mnemonic":              "BD_REPAIR_PROP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "BD_PROPOSAL_DOC"}
      ]
    },

    'Property Images':
    {
      "group_mnemonic":              "BD_PICTURES",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "BD_IMAGE_REFEREN"}
      ]
    },

    'Property Video':
    {
      "group_mnemonic":              "BD_VIDEOS",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "BD_VIDEO_REF"}
      ]
    },

    'Property Documents':
    {
      "group_mnemonic":              "BD_DOCUMENTS",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "BD_DOC_REF"}
      ]
    },

    'Incident Images':
    {
      "group_mnemonic":              "BD_INCDNT_IMAGES",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "BD_INCDNT_IMG"}
      ]
    },

    'Incident Video':
    {
      "group_mnemonic":              "BD_INCDNT_VID_GR",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "BD_INCDNT_VIDEO"}
      ]
    },

    'Incident Documents':
    {
      "group_mnemonic":              "BD_INCDNT_DOCS",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "BD_INCDNT_DOC_PA"}
      ]
    },

    'Site Visit Image(s)':
    {
      "group_mnemonic":              "SITE_VISIT_IMG_G",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "SITE_VISIT_IMG"}
      ]
    },

    'Site Visit Document(s)':
    {
      "group_mnemonic":              "SITE_VISIT_DOC_G",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "SITE_VISIT_DOC"}
      ]
    },

    'Site Photographs':
    {
      "group_mnemonic":              "SITE_IMAGE_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "SITE_IMAGE"}
      ]
    },

    'Site Video':
    {
      "group_mnemonic":              "SITE_VIDEO_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "SITE_VIDEO_PATH"}
      ]
    },

    'Site Documents':
    {
      "group_mnemonic":              "SITE_DOCUMENT_GR",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "SITE_DOC_PATH"}
      ]
    },

    'Site Map':
    {
      "group_mnemonic":              "MAP_GROUP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "MAP_IMAGE"}
      ]
    },

    'container-tdr':
    {
      "group_mnemonic":              "",
      "group_repeating":             "N",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "TDR_PCK_UUID"},
        {"Source": "PackageName",      "Target": "TDR_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "TDR_AD_AST_UUID"},
        {"Source": "AssetName",        "Target": "TDR_AST_NAME"},
        {"Source": "AssetName",        "Target": "TDR_CAPTION"},
        {"Source": "FileName",         "Target": "TDR_FILE_NAME"},
        {"Source": "Access",           "Target": "TDR_ACCESS"},
        {"Source": "Original",         "Target": "TDR_ORIGIN"},
        {"Source": "Preservation",     "Target": "TDR_PRESER"},
        {"Source": "Thumbnail",        "Target": "TDR_THUMB"},
        {"Source": "Other",            "Target": "TDR_OTHER"},
        {"Source": "Ocr",              "Target": "TDR_OCR"},
        {"Source": "MimeType",         "Target": "TDR_MIME_TYP"},
        {"Source": "Extension",        "Target": "TDR_EXTENSON"}
      ]
    },

    'container-finding-aid':
    {
      "group_mnemonic":              "",
      "group_repeating":             "N",
      "map" :
      [
        {"Source": "Access",         "Target": "BOXLIST_LINK"}
      ]
    },

    'Treatment Proposal - Container':
    {
      "group_mnemonic":              "C_TREATMENT_PROP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "Access",         "Target": "C_PROPOSAL_DOC"}
      ]
    },

    'Conservation Image - Container':
    {
      "group_mnemonic":              "C_CONIM_REF_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "C_CONIM_PCK_UUID"},
        {"Source": "PackageName",      "Target": "C_CONIM_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "C_CONIM_AST_UUID"},
        {"Source": "AssetName",        "Target": "C_CONIM_AST_NAME"},
        {"Source": "AssetName",        "Target": "C_CONIM_CAPTION"},
        {"Source": "FileName",         "Target": "C_CONIM_FILE_NME"},
        {"Source": "Access",           "Target": "C_CONIM_ACCESS"},
        {"Source": "Original",         "Target": "C_CONIM_ORIGIN"},
        {"Source": "Preservation",     "Target": "C_CONIM_PRESER"},
        {"Source": "Thumbnail",        "Target": "C_CONIM_THUMB"},
        {"Source": "Other",            "Target": "C_CONIM_OTHER"},
        {"Source": "Ocr",              "Target": "C_CONIM_OCR"},
        {"Source": "MimeType",         "Target": "C_CONIM_MIME_TYP"},
        {"Source": "Extension",        "Target": "C_CONIM_EXTENSON"}
      ]
    },

    'Conservation Video - Container':
    {
      "group_mnemonic":              "C_CONVD_REF_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "C_CONVD_PCK_UUID"},
        {"Source": "PackageName",      "Target": "C_CONVD_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "C_CONVD_AST_UUID"},
        {"Source": "AssetName",        "Target": "C_CONVD_AST_NAME"},
        {"Source": "AssetName",        "Target": "C_CONVD_CAPTION"},
        {"Source": "FileName",         "Target": "C_CONVD_FILE_NME"},
        {"Source": "Access",           "Target": "C_CONVD_ACCESS"},
        {"Source": "Original",         "Target": "C_CONVD_ORIGIN"},
        {"Source": "Preservation",     "Target": "C_CONVD_PRESER"},
        {"Source": "Thumbnail",        "Target": "C_CONVD_THUMB"},
        {"Source": "Other",            "Target": "C_CONVD_OTHER"},
        {"Source": "Ocr",              "Target": "C_CONVD_OCR"},
        {"Source": "MimeType",         "Target": "C_CONVD_MIME_TYP"},
        {"Source": "Extension",        "Target": "C_CONVD_EXTENSON"}
      ]
    },

    'Conservation Audio - Container':
    {
      "group_mnemonic":              "C_CONAD_REF_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "C_CONAD_PCK_UUID"},
        {"Source": "PackageName",      "Target": "C_CONAD_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "C_CONAD_AST_UUID"},
        {"Source": "AssetName",        "Target": "C_CONAD_AST_NAME"},
        {"Source": "AssetName",        "Target": "C_CONAD_CAPTION"},
        {"Source": "FileName",         "Target": "C_CONAD_FILE_NME"},
        {"Source": "Access",           "Target": "C_CONAD_ACCESS"},
        {"Source": "Original",         "Target": "C_CONAD_ORIGIN"},
        {"Source": "Preservation",     "Target": "C_CONAD_PRESER"},
        {"Source": "Thumbnail",        "Target": "C_CONAD_THUMB"},
        {"Source": "Other",            "Target": "C_CONAD_OTHER"},
        {"Source": "Ocr",              "Target": "C_CONAD_OCR"},
        {"Source": "MimeType",         "Target": "C_CONAD_MIME_TYP"},
        {"Source": "Extension",        "Target": "C_CONAD_EXTENSON"}
      ]
    },

    'Conservation Textual - Container':
    {
      "group_mnemonic":              "C_CONTX_REF_GRP",
      "group_repeating":             "Y",
      "map" :
      [
        {"Source": "PackageUuid",      "Target": "C_CONTX_PCK_UUID"},
        {"Source": "PackageName",      "Target": "C_CONTX_PCK_NAME"},
        {"Source": "AssetUuid",        "Target": "C_CONTX_AST_UUID"},
        {"Source": "AssetName",        "Target": "C_CONTX_AST_NAME"},
        {"Source": "AssetName",        "Target": "C_CONTX_CAPTION"},
        {"Source": "FileName",         "Target": "C_CONTX_FILE_NME"},
        {"Source": "Access",           "Target": "C_CONTX_ACCESS"},
        {"Source": "Original",         "Target": "C_CONTX_ORIGIN"},
        {"Source": "Preservation",     "Target": "C_CONTX_PRESER"},
        {"Source": "Thumbnail",        "Target": "C_CONTX_THUMB"},
        {"Source": "Other",            "Target": "C_CONTX_OTHER"},
        {"Source": "Ocr",              "Target": "C_CONTX_OCR"},
        {"Source": "MimeType",         "Target": "C_CONTX_MIME_TYP"},
        {"Source": "Extension",        "Target": "C_CONTX_EXTENSON"}
      ]
    }
  }
}