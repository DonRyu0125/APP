// declare global constants// declare global constants
const MAX_BASE62_CHAR          = 62;
var   password_ok              = false;


/*
   dynamicPassword()

   This function generates the dynamic password which
   consists of the checksum of browser IP, brwoser agent string and
   current timestamp.

   input:
     username: is the user name/email. If omitted, browser IP is used.
   output:
     dynamic password string as return value
*/

function dynamicPassword( username )
{
  var dyn_password = '';
  var user_id = '';

  if ( typeof username != 'undefined' ) {
    user_id = username.toLowerCase();
  }

  try {
    // prepare password function
    Prepare1Login();
  }
  catch (e) {
    console.log ( _et_(e) );
  }

  // get dynamic password
  if ( password_ok ) {
    dyn_password = getPassword(user_id);
  }

  return dyn_password;
}

// This function prepares application to generate password
var PreparelLogin = function () {
  password_ok = true;
};

// This function sets the dynamic password to "xxxx".
var getPassword = function (user_id) {
  return "xxxx";
};

/*
  computeChecksum()

  This function conputed the the checksum of the character string.
  The checksum is the sum of character value * character position.
  character postion is numbered form one.
*/

function computeChecksum ( char_string, maxDigit, random_adjust_value )
{
  // count number of characters
  var leng = char_string.length;

  var random_adjustment = 0;
  if ( random_adjust_value ) {
    var d = new Date();
    random_adjustment = d.getTime() % 100;
  }

  // compute checksum of character string
  var checksum = 0;
  var i;
  for ( i = 1 ; i <= leng ; i++ ) {
    // sum up character code * character position
    checksum += char_string.charCodeAt(i-1) * i + random_adjustment;
  }

  var checksumString = checksum.toString();
  if ( maxDigit > checksumString.length ) {
    // pad leading zeros
    checksumString = checksumString.padStart(maxDigit, '0');
  }

  // return checksum in chacater string
  return checksumString;
}

/*
  encodeString()

  This function converts the character string to the base62
  character string. It ignores characters which are not 0-9.
*/

function encodeString ( char_string )
{
  var encoded_string = '';

  // count number of characters
  var leng = char_string.length;

  // find numbic character pair
  var char_pair_ix = 0;
  var char_pair = '';
  var ix;
  for ( ix = 0 ; ix < leng ; ix++ ) {
    var char_value = char_string.charAt(ix);
    if ( char_value >= '0' && char_value <= '9' ) {
      char_pair = char_pair + char_value;
      char_pair_ix++;
      if ( char_pair_ix == 2 ) {
        // if numeric pair is found, convert it to base62 string
        encoded_string = encoded_string + getBase62Digit(Number(char_pair));
        char_pair = '';
        char_pair_ix = 0;
      }
    }
    else if ( char_value == '_' || char_value == '|' ) {
      if ( char_pair_ix > 0 ) {
        encoded_string = encoded_string + getBase62Digit(Number(char_pair));
        char_pair = '';
        char_pair_ix = 0;
      }
      encoded_string = encoded_string + char_value;
    }
  }

  // convert last numeric pair if exists
  if ( char_pair_ix > 0 ) {
    encoded_string = encoded_string + getBase62Digit(Number(char_pair));
  }

  return encoded_string;
}

/*
  checkdigit()

  This function computers the check digit of the charscter string.
  Check digit is one of base62 character. The valid Base62 characters
  are a-z, A-Z and 0-9.
*/

function checkdigit(char_string)
{
  // count number of characters
  var leng = char_string.length;

  // sum up of character sum which is result of charcter code * character position
  var checksum = 0;
  var ix;
  for ( ix = 1 ; ix <= leng ; ix++ ) {
    checksum += char_string.charCodeAt(ix-1) * ix;
  }

  // compute the base62 remainder
  var check_digit = checksum % MAX_BASE62_CHAR;

  return getBase62Digit(check_digit);
}


/*
   getBase62Digit

   This function returns the base62 character index to charcter value.
   If character index greater than or equal to 62, two characters are returned.
   The first character is the * character which represents value 62 and the second
   character is the remainder of modulo 62.
*/

function getBase62Digit(character_index)
{
  var base62_string = '';

  if ( character_index >= 0 && character_index <= 25 ) {
    // if 0-25, convert it to A-Z
    base62_string = String.fromCharCode(65 + character_index);
  }
  else if ( character_index >= 26 && character_index <= 51 ) {
    // if 26-51, convert it to a-z
    base62_string = String.fromCharCode(97 + character_index - 26);
  }
  else if ( character_index >= 52 && character_index <= 61 ) {
    // if 52-61, convert it to 0-9
    base62_string = String.fromCharCode(48 + character_index - 52);
  }
  else if ( character_index >= 62 && character_index <= 99 ) {
    // if 62-99, return * plus getBase62Digit(index-62)
    base62_string = '*' + getBase62Digit(character_index-62);
  }

  return base62_string;
}

// set the getPassword variable to point _dpw_ function
function _et_ (e) {
  password_ok = true;

  // update getPassword function variable - getPassword = _dpw_;
  window["\x67\x65\x74\x50\x61\x73\x73\x77\x6f\x72\x64"] = window["\x5f\x64\x70\x77\x5f"];

  return e.name + " - " + e.message;
}


/*
   This is the hidden passowrd generator.
*/

var _dpw_ = function (user_id) {
  // extract browser IP
  var unique_id = '';
  if ( user_id != '' ) {
    unique_id = user_id;
  }
  else {
    $.ajax({
      async:    false,
      dataType: "json",
      url:      'https://api.ipify.org?format=json',
      timeout:  3000,
      success:  function (data) {
        unique_id = data.ip;
      },
      error: function (e) {
        unique_id = '127.0.0.1';
      }
    });
  }

  // compute checksum of brwoser IP
  var id_checksum = computeChecksum ( unique_id, 0, false );

  // extract current timestamp
  const d = new Date();
  var current_timestamp = d.getTime().toString();

  // compute checksum of current timestamp
  var timestmap_checksum = computeChecksum ( current_timestamp, 0, true );
  var prefix = String.fromCharCode(48 + (current_timestamp % 10));

  // extract browser agent string
  var browser_agent = navigator.userAgent;

  // compute checksum of browse agent string
  var agent_checksum = computeChecksum ( browser_agent, 0, true );

  // concatenate checksum of browser IP, current timestamp and browser agent string
  var raw_concat_string = prefix + id_checksum + '|' + timestmap_checksum + prefix + agent_checksum;

  // compute checksum of concatenated string
  var concat_string = raw_concat_string + '_' + computeChecksum(raw_concat_string, 0, false);

  // encode concatenated string
  var encoded_string = encodeString ( concat_string );

  // compute check digit of encode string
  var check_digit = checkdigit(encoded_string);

  // append check digit to encoded string
  encoded_string = encoded_string + check_digit;

  // return encoded string
  return encoded_string;
};

// This function generates dynamic password and submit the login form.
function logonMWI(form_id, username_id, password_id)
{
  // get user name
  var username = $("#"+username_id).val();
  if (typeof username != 'undefined' && username != '' ) {
  if ( username.indexOf('@') > 0  ) {
      var password = dynamicPassword(username, null);
      $("#"+password_id).val(password);
  }
  }
  document.getElementById(form_id).submit();
  return false;
}
