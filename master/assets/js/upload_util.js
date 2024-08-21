
// read cookie value
function getMyCookie ( cookie_name ) {
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

// close colorbox
function CloseColorBox() {
  parent.$.colorbox.close();
}

// read a web page
function read_page(request_url, form_id, form_body_id) {
  if ( typeof form_id == 'undefined' || form_id == "" ) {
    // send URL with GET method
    $.ajax({
      async: false,
      type: "GET",
      dataType: "html",
      url: request_url,
      success: function (data) {
        if ( data != null && data != "" ) {
          document.getElementById(form_body_id).innerHTML = data;
        }
        else {
          alert ( "Web page is empty" );
        }
      },
      error: function (xhr, status, error) {
        alert ( "Unable to read web page" );
      }
    });
  }
  else {
    // send URL with POST method
    var jquery_form = "#" + form_id;
    var form_data = $(jquery_form).serialize();

    $.ajax({
      async: false,
      type: "POST",
      dataType: "html",
      url: request_url,
      data: form_data,
      success: function (data) {
        if ( data != null && data != "" ) {
          document.getElementById(form_body_id).innerHTML = data;
        }
        else {
          alert ( "Web page is empty" );
        }
      },
      error: function (xhr, status, error) {
        alert ( "Unable to read web page" );
      }
    });
  }
}
