/*
   utility functions for thr M2L online application.
*/

/*
  printLabel()

  This function prints the spine label of catalogue record.
*/
function printLabel(e, link)
{
  e.preventDefault();

  var callno_id = 'ITEM_CALL_NUMBER';
  var object_name = "CALLNUMBER";
  var object_value = $('#' + callno_id).val();
  var printer_connected = false;
  if ( object_value == null || object_name == '' ) {
    alert ( "Call number is not defined." );
  }
  else {
    var printerName = "";
    var printers = dymo.label.framework.getPrinters();
    if (printers.length > 0) {
      for (var i = 0; i < printers.length; ++i) {
        var printer = printers[i];
        if (printer.printerType == "LabelWriterPrinter") {
          printerName = printer.name;
          if ( printer.isConnected ) {
            printer_connected = true;
          }
          break;
        }
      }
    }

    if ( printerName == '' ) {
      var yes_reply = confirm ( "No DYMO printers are installed. Install DYMO printers.\nDo you print label to default printer?" );
      if ( yes_reply ) {
        printJS(callno_id, 'html');
      }
    }
    else if ( !printer_connected ) {
      alert ( "Spine label is not printed because label printer is not ready." );
    }
    else {
      var labelXml = '<DieCutLabel Version="8.0" Units="twips">' +
                        '<PaperOrientation>Landscape</PaperOrientation>' +
                        '<Id>Small30347</Id>' +
                        '<PaperName>30347 1 in x 1-1/2 in</PaperName>' +
                        '<DrawCommands>' +
                          '<RoundRectangle X="0" Y="0" Width="1440" Height="2160" Rx="180" Ry="180" />' +
                        '</DrawCommands>' +
                        '<ObjectInfo>' +
                          '<TextObject>' +
                            '<Name>CALLNUMBER</Name>' +
                            '<ForeColor Alpha="255" Red="0" Green="0" Blue="0" />' +
                            '<BackColor Alpha="0" Red="255" Green="255" Blue="255" />' +
                            '<LinkedObjectName></LinkedObjectName>' +
                            '<Rotation>Rotation0</Rotation>' +
                            '<IsMirrored>False</IsMirrored>' +
                            '<IsVariable>True</IsVariable>' +
                            '<HorizontalAlignment>Left</HorizontalAlignment>' +
                            '<VerticalAlignment>Top</VerticalAlignment>' +
                            '<TextFitMode>ShrinkToFit</TextFitMode>' +
                            '<UseFullFontHeight>True</UseFullFontHeight>' +
                            '<Verticalized>False</Verticalized>' +
                            '<StyledText>' +
                              '<Element>' +
                                '<String>CALLNUMBER</String>' +
                                '<Attributes>' +
                                  '<Font Family="Arial" Size="12" Bold="True" Italic="False"' +
                                  '  Underline="False" Strikeout="False" />' +
                                  '<ForeColor Alpha="255" Red="0" Green="0" Blue="0" />' +
                                '</Attributes>' +
                              '</Element>' +
                            '</StyledText>' +
                          '</TextObject>' +
                          '<Bounds X="326" Y="165" Width="1747" Height="1065" />' +
                        '</ObjectInfo>' +
                      '</DieCutLabel>';
      var label = dymo.label.framework.openLabelXml(labelXml);
      label.setObjectText(object_name, object_value);
      label.print(printerName);
    }
  }
}
