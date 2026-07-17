var hash = {}
hash.initialize  = function () {

  var hash_o = window.location.hash;
  var line = hash.get('l');
  var anchor = hash_o.split("&")[0];
  util.log("l = " + line + "; anchor = " + anchor,'hash',1);
  if (!/^#/.test(anchor)) {anchor = "";}

  // If line given, use it even if anchor given.
  if (line !== "") {
      var editor = ace.edit("editor");
      var extra = ".";
      if (anchor) {
        extra = " and ignoring any anchor " + anchor;
      }
      util.log("Scrolling to location given by line parameter l in hash (" + (parseInt(line)) + ")" + extra,'hash',1);
      var firstVisibleLine = parseInt($('.ace_gutter-cell').first().text());
      if (parseInt(line) - 3 >= firstVisibleLine) {
        editor.scrollToLine(parseInt(line) - 3);
      } else {
        editor.scrollToLine(parseInt(line) - 1);
      }
      var col = hash.get('c') || 0;
      editor.moveCursorTo(parseInt(line) - 1, col - 1);
  } else if (anchor !== "") {
    util.log("Scrolling to section indicated by hash.",'hash',1);
    var el = $('#display a[href="' + anchor + '"].hanchor');
    if (el[0]) {
      util.log("Clicking " + '#display a[href="' + anchor + '"].hanchor'
          ,'hash',1);
      el[0].click();
      // The click causes all other hash parameters to be removed.
      // This recovers them.
      window.location.hash = hash_o;
    } else {
      util.log("Anchor " + anchor 
          + " not found in DOM. Removing it from hash."
          ,'hash',1);
      if (/=/.test(hash_o)) {
        window.location.hash = hash_o.replace(anchor + "&","");
      } else {
        window.location.hash = hash_o.replace(anchor,"");
      }
    }
  }
}

hash.get = function(key) {
  var hash = window.location.hash;
  if (hash.includes(key + '=')) {
    var re = new RegExp("(#|&).*" + key + "=(.+?)(&.*|$)");
    return hash.replace(re, "$2");
  } else {
    return "";
  }
}

hash.update = function(key, val) {
  var hashString = window.location.hash;
  util.log("Updating hash.",'hash',1);
  util.log("  Current: " + hashString,'hash',1);

  let re = new RegExp(key + "=");
  if (re.test(hashString)) {
    if (val === "") {
      re = new RegExp("(&?" + key + "=.+?)(&|$)");
      hashString = hashString.replace(re, "");
    } else {
        re = new RegExp(key + "=(.+?)(&|$)")
        hashString = hashString.replace(re, key + "=" + val + "$2");
    }
  } else {
    if (val !== "") {
      hashString = hashString + "&" + key + "=" + val;
    }
  }

  hashString = hashString.replace(/^#&/, "#").replace(/^&/, "#");

  if (hashString === "#") {
    location.hash = "";
    history.pushState(null, null, ' ');
  }
  util.log("      New: " + hashString,'hash',1);
  window.location.hash = hashString;
}