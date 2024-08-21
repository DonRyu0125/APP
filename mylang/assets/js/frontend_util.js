/*
  Supported function for Online user routines

  Version:   1.00
  Author:    Richard Lee - MINISIS Inc
  Date:      January 2021

  Online user routine is activated by declaring class in the HTML tag.
  The user routine classes are

  1)   get_ai_value_exit - get next AI value
  2)   duplicate_occ_exit - duplicate repeating grouped field ocurrence
  3)   get_index_value_exit - browse fast access value list and paste selected value in specified field
  4)   set_date_exit - set relative date
  5)   generate field values
       class: generate_field_exit
       parameter: data-generate{1-n}=<query>,<target>,<source>
  6)   call_exit - call exit in <a> tag. one or more exit classes are specified.
  7)   protect field values
       class: protect_field_exit
       parameter: data-generate{1-n}=<query>,<target>
  8)   unprotect field values
       class: unprotect_field_exit
       parameter: data-generate{1-n}=<query>,<target>
  9)   init_call_exit - call user routine after form is loaded. It is worked in conjunction with other user routine class.
  10)  mandatory_check - check to see mandatory field is missing
       parameter: data-mandatory=<query expression>
  11)  <table> tag with "generic_table" class and data-exit="handleGroupOccDataEntry" - show group field data entry in popup window
  12)  show_optional_data_exit - show data section according to the current field value
       parameter: [data-source_value="tag ID of source field value"]
                  [data-section-label="class name of data section". If omiited, "data-section" is used.
                  data-toggle-section="data section <div> id=<Field vlaue>[,data section <div> id=<Field vlaue>]..."
  13)  lookup_exit - looks up field values
       parameter: data-lookup="<lookup db>,<llokup_key>[,<source field>,<target field>]..."
  14)  handleGroupOccDataEntry function (callback user routine) - it is called from the handler of the "generic table" class
  15)  readUserRole - reads MWI user role cookie.
  16)  show_optional_tab_exit - show tabbed data entey form according to the current field value
       parameter: [data-source_value="tag ID of source field value"]
                  data-toggle-tab="<field value>=<tab id>[;<tab id>]...[|<field value>=<tab id>[;<tab id>]...]..."
  17)  unique_key_check - ensure field value is unique within the database
  18)  edit source record whose ID is stored in the source field of current record
       class edit_record - built-in core class
       parameter: data-sourcedb=<source database name> data-source=<mnemonic of source field> data-key=<source primary key mnemonic>
  19)  toggle_section - show or hide section according to the result     of query expression // RL-20220131
       parameter: data-toggle="<query expression>"
                  [data-toggle-div="<div> tag ID"]
                  [data-toggle-tabs="<a> tag ID[,<a> tag ID]...]
  20)  a.image_clicked - show image in popup 900x600 window  // RL-20220131
  21)  a.toggle_data_section - show and hide section by toggling button
       parameters: data-section=<div tag> ID
  22)  copy_field_exit - copy current field value to target field if target feld is empty
       parameters: data-copy="<field>[,<field>]..."
                   data-valid="<value>[|<value>]...
  23)  generate_report_exit & a.call_exit - show PDF report in the popup window
       parameters: data-database=<database name>
                   data-report=<PDF report name>
                   data-exp=<search exproession> - it contains marker(!value1) where search value is filled in
                   data-value1=<search value>
  24)  gen_set_cond_help - show sub-menu values according to the main menu value
       parameters: data-main=<mnemonic of primary key of main menu database>
                   data-help=<mnemonic of sub menu values>
                   data-source=<mnemonic of main menu value>. if omitted, current field value is assumed
                   data-display=<mnemonic of sub menu in current form>
                   data-table=<main menu database name>
  25) go_to_occurrence - switch repeatable field to the specified occurrence
      parameters:  data-target=<mnemonic of repeatable field>
                   data-goto={FIRST|LAST|NEW}
  26) data-next-exit - specifies the ID of the input tag which is linked to next user exit
*/

const   not_token           = "-";
const   or_token            = "+";
const   xor_token           = "#";
const   and_token           = "*";
const   open_token          = "(";
const   close_token         = ")";
const   space_token         = " ";

const byPosition            = 1;
const byKey                 = 2;
const jm_start              = "start";
const jm_end                = "end";
const jm_next               = "next";
const jm_startDate          = "startDate";
const jm_dateOperator       = "dateOperator";
const jm_dateUnit           = "dateUnit";
const jm_unitType           = "unitType";
const jm_year               = "year";
const jm_month              = "month";
const jm_day                = "day";
const jm_leftop             = "leftop";
const jm_rightop            = "rightop";
const jm_operator           = "operator";


// types of jm_dateOperator
const plus_date             = 1;
const minus_date            = 2;

// types of jm_unitType
const day_type              = 1;
const month_type            = 2;
const year_type             = 3;


/* **********************************************************************************
  exitDefaultController()

  This function is the controller of user routines. User routine is called
  after HTML field is touched.
  Developer updates this function if new user routine class is used in the application.
************************************************************************************ */

function exitDefaultController(calling_field)
{
  var proceedProcessing = true;
  var exitResult;

  // call 'generate_field_exit' class user routine
  if ( $(calling_field).hasClass('generate_field_exit') ) {
    if ( typeof processGenerateFieldRule == 'function' ) {
      exitResult = processGenerateFieldRule (calling_field);
    }
  }

  // call 'protect_field_exit' class user routine
  if ( $(calling_field).hasClass('protect_field_exit') ) {
    if ( typeof processProtectFieldRule == 'function' ) {
      exitResult = processProtectFieldRule (calling_field);
    }
  }

  // call 'unprotect_field_exit' class user routine
  if ( $(calling_field).hasClass('unprotect_field_exit') ) {
    if ( typeof processUnprotectFieldRule == 'function' ) {
      proceedProcessing = processUnprotectFieldRule (calling_field);
    }
  }

  // call 'unique_key_check' class user routine // RL-2021-09-07
  if ( $(calling_field).hasClass('unique_key_check') ) {
    if ( typeof checkUniqueKey == 'function' ) {
      proceedProcessing = checkUniqueKey (calling_field);
    }
  }

  // call 'show_optional_data_exit' class user routine
  if ( $(calling_field).hasClass('show_optional_data_exit') ) {
    toggleSection(calling_field);
  }

  // call 'show_optional_tab_exit' class user routine
  if ( $(calling_field).hasClass('show_optional_tab_exit') ) {
    toggleTab(calling_field);
  }

  // call 'lookup_exit' class user routine
  if ( $(calling_field).hasClass('lookup_exit') ) {
    exitResult = lookupFieldValue(calling_field);
  }

  // RL-20220131
  // call 'toggle_section' class user routine
  if ( $(calling_field).hasClass('toggle_section') ) {
    toggleDivTag(calling_field);
  }

  // RL-20220131
  // call 'toggle_section' class user routine
  if ( $(calling_field).hasClass('toggle_section') ) {
    toggleDivTag(calling_field);
  }

  // RL-202203151
  // call 'copy_field_exit' class user routine
  if ( $(calling_field).hasClass('copy_field_exit') ) {
    copyField(calling_field);
  }

  // RL-20220311
  // call 'generate_report_exit' class user routine
  if ( $(calling_field).hasClass('generate_report_exit') ) {
    generateReport(calling_field);
  }

  // RL-20220601
  // call 'gen_set_cond_help' class user routine
  if ( $(calling_field).hasClass('gen_set_cond_help') ) {
    setSubMenu(calling_field);
  }

  // call 'go_to_occurrence' class user routine
  if ( $(calling_field).hasClass('go_to_occurrence') ) {
    gotoOccurrence(calling_field);
  }

  // Is data-next-exit attribute defined?
  var data_option = $(calling_field).data('next-exit');
  if ( data_option != null ) {
    var next_exit = $('#'+data_option);
    if ( next_exit != null ) {
      // call next user exit
      exitDefaultController(next_exit);
    }
  }

  return proceedProcessing;
}


/* *****************************************************************************
   RpnStack class

   This class analyzes query expresssion and prodcues Reverse-Polish-Notation
   stack for query expression.
******************************************************************************** */
function RpnStack(exp)
{
  this.valid = false;

  var RPN_stack = [];
  var token = [];

  /* *************************************************************************************
    RpnStack class - contructor prcoessing
  *************************************************************************************** */
  var ok = parse ( exp );
  if ( ok ) {
    this.valid = true;
  }

  /* *************************************************************************************
    "isValid" method - check to see query expression is valid
  *************************************************************************************** */
  this.isValid = function ()
  {
    return this.valid;
  }

  /* *************************************************************************************
    "length" method - return length of RPN stack
  *************************************************************************************** */
  this.length = function ()
  {
    if ( !this.valid ) {
      return 0;
    }

    return RPN_stack.length;
  }

  /* *************************************************************************************
    "at" method - return RPN stack entry at the specified index. Etnry is numbered from 0.
  *************************************************************************************** */
  this.at = function ( index )
  {
    if ( !this.valid || index >= RPN_stack.length ) {
      return false;
    }

    return RPN_stack[index];
  }

  /* *************************************************************************************
    utility functions
  *************************************************************************************** */
  // process BNF - <query> ::= <operand> <or_operand>*
  function BNF_query( token_ix )
  {
    var OrgPrnSize = RPN_stack.length;
    var ok = true;
    var ix = token_ix;
    var result;

    // evaluate <operand>
    result = BNF_operand ( ix );
    if ( result == -1 ) {
      ok = false;
    }
    else {
      ix = result;

      // evaluate <or_operand>*
      while ( true ) {
        result = BNF_orOperand ( ix );
        if ( result == -1 ) {
          break;
        }
        ix = result;
      }
    }

    if ( !ok ) {
      var PrnSize = RPN_stack.length;
      while ( PrnSize > OrgPrnSize ) {
        RPN_stack.pop();
        PrnSize--;
      }
      return -1;
    }

    return ix;
  }

  // process BNF - <operand> ::= <operand_expression> <and_operand>*
  function BNF_operand ( token_ix )
  {
    var OrgPrnSize = RPN_stack.length;
    var ok = true;
    var ix = token_ix;
    var result;

    // evaluate <operand_expression>
    result = BNF_operandExpression( ix );
    if ( result == -1 ) {
      ok = false;
    }
    else {
      ix = result;

      // evaluate <and_operand>*
      while ( true ) {
        result = BNF_andOperand ( ix );
        if ( result == -1 ) {
          break;
        }
        ix = result;
      }
    }

    if ( !ok ) {
      var PrnSize = RPN_stack.length;
      while ( PrnSize > OrgPrnSize ) {
        RPN_stack.pop();
        PrnSize--;
      }
      return -1;
    }

    return ix;
  }

  // process BNF - <operand_expression> ::= [<not>] {<subexp> | <simple_exp>}
  function BNF_operandExpression ( token_ix )
  {
    var OrgPrnSize = RPN_stack.length;
    var ok = true;
    var ix = token_ix;
    var has_not_op = false;
    var result;

    // evaluate [<not>]
    result = BNF_notOp( ix );
    if ( result != -1 ) {
      has_not_op = true;
      ix = result;
    }

    // evaluate <subexp>
    result = BNF_subExp ( ix );
    if ( result == -1 ) {
      result = BNF_simpleExp ( ix );
    }

    if ( result == -1 ) {
      ok = false;
    }
    else {
      ix = result;

      if ( has_not_op ) {
        RPN_stack.push(not_token);
      }
    }

    if ( !ok ) {
      var PrnSize = RPN_stack.length;
      while ( PrnSize > OrgPrnSize ) {
        RPN_stack.pop();
        PrnSize--;
      }
      return -1;
    }

    return ix;
  }

  // process BNF - <not> ::= -
  function BNF_notOp ( token_ix )
  {
    // check 'not' token
    if ( token_ix < token.length && token[token_ix] == not_token ) {
      return ++token_ix;
    }

    return -1;    // not a NOT operator
  }

  // process BNF - <subexp> ::=  ( <query> )
  function BNF_subExp ( token_ix )
  {
    var OrgPrnSize = RPN_stack.length;
    var ok = true;
    var ix = token_ix;
    var result;

    // check "(" token
    if ( ix >= token.length || token[ix] != open_token ) {
      ok = false;
    }
    else {
      ix++; // skip "(" token

      // evaluate <query>
      result = BNF_query( ix );
      if ( result == -1 ) {
        ok = false;
      }
      else {
        ix = result;

        // check ")" token
        if ( ix < token.length && token[ix] == close_token ) {
          ix++;  // skip ")" token
        }
        else {
          ok = false;
        }
      }
    }

    if ( !ok ) {
      var PrnSize = RPN_stack.length;
      while ( PrnSize > OrgPrnSize ) {
        RPN_stack.pop();
        PrnSize--;
      }
      return -1;
    }

    return ix;
  }

  // process BNF - <simple_exp> ::= <mnemonic> <space>* [{=|<>|>=|>|<=|<|++}] <space>* <value>
  function BNF_simpleExp ( token_ix )
  {
    // simple expresion is already paresd in regExp and is a single entry in the token array
    // simple expression string size is always greater than one.
    if ( token_ix >= token.length || token[token_ix].length <= 1 ) {
      return -1;
    }

    // push token to PRN array
    RPN_stack.push ( token[token_ix] );

    return ++token_ix;
  }

  // process BNF - <space> ::=
  function BNF_space ( token_ix )
  {
    if ( token_ix >= token.length || token[token_ix] != space_token ) {
      return -1;
    }

    return ++token_ix;  // skip space token
  }

  // process BNF - <and_operand> ::= * <operand>
  function BNF_andOperand ( token_ix )
  {
    var OrgPrnSize = RPN_stack.length;
    var ok = true;
    var ix = token_ix;
    var result;

    // check "and" token
    if ( ix >= token.length || token[ix] != and_token ) {
      ok = false;
    }
    else {
      ix++;

      // evaluate <operand>
      result = BNF_operand ( ix );
      if ( result == -1 ) {
        ok = false;
      }
      else {
        ix = result;

        // push "and" operator to PRN array
        RPN_stack.push ( and_token );
      }
    }

    if ( !ok ) {
      var PrnSize = RPN_stack.length;
      while ( PrnSize > OrgPrnSize ) {
        RPN_stack.pop();
        PrnSize--;
      }
      return -1;
    }

    return ix;
  }

  // process BNF - <or_operand> ::= <xor_op> | <or_op>
  function BNF_orOperand ( token_ix )
  {
    var ix = token_ix;
    var result;

    if ( ix >= token.length ) {
      return -1;
    }

    result = BNF_orOp( ix );
    if ( result == -1 ) {
      result = BNF_xorOp( ix );
    }

    return result;
  }

  // process BNF - <xor_op> ::= # <operand>
  function BNF_xorOp ( token_ix )
  {
    var OrgPrnSize = RPN_stack.length;
    var ok = true;
    var ix = token_ix;
    var result;

    if ( ix >= token.length || token[ix] != xor_token ) {
      ok = false;
    }
    else {
      ix++;  // skip "xor" token

      result = BNF_operand( ix );
      if ( result == -1 ) {
        ok = false;
      }
      else {
        ix = result;

        // push "xor" token to PRN array
        RPN_stack.push(xor_token);

      }
    }

    if ( !ok ) {
      var PrnSize = RPN_stack.length;
      while ( PrnSize > OrgPrnSize ) {
        RPN_stack.pop();
        PrnSize--;
      }
      return -1;
    }

    return ix;
  }

  // process BNF - <or_op> ::= + <operand>
  function BNF_orOp ( token_ix )
  {
    var OrgPrnSize = RPN_stack.length;
    var ok = true;
    var ix = token_ix;
    var result;

    if ( ix >= token.length || token[ix] != or_token ) {
      ok = false;
    }
    else {
      ix++;

      result = BNF_operand( ix );
      if ( result == -1 ) {
        ok = false;
      }
      else {
        ix = result;

        // push "or" token to PRN array
        RPN_stack.push(or_token);
      }
    }

    if ( !ok ) {
      var PrnSize = RPN_stack.length;
      while ( PrnSize > OrgPrnSize ) {
        RPN_stack.pop();
        PrnSize--;
      }
      return -1;
    }

    return ix;
  }

  // tokensize query expression and return token array
  function tokenize ( expression )
  {
    const tokenRegExp = /((?<open>(\s*\(\s*))|(?<close>(\s*\)\s*))|(?<and>(\s*\*\s*))|(?<or>(\s*\+\s*))|(?<xor>(\s*#\s*))|(?<not>((\s*-\s*)))|(?<space>(\s+))|(?<statement>([^\s=\>\<]){1,20}(\s)*(==|=|\<\>|\>=|\>|\<=|\<|\s)(\s)*(!\+|!-|'(''|[^'])+'|[^-\*\+]+)))/i  // 'token regExp

    var return_value = false;
    var tokenArray = [];
    var exp = expression;

    while ( exp.length > 0 ) {
      var result = tokenRegExp.exec(exp);
      if ( result == null ) {
        break;
      }
      else {
        if ( result.groups.statement != undefined ) {
          tokenArray.push(result.groups.statement);
          exp = exp.substring(result.groups.statement.length);
        }
        else if ( result.groups.not != undefined ) {
          tokenArray.push(not_token);
          exp = exp.substring(result.groups.not.length);
        }
        else if ( result.groups.open != undefined ) {
          tokenArray.push(open_token);
          exp = exp.substring(result.groups.open.length);
        }
        else if ( result.groups.close != undefined ) {
          tokenArray.push(close_token);
          exp = exp.substring(result.groups.close.length);
        }
        else if ( result.groups.and != undefined ) {
          tokenArray.push(and_token);
          exp = exp.substring(result.groups.and.length);
        }
        else if ( result.groups.or != undefined ) {
          tokenArray.push(or_token);
          exp = exp.substring(result.groups.or.length);
        }
        else if ( result.groups.xor != undefined ) {
          tokenArray.push(xor_token);
          exp = exp.substring(result.groups.xor.length);
        }
        else if ( result.groups.space != undefined ) {
          tokenArray.push(space_token);
          exp = exp.substring(result.groups.space.length);
        }
        else {
          break;
        }
      }
    }

    if ( exp.length == 0 ) {
      return_value = true;
      token = tokenArray;
    }

    return return_value;
  }

  // convert token array to RPN array
  function convertRPN ( )
  {
    var return_value = false;
    var result = BNF_query ( 0 );
    if ( result != -1 && result >= token.length ) {
      return_value = true;
    }

    return return_value;
  }

  // parse query expression and return token array
  function parse ( exp )
  {
    var return_value = false;
    var ok = tokenize ( exp );
    if ( ok ) {
      var ok = convertRPN ( );
      if ( ok ) {
        return_value = true;
      }
    }

    return return_value;
  }
}

/* *****************************************************************************
   queryExpression class

   This class handles the query expression.
******************************************************************************** */
function queryExpression ( exp )
{
  this.rpn = new RpnStack(exp);
  this.query_exp = exp;
  this.valid = false;

  if ( this.rpn.isValid() ) {
    this.valid = true;
  }

  // Is query expression valid?
  this.isValid = function ( )
  {
    return this.valid;
  }

  // evaluate query expression
  this.evaluate = function ( calling_field )
  {
    var return_value = null;

    if ( this.valid ) {
      var rpn_stack_size = this.rpn.length();
      var i = 0;
      var result_stack = [];
      var rpn_entry;
      var reuslt1, result2;
      for ( i = 0 ; i < rpn_stack_size ; i++ ) {
        rpn_entry = this.rpn.at(i);
        switch ( rpn_entry ) {
          case not_token:
            result1 = result_stack.pop();
            if ( result1 ) {
              result1 = false;
            }
            else {
              result1 = true;
            }
            result_stack.push ( result1 );
            break;
          case or_token:
            result1 = result_stack.pop();
            result2 = result_stack.pop();
            if ( result1 || result2 ) {
              result1 = true;
            }
            else {
              result1 = false;
            }
            result_stack.push ( result1 );
            break;
          case xor_token:
            result1 = result_stack.pop();
            result2 = result_stack.pop();
            if ( (result1 && result2) || (!result1 && !result2) ) {
              result1 = false;
            }
            else {
              result1 = true;
            }
            result_stack.push ( result1 );
            break;
          case and_token:
            result1 = result_stack.pop();
            result2 = result_stack.pop();
            if ( result1 && result2 ) {
              result1 = true;
            }
            else {
              result1 = false;
            }
            result_stack.push ( result1 );
            break;
          default:
            // parse query statement
            var exp_result = parseQueryComponent ( rpn_entry );
            if ( exp_result != null ) {
              // evaluate query components
              result1 = evaluateQueryComponent ( calling_field, exp_result.groups[jm_leftop], exp_result.groups[jm_operator],
                exp_result.groups[jm_rightop] );
            }
            else {
              result1 = false;
            }

            result_stack.push ( result1 );
            break;
        }
      }

      // set return value
      return_value = result_stack.pop();
    }

    return return_value;
  }
}

/* *************************************************************************************
  utility functions
*************************************************************************************** */

// RL-2021-02-09

/**
**
**  Skip a parameter option. the start offset and end offset pf parameter and
**  offset of next option are returned in json object.
**
**/

function skip_param_option ( paramline, start_loc, option_name )
{
  var return_value = {};
  var end_loc = 0;
  var next_loc = 0;
  var found = true;
  var del = '\'';
  var comma = ',';
  var found_loc;

  return_value[jm_start] = -1;
  return_value[jm_end] = -1;
  return_value[jm_next] = -1;

  if ( option_name != null ) {
    found_loc = paramline.toUpperCase().indexOf(option_name.toUpperCase(), start_loc);
    if ( found_loc == -1 ) {
      found = false;
    }
    else {
      if ( found_loc == start_loc
      ||   paramline.startsWith(' ', found_loc-1)
      ||   paramline.startsWith(comma, found_loc-1) ) {
        start_loc = found_loc + option_name.length;
      }
      else {
        found = false;
      }
    }
  }

  if ( found ) {
    // Is it a literal?
    if ( paramline.startsWith(del, start_loc) ) {
      start_loc += del.length;

      end_loc = paramline.indexOf(del, start_loc);
      if ( end_loc == -1 ) {
        found = false;
      }
      else {
        next_loc = end_loc;
        end_loc--;  // offset to last character of value
      }
    }
    else {
      // look for , character or end of line
      end_loc = paramline.indexOf(comma, start_loc);
      if ( end_loc == -1 ) {
        // if comma not found, say option value up to the end of string
        next_loc = paramline.length;
        end_loc = next_loc - 1;
      }
      else {
        next_loc = end_loc;
        end_loc--;
      }
    }
  }

  if ( found ) {
    return_value[jm_start] = start_loc;
    return_value[jm_end] = end_loc;
    return_value[jm_next] = next_loc;
  }

  return return_value;
}


/**
**
**  skip delimiter and return the offdet of first non-blank character after delimiter.
**
**/
function skip_delimiter ( paramline, start_loc, del )
{
  var return_value = -1;
  var i;

  if ( paramline.startsWith(del, start_loc) ) {
    start_loc += del.length;

    // skip spaces
    while ( start_loc < paramline.length ) {
      if ( !paramline.startsWith(' ', start_loc) ) {
        // if found non-blank character, exit loop
        break;
      }
      start_loc++;
    }
    return_value = start_loc;
  }

  return return_value;
}


/**
**
**  search and extract parameter value from parameter line.
**
**/

function parseParameter ( paramline, option, position, option_name )
{
  var   skip_result = {};
  var   return_value = "";
  var   start_loc;
  var   i;

  if ( position != null ) {
    possition = 1;
  }

  if ( position >= 1 ) {
    switch ( option ) {
      case byPosition:
        start_loc = 0;
        // skip positional parameters
        i = 1;
        while ( i < position && start_loc < paramline.length ) {
          skip_result = skip_param_option ( paramline, start_loc, null );
          start_loc = skip_result[jm_next];
          if ( start_loc == -1 ) {
            break;
          }
          // skip delimiter
          start_loc = skip_delimiter ( paramline, start_loc, ',' );
          if ( start_loc == -1 ) {
            // if no comma, say syntax error
            start_loc = paramline.length;
            break;
          }
          i++;
        }
        if ( start_loc < paramline.length ) {
          skip_result = skip_param_option ( paramline, start_loc, null );
          if ( skip_result[jm_start] != -1 ) {
            return_value = paramline.substring(skip_result[jm_start], skip_result[jm_end]+1);
          }
        }
        break;
      case byKey:
        if ( option_name != null ) {
          var option_keyword = option_name + '=';

          // search and extract key option
          i = 1;
          start_loc = 0;
          while ( i < position ) {
            skip_result = skip_param_option ( paramline, start_loc, 1, option_keyword );
            start_loc = skip_result[jm_next];
            if ( skip_result[jm_start] == -1 ) {
              start_loc = paramline.length;
              break;
            }
            i++;

            // skip delimiter
            if ( start_loc < paramline.length ) {
              start_loc = skip_delimiter ( paramline, start_loc, ',' );
              if ( start_loc == -1 ) {
                // if no comma, say syntax error
                start_loc = paramline.length;
                break;
              }
              start_loc++;  // skip commna
            }
          }
          if ( start_loc < paramline.length ) {
            skip_result = skip_param_option ( paramline, start_loc, 1, option_keyword );
            if ( skip_result[jm_start] != -1 ) {
              return_value = paramline.substring(skip_result[jm_start], skip_result[jm_end]+1);
            }
          }
        }
        break;
    }
  }

  return return_value;
}


/**
**
**  This function parses date expression and reutrns date parameters in json object.
**  The date parameters are: start_date, date operator(+ or -), number of unit
**  and unit type(D, M and Y).
**
**/
function parseDateExp ( dateExpression )
{
  const dateRepExp = /(?<date>(\+\+1|\d\d\d\d-\d\d-\d\d))?(?<operator>[\+-])(?<unit>\d+)(?<type>[DMYW])$/i
  var return_value = false;

  // parse date expression
  var results = dateRepExp.exec(dateExpression.toUpperCase());
  if ( results != null ) {
    var start_date = "";
    if ( results.groups.date == 'undefined' || results.groups.date === '++1' ) {
      today = new Date();
      start_date = today.toISOString().substring(0, 10);
    }
    else {
      start_date = results.groups.date;
    }
    return_value = {};
    return_value[jm_startDate] = start_date;
    return_value[jm_dateOperator] = results.groups.operator;
    return_value[jm_dateUnit] = results.groups.unit;
    return_value[jm_unitType] = results.groups.type.toUpperCase();
  }

  return return_value;
}


/*
   getDayCount()

   This function returns number of days of date string which is in format of YYYY-MM_DD.
*/

function getDayCount ( year, month, day )
{
  var count = 0;
  var i = 0;

  // convert year to day count
  for ( i = 0 ; i < year ; i++ ) {
    if ( (i % 4 == 0 && i %100 != 0) || (i % 400 == 0 && i != 0) ) {
      count += 366;
    }
    else {
      count += 365;
    }
  }

  // convert month to day count
  for ( i = 1 ; i < month ; i++ ) {
    switch ( i ) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
        count += 31;
        break;

      case 2:
        if ( (year % 4 == 0 && year % 100 != 0)
        ||   (year % 400 == 0 && year != 0) ) {
          count += 29;            /* leap year */
        }
        else {
          count += 28;
        }
        break;

      case 4:
      case 6:
      case 9:
      case 11:
        count += 30;
        break;
    }
  }

  /* add days to day count */
  count += day;

  return count;
}


/*
   getDateComponent()

   This function determines year, month and day of day count.
*/

function getDateComponent ( day_count )
{
  var  result = {};
  var  temp_count;
  var  i;
  var  max_day;
  var  month;
  var  year;

  /* determine year */
  year = 0;
  max_day = 365;
  temp_count = day_count;

  while ( temp_count > max_day )  {
    year++;
    temp_count -= max_day;

    if ( (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0 && year != 0)) {
      max_day = 366;
    }
    else {
      max_day = 365;
    }
  }
  result[jm_year] = year;

  /* determine month of year */
  month = 1;
  for ( i = 1 ; i < 12 ; i++ ) {
    switch ( i ) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
        max_day = 31;
        break;

      case 2:
        if ( (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0 && year != 0) ) {
          max_day = 29;            /* leap year */
        }
        else {
          max_day = 28;
        }
        break;

      case 4:
      case 6:
      case 9:
      case 11:
        max_day = 30;
        break;
    }

    if ( temp_count <= max_day ) {
      break;
    }

    month++;
    temp_count -= max_day;
  }
  result[jm_month] = month;

  /* determine day of month */
  result[jm_day] = temp_count;

  return result;
}


/**
**
**  This function computes the relative date and produces the date string.
**
**/
function buildRelativeDateString ( dateExpression, inclusive_date )
{
  var year = parseInt(dateExpression[jm_startDate].substring(0, 4));
  var month = parseInt(dateExpression[jm_startDate].substring(5, 7));
  var day = parseInt(dateExpression[jm_startDate].substring(8));

  var numdays = getDayCount ( year, month, day );
  var minus_value = (dateExpression[jm_dateOperator] == "+") ? false : true;
  var num_units = parseInt ( dateExpression[jm_dateUnit] );

  if ( dateExpression[jm_unitType] == 'W' ) {
    if ( minus_value ) {
      if ( numdays >= num_units * 7 ) {
        numdays -= num_units * 7;
      }
    }
    else {
      numdays += num_units * 7;
    }
  }
  else if ( dateExpression[jm_unitType] == 'M' ) {
    while ( num_units > 0 ) {
      if ( minus_value ) {
        if ( month == 1 ) {
          year--;
          month = 12;
        }
        else {
          month--;
        }
      }
      else {
        if ( month == 12 ) {
          year++;
          month = 1;
        }
        else {
          month++;
        }
      }

      num_units--;
    }

    /* compute day count of relative date */
    numdays = getDayCount ( year, month, day );
  }
  else if ( dateExpression[jm_unitType] == 'Y' ) {
    if ( minus_value ) {
      if ( year > num_units ) {
        year -= num_units;
      }
    }
    else {
      year += num_units;
    }

    /* compute day count of relative date */
    numdays = getDayCount ( year, month, day );
  }
  else { // default to "D"
    if ( minus_value ) {
      if ( numdays >= num_units ) {
        numdays -= num_units;
      }
    }
    else {
      numdays += num_units;
    }
  }

  if ( inclusive_date ) {
    if ( minus_value ) {
      numdays++;
    }
    else {
      if ( numdays > 0 ) {
        numdays--;
      }
    }
  }

  // get date components (year, month and day)
  var date_comp = getDateComponent ( numdays );

  // retrun date string
  var return_value = date_comp[jm_year].pad(4) + '-' + date_comp[jm_month].pad(2) + '-' + date_comp[jm_day].pad(2);

  return return_value;
}


/**
**
**  This function generates relative data in YYYY-MM-DD format.
**
**/
function generateRelativeDate ( dateExpression )
{
  var return_value = false;

  // parse date expression
  var date_param = parseDateExp ( dateExpression );
  if ( date_param != false ) {
    var dateResult = buildRelativeDateString ( date_param, false );
    if ( dateResult != false ) {
      return_value = dateResult;
    }
  }

  return return_value;
}


/*
  setRelativeDate()

  This function computes the relative date and saves it in the specified HTML field.
*/
function setRelativeDate(caller)
{
  var paramline = $(caller).data('param');

  if ( paramline != null ) {
    // extract target field ID and date expression */
    var field_id = parseParameter ( paramline, byPosition, 1 );
    var date_exp = parseParameter ( paramline, byPosition, 2 );

    if ( field_id != null && date_exp != null ) {
      var newDate = generateRelativeDate(date_exp);
      if ( newDate == false ) {
        alert ( 'Date expression "' + date_exp + '" is invalid.' );
      }
      else {
        var target_field = document.getElementById(field_id);
        if ( target_field != null ) {
          $(target_field).val(newDate);
          $(target_field).change();
        }
      }
    }
  }
}

/*
  getAiValue()

  This function sends reuqest to server to obtain next AI value and save it
  in the specified target field. It reads the parameter from the
  data-param attribute which has format: <target field id>,<AI scheme name>
*/
function getAiValue(caller)
{
  var paramline = $(caller).data('param');

  if ( paramline != null ) {
    // extract target field ID and AI scheme name */
    var field_id = parseParameter ( paramline, byPosition, 1 );
    var ai_scheme = parseParameter ( paramline, byPosition, 2 );

    if ( field_id == "" || ai_scheme == "" ) {
      alert ( "Either field ID or AI scheme name is missing." );
    }
    else {
      read_n_save_ai_value ( ai_scheme, field_id );
    }
  }
}


/*
  selectIndexKey()

  This function shows the fast access table and returns the selected value in
  the target field.  It reads the target field ID, database name and fast
  access field mnemonic from the data-param, data-val-database attribute
  and data-val-field attribute respectively.
*/
function selectIndexKey(caller)
{
  var target_field = null;
  var target_field_id = caller.data('param');
  if ( target_field_id != null && target_field_id != "" ) {
    target_field = document.getElementById(target_field_id);
  }

  if ( target_field != null ) {
    getValidatedKeyValue ( caller, $(target_field) );
  }
}

// function extracts field value and copies th field value to the field in new group occurrence.
function processFieldList ( field_list, start_ix, stop_ix, current_occurrence, current_occ_group, new_occ_group )
{
  var ix, i;
  var xml_field_id;
  var current_field;
  var field_value;
  var occ, child_occ;
  var source_field_id, target_field_id;
  var field_id_parm;
  var repeating, start_group, end_group, same_group;
  var add_value;
  var new_field;

  var record = currentAppInterface.app_record;

  for ( ix = start_ix ; ix < stop_ix ; ix++ ) {
    same_group = false;
    field_id_parm = field_list[ix].split('=');
    if ( field_id_parm.length == 2 ) {
      source_field_id = field_id_parm[0];
      target_field_id = field_id_parm[1];
    }
    else {
      source_field_id = field_list[ix];
      target_field_id = field_list[ix];
      same_group = true;
    }

    repeating = false;
    start_group = false;

    if ( source_field_id.indexOf('+') == 0 ) {
      start_group = true;
      source_field_id = source_field_id.substring(1);
    }
    if ( source_field_id.indexOf('*') == 0 ) {
      repeating = true;
      source_field_id = source_field_id.substring(1);
    }

    if ( same_group ) {
      target_field_id = source_field_id;
    }

    xml_field_id = source_field_id.toLowerCase();
    // Is it start of grouped field?
    if ( start_group ) {
      // yes, process grouped field
      var group_end_tag = '-' + source_field_id;
      var group_length = 0;
      for ( i = ix+1 ; i < stop_ix ; i++ ) {
        if ( field_list[i].indexOf(group_end_tag) == 0 ) {
          break;
        }
        group_length++;
      }
      if ( group_length > 0 ) {
        num_lower_group = record.getOccurrenceCount(source_field_id.toLowerCase(), current_occ_group);
        if ( num_lower_group > 0 ) {
          for ( child_occ = 1 ; child_occ <= num_lower_group ; child_occ++ ) {
            var lower_group = record.getGroup( source_field_id, child_occ, current_occ_group);
            if ( lower_group != false ) {
              var new_lower_group;
              var num_lower_group;
              var ocnum;

              if ( repeating ) {
                occnum = child_occ;
              }
              else {
                occnum = 0;  // zero means non-repeating
              }

              // create new group
              record.addGroup ( target_field_id, child_occ, new_occ_group, true );
              new_lower_group = record.getGroup(target_field_id, occnum, new_occ_group);

              processFieldList ( field_list, ix+1, i, occnum, lower_group, new_lower_group );
            }
          }
        }
      }

      ix = i;
    }
    else {
      var numocc = record.getOccurrenceCount(xml_field_id, current_occ_group);
      if ( typeof numocc != 'number' ) {
        add_value = true;
        if ( !same_group ) {
          new_field = record.getElement(target_field_id.toLowerCase(), 1, new_occ_group);
          if ( new_field != false ) {
            add_value = false;
          }
        }

        current_field = record.getElement(xml_field_id, current_occurrence, current_occ_group);
        if ( current_field == false ) {
          field_value = null;
        }
        else {
          field_value = current_field.text();
        }
        if ( field_value != null && field_value != '' ) {
          if ( add_value ) {
            record.addElement(target_field_id.toLowerCase(), field_value, repeating, new_occ_group);
          }
          else {
            record.updateElement(new_field, field_value, 1);
          }
        }
        else {
          if ( !same_group && !add_value ) {
            // clear existing new field value
            record.removeElement(new_field);
          }
        }
        numocc = 0;
      }

      for ( occ = 1; occ <= numocc ; occ++ ) {
        add_value = true;
        if ( !same_group ) {
          new_field = record.getElement(target_field_id.toLowerCase(), occ, new_occ_group);
          if ( new_field != false ) {
            add_value = false;
          }
        }

        current_field = record.getElement(xml_field_id, occ, current_occ_group);
        if ( current_field == false ) {
          field_value = null;
        }
        else {
          field_value = current_field.text();
        }
        if ( field_value != null && field_value != '' ) {
          if ( add_value ) {
            record.addElement(target_field_id.toLowerCase(), field_value, repeating, new_occ_group);
          }
          else {
            record.updateElement(new_field, field_value, occ);
          }
        }
        else {
          if ( !same_group && !add_value ) {
            // clear existing new field value
            record.removeElement(new_field);
          }
        }
      }
    }
  }
}

/**
 **  copyOccField - copy fields of current ocurrence to that of new ocurrences.
*/
function copyOccField ( field_list, calling_field, parent_id, target_parent_id ) {
 var field_id = $(calling_field).attr('id');
  var ix = 0;
  var numocc = 0;
  var repeating = true;
  var record = currentAppInterface.app_record;
  var group_fieldset = $(calling_field).parents(currentAppInterface.interface_params.group_container);
  var current_occ_group = currentAppInterface.getGroupParent(field_id);
  var current_occurrence = parseInt($('#' + parent_id).find(currentAppInterface.interface_params.group_occurrence).first().text());
  var field_value = null;
  var xml_field_id = '';
  var current_field = null;

  // count # of grouped field
  if ( target_parent_id != null ) {
    numocc = record.getOccurrenceCount(target_parent_id.toLowerCase()) + 1;
  }
  if ( target_parent_id == null || record.addGroup(target_parent_id, numocc, null, repeating) ) {
    var new_occ_group = null;
    if ( target_parent_id != null ) {
      new_occ_group = record.getGroup(target_parent_id, numocc);
    }
    if ( target_parent_id == null || new_occ_group != false ) {
      processFieldList ( field_list, 0, field_list.length, current_occurrence, current_occ_group, new_occ_group );
    }
  }

  // update grouped field occurrence count
  if ( group_fieldset != null && parent_id == target_parent_id ) {
    $('#' + parent_id).find(currentAppInterface.interface_params.group_total_occurrences).first().text(numocc);
  }
}


/*
  duplicateOcc()

  This function duplicates the current ocurrence for the specified time.
*/
function duplicateOccurrence(caller, numCopies)
{
  var dbname = $('body').data('database');
  var field_list = null;
  var ix = 0;

  // extract data-param attribute
  var list_id = $(caller).attr('id');
  if ( list_id != null ) {
    if ( typeof app_config != 'undefined' ) {
      field_list = app_config.databases[dbname].dup_field_list[list_id];
    }
  }

  if ( field_list != null ) {
    var numOfCopies = 0;

    if ( typeof numCopies == 'number' ) {
      numOfCopies = numCopies;
    }
    else {
      // prompt number of duplicated occurrences
      var input = prompt ( "Number of copies: ", '1' );
      if ( input != null ) {
        numOfCopies = parseInt ( input );
      }
    }

    if ( numOfCopies > 0 ) {
      // find parent field
      var parent_field = $(caller).parents(currentAppInterface.interface_params.group_container);

      if ( parent_field.length > 0 ) {
        var parent_id = parent_field.attr('id');

        // duplicate occurrences
        for ( ix = 0 ; ix < numOfCopies ; ix++ ) {
          copyOccField ( field_list, caller, parent_id, parent_id );
        }
      }
    }
  }
}


/*
  removeDelimiter()

  This function extracts the value inside the pair of literal delimiter.
  The literal delimiter is single quote character. Two consecutive
  quote characters means single quote character.
*/

function removeDelimiter ( literal_value )
{
  var return_value = literal_value;

  if ( return_value.indexOf('\'') == 0 ) {
    var literal_size = literal_value.length;
    if ( return_value.indexOf('\'', literal_size-1) == literal_size-1 ) {
      return_value = literal_value.substring(1, literal_size-1);
    }
  }

  return return_value.replace(/''/g, "'");
}

/*
  extractFieldValue()

  This function seaches the XML record for specified field and returns the field
  value as return value.
*/

function extractFieldValue ( calling_field, source_exp )
{
  var return_value = null;
  var record = currentAppInterface.app_record;
  var any_parent = false;
  var current_occ_group = null;
  var field_id = source_exp.toUpperCase();
  var calling_field_id = $(calling_field).attr('id');
  var xml_field_id;
  var source_field;

  end_loc = field_id.indexOf('.*');
  if ( end_loc > 0 ) {
    // if any parent indciator is specified, drop any parent indicator from field mnemonic
    field_id = field_id.substring(0, end_loc);
    any_parent = true;
  }

  // Is the field visible in the web page?
  if ( calling_field_id != null && calling_field_id == field_id ) {
    return_value = $('#'+field_id).val();
  }
  else {
    // no, extract it from the XML record
    if ( !any_parent ) {
      current_occ_group = currentAppInterface.getGroupParent(field_id);
    }

    xml_field_id = field_id.toLowerCase();
    source_field = record.getElement(xml_field_id, 1, current_occ_group);
    if ( source_field != false ) {
      return_value = source_field.text();
    }
  }

  return return_value;
}

/*
  parseQueryComponent()

  This function parses the query component and returns the result of the
  regular expression.
*/

function parseQueryComponent ( query_comp )
{
  const queryCompRegExp = /(?<leftop>([^\s=\>\<]){1,20})(\s)*(?<operator>(==|=|\<\>|\>|\>\=|\<=|\<|\s))(\s)*(?<rightop>(!\+|!-|'(''|[^'])+'|(.)+))$/i

  return queryCompRegExp.exec(query_comp);
}

/*
  evaluateQueryComponent()

  This function evaludates the query component and returns either true or false if
  search field matches the supplied value or not.
*/

function evaluateQueryComponent ( calling_field, search_id, search_op, search_value )
{
  var compare_result = false;

  // remove delimiter
  search_value = removeDelimiter ( search_value );

  var field_value = extractFieldValue ( calling_field, search_id );
  if ( search_value == '!+' ) {
    if ( field_value != null && field_value.length > 0 ) {
      compare_result = true;
    }
  }
  else if ( search_value == '!-' ) {
    if ( field_value == null || field_value.length == 0 ) {
      compare_result = true;
    }
  }
  else {
    var operand1_value = (field_value == null) ? "" : field_value;
    var operand2_value = (search_value == null) ? "" : search_value;
    operand1_value = operand1_value.toUpperCase();
    operand2_value = operand2_value.toUpperCase();

    if ( search_op == ' ' || search_op == '=' ) {
      if ( operand1_value.indexOf(operand2_value) >= 0 ) {
        compare_result = true;
      }
    }
    else if ( search_op == '==' ) {
      if ( operand1_value == operand2_value ) {
        compare_result = true;
      }
    }
    else if ( search_op == '<>' ) {
      if ( operand1_value == '' || operand1_value.indexOf(operand2_value) == -1 ) {
        compare_result = true;
      }
    }
    else if ( search_op == '>' ) {
      if ( operand1_value > operand2_value ) {
        compare_result = true;
      }
    }
    else if ( search_op == '>=' ) {
      if ( operand1_value >= operand2_value ) {
        compare_result = true;
      }
    }
    else if ( search_op == '<' ) {
      if ( operand1_value < operand2_value ) {
        compare_result = true;
      }
    }
    else if ( search_op == '<=' ) {
      if ( operand1_value <= operand2_value ) {
        compare_result = true;
      }
    }
  }

  return compare_result;
}


/*
  evaluateQuery()

  This function evaluates MINISIS query statement and returns the query result
  as the return value.
*/

function evaluateQuery ( calling_field, query_exp )
{
  var return_value = false;

  if ( query_exp == null || query_exp === '$$' ) {
    return_value = true;
  }
  else {
    // evaluate query statement
    var testQuery = new queryExpression ( query_exp );
    if ( testQuery.isValid() ) {
      return_value = testQuery.evaluate ( calling_field );
    }
  }

  return return_value;
}


/*
  expandSymbol()

  This function expands the symbolic literal to character string.
*/

function expandSymbol ( symbolic_literal )
{
  const symbolRegExp = /\+\+\d+.*/

  var return_value = symbolic_literal;

  if ( symbolRegExp.exec(symbolic_literal) != null ) {
    var url = getCookie("HOME_SESSID") + "?expandsymbol&key=" + encodeURIComponent(symbolic_literal);

    $.ajax({
      async: false,
      type: "get",
      dataType: "xml",
      url: url,
      success: function (data) {
        if ( jQuery.isXMLDoc( data ) ) {
          var xml_value = getXmlFieldValue (data, "expansion");
          if ( xml_value != '' ) {
            return_value = xml_value;
          }
        }
      }
    });
  }

  return return_value;
}

/*
  extractSoruceValue()

  This function evaludates the source expression and determinaes the
  source value according to the source type. The valid soruce types are
  literal, relative date and MINISIS field.
*/

function extractSoruceValue ( calling_field, source_exp )
{
  var myvalue = $(calling_field).val();
  var return_value = null;
  var end_loc;

  if ( source_exp != null ) {
    if ( source_exp.indexOf('\'') == 0 ) {
      // process literal
      return_value = removeDelimiter(source_exp);
      return_value = expandSymbol ( return_value );
    }
    else if ( source_exp.toUpperCase().indexOf("RELATIVE_DATE=") == 0 ) {
      // process relative date
      var dateExp = source_exp.substring(14);
      if ( dateExp.indexOf('+') != 0 && dateExp.indexOf('-') != 0 ) {
        dateExp = '+' + dateExp;
      }
      if ( myvalue.match(/\d\d\d\d-\d\d\-\d\d$/) != null ) {
        dateExp = myvalue + dateExp;
      }
      else {
        dateExp = '++1' + dateExp;
      }
      var dateString = generateRelativeDate(dateExp);
      if ( dateString == false ) {
        alert ( 'Date expression "' + source_exp + '" is invalid.' );
      }
      else {
        return_value = dateString;
      }
    }
    else if ( source_exp.toUpperCase().indexOf("FIELD=") == 0 ) {
      return_value = extractFieldValue ( calling_field, source_exp.substring(6) );
    }
    else if ( source_exp.toUpperCase() == '$CURRENT' ) {
      return_value = myvalue;
    }
  }

  return return_value;
}

/*
  setFieldValue()

  This function either updates or adds value to the target field.
*/

function setFieldValue ( calling_field, target_field, source_value )
{
  var record = currentAppInterface.app_record;
  var parent_group = currentAppInterface.getGroupParent(target_field);

  var occurrence = '0';
  if ( currentAppInterface.isRepeatingField('#'+target_field) ) {
    occurrence = calling_field.closest(currentAppInterface.interface_params.r_field_container).find(currentAppInterface.interface_params.r_field_occurrence).first().text();
  }
  if ( occurrence == null || occurrence == "" ) {
    occurrence = "0";
  }
  var field_is_repeating = (parseInt(occurrence) > 0) ? true : false;
  var field = record.getElement(target_field.toLowerCase(), occurrence, parent_group);

  if (field) {
    record.updateElement(field, source_value);
  }
  else {
    record.addElement(target_field.toLowerCase(), source_value, field_is_repeating, parent_group);
  }

  if ( $('#'+target_field).length > 0 ) {
    $('#'+target_field).val(source_value).change();
  }
}

/*
  generateFieldValue()

  This function sets the target field to the source value which is generated,
  is copied from other field or is literal value.
*/

function generateFieldValue ( calling_field, query_exp, target_field, source_exp )
{
  var query_result = evaluateQuery ( calling_field, query_exp );

  if ( query_result != null && query_result == true ) {
    /* get source value */
    var source_value = extractSoruceValue ( calling_field, source_exp );
    if ( source_value != null ) {
      // save soruce value in XML target field
      setFieldValue ( calling_field, target_field, source_value );

      // save target field in XML record
      // var field_id = $(calling_field).attr('id');
      // if ( field_id == null || field_id != target_field ) {
      //   $('#'+target_field).change();
      // }
    }
  }
}

/*
  processGenerateFieldRule()

  This function generates one or more field values according the data generation rules
  which are defined in the data-generate(n) attribute.
*/

function processGenerateFieldRule(calling_field)
{
  const generateRegExp = /(?<query>(\$\$|'(''|[^'])+')),(?<target>[^,]{1,20}),(?<source>('(''|[^'])*'|FIELD=(.){1,20}|RELATIVE_DATE=(.)+|\$CURRENT))$/i
  const paramNameRegExp = /^GENERATE\d*$/i

  var return_value = true;
  var result;
  var query_exp, target_field, source_exp;

  var dataArray = $(calling_field).data();
  $.each(dataArray, function(key, val) {
    var generate_key = paramNameRegExp.exec(key);
    if ( generate_key != null ) {
      result = generateRegExp.exec(val);
      if ( result != null ) {
        query_exp = removeDelimiter(result.groups.query);
        target_field = result.groups.target.toUpperCase();
        source_exp = result.groups.source;
        generateFieldValue ( calling_field, query_exp, target_field, source_exp );
      }
    }
  });

  return return_value;
}

/*
  checkUniqueKey()

  This function cheks to see the field vlaue is unique within the database.
  The field must be indexed.
*/

function checkUniqueKey(calling_field)
{
  var   result = false;

  // extract database name
  var dbname = $('body').data('database');
  if ( typeof dbname == 'undefined' || dbname == null ) {
    dbname = '';
    alert ( 'Database is not found in <body> tag.' );
  }

  // extract current field mnemonic
  var key_mnemonic = $(calling_field).attr('id');
  if ( typeof key_mnemonic == 'undefined' || key_mnemonic == null ) {
    key_mnemonic = '';
    alert ( "Field mnemonic is not found in <input> tag." );
  }

  // extract key value
  var key_value = $(calling_field).val();
  if ( typeof key_value == 'undefined' || key_value == null ) {
    key_value = '';
  }


  // build MANIPRECORD command
  if ( dbname != "" && key_mnemonic != "" && key_value != "" ) {
    var url = getHomeSessId() + "?MANIPXMLRECORD&DATABASE=" + dbname + "&READ=Y&KEY=" + key_mnemonic +
      "&VALUE=" + escapeUrlchars(key_value);

    // send ajax call to read record
    $.ajax({
      async: false,
      type: "GET",
      dataType: "xml",
      url: url,
      timeout: 300000,
      success: function (data) {
        if ( jQuery.isXMLDoc(data) ) {
          var xml_value = getXmlFieldValue (data, "error");
          if ( xml_value == '' || parseInt(xml_value, 10) != 0 ) {
            // if key not found, set resutlt to true
            result = true;
          }
          else {
            alert ( "Key value \"" + key_value + "\" is already defined." );

            // clear field value
            $(calling_field).val('');

            // do not tab out field
            $(calling_field).focus();
          }
        }
      },
      error: function (xhr, status, error) {
        alert ( "Unable to send command to check unique key value because of " + error + "." );
      }
    });
  }

  return result;
}

/*
  processProtectFieldRule()

  This function protects the HTML field(s) according the data protection rules
  which are defined in the data-protect(n) attribute.
*/

function processProtectFieldRule(calling_field)
{
  const protectRegExp = /(?<query>(\$\$|'(''|[^'])+')),(?<target>[^,]{1,20})$/i
  const paramNameRegExp = /^PROTECT\d*$/i

  var return_value = true;
  var result;
  var query_exp, target_field, source_exp;

  var dataArray = $(calling_field).data();
  $.each(dataArray, function(key, val) {
    var protect_key = paramNameRegExp.exec(key);
    if ( protect_key != null ) {
      result = protectRegExp.exec(val);
      if ( result != null ) {
        query_exp = removeDelimiter(result.groups.query);
        target_field = result.groups.target.toUpperCase();

        // evaluate query expression
        var query_result = evaluateQuery ( calling_field, query_exp );
        if ( query_result ) {
          var target_id = '#'+target_field;
          if ( !$(target_id).hasClass('disabled') ) {
            // protect HTML field
            $(target_id).addClass('disabled');
          }
        }
      }
    }
  });

  return return_value;
}

/*
  processUnprotectFieldRule()

  This function unprotects HTML field(s) according the data protection rules
  which are defined in the data-unprotect(n) attribute.
*/

function processUnprotectFieldRule(calling_field)
{
  const unprotectRegExp = /(?<query>(\$\$|'(''|[^'])+')),(?<target>[^,]{1,20})$/i
  const paramNameRegExp = /^UNPROTECT\d*$/i

  var return_value = true;
  var result;
  var query_exp, target_field, source_exp;

  var dataArray = $(calling_field).data();
  $.each(dataArray, function(key, val) {
    var unprotect_key = paramNameRegExp.exec(key);
    if ( unprotect_key != null ) {
      result = unprotectRegExp.exec(val);
      if ( result != null ) {
        query_exp = removeDelimiter(result.groups.query);
        target_field = result.groups.target.toUpperCase();

        // evaluate query expression
        var query_result = evaluateQuery ( calling_field, query_exp );
        if ( query_result ) {
          var target_id = '#'+target_field;
          if ( $(target_id).hasClass('disabled') ) {
            // unprotect HTML field
            $(target_id).removeClass('disabled');
          }
        }
      }
    }
  });

  return return_value;
}



/* RL-2021-05-13 */

/*
  checkMandatoryField()

  This function searches HTML fields with data-mandatory attirbute and evaludates
  mandatory rule of each found HTML field. It return false if one of
  mandatory fields is missing.
*/

function checkMandatoryField(group_id)
{
  var   checkResult = true;
  var   result = true;
  var   i = 0;
  var   mandatoryField = null;

  // check group mandatory fields
  if ( typeof group_id != 'undefined' ) {
    mandatoryField = $('#' + group_id).find('.group_mandatory_check');
  }
  else {
    mandatoryField = $('body').find('.group_mandatory_check');
  }

  for ( i = 0 ; i < mandatoryField.length ; i++ ) {
    var fieldValue = $(mandatoryField[i]).val();
    if ( typeof fieldValue == 'undefined' || fieldValue == '' ) {
      result = evaluateMandatoryRule($(mandatoryField[i]));
      if ( typeof result == 'string' ) {
        alert ( 'Mandatory field "' + result + '" is missing.' );
        checkResult = false;
        break;
      }
    }
  }

  // check form mandatory fields
  if ( checkResult ) {
    if ( typeof group_id != 'undefined' ) {
      mandatoryField = $('#' + group_id).find('.mandatory_check');
    }
    else {
      mandatoryField = $('body').find('.mandatory_check');
    }

    for ( i = 0 ; i < mandatoryField.length ; i++ ) {
      var fieldValue = $(mandatoryField[i]).val();
      if ( typeof fieldValue == 'undefined' || fieldValue == '' ) {
        result = evaluateMandatoryRule($(mandatoryField[i]));
        if ( typeof result == 'string' ) {
          alert ( 'Mandatory field "' + result + '" is missing.' );
          checkResult = false;
          break;
        }
      }
    }
  }

  return checkResult;
}

/*
  callWrapupUserExit()

  This function calls the record wrap up user routine if the form contains input tag with
  "wrapup_user_exit" class.
*/

function callWrapupUserExit()
{
  var   checkResult = true;
  var   result = true;
  var   i = 0;
  var   wrapupUserExit = $('body').find('.wrapup_user_exit');

  if ( wrapupUserExit.length > 0 ) {
    $(wrapupUserExit).each(function() {
      // extract data-exit attribute
      var exit_name = $(this).data('exit');
      if ( exit_name != undefined ) {
        result = eval( exit_name + "($(this));" );
        if ( result == false ) {
          checkResult = false;
          return false;   // exit each loop
        }
      }
    });
  }

  return checkResult;
}

/*
  evaluateMandatoryRule()

  This function extracts the mandatory riles form the data-mandatory attrobute of the
  calling dield and evaluates the mandatory field rule. It returns true if mandatory
  rule is defined and is evaluated to the true condition.
*/

function evaluateMandatoryRule(calling_field)
{
  var result = true;

  var mandatoryRule = $(calling_field).data('mandatory');
  if ( typeof mandatoryRule != 'undefined' ) {
    // evaludate madnatory rule
    if ( mandatoryRule === '$$' || evaluateQuery(calling_field, mandatoryRule) == true ) {
      result = $(calling_field).attr('id');
    }
  }

  return result;
}

/* ************************************************************************ */
// exit (user_routine) handles the popup data entry form of the group field.
function handleGroupOccDataEntry ( table_id, op, occnum )
{
  var return_code = true;

  switch ( op ) {
    case 'A':   // add row
      return_code = addGroupOccRecord(table_id, occnum );
      break;
    case 'C':   // edit row
      return_code = editGroupOccRecord(table_id, occnum );
      break;
    case 'D':   // delete row
      return_code = deleteGroupOccRecord(table_id, occnum );
      break;
  }

  return return_code;
}

function getjQueryXmlFieldValue (xml_record, field_tag) {
  var  return_value = '';

  var source = xml_record.find(field_tag);
  if ( source.length > 0 ) {
    return_value = source[0].textContent;
  }

  return return_value;
}

/* ************************************************************************ */
// function copies fields form group occurrence record to parent record and updates
// the group list control in the data entry form.
function updateParentRecord ( enquiry_record, table_id, occnum, xml_record, pull_params )
{
  var record = currentAppInterface.app_record;
  var group_mnemonic = '';
  var ix = 0;

  // get table tag
  var table_tag = $('#'+table_id);
  if ( typeof table_tag == 'undefined' ) {
    table_tag = null;
  }
  else {
    // extract group mnemonic
    group_mnemonic = $(table_tag).data('group');
    if ( typeof group_mnemonic == 'undefined' ) {
      group_mnemonic = '';
    }
  }

  var col_data = [];
  col_data.push(occnum.toString());

  if ( group_mnemonic != '' ) {
    // extract source fields
    for ( ix = 0 ; ix < pull_params.length ; ix++ ) {
      // parse pull parameter
      var fieldList = pull_params[ix].split('=');
      if ( fieldList.length > 1 ) {
        // extract field from group occurrence record
        var fieldValue = getjQueryXmlFieldValue (xml_record, fieldList[1]);
        if ( fieldValue != '' ) {
          // add field to parent record
          setXmlRecordFieldValueEx (group_mnemonic, occnum, fieldList[0], fieldValue, 1, table_id);
        }
      }
    }

    // update group list control in the data entry form
    var sourceNames = getColSoruceNames ( $(table_tag) );
    var sourceValues = getSourceValues ( record, group_mnemonic, occnum, sourceNames );
    refreshTableRow ( table_id, occnum, sourceValues );
  }
}

/* ************************************************************************ */
// function checks the existence of push mandatory fields.
function checkPushMandatoryField(mandatory_params, or_condition)
{
  var return_value = true;
  var missing_mandatory_field = '';
  var ix = 0;
  var missing_count = 0;

  if ( mandatory_params.length > 0 ) {
    for ( ix = 0 ; ix < mandatory_params.length ; ix++ ) {
      var sourceField = getXmLRecordFieldValue( mandatory_params[ix], null );
      if ( sourceField != '' ) {
        if ( or_condition ) {
          break;
        }
      }
      else {
        missing_count++;
        if ( or_condition == false ) {
          return_value = false;
          missing_mandatory_field = mandatory_params[ix];
          break;
        }
      }
    }
  }

  if ( or_condition && missing_count >= mandatory_params.length ) {
    return_value = false;
    missing_mandatory_field = mandatory_params[0];
    for ( ix = 1 ; ix < mandatory_params.length ; ix++ ) {
      if ( ix+1 == mandatory_params.length ) {
        missing_mandatory_field = missing_mandatory_field + ' or ' + mandatory_params[ix];
      }
      else {
        missing_mandatory_field = missing_mandatory_field + ', ' + mandatory_params[ix];
      }
    }
  }

  if ( return_value == false ) {
    alert ( 'Adding occurrence is denied because of missing one of below mandatory field(s)\n\n"' + missing_mandatory_field + '".' );
  }

  return return_value;
}

/* ************************************************************************ */
// function prompts user to enter fields of group occurrence record.
function addGroupOccRecord ( table_id, occnum )
{
  var return_code = true;
  var result = false;
  var table_tag = $('#'+table_id);

  // extract data-component-database attribute
  var comp_db_line = $(table_tag).data('component-database');
  if ( typeof comp_db_line == 'undefined' ) {
    comp_db_line = '';
  }

  // extract data-push attribute - copy fields from root database to group occurrence database
  var push_param_line = $(table_tag).data('push');
  if ( typeof push_param_line == 'undefined' ) {
    push_param_line = '';
  }
  var push_params = push_param_line.split(',');

  // extract data-pull attribute - copy fields from group occurrence database to root database
  var pull_param_line = $(table_tag).data('pull');
  if ( typeof pull_param_line == 'undefined' ) {
    pull_param_line = '';
  }
  var pull_params = pull_param_line.split(',');

  // extract data-mandatory attribute - check mandatory fields
  var or_condition = true;
  var mandatory_param_line = $(table_tag).data('mandatory');
  if ( typeof mandatory_param_line == 'undefined' ) {
    mandatory_param_line = '';
  }
  var mandatory_params = mandatory_param_line.split('|');
  if ( mandatory_params.length == 0 ) {
    mandatory_params = mandatory_param_line.split('*');
    if ( mandatory_params.length > 0 ) {
      or_condition = false;
    }
  }

  // extract data-add-option attribute - additional ADDSINGLERECORD query option
  var add_option_line = $(table_tag).data('add-option');
  if ( typeof add_option_line == 'undefined' ) {
    add_option_line = '';
  }

  var enquiry_record = currentAppInterface.app_record;
  $tmp_xml_record = null;

  if ( comp_db_line == '' ) {
    alert ( "data-component-database option is missing in the <table> tag." );
    return_code = false;
  }
  else {
    if ( mandatory_params.length > 0 && checkPushMandatoryField(mandatory_params, or_condition)== false ) {
      return_code = false;
    }
    else {
      // prepare URL
      var home_sess = getHomeSessId();
      var url = home_sess + "?ADDSINGLERECORD&NEW=Y&DISCONNECT=Y&RECORD_DEFAULT=Y&DATABASE=" + comp_db_line;
      if ( add_option_line != '' ) {
        url = url + add_option_line;
      }

      if ( push_params.length > 0 ) {
        url = url + setNewRecordDefault(push_params, add_option_line);
      }

      // set up colorbox
      $popup = true;
      $.colorbox({
        iframe: true,
        href: url,
        transition: "elastic",
        width: '100%',
        height: '100%',
        overlayClose: false,
        onOpen: function(){
          $('body').css({ overflow: 'hidden' });
        },
        // onLoad: function() {
        //   $('#cboxClose').remove();
        // },
        onCleanup: function () {
          if ( $tmp_xml_record != null ) {
            if ( pull_params.length > 0 ) {
              updateParentRecord ( enquiry_record, table_id, occnum, $tmp_xml_record, pull_params );
            }
          }
          else {
            // remove new table row
            removeTableRow(table_id, occnum);
          }
        },
        onClosed: function () {
          delete $tmp_xml_record;
          delete $popup;
          $('body').css({ overflow: '' });
        }
      });
    }
  }

  return return_code;
}

/* ************************************************************************ */
// function prompts user to edit fields of group occurrence record.
function editGroupOccRecord ( table_id, occnum )
{
  var return_code = true;
  var table_tag = $('#'+table_id);

  // extract data-comp-database attribute
  var comp_db_line = $(table_tag).data('component-database');
  if ( typeof comp_db_line == 'undefined' ) {
    comp_db_line = '';
  }

  // extract data-pull attribute - copy fields from group occurrence database to root database
  var param_line = $(table_tag).data('pull');
  if ( typeof param_line == 'undefined' ) {
    param_line = '';
  }
  var pull_params = param_line.split(',');

  // extract data-group attribute
  var group_mnemonic = $(table_tag).data('group');
  if ( typeof group_mnemonic == 'undefined' ) {
    group_mnemonic = '';
  }

  // extract data-recid attribute - group occurrence record id in root record and group occurrence record
  param_line = $(table_tag).data('recid');
  if ( typeof param_line == 'undefined' ) {
    param_line = '';
  }
  var recid_params = param_line.split(',');

  var enquiry_record = currentAppInterface.app_record;
  $tmp_xml_record = null;

  if ( comp_db_line == '' || recid_params.length < 2 || group_mnemonic == '' ) {
    if ( group_mnemonic == '' ) {
      alert ( "data-group option is missing in the <table> tag." );
    }
    else if ( recid_params.length < 2 ) {
      alert ( "Either data-recid option is missing or is invalid." );
    }
    else {
      alert ( "data-component-database option is missing in the <table> tag." );
    }
    return_code = false;
  }
  else {
    // extract group occurrence record ID from root record
    var recid = getXmLRecordFieldValueEx(group_mnemonic, occnum, recid_params[0], 1, table_id);

    // prepare URL
    var home_sess = getHomeSessId();
    var url = home_sess + "?CHANGESINGLERECORD&NEW=Y&DISCONNECT=N&CLOSE=Y&DATABASE=" + comp_db_line + "&EXP=" + recid_params[1] + '%20' + recid;

    // set up colorbox
    $popup = true;
    $.colorbox({
      iframe: true,
      href: url,
      transition: "elastic",
      width: '100%',
      height: '100%',
      overlayClose: false,
      onOpen: function(){
        $('body').css({ overflow: 'hidden' });
      },
      // onLoad: function() {
      //   $('#cboxClose').remove();
      // },
      onCleanup: function () {
        if ($tmp_xml_record != null && pull_params.length > 0) {
          updateParentRecord ( enquiry_record, table_id, occnum, $tmp_xml_record, pull_params );
        }
      },
      onClosed: function () {
        delete $tmp_xml_record;
        delete $popup;
        $('body').css({ overflow: '' });
      }
    });
  }

  return return_code;
}

/* ************************************************************************ */
// function prompts user to confirm the deletion of group ocurrence record.  If confirmed and data-keep is specified,
// the the field specified in the data-keep attribute is changed to 'deleted'.
function deleteGroupOccRecord ( table_id, occnum )
{
  var return_code = false;
  var table_tag = $('#'+table_id);

  if ( confirm("Are you really want to delete selected occurrence?") == true ) {
    // extract data-component-database attribute
    var comp_db_line = $(table_tag).data('component-database');
    if ( typeof comp_db_line == 'undefined' ) {
      comp_db_line = '';
    }

    // extract data-group attribute
    var group_mnemonic = $(table_tag).data('group');
    if ( typeof group_mnemonic == 'undefined' ) {
      group_mnemonic = '';
    }

    // extract data-recid attribute - group occurrence record id in parent record and group occurrence record
    param_line = $(table_tag).data('recid');
    if ( typeof param_line == 'undefined' ) {
      param_line = '';
    }
    var recid_params = param_line.split(',');

    // extract data-delete attribute - record status field and dleted keuword
    param_line = $(table_tag).data('delete');
    if ( typeof param_line == 'undefined' ) {
      param_line = '';
    }
    var delete_params = param_line.split(',');

    // get enquiry record handle
    var enquiry_record = currentAppInterface.app_record;

    if ( comp_db_line == '' || recid_params.length < 2 || group_mnemonic == '' || delete_params.length < 2 ) {
      if ( delete_params.length < 2 ) {
        alert ( "Either data-delete option is missing or is invalid." );
      }
      else if ( group_mnemonic == '' ) {
        alert ( "data-group option is missing in the <table> tag." );
      }
      else if ( recid_params.length < 2 ) {
        alert ( "Either data-recid option is missing or is invalid." );
      }
      else {
        alert ( "data-component-database option is missing in the <table> tag." );
      }
    }
    else {
      // extract group occurrence record ID from root record
      var recid = getXmLRecordFieldValueEx(group_mnemonic, occnum, recid_params[0], 1, table_id);

      // prepare record transactions to change record status
      var form_data = '<?xml version="1.0" encoding="UTF-8"?>\n<RECORD>\n';
      form_data = form_data.concat('<' + delete_params[0] + '>' + delete_params[1] + '</' + delete_params[0] + '>\n');
      form_data = form_data.concat('</RECORD>');

      // prepare url
      var url = getHomeSessId() + "?MANIPXMLRECORD&DATABASE=" + comp_db_line + "&KEY=" + recid_params[1] + "&VALUE=" + recid;

      // send HTTP request by ajax to change record status
      $.ajax({
        async: false,
        type: "POST",
        dataType: "xml",
        url: url,
        data: form_data,
        processData: false,
        cache: false,
        timeout: 300000,
        success: function (data) {
          if ( jQuery.isXMLDoc(data) ) {
            var xml_value = getXmlFieldValue (data, "error");
            if ( xml_value == '' || parseInt(xml_value, 10) != 0 ) {
              alert ( "Error " + xml_value + " encountered while updating group occurrence record." );
            }
            else {
              // delete occurrence from xml record
              var record = currentAppInterface.app_record;
              var groupOcc = record.getGroup(group_mnemonic, occnum);
              if ( groupOcc !== false ) {
                record.removeGroupOccurrence(groupOcc);
              }

              // remove selected table row
              removeTableRow(table_id, occnum);

              return_code = true;
            }
          }
        },
        error: function (xhr, status, error) {
          alert ( "Unable to send command to update group occurrence record because of " + error + "." );
        }
      });
    }
  }

  return return_code;
}

// RL-2021-05-28
// Function parses the push options, extract source field value and generates default
// target field value.
function setNewRecordDefault(push_params, add_option_line)
{
  var  return_string = '';

  var i = 0;
  var count = 0;

  if ( add_option_line != '' ) {
    // count # of &NAMEn option
    start = 0;
    while ( true ) {
      i = add_option_line.indexOf("&NAME", start );
      if ( i == -1 || i == start ) {
        // exit loop
        break;
      }
      count++;
      start = i + 5;
    }
  }

  for ( i = 0 ; i < push_params.length ; i++ ) {
    var fieldList = push_params[i].split('=');
    if ( fieldList.length > 1 ) {
      // extract source field value
      var sourceField = getXmLRecordFieldValue( fieldList[1], null );
      if ( sourceField != '' ) {
        // if source field is found, set up default target field value
        count++;
        return_string = return_string + "&NAME" + count + "=" + fieldList[0] + "&VALUE" + count + "=" + escapeUrlchars(sourceField);
      }
    }
  }

  return return_string;
}


// function replaces URL forbidden characters with escaped string. Escaped string
// is returned as return value.
function escapeUrlchars(sourceField)
{
  var tempString = sourceField.replace(/\%/, '%25');
  tempString = tempString.replace (/ /g, '%20');
  tempString = tempString.replace (/&/g, '%26');
  tempString = tempString.replace (/=/g, '%3d');
  tempString = tempString.replace (/\+/g, '%2b');
  tempString = tempString.replace (/\?/g, '%3f');
  tempString = tempString.replace (/\#/g, '%23');
  tempString = tempString.replace (/\n/g, '%0a');

  return tempString;
}

// function decodes HTML Entity
// is returned as return value
function decodeText(tempString){
  const SCarray = {
    "&#126;": "~",
    "&#96;" : "`",
    "&#33;" : "!",
    "&#35;" : "#",
    "&#34;" : "\"",
    "&#quot;" : "\"",
    "&#36;" : "$",
    "&#37;" : "%",
    "&amp;" : "&",
    "&#38;" : "&",
    "&#39;" : "'",
    "&#40;" : "(",
    "&#41;" : ")",
    "&#42;" : "*",
    "&#43;" : "+",
    "&#44;" : ",",
    "&#45;" : "-",
    "&#46;" : ".",
    "&#47;" : "/",
    "&#58;" : ":",
    "&#59;" : ";",
    "&#61;" : "=",
    "&lt;"  : "<",
    "&#60;" : "<",
    "&gt;"  : ">",
    "&#62;" : ">",
    "&#63;" : "?",
    "&#64;" : "@",
    "&#91;" : "[",
    "&#92;" : "\\",
    "&#93;" : "]",
    "&#94;" : "^",
    "&#95;" : "_",
    "&#123;" : "{",
    "&#124;" : "|",
    "&#125;" : "}",
  };
  for(const [key,value] of Object.entries(SCarray)){
  tempString = tempString.replace(new RegExp(`${key}`, "gi"), `${value}`);
  }
  return tempString;
}

// function extracts source field value from XML record.
function getXmLRecordFieldValue ( field_mnemonic, parent_mnemonic )
{
  var return_result = '';

  var record = currentAppInterface.app_record;
  var xml_field_id = '';
  var occ = 0;
  var parent_group = undefined;
  if ( parent_mnemonic != null && parent_mnemonic != undefined && parent_mnemonic != ''  ) {
    parent_group = currentAppInterface.getGroupParent(parent_mnemonic);
    occ = 1;
  }

  xml_field_id = field_mnemonic.toLowerCase();
  var current_field = record.getElement(xml_field_id, occ, parent_group);
  if ( current_field != false && $(current_field).length > 0 ) {
    return_result = $(current_field).first().text();
  }

  return return_result;
}

// function extracts source field value from XML record. The parent group ID and group ocurrence
// are passed.
function getXmLRecordFieldValueEx ( parent_id, parent_occ, target_field_id, occurrence, caller_id )
{
  var return_result = '';

  var record = currentAppInterface.app_record;
  var xml_field_id = '';
  var parent_group = currentAppInterface.getGroupListParent(parent_id, parent_occ, caller_id, false);

  xml_field_id = target_field_id.toLowerCase();
  var current_field = record.getElement(xml_field_id, occurrence, parent_group);
  if ( current_field != false ) {
    return_result = current_field.text();
  }

  return return_result;
}

/*
  setXmlRecordFieldValue()

  This function either updates the XML record field or adds value to the XML record field.
*/

function setXmlRecordFieldValue ( target_field_id, field_value, occurrence )
{
  var target_field = $('#'+ target_field_id);
  if ( $(target_field).length > 0 ) {
    $(target_field).val(field_value);
    $(target_field).change();
  }
  else {
    var record = currentAppInterface.app_record;
    var parent_group = currentAppInterface.getGroupParent(target_field_id);

    var field_is_repeating = (occurrence) > 0 ? true : false;
    var field = record.getElement(target_field_id.toLowerCase(), occurrence, parent_group);

    if (field) {
      record.updateElement(field, field_value);
    }
    else {
      record.addElement(target_field_id.toLowerCase(), field_value, field_is_repeating, parent_group);
    }
  }
}

/*
  setXmlRecordFieldValueEx()

  This function either updates the XML record field or adds value to the XML record field.
  The ID and occurrence of immediate grouped field are passed in.
*/

function setXmlRecordFieldValueEx ( parent_id, parent_occ, target_field_id, field_value, occurrence, caller_id )
{
  var record = currentAppInterface.app_record;
  var parent_group = currentAppInterface.getGroupListParent(parent_id, parent_occ, caller_id, true);
  var field_is_repeating = true;

  var field = record.getElement(target_field_id.toLowerCase(), occurrence, parent_group);
  if (field) {
    record.updateElement(field, field_value);
  }
  else {
    record.addElement(target_field_id.toLowerCase(), field_value, field_is_repeating, parent_group);
  }
}

/*
  lookupFieldValue()

  This function looks up field value using the lookup table.
*/

function lookupFieldValue(calling_field)
{
  var return_value = false;
  var lookup_parms = [];

  // extract data-lookup parameter
  var lookup_parms_line = $(calling_field).data('lookup');
  if ( lookup_parms_line != undefined ) {
    // parse parameters
    lookup_parms = lookup_parms_line.split(',');
  }

  if ( lookup_parms.length < 4 ) {
    alert ( 'Invalid parameter line "' + lookup_parms_line + '".' );
  }
  else {
    var fieldValue = '';
    fieldValue = $(calling_field).val();
    if ( fieldValue == undefined ) {
      fieldValue = '';
    }

    if ( fieldValue != '' ) {
      // prepare URL to read lookup record
      var url = getHomeSessId() + "?MANIPXMLRECORD&DATABASE=" + lookup_parms[0] + "&READ=Y&KEY=" + lookup_parms[1] +
        "&VALUE=" + escapeUrlchars(fieldValue);

      // send ajax call to server
      $.ajax({
        async: false,
        type: "GET",
        dataType: "xml",
        url: url,
        timeout: 300000,
        success: function (data) {
          if ( jQuery.isXMLDoc(data) ) {
            var xml_value = getXmlFieldValue (data, "error");
            if ( xml_value != '' ) {
              var ecode = parseInt(xml_value, 10);
              // Is record found?
              if ( ecode == 0 ) {
                // extract lookup field value
                var num_parms = (lookup_parms.length-2)/2;
                var ix;

                for ( ix = 0 ; ix < num_parms ; ix++ ) {
                  xml_value = getXmlFieldValue (data, lookup_parms[2+ix*2]);
                  if ( xml_value != '' ) {
                    var target_field = $('#'+lookup_parms[3+ix*2]);
                    if ( target_field != undefined ) {
                      // set target field to lookup field value
                      $(target_field).val(xml_value);
                      currentAppInterface.updateField($(target_field));
                      $(target_field).change();
                      return_value = true;
                    }
                  }
                }
              }
            }
          }
        },
        error: function (xhr, status, error) {
        }
      });
    }
  }

  return return_value;
}

/*
  readDecodeUserRole()

  This function reads the user role and returns decoded user routine to caller.
*/

function readUserRole()
{
  var user_role = '';

  var access_token = $.cookie("MWI_ACCESS_TOKEN");
  if ( typeof access_token == 'string' ){
    // decode encripted user role
    if ( access_token.indexOf('[') == 0 && access_token.indexOf(']') > 0 ) {
      var tmp_val = access_token.substring(access_token.indexOf(']')+1);
      access_token = decode_string ( tmp_val );
    }
    user_role = access_token;
  }

  return user_role;
}

/* ************************************************************************ */
// function Shows optional data section of data entry form.
// data-section is in format of <section id>=<field value>[;<field value>]...[|<section id>=<field value>[;<field value>]...]...
function toggleSection (calling_field)
{
  var section_name = 'data-section';
  var data_option = $(calling_field).data('section-label');
  if ( data_option != undefined ) {
    section_name = data_option;
  }

  // scan class "data-section"
  var data_section = $('body').find('.'+section_name);
  var ix, i;

  // for each instance of "data-section", set display style to none
  $(data_section).each(function() {
    $(this).css("display", "none");
  });

  // extract "source_value" data attribute
  var caller = calling_field;
  var source_value = $(calling_field).data('source_value');
  if ( source_value != undefined ) {
    caller = $('#'+source_value);
  }

  var field_value = '';
  var params_line = '';
  if ( caller != null ) {
    field_value = $(caller).val();
    if ( field_value == null ) {
      field_value = '';
    }

    params_line = $(caller).data('toggle-section');
    if ( params_line == undefined ) {
      params_line = '';
    }
  }

  // find and enable data section
  var params_entry;
  var value_entry;
  var params = params_line.split('|');
  for ( ix = 0 ; ix < params.length ; ix++ ) {
    params_entry = params[ix].split('=');
    if ( params_entry.length == 2 ) {
      value_entry = params_entry[1].split(';');
      for ( i = 0 ; i < value_entry.length ; i++ ) {
        if ( field_value == value_entry[i] ) {
          if ( $('#' + params_entry[0]).length > 0 ) {
            $('#' + params_entry[0]).css("display", "block");
            ix = params.length;  // force to exit outer loop
            break;
          }
        }
      }
    }
  }
}


/* ************************************************************************ */
// function Shows optional data tab of data entry form.
// data-tab is in format of <field value>=<tab id>[;<tab id>]...[|<field value>=<tab id>[;<tab id>]...]...
function toggleTab (calling_field)
{
  var h_field;
  var form_id;
  var ix, i;
  var params_entry;
  var params;
  var found;
  var tab_names;

  // extract "source_value" data attribute
  var caller = calling_field;
  var source_value = $(calling_field).data('source_value');
  if ( source_value != undefined ) {
    caller = $('#'+source_value);
  }

  var field_value = '';
  var params_line = '';
  params = [];
  if ( caller != null ) {
    field_value = $(caller).val();
    if ( field_value == null ) {
      field_value = '';
    }

    params_line = $(caller).data('toggle-tab');
    if ( params_line == undefined ) {
      params_line = '';
    }
    else {
      params = params_line.split('|');
    }
  }

  // extrtact "menu-id" data attribute
  var menu_id_list = $(caller).data('menu-id');
  if ( menu_id_list != null && menu_id_list != '' ) {
    var menu_entry = menu_id_list.split(','); // split up navigation ID list

    // check each navigation bar
    for ( var menu_ix = 0 ; menu_ix < menu_entry.length ; menu_ix++ ) {
      var menu_id = menu_entry[menu_ix];
      // scan <li> tag with "conditional_menu" class
      var li_menu = $('#'+menu_id).find('li.conditional_menu');
      if ( li_menu.length > 0 ) {
        // hide li menu items
        for ( ix = 0 ; ix < li_menu.length ; ix++ ) {
          h_field = li_menu[ix];
          $(h_field).hide();
        }

        // search for topic value from data-toggle-tab attribute
        found = false;
        tab_names = [];
        for ( ix = 0 ; ix < params.length ; ix++ ) {
          params_entry = params[ix].split('=');
          if ( params_entry.length == 2 ) {
            if ( params_entry[0] == field_value ) {
              found = true;
              tab_names = params_entry[1].split(',');
              break;
            }
          }
        }

        // show conditional li menu item
        if ( found ) {
          for ( ix = 0 ; ix < li_menu.length ; ix++ ) {
            h_field = li_menu[ix];
            form_id = $(h_field).find('a').data('form');
            if ( typeof form_id != 'undefined' && form_id != '' ) {
              for ( i = 0 ; i < tab_names.length ; i++ ) {
                if ( form_id == tab_names[i] ) {
                  $(h_field).show();
                  break;
                }
              }
            }
          }
        }
      }
    }
  }
}

/* RL-20220131 */

/*
  toggleDevTag()

  This function shows or hides according nthe result of query exporession.
  It expects the query expression is passed in in he data-toggle attribute.
*/

function toggleDivTag(calling_field)
{
  var   checkResult = true;
  var   result = true;
  var   i = 0;
  var   toggleCondition = '';
  var   toggle_div_tag = '';
  var   toggle_tabs = '';
  var   tabs_array= [];
  var   sections_array = [];

  toggle_div_tag = $(calling_field).data('toggle-div');
  if ( typeof toggle_div_tag == 'undefined' ) {
    toggle_div_tag = '';
  }
  else {
    sections_array = toggle_div_tag.split(',');
  }


  toggle_tabs = $(calling_field).data('toggle-tabs');
  if ( typeof toggle_tabs == 'undefined' ) {
    toggle_tabs = '';
  }
  else {
    tabs_array = toggle_tabs.split(',');
  }

  if ( toggle_div_tag != '' || toggle_tabs != '' ) {
    toggleCondition = $(calling_field).data('toggle');
    if ( typeof toggleCondition == 'undefined' ) {
      toggleCondition = '';
    }

    if ( toggleCondition != '' ) {
      // evaludate condition
      if ( evaluateQuery(calling_field, toggleCondition) == true ) {
        // if true, show div tag
        if ( toggle_div_tag != '' ) {
          for ( i = 0 ; i < sections_array.length ; i++ ) {
            $('#'+sections_array[i]).css("display", "block");
          }
        }

        // enable tabs
        if ( tabs_array.length > 0 ) {
          for ( i = 0 ; i < tabs_array.length ; i++ ) {
            $('#'+tabs_array[i]).css("display", "inline");
          }
        }
      }
      else {
        // if false, hide <div> tag
        if ( toggle_div_tag != '' ) {
          for ( i = 0 ; i < sections_array.length ; i++ ) {
            $('#'+sections_array[i]).css("display", "none");
          }
        }

        // disable tabs
        if ( tabs_array.length > 0 ) {
          for ( i = 0 ; i < tabs_array.length ; i++ ) {
            $('#'+tabs_array[i]).css("display", "none");
          }
        }
      }
    }
  }

  return checkResult;
}

// RL-20220311
// Search the specified database for records and render records to either HTML page or XML record.
// If XML record, the browser renders the XML record to default record HTML page.

function generateReport( calling_field )
{
  var ok = true;

  // extract data-database option
  var dbname = $(calling_field).data('database');
  if ( dbname == null ) {
    ok = false;
    alert ( 'Database option is missing.' );
  }

  // extract data-report option
  var report = $(calling_field).data('report');
  if ( ok && report == null ) {
    ok = false;
    alert ( 'Report option is missing.' );
  }

  // extract data-exp option
  var exp = $(calling_field).data('exp');
  if ( ok && exp == null ) {
    ok = false;
    alert ( 'Exp option is missing.' );
  }

  // extract data-value1 option
  var value_field = $(calling_field).data('value1');
  var value1 = '';
  if ( ok ) {
    if ( value_field == null ) {
      ok = false;
      alert ( 'Value1 option is missing.' );
    }
    else {
      value1 = $('#' + value_field).val();
      if ( value1 == null || value1 == '' ) {
        ok = false;
        alert ( "Report is not generated brcause " + value_field + " field has no value." );
      }
    }
  }

  // extract data-download option
  var download = $(calling_field).data('download');
  if ( ok && download == null ) {
    ok = false;
    alert ( 'Download option is missing.' );
  }

  if ( ok ) {
    // replace marker with value
    var new_exp = exp;
    var ix = exp.indexOf("!value1");
    if ( ix >= 0 ) {
      new_exp = exp.substr(0,ix) + value1 + exp.substr(ix+8);
    }
    new_exp = encodeURIComponent(new_exp);

    var url = currentAppInterface.interface_params.sessid + "/" + new_exp + "?SEARCH_N_OUTPUTFILE&NEW=Y" +
              "&DATABASE=" + dbname + "&DOWNLOADPAGE=" + download + "&REPORT=" + report;

    var dialog_width = window.innerWidth - 8; // leave spaces in left and right margin
    var dialog_height = window.innerHeight - 13;  // leave spaces in top and bottom margin

    // show detailed record in modal dialog
    $.colorbox({
      iframe: true,
      fastIframe: false,
      href: url,
      transition: "elastic",
      width: dialog_width,
      height: dialog_height,
      title: "<span style='color:black;'>Click <i class='fa fa-times-circle-o'></i> at the bottom right of screen to close window</span>"
    });
  }
}

/*
  copyField()

  This function copies the current field value to traget field
  if target field is empty and the current field is one of the
  values defined in the "valid" option.
*/

function copyField(calling_field)
{
  var target_field = [];
  var valid_value = [];

  // extract data-copy option
  var data_option = $(calling_field).data('copy');
  if ( data_option != null ) {
    // parse data-copy option
    target_field = data_option.split(',');
  }

  // extract data-valid option
  data_option = $(calling_field).data('valid');
  if ( data_option != null ) {
    // if option is found, parse data-valid option
    valid_value = data_option.split('|');
  }

  // extract current field value
  var current_value = $(calling_field).val();

  // if current field value is not empty
  if ( current_value != '' ) {
    var proceed_next = false;
    var ix;

    // if data-valid is absent or current field is one of valid values
    if ( valid_value.length == 0 ) {
      proceed_next = true;
    }
    else {
      for ( ix = 0 ; ix < valid_value.length ; ix++ ) {
        if ( current_value == valid_value[ix] ) {
          proceed_next = true;
          break;
        }
      }
    }
    if ( proceed_next ) {
      // for each target field
      for ( ix = 0 ; ix < target_field.length ; ix++ ) {
        // if target field is empty
        var target_value = $('#'+target_field[ix]).val();
        if ( target_value == '' ) {
          // copy current field to target field
          $('#'+target_field[ix]).val(current_value).change();
        }
      }
    }
  }
}


// RL-20220601
/*
  setSubMenu()

  This function sets the sub menu values accoeding to the main menu value.
*/

function setSubMenu(calling_field)
{
  // extract mnemonic of primary key (data-main)
  var main_menu_fld = $(calling_field).data('main');
  if ( main_menu_fld == null ) {
    main_menu_fld = '';
  }

  // extract mnemonic of submenu field (data-help)
  var sub_menu_fld = $(calling_field).data('help');
  if ( sub_menu_fld == null ) {
    sub_menu_fld = '';
  }

  // extract mnemonic of main menu source (data-source)
  var main_menu_source = $(calling_field).data('source');
  if ( main_menu_source == null ) {
    main_menu_source = '';
  }

  // extract mnemonic of submenu field on the form (data-display)
  var sub_menu = $(calling_field).data('display');
  if ( sub_menu == null ) {
    sub_menu = '';
  }

  // extract manin main database name
  var main_menu_db = $(calling_field).data('table');
  if ( main_menu_db == null ) {
    main_menu_db = '';
  }

  // are mandatory options defined?
  if ( main_menu_fld == '' || sub_menu_fld == '' || sub_menu == '' || main_menu_db == '' ) {
     alert ( 'Mandatory option(s) are missing.' );
  }
  else {
    // extract current sub menu value
    var current_menu_value = '';
    var handled_by = currentAppInterface.app_record.getElement(sub_menu, 1, null);
    if ( handled_by !== false ) {
      current_menu_value = handled_by.text();
    }

    // extract main menu value
    var main_menu_value = '';
    if ( main_menu_source == '' ) {
      main_menu_value = $(calling_field).val();
    }
    else {
      main_menu_value = $('#'+main_menu_source).val();
    }

    if ( $('#'+sub_menu).length > 0
    &&   main_menu_value != null && main_menu_value != '' ) {
      var read_error = 3000;  // read status is defaulted to "record not found"

      // read main menu record
      var menu_record = null;
      var url = getHomeSessId()
                + "?MANIPXMLRECORD&READ=Y"
                + "&DATABASE=" + main_menu_db
                + "&KEY=" + main_menu_fld
                + "&VALUE=" + encodeURIComponent(main_menu_value);
      $.ajax({
        async: false,
        type: "GET",
        dataType: "xml",
        url: url,
        timeout: 10000,
        success: function (data) {
          if ( jQuery.isXMLDoc(data) ) {
            var xml_value = getXmlFieldValue (data, "error");
            if ( xml_value != '' ) {
              read_error = parseInt(xml_value, 10);
            }
            if ( read_error == 0 ) {
              menu_record = data;
            }
          }
        },
        error: function (xhr, status, error) {
          read_error = 3001;
        }
      });

      if ( read_error == 0 ) {
        var i, ix;
        var sub_menu_id;
        var sub_menu_fld_id;
        var data_name;

        i = 0;
        while ( true ) {
          i++;
          if ( i == 1 ) {
            sub_menu_id = sub_menu;
            sub_menu_fld_id = sub_menu_fld;
          }
          else {
            data_name = 'display'+i.toString();
            sub_menu_id = $(calling_field).data(data_name);
            data_name = 'help'+i.toString();
            sub_menu_fld_id = $(calling_field).data(data_name);
            if ( sub_menu_id == null || sub_menu_fld_id == null ) {
              // exit loop
              break;
            }
          }

          // clear sub menu value list
          var sub_menu_list = document.getElementById(sub_menu_id);
          for ( ix = sub_menu_list.options.length ; ix > 0 ; ix-- ) {
            sub_menu_list.remove(ix-1);
          }

          // clear selection of select tag
          $('#'+sub_menu_id).val('');

          // set sub menu option list
          var sub_menu_value = '';
          var value_found = false;
          var sub_menu_group = menu_record.getElementsByTagName(sub_menu_fld_id);
          if ( sub_menu_group.length > 0 ) {
            // add blank value
            var option = new Option ( '', '' );
            sub_menu_list.appendChild(option);

            // add menu values
            for ( ix = 0 ; ix < sub_menu_group.length ; ix++ ) {
              sub_menu_value = sub_menu_group[ix].textContent;
              if ( sub_menu_value != null && sub_menu_value != '' ) {
                if ( !value_found && current_menu_value == sub_menu_value ) {
                  value_found = true;
                  option = new Option ( sub_menu_value, sub_menu_value, true, true );
                }
                else {
                  option = new Option ( sub_menu_value, sub_menu_value );
                }
                sub_menu_list.appendChild(option);
              }
            }
          }
        }
      }
    }
  }
}


// RL-20220601
/*
  gotoOccurrence()

  This function sets the sub menu values accoeding to the main menu value.
*/

function gotoOccurrence(calling_field)
{
  // extract mnemonic of repeatable field ID (data-target)
  var target_id = $(calling_field).data('target');
  if ( target_id == null ) {
    target_id = '';
  }

  // extract occurrecne option (data-goto)
  var goto_option = $(calling_field).data('goto');
  if ( goto_option == null ) {
    goto_option = 'first';
  }
  else {
    goto_option = goto_option.toLowerCase();
  }

  if ( target_id == '' ) {
    alert ( "Target field mnemonic is missing." );
  }
  else {
    var target_field = $('#'+target_id);

    // Is taerget field defined?
    if ( $(target_field).length > 0 ) {
      var occ_info = {};

      // get fieod mnemonic
      occ_info.element = target_id;

      // determine field type
      if ( $('#'+target_id).prop('tagName') == 'FIELDSET' ) {
        occ_info.fld_type = 'group';
      }
      else {
        occ_info.fld_type = 'field';
      }
      // get current occurrence number
      occ_info.current_occ = currentAppInterface.getCurrentOccurrence(target_id);

      // get total ocurrence
      occ_info.total_occ = currentAppInterface.getTotalOccurrences(target_id);

      switch ( goto_option ) {
        case 'first':
          currentAppInterface.firstOccurrence(target_field, occ_info);
          break;

        case 'last':
          currentAppInterface.lastOccurrence(target_field, occ_info);
          break;

        case 'new':
          currentAppInterface.newOccurrence(target_field, occ_info);
          break;
      }
    }
  }
}
