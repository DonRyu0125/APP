function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function htmlEscape(str) {
  return String(str)
   .replace(/&/g, '&amp;')  /* RL-2021-05-31 */
   .replace(/"/g, '&quot;')
   .replace(/'/g, '&#39;')
   .replace(/</g, '&lt;')
   .replace(/>/g, '&gt;');
}


function htmlUnescape(value){
  return String(value).replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&euro;/g, '€').replace(/&#35;/g, '#').replace(/&#36;/g, '$').replace(/&#37;/g, '%').replace(/&#40;/g, '(').replace(/&#41;/g, ')').replace(/&iexcl;/g, '¡').replace(/&cent;/g, '¢').replace(/&pound;/g, '£').replace(/&curren;/g, '¤').replace(/&yen;/g, '¥').replace(/&brvbar;/g, '¦').replace(/&sect;/g, '§').replace(/&uml;/g, '¨').replace(/&copy;/g, '©').replace(/&ordf;/g, 'ª').replace(/&#171;/g, '«').replace(/&not;/g, '¬').replace(/&reg;/g, '®').replace(/&macr;/g, '¯').replace(/&deg;/g, '°').replace(/&plusmn;/g, '±').replace(/&acute;/g, '´').replace(/&micro;/g, 'µ').replace(/&para;/g, '¶').replace(/&frac14;/g, '¼').replace(/&frac12;/g, '½').replace(/&frac34;/g, '¾').replace(/&iquest;/g, '¿').replace(/&#192;/g, 'À').replace(/&#193;/g, 'Á').replace(/&#194;/g, 'Â').replace(/&#195;/g, 'Ã').replace(/&#196;/g, 'Ä').replace(/&#197;/g, 'Å').replace(/&#198;/g, 'Æ').replace(/&#199;/g, 'Ç').replace(/&#200;/g, 'È').replace(/&#201;/g, 'É').replace(/&#202;/g, 'Ê').replace(/&#203;/g, 'Ë').replace(/&#204;/g, 'Ì').replace(/&#205;/g, 'Í').replace(/&#206;/g, 'Î').replace(/&#207;/g, 'Ï').replace(/&#208;/g, 'Ð').replace(/&#209;/g, 'Ñ').replace(/&#210;/g, 'Ò').replace(/&#211;/g, 'Ó').replace(/&#212;/g, 'Ô').replace(/&#213;/g, 'Õ').replace(/&#214;/g, 'Ö').replace(/&#215;/g, '×').replace(/&#216;/g, 'Ø').replace(/&#217;/g, 'Ù').replace(/&#218;/g, 'Ú').replace(/&#219;/g, 'Û').replace(/&#220;/g, 'Ü').replace(/&#221;/g, 'Ý').replace(/&#222;/g, 'Þ').replace(/&#223;/g, 'ß').replace(/&#224;/g, 'à').replace(/&#225;/g, 'á').replace(/&#226;/g, 'â').replace(/&#227;/g, 'ã').replace(/&#228;/g, 'ä').replace(/&#229;/g, 'å').replace(/&#230;/g, 'æ').replace(/&#231;/g, 'ç').replace(/&#232;/g, 'è').replace(/&#233;/g, 'é').replace(/&#235;/g, 'ë').replace(/&#236;/g, 'ì').replace(/&#237;/g, 'í').replace(/&#238;/g, 'î').replace(/&#239;/g, 'ï').replace(/&#240;/g, 'ð').replace(/&#241;/g, 'ñ').replace(/&#242;/g, 'ò').replace(/&#243;/g, 'ó').replace(/&#244;/g, 'ô').replace(/&#245;/g, 'õ').replace(/&#246;/g, 'ö').replace(/&#247;/g, '÷').replace(/&#248;/g, 'ø').replace(/&#249;/g, 'ù').replace(/&#250;/g, 'ú').replace(/&#251;/g, 'û').replace(/&#252;/g, 'ü').replace(/&#253;/g, 'ý').replace(/&#254;/g, 'þ').replace(/&#255;/g, 'ÿ').replace(/&#256;/g, '?').replace(/&#257;/g, '?').replace(/&#258;/g, '?').replace(/&#259;/g, '?').replace(/&#260;/g, '?').replace(/&#261;/g, '?').replace(/&#262;/g, '?').replace(/&#263;/g, '?').replace(/&#264;/g, '?').replace(/&#265;/g, '?').replace(/&#266;/g, '?').replace(/&#267;/g, '?').replace(/&#268;/g, '?').replace(/&#269;/g, '?').replace(/&#270;/g, '?').replace(/&#271;/g, '?').replace(/&#272;/g, '?').replace(/&#273;/g, '?').replace(/&#274;/g, '?').replace(/&#275;/g, '?').replace(/&#276;/g, '?').replace(/&#277;/g, '?').replace(/&#278;/g, '?').replace(/&#279;/g, '?').replace(/&#280;/g, '?').replace(/&#281;/g, '?').replace(/&#282;/g, '?').replace(/&#283;/g, '?').replace(/&#284;/g, '?').replace(/&#285;/g, '?').replace(/&#286;/g, '?').replace(/&#287;/g, '?').replace(/&#288;/g, '?').replace(/&#289;/g, '?').replace(/&#290;/g, '?').replace(/&#291;/g, '?').replace(/&#292;/g, '?').replace(/&#293;/g, '?').replace(/&#294;/g, '?').replace(/&#295;/g, '?').replace(/&#296;/g, '?').replace(/&#297;/g, '?').replace(/&#298;/g, '?').replace(/&#299;/g, '?').replace(/&#8482;/g, '™').replace(/&amp;/g, '&');
}

// Adding .trim() functionality to Internet Explorer:
if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  }
}

/*
  isInMap

  params:
    - keyword : a string to be searched for
    - object : an array of javascript objects to be traversed searching for `keyword`

  returns:
    - boolean value of whether the keyword was found in `object` or not
*/
function isInMap(keyword, object) {
  keyword = keyword.toLowerCase();
  var result = false;

  for (var i = 0; i < object.length; i++) {
    $.each(object[i], function(k,v) {
      if (k.toLowerCase() === keyword || v.toLowerCase() === keyword || k.toLowerCase() + '_occurrence' === keyword  || v.toLowerCase() + '_occurrence' === keyword) {
        result = true;
      }
    });
  }

  return result;

};


/*
  isInArray

  params:
    - keyword : a string to be searched for
    - arr: an array of strings to be traversed searching for `keyword`

  returns:
    - boolean value of whether the keyword was found in `arr` or not
*/
function isInArray(keyword, arr) {
  keyword = keyword.toLowerCase();
  var result = false;

  for (var i = 0; i < arr.length; i++) {
    if (arr[i].toLowerCase() === keyword) result = true;
  }

  return result;
};
