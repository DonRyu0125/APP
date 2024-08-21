const DEFAULT_FROM_EMAIL = "ao@ontario.ca";
const OUTGOING_TYPE = 'Outgoing';
const AOOPAC_SCRIPT_PATH = 'https://C:/scripts/mwimain.dll';
const LOAN_EXHIBITION_TYPE = 'Loan/Exhibitions';

// define type of webpage and topic type. they are accessed in the enquiry_request.js
var $pageType = 'enquiry';
var $enquiryTopicType = '';

/* **********************************************************************************
  setupWorksheetHandler()

  This function sets up the event handler of worksheet. It is called after form is loaded.
************************************************************************************ */

var setupWorksheetHandler = function() {
    // bind user routine by class names
    $('a.set_date_exit').on('click', function() { setRelativeDate($(this)); });
    $('a.get_ai_value_exit').on('click', function() { getAiValue($(this)); });
    $('a.get_index_value_exit').on('click', function() { selectIndexKey($(this)); });
    $('.correspond_type_exit').off().change(function() { handle_send_button($(this)); });
}



/* **********************************************************************************
  exitController()

  This function is the controller of user routines. User routine is called
  after either HTML field is touched or form is loaded.
************************************************************************************ */

function exitController(calling_field) {
    var proceedProcessing = true;

    // bind user routine by ID
    $('#ENQ_EM_TMPL_PATH').off().change(function() { loadEmailTemplate($(this)); });

    if ($(calling_field).hasClass('correspond_type_exit')) {
        handle_send_button(calling_field);
    }

    // RL-20220601
    if ($(calling_field).hasClass('correspondence_default')) {
        setCorrespondenceDefault(calling_field);
    }

    return proceedProcessing;
}

// enquiry main line
$(document).ready(function() {
    active_interface = new ApplicationInterface(new EnquiriesRecord('#MY_XML'));
    active_interaction = new ApplicationInteraction(active_interface);

    // setup application event handler
    active_interface.appWorksheetHandler = setupWorksheetHandler;

    init(active_interaction.populateForm);

    $('span.check i').each(function() {
        populateCheckBoxes($(this));
    });

    // Handle Page Loading:
    $('nav#worksheet_nav a').off().on('click', function(e) {
        e.preventDefault();
        loadForm($(this).attr('href'));
    });
    updateDatabaseActionLinks();
    generateRecordSavingForm('normal');
});

// function performs record wrapup processing.
function wrapupEnquiries(calling_field) {
    var return_code = true;

    // extract ENQ_STATUS
    var status = getXmLRecordFieldValue('ENQ_STATUS', null);

    // if ENQ_STATUS is Request, change it to Active
    if (status == 'Request' || status == '') {
        setXmlRecordFieldValue('ENQ_STATUS', 'Active', 0);
    }

    return return_code;
}

/* ************************************************************************ */
// function handles the approval of the enquiry.
function approveEnquiry(calling_field) {
    // mandatory field checking
    var rc = checkLoanMantoryField();
    if (rc == false) {
        // if missing mandatory field, exit function
        return;
    }

    var result;
    var final_result = {};

    final_result.status = true;
    final_result.lo_id = '';
    final_result.error_message = '';
    final_result.create_loanout = false;

    // extreact ENQ_TOPIC field
    var enq_topic = getXmLRecordFieldValue("ENQ_TOPIC", null);
    if (enq_topic == LOAN_EXHIBITION_TYPE) {
        var enq_lo_id = getXmLRecordFieldValue("ENQ_LO_ID", null);
        if (enq_lo_id == null || enq_lo_id == '') {
            // if topic is "Loan/Exhibitions" and loanout has not yet created, create loanout record
            final_result.create_loanout = true;
            result = createLoanOutRecord();
            final_result.status = result.status;
            if (result.status == true) {
                final_result.lo_id = result.lo_id;
            } else {
                final_result.error_message = result.error_message;
            }
        }
    }

    if (final_result.status == false) {
        if (final_result.error_message != '') {
            alert(final_result.error_message);
        }
    } else {
        // set ENQ_PROCESS_DATE field to today's date
        setXmlRecordFieldValue('ENQ_PROCESS_DATE', '++1', 0);

        // set ENQ_STATUS field to Close
        setXmlRecordFieldValue('ENQ_STATUS', 'Close', 0);

        if (final_result.create_loanout && final_result.lo_id != '') {
            // addt ENQ_LO_ID field
            setXmlRecordFieldValue('ENQ_LO_ID', final_result.lo_id, 0);
        }

        var callback_func = function(html_response, data) { wrapupEnquiryProcessing(html_response, data); }

        // update enquiry status
        var field_handle = $('#dba_save').find('a');
        if (field_handle.length > 0) {
            var form_action = $(field_handle).data('form-action');
            var form = $('#submission_form');

            if (form_action === undefined || form_action == null || form.length <= 0) {
                alert("Form is not found.");
            } else {
                submitFormAndCallback(form_action, form, callback_func, final_result, false);
            }
        }
    }
}

// function sends email after enquiry record is saved.
function sendEmail(html_response, callback_data) {
    // prepare URL
    var url = getCookie('HOME_SESSID') + "?SAVE_MAIL_FORM&XML=Y"; +
    "&FROM_DEFAULT=" + callback_data.from +
        "&TO=" + callback_data.who +
        "&SUBJECT_DEFAULT=" + callback_data.subject;

    // prepare form data
    var formData = new FormData();
    formData.append("SENDER", callback_data.from);
    formData.append("RECEIVER", callback_data.who);
    formData.append("SUBJECT", callback_data.subject);
    formData.append("MAILBODY", callback_data.body);

    // sned ajax call to send email
    $.ajax({
        async: false,
        type: "POST",
        dataType: "xml",
        url: url,
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
            var show_error = false;
            var first_child;
            var node_value;

            if (jQuery.isXMLDoc(data)) {
                var nodes = data.getElementsByTagName("error")[0];
                if (nodes.length > 0) {
                    first_child = nodes.childNodes[0];
                    node_value = parseInt(first_child.nodeValue, 10);
                    if (node_value != 0) {
                        alert("Unable to send email because of error " + node_value);
                    }
                }
            }
        },
        error: function(xhr, status, error) {
            alert("Send email error " + '\n' + "xhr: " + xhr + '\n' + "status: " + status + '\n' + "error: " + error);
        }
    });
}

// function converts HTML to plain text. The line feeds characters are retained.
function htmlToText(htmlText) {
    var plainText = '';
    var tempBuf;

    // remove <br> to ^br^
    tempBuf = htmlText.replace(/<br>/gi, '~br~');

    var temp = document.createElement("div");
    temp.innerHTML = tempBuf;

    tempBuf = temp.textContent || temp.innerText || '';

    plainText = tempBuf.replace(/~br~/g, '\n');

    return plainText;
}


/* ************************************************************************ */
// This function sends message to client via either email if enquiry method is
// not web or send emil notification if enquiry method is web
function sendEmailMessage(field_id) {
    var web_enquiry = true;
    var h_field;

    var enquiry_id = '';
    h_field = $('#ENQ_ID');
    if ($(h_field).length > 0 && $(h_field).val() != '') {
        enquiry_id = $(h_field).val();
    }

    var patron_email_addx = '';
    var patron_email = $('#ENQ_PATRON_EMAIL');
    if ($(patron_email).length > 0 && $(patron_email).val() != '') {
        patron_email_addx = $(patron_email).val();
    }

    var who_addx = '';

    // get email from ENQ_PATRON_EMAIL field
    if (patron_email_addx != '') {
        who_addx = patron_email_addx;
    } else {
        alert('Client email address is missing.');
    }

    if (who_addx != '') {
        h_field = $('#ENQ_PATRON_ID');
        if ($(h_field).length == 0 || $(h_field).first().val() == '') {
            web_enquiry = false;
        } else {
            h_field = $('#E_METHOD_REQUEST');
            if ($(h_field).length == 0 || $(h_field).first().val() != 'Web') {
                web_enquiry = false;
            }
        }

        // save richedit field
        $("body").find('.richText').each(function() {
            saveRichTextField($(this));
        });

        // save enquiry record
        var field_handle = $('#dba_save').find('a');
        if (field_handle.length > 0) {
            var form_action = $(field_handle).data('form-action');
            var form = $('#submission_form');

            if (form_action === undefined || form_action == null || form.length <= 0) {
                alert("Form is not found.");
            } else {
                var enq_id = '';
                var subject = '';
                var body = '';

                // extract enquiry ID
                h_field = $('#ENQ_ID');
                if ($(h_field).length > 0) {
                    enq_id = $(h_field).first().val();
                }

                // extract subject
                h_field = $('#CORRESPOND_SUBJ');
                if ($(h_field).length > 0) {
                    subject = $(h_field).first().val();
                }
                if (subject == '') {
                    subject = 're: enquiry ' + enq_id;
                } else {
                    subject = 're: enquiry ' + enq_id + ' - ' + subject;
                }

                // extract email body
                if (web_enquiry) {
                    body = "Please log in your personal profile portal to view the reply of the enquiry " +
                        enq_id + "\n\nRegrards,\nAO team";
                } else {
                    // assemble CHANGESINGLERECORD URL
                    url = AOOPAC_SCRIPT_PATH + '?CHANGESINGLERECORD&APPLICATION=ENQUIRIES_VIEW&LANGUAGE=144&DATABASE=ENQUIRIES_VIEW&de_form=%5bAO_ASSETS%5dhtml/editEnquiry.html&rid=edit-inquiry&EXP=ENQ_ID~20' + enquiry_id;

                    var edit_link = '\n\nP.S.  If you would like to correspond with CAMS staff, click on the link below\n\n' + url;

                    body = $('#MESSAGE_TEXT').html();
                    if (body == null) {
                        body = '';
                    }
                    body = htmlToText(body) + edit_link;
                }

                // excape form data forbidden characters (& and =)
                body = body.replace(/&/g, '%26').replace(/=/g, '%3d')

                var callback_data = {};
                callback_data.enq_id = enq_id;
                callback_data.web_enquiry = web_enquiry;
                callback_data.who = who_addx;
                callback_data.from = DEFAULT_FROM_EMAIL;
                callback_data.subject = subject;
                callback_data.body = body;
                var callback_func = function(html_response, data) { sendEmail(html_response, data); }


                // set C_APPROVED_BY to current user name
                var group_occ = currentAppInterface.getCurrentOccurrence('CORRESPOND_GRP');

                // set field to indicate that correspondence is sent.
                setXmlRecordFieldValue('CORRESPOND_SENT', 'Y', group_occ);

                submitFormAndCallback(form_action, form, callback_func, callback_data, false);
            }
        }
    }
}

/* ************************************************************************ */
// This function replaces variables of email text with actual text.
function replaceEmailVariable(source_string) {
    var target_string = source_string;

    // get staff name
    var staff_name = $('#CORRESPOND_WHO').val();
    if (staff_name == null || staff_name == '') {
        staff_name = getUserName();
    }

    // get client name
    var client_name = $('#ENQ_PATRON_NAME').val();
    if (client_name == null) {
        client_name = '';
    }

    // replace {3} with client name
    if (client_name != '') {
        target_string = target_string.replace('{3}', client_name);
    }

    // replace {0} with staff name
    target_string = target_string.replace('{0}', staff_name);

    return target_string;
}


/* ************************************************************************ */
// This function loads the email template to message text data box.
function loadEmailTemplate(calling_field) {
    var template_file = $(calling_field).first().val();

    // make ajax call to fetch template file contents
    if (typeof template_file != 'undefined' && template_file != '') {
        var url = getCookie("HOME_SESSID") + "?GET&FILE=" + template_file;
        $.ajax({
            async: false,
            type: "GET",
            dataType: "text",
            url: url,
            success: function(data) {
                if (data != null && data != "") {
                    // update message text with template contents
                    var message_text = $('#MESSAGE_TEXT');
                    if ($(message_text).length > 0) {
                        // if text file, replace \n with <br/>
                        var email_body = data;
                        // if text file, replace \n with <br/>
                        if (template_file.indexOf('.html') == -1 && template_file.indexOf('.htm') == -1) {
                            email_body = email_body.replace(/\n/g, '<br/>');
                        }

                        // replace email variables with text
                        email_body = replaceEmailVariable(email_body);

                        $(message_text).html(email_body);
                    }
                }
            },
            error: function(xhr, status, error) {
                if (xhr.status != 404) {
                    alert("Unable to fetch email template file contents. (HTTP status " + xhr.status + ")");
                }
            }
        });
    }
}

// function checkes the mandatory fields of the Loan/Exhibitions enquiries.
function checkLoanMantoryField() {
    var return_code = true;
    var mnemonic = '';
    var absent_mnemonic = '';

    // check E_EXH_START_DATE field
    mnemonic = 'E_EXH_START_DATE';
    var sourceField = getXmLRecordFieldValue(mnemonic, null);
    if (sourceField == null || sourceField == '') {
        return_code = false;
        absent_mnemonic = mnemonic;
    }

    // check E_EXH_END_DATE field or E_LOAN_DURATION field
    if (return_code) {
        mnemonic = 'E_EXH_END_DATE';
        sourceField = getXmLRecordFieldValue(mnemonic, null);
        if (sourceField == null || sourceField == '') {
            sourceField = getXmLRecordFieldValue('E_LOAN_DURATION', null);
            if (sourceField == null || sourceField == '') {
                return_code = false;
                absent_mnemonic = mnemonic;
            }
        }
    }

    // check ENQ_TITLE field
    if (return_code) {
        mnemonic = 'ENQ_TITLE';
        sourceField = getXmLRecordFieldValue(mnemonic, null);
        if (sourceField == null || sourceField == '') {
            return_code = false;
            absent_mnemonic = mnemonic;
        }
    }

    // check E_LOAN_ORG field
    if (return_code) {
        mnemonic = 'E_LOAN_ORG';
        sourceField = getXmLRecordFieldValue(mnemonic, null);
        if (sourceField == null || sourceField == '') {
            return_code = false;
            absent_mnemonic = mnemonic;
        }
    }

    if (absent_mnemonic != '') {
        alert("Field " + absent_mnemonic + " is absent.");
    }

    return return_code;
}

/* ************************************************************************ */
// This function manipulates the enquiry request group list.
function enquiryGroupFieldHanler(table_id, op, occnum) {
    var sourceField = getXmLRecordFieldValue('ENQ_TOPIC', null);
    var loan_exhibution = false;

    if (sourceField != null && sourceField == LOAN_EXHIBITION_TYPE) {
        loan_exhibution = true;
    }

    if (loan_exhibution) {
        // check existence of mandatory fields if loan/exhibition
        if (!checkLoanMantoryField()) {
            return false;
        }
    }

    switch (op) {
        case 'A': // add row
            break;
        case 'C': // edit row
            // check mandatory if reproduction
            break;
        case 'D': // delete row
            break;
    }

    var return_code = handleGroupOccDataEntry(table_id, op, occnum);

    return return_code;
}

// function protects or unprotects the 'send' button.
function handle_send_button(calling_field) {
    // extract CORRESPOND_TYPE field value
    var type_value = $(calling_field).val();

    // find ENQ_EM_TMPL field
    var email_template = $('#ENQ_EM_TMPL');

    // find SEND_EMAIL button
    var send_mail_button = $('#SEND_EMAIL');

    // is email already sent?
    var h_email_sent = $('#CORRESPOND_SENT');
    var email_sent = false;
    if (h_email_sent != null && $(h_email_sent).val() == 'Y') {
        email_sent = true;
    }

    // update button label
    if (type_value == OUTGOING_TYPE && email_sent) {
        $(send_mail_button).html('<i class="fa fa-paper-plane"></i> Sent');
    } else {
        if (type_value == OUTGOING_TYPE) {
            // extract USERNAME cookie
            var username = getCookie('USERNAME');

            // set CORRESPOND_WHO field
            var correspond_who = $('#CORRESPOND_WHO');
            if (correspond_who.length > 0) {
                // RL20220917
                var source_field = $('#ENQ_REASSIGN_TO').val();
				if ( source_field == null || source_field == '' ) {
				  source_field = $('#ENQ_HANDLED_BY').val();
                  if (source_field == null) {
                    source_field = username;
                  }
				}
                $(correspond_who).val(source_field).change();
            }
        }

        $(send_mail_button).html('<i class="fa fa-paper-plane"></i> Send');
    }

    if (type_value != null && type_value == OUTGOING_TYPE && !email_sent) {
        // unproect ENQ_EM_TMPL and SEND_EMAIL
        if (email_template.length > 0) {
            if ($(email_template).hasClass('disabled')) {
                $(email_template).removeClass('disabled');
            }
        }
        if (send_mail_button.length > 0) {
            if ($(send_mail_button).hasClass('disabled')) {
                $(send_mail_button).removeClass('disabled');
            }
        }
    } else {
        // unproect ENQ_EM_TMPL and SEND_EMAIL
        if (email_template.length > 0) {
            if (!$(email_template).hasClass('disabled')) {
                $(email_template).addClass('disabled');
            }
        }
        if (send_mail_button.length > 0) {
            if (!$(send_mail_button).hasClass('disabled')) {
                $(send_mail_button).addClass('disabled');
            }
        }
    }
}

// function creates the loanout record if enquiry record links to one or
// more request_info records which are approved for retrieval.
function createLoanOutRecord() {
    var result = {};

    result.status = false;
    result.lo_id = '';
    result.error_message = '';

    var record = currentAppInterface.app_record;
    var i;
    var parentGroup;
    var hField;
    var hFieldValue;
    var xml_value;
    var error_code;
    var sisn;

    // count # of ASSO_REQ_GRP
    var numocc = record.getOccurrenceCount('ASSO_REQ_GRP', null);

    if (numocc == 0) {
        var create_record = confirm("Do you want to create Loan-Out record with no item?");
        if (create_record) {
            result.status = true;
        }
    } else {
        // Are all items approved for retrieval
        result.status = true;
        for (i = 1; i <= numocc; i++) {
            parentGroup = record.getGroup('ASSO_REQ_GRP', i, null);
            if (parentGroup != null) {
                hField = record.getElement('ASSO_REQ_STATUS', 1, parentGroup);
                if (hField === false) {
                    hFieldValue = '';
                } else {
                    hFieldValue = hField.text();
                }
                if (hFieldValue != 'Retrieve' && hFieldValue != 'Requested' && hFieldValue != 'Returned') {
                    result.status = false;
                    result.error_message = 'Enquiry approval is denied because one of items is not yet reserved for loan.';
                    break;
                }
            }
        }
    }

    var form_data = '<?xml version="1.0" encoding="UTF-8"?>\n<RECORD>\n';

    if (result.status == true) {
        // set EXHIB_START field to E_EXH_START_DATE field value
        hField = record.getElement('E_EXH_START_DATE', 1, null);
        if (hField !== false) {
            form_data = form_data.concat('<EXHIB_START>' + hField.text() + '</EXHIB_START>\n');
        }

        // set EXHIB_END field to E_EXH_END_DATE field value
        hField = record.getElement('E_EXH_END_DATE', 1, null);
        if (hField !== false) {
            form_data = form_data.concat('<EXHIB_END>' + hField.text() + '</EXHIB_END>\n');
        }

        // set LO_TYPE field to E_LOAN_TYPE field value
        hField = record.getElement('E_LOAN_TYPE', 1, null);
        if (hField !== false) {
            form_data = form_data.concat('<LO_TYPE>' + hField.text() + '</LO_TYPE>\n');
        }

        // set EXHIB_DAYS field to E_LOAN_DURATION field value
        hField = record.getElement('E_LOAN_DURATION', 1, null);
        if (hField !== false) {
            form_data = form_data.concat('<EXHIB_DAYS>' + hField.text() + '</EXHIB_DAYS>\n');
        }

        // set LO_SHIPPED_TO field to E_EXH_CONTACT field value
        hField = record.getElement('E_EXH_CONTACT', 1, null);
        if (hField !== false) {
            form_data = form_data.concat('<LO_SHIPPED_TO>' + hField.text() + '</LO_SHIPPED_TO>\n');
        }

        // set LO_SHIPPED_TO_ID field to E_EXH_CONTACT_ID field value
        hField = record.getElement('E_EXH_CONTACT_ID', 1, null);
        if (hField !== false) {
            form_data = form_data.concat('<LO_SHIPPED_TO_ID>' + hField.text() + '</LO_SHIPPED_TO_ID>\n');
        }

        // set LO_INT_CONTACT field to E_INT_CONTACT field value
        hField = record.getElement('E_INT_CONTACT', 1, null);
        if (hField !== false) {
            form_data = form_data.concat('<LO_INT_CONTACT>' + hField.text() + '</LO_INT_CONTACT>\n');
        }

        // set LO_INT_CONT_ID field to E_INT_CONTACT_ID field value
        hField = record.getElement('E_INT_CONTACT_ID', 1, null);
        if (hField !== false) {
            form_data = form_data.concat('<LO_INT_CONT_ID>' + hField.text() + '</LO_INT_CONT_ID>\n');
        }

        // set LO_RETURNED_TO field to E_RETURN_TO field value
        hField = record.getElement('E_RETURN_TO', 1, null);
        if (hField !== false) {
            form_data = form_data.concat('<LO_RETURNED_TO>' + hField.text() + '</LO_RETURNED_TO>\n');
        }

        // set LO_RETURNED_ID field to E_RETURN_TO_ID field value
        hField = record.getElement('E_RETURN_TO_ID', 1, null);
        if (hField !== false) {
            form_data = form_data.concat('<LO_RETURNED_ID>' + hField.text() + '</LO_RETURNED_ID>\n');
        }

        // set LO_STATUS to "Planning"
        form_data = form_data.concat('<LO_STATUS>Planning</LO_STATUS>\n');

        // set LO_PURPOSE to "Exhibition"
        form_data = form_data.concat('<LO_PURPOSE>"Exhibition</LO_PURPOSE>\n');

        // set LO_TYPE to "Outgoing Loan"
        form_data = form_data.concat('<LO_TYPE>Outgoing Loan</LO_TYPE>\n');

        // extract enquiry title
        hField = record.getElement('ENQ_TITLE', 1, null);
        if (hField !== false) {
            // set LO_TITLE to enqury title (ENQ_TITLE)
            form_data = form_data.concat('<LO_TITLE>' + hField.text() + '</LO_TITLE>\n');
            form_data = form_data.concat('<EXHIB_NAME>' + hField.text() + '</EXHIB_NAME>\n');
        }

        // extract enquiry ID
        hField = record.getElement('ENQ_ID', 1, null);
        if (hField !== false) {
            // set LO_ENQ_ID to enquiry ID
            form_data = form_data.concat('<LO_ENQ_ID>' + hField.text() + '</LO_ENQ_ID>\n');
        }

        // extract E_LOAN_ORG field
        hField = record.getElement('E_LOAN_ORG', 1, null);
        if (hField !== false) {
            // set LO_ORG to E_LOAN_ORG
            form_data = form_data.concat('<LO_ORG>' + hField.text() + '</LO_ORG>\n');
        }

        // extract E_LOAN_ORG_ID field
        hField = record.getElement('E_LOAN_ORG_ID', 1, null);
        if (hField !== false) {
            // set LO_ORG_ID to E_LOAN_ORG_ID
            form_data = form_data.concat('<LO_ORG_ID>' + hField.text() + '</LO_ORG_ID>\n');
        }

        // for each ocurrence of ASSO_REQ_GRP
        for (i = 1; i <= numocc; i++) {
            parentGroup = record.getGroup('ASSO_REQ_GRP', i, null);
            if (parentGroup != null) {
                // add <LOAN_OUT_ITEMS> start tag
                form_data = form_data.concat('<LOAN_OUT_ITEMS>\n');

                // extract ASSO_ITEM_ID field and add ITEM_ACC_NO field
                hField = record.getElement('ASSO_ITEM_ID', i, parentGroup);
                if (hField !== false) {
                    form_data = form_data.concat('<ITEM_ACC_NO>' + hField.text() + '</ITEM_ACC_NO>\n');
                }

                // extract ASSO_ITEM_SOURCE field and add ITEM_DB_NAME field
                hField = record.getElement('ASSO_ITEM_SOURCE', i, parentGroup);
                if (hField !== false) {
                    form_data = form_data.concat('<ITEM_DB_NAME>' + hField.text() + '</ITEM_DB_NAME>\n');
                }

                // extract ASSO_ITEM_TITLE field and add ITEM_LEGAL_TITLE field
                hField = record.getElement('ASSO_ITEM_TITLE', i, parentGroup);
                if (hField !== false) {
                    form_data = form_data.concat('<ITEM_LEGAL_TITLE>' + hField.text() + '</ITEM_LEGAL_TITLE>\n');
                }

                // set ITEM_DATE_VERIF field to X
                form_data = form_data.concat('<ITEM_DATE_VERIF>X</ITEM_DATE_VERIF>\n');

                // add </LOAN_OUT_ITEMS> end tag
                form_data = form_data.concat('</LOAN_OUT_ITEMS>\n');
            }
        }
    }

    // wrapup update transaction
    form_data = form_data.concat('</RECORD>');

    // prepare url to add LOAN_OUT record
    var url = getHomeSessId() + "?MANIPXMLRECORD&DATABASE=LOAN_OUT&CREATE=Y&BOTHPROCESSING=[M2A_SCRIPT]CHECK_LOAN_ITEM_GROUP.PAR";

    if (result.status == true) {
        // call adjax to add LOAN_OUT record and wait for response
        $.ajax({
            async: false,
            type: "POST",
            dataType: "xml",
            url: url,
            data: form_data,
            processData: false,
            cache: false,
            timeout: 300000,
            success: function(data) {
                if (jQuery.isXMLDoc(data)) {
                    xml_value = getXmlFieldValue(data, "error");
                    error_code = 3000;
                    if (xml_value != '') {
                        error_code = parseInt(xml_value, 10);
                    }
                    if (error_code != 0) {
                        result.status = false;
                        result.error_message = "Error " + error_code + " encountered while creating loan-out record.";
                    } else {
                        // extract <sisn> tag of LOAN_OUT record
                        xml_value = getXmlFieldValue(data, "sisn");
                        sisn = 0;
                        if (xml_value != '') {
                            sisn = parseInt(xml_value, 10);
                        }

                        // read LOAN_OUT record
                        url = getHomeSessId() + "?MANIPXMLRECORD&DATABASE=LOAN_OUT&READ=Y&KEY=SISN&VALUE=" + sisn;
                        $.ajax({
                            async: false,
                            type: "GET",
                            dataType: "xml",
                            url: url,
                            timeout: 10000,
                            success: function(data) {
                                if (jQuery.isXMLDoc(data)) {
                                    xml_value = getXmlFieldValue(data, "error");
                                    error_code = 3000;
                                    if (xml_value != '') {
                                        error_code = parseInt(xml_value, 10);
                                    }
                                    if (error_code != 0) {
                                        alert("Error " + error_code + " encountered while reading loan-out record.");
                                    } else {
                                        // extract <LO_ID> tag of LOAN_OUT record
                                        xml_value = getXmlFieldValue(data, "LO_ID");
                                        if (xml_value != '') {
                                            result.lo_id = xml_value;
                                        }
                                    }
                                }
                            },
                            error: function(xhr, status, error) {
                                alert("Unable to send command to read loan-out record because of " + error + ".");
                            }
                        });
                    }
                }
            },
            error: function(xhr, status, error) {
                result.status = false;
                result.error_message = "Unable to send command to create loan-out record because of " + error + ".";
            }
        });
    }

    return result;
}

// this function performs the enquiry wrapup record processing.
// It shows the LOAN_OUT id to user.
function wrapupEnquiryProcessing(html_response, data) {
    if (data.create_loanout) {
        if (data.status == true) {
            alert('Please visit the Loan-Out module to complete the "' + data.lo_id + '" loan-out record.');
        }
    }
}


// This function commits the current enquiry record and generates the specified report.
// The report is a PDF file which is donloaded to the browsder for saving.
function downLoadEnquiryReport(report_spec) {
    alert("Generating " + report_spec);
}


// RL-20220601
// This function sets the field deaults of new correspondence occurrence.
function setCorrespondenceDefault(calling_field) {
    var source_field;

    // check CORRESPOND_DATE
    source_field = $('#CORRESPOND_DATE').val();
    var has_date = (source_field != null && source_field != '') ? true : false;

    // check CORRESPOND_TYPE
    source_field = $('#CORRESPOND_TYPE').val();
    if (source_field == null) {
        source_field = '';
    }
    var has_type = (source_field != '') ? true : false;
    var incoming_mail = (source_field == 'Incoming') ? true : false;

    var email_sent = false;
    source_field = $('#CORRESPOND_SENT').val();
    if (source_field != null && source_field == 'Y') {
        email_sent = true;
    }

    // check CORRESPOND_WHO
    source_field = $('#CORRESPOND_WHO').val();
    var has_who = (source_field != null && source_field != '') ? true : false;

    // check CORRESPOND_SUBJ
    source_field = $('#CORRESPOND_SUBJ').val();
    var has_subject = (source_field != null && source_field != '') ? true : false;

    // check MESSAGE_TEXT
    source_field = $('#MESSAGE_TEXT').html();
    var has_email_body = (source_field != null && source_field != '') ? true : false;

    if (has_date || has_type || has_who || has_subject || has_email_body) {
        document.getElementById("MESSAGE_TEXT").contentEditable = (incoming_mail || email_sent) ? false : true;
        if (!incoming_mail && !email_sent) {
            handle_send_button($('#CORRESPOND_TYPE'));
        }
    } else {
        document.getElementById("MESSAGE_TEXT").contentEditable = true;

        // set CORRESPOND_DATE to today's date
        source_field = new Date().toISOString().slice(0, 10);
        $('#CORRESPOND_DATE').val(source_field).change();

        // set CORRESPOND_WHO to current staff name
        source_field = $('#ENQ_HANDLED_BY').val();
        if (source_field == null || source_field == '') {
            source_field = getUserName();
        }
        $('#CORRESPOND_WHO').val(source_field).change();

        // set CORRESPOND_SUBJ to ENQ_TITLE
        source_field = $('#ENQ_TITLE').val();
        if (source_field == null) {
            source_field = '';
        }
        $('#CORRESPOND_SUBJ').val(source_field).change();

        // set CORRESPOND_TYPE to "Outgoing"
        $('#CORRESPOND_TYPE').val("Outgoing").change();
        handle_send_button($('#CORRESPOND_TYPE'));
    }
}