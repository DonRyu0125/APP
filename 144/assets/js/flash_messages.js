var Messages = function() {

 var m = this;
  /*****
  **
  **  init : sets up messages, allows for message removal from client side
  **
   *****/
  this.init = function() {
    var session_messages = (m.messagesPresent()) ? m.getMessages() : [];
    var minisis_messages = ""; // rl-2021-02-21
    if ( document.getElementById("notices") != null ) { // rl-2021-02-21
      if ($('#notices').html().length > 15) {
        minisis_messages = m.cleanMinisisMessages('#notices');
      }
    }

    if (typeof minisis_messages !== 'undefined' && minisis_messages != "" ) {  // rl-2021-02-21
      session_messages = session_messages.concat(minisis_messages);
    }

    if (session_messages.length > 0) {
      m.setMessages(session_messages);
      var message_html = $('<div id="flash_messages"/>').append('<h2>Notice</h2>').append(m.generateMessageHtml()).append('<p><span class="close">Close Messages</span></p>');
      $('body').append(message_html);

      $('div#flash_messages span.close').off().on('click', function(){
        m.deleteMessages();
        $('div#flash_messages').fadeOut(250, function() {
          $('body').find('div#flash_messages').remove();
        });
      });
    }
  };


  /*****
  **
  **  messagesPresent : checks to see if any messages for the user are present in local storage
  **
  **  returns:
  **    - boolean (are messages present?  true/false)
  **
   *****/
  this.messagesPresent = function() {
    return (sessionStorage.getItem('messages') !== null);
  };


  /*****
  **
  **  getMessages : returns an array of all messages that have been set for the user
  **
  **  returns:
  **    - array of all available messages for the user (strings)
  **
   *****/
  this.getMessages = function() {
    if (!m.messagesPresent()) return false;

    return sessionStorage.getItem('messages').split('$$$');
  };


  /*****
  **
  **  setMessages : sets the messages to display to the user
  **
  **  params:
  **    - messages : Either a STRING or an ARRAY containing strings to send to the user.
  **
   *****/
  this.setMessages = function(messages) {
    var messages_to_set = '';
    messages = (typeof messages == 'string') ? [messages] : messages;

    for (var i=0; i < messages.length; i++) {
      if (i!==0) messages_to_set += "$$$";
      messages_to_set += htmlEscape(messages[i]);
    }

    sessionStorage.setItem('messages', messages_to_set);
  };


  /*****
  **
  **  deleteMessages : clears any existing messages for the user
  **
   *****/
  this.deleteMessages = function() {
    sessionStorage.removeItem('messages');
  };


  /*****
  **
  **  generateMessageHtml : generates the messages to display to the user
  **
   *****/
  this.generateMessageHtml = function() {
    var messages = m.getMessages();
    var html = $('<ul/>');

    for (var i = 0; i < messages.length; i++) {
      html.append('<li>' + htmlUnescape(messages[i]) + '</li>');
    }

    return html;
  };

  /*****
  **
  **  cleanMinisisMessages : cleans up the messages returned from MINISIS for use with this messaging system
  **
   *****/
  this.cleanMinisisMessages = function(messages_id) {
    return $(messages_id).html().split('<br>').slice(1,-1);
  };
}