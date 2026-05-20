util = {} 

util.favicon_href = function(text) {
  return $('#favicon').attr('href').replace(/🔀|💥/,text);
}

util.favicon = function(state) {
  // Use favicon to indicate if there are un-saved changed.
  if (state === 'default') {text = "🔀";}
  if (state === 'unsavedChanges') {text = "💥";}

  $("#favicon").attr("href", util.favicon_href(text));
}

util.tic = function() {
  if (app['logLevel']['timing'] > 0 ) {
    return startTime = new Date();
  }
}

util.toc = function(startTime, msg) {
  function pad(n) {
    if (n < 10) {return " ".repeat(2) + n};
    if (n < 100) {return " ".repeat(1) + n};
  }
  let e = new Error();
  let stack = e.stack.toString().split(/\r\n|\n/);
  let line = stack[2]
              .replace(/.*\//,"")
              .replace(/:(.*):.*/,":$1");
  if (app['logLevel']['timing'] > 0 ) {
    let endTime = new Date();
    let dt = endTime - startTime;
    util.log(pad(dt) + " [ms] " + msg + " (" + line + ")",'timing',1,"");
  }
}

util.warn = function() {
  // Based on https://stackoverflow.com/a/59914441/18433855
  // Used in marked-renderers.js/render() to show KaTeX
  // warnings that appear in console also appear in title of
  // equation element.
  let args = Array.prototype.slice.call(arguments);
  let messages = args
                  .filter(function(a) {
                      return typeof a === 'string';
                  });
  util.warn.messages = messages.join(", ");
  if (!util.warn.token) {
    console.log(messages);
    return;
  }
  for (var m in messages) {
    console.oldWarn("Line(s) " + util.warn.token.lineStart + "-" + util.warn.token.lineEnd + ": " + messages[m]);
  }
}
console.oldWarn = console.warn;
console.warn = util.warn;

util.log = function(msg, category, level, line) {

  function pad(n) {
    if (n < 10) {return "0".repeat(4) + n};
    if (n < 100) {return "0".repeat(3) +n};
    if (n < 1000) {return "0".repeat(2) + n};
    if (n < 10000) {return "0".repeat(1) + n};
    return "" + n;
  }

  if (app['logLevel']['none'] == 1) {
    return;
  }
  if (app['logMode'] === 'disabled') {
    return;
  }

  if (app['logLevel']['all'] == false && app['logLevel'][category] < level) {
    return;
  }

  if (app['logLevel']['all'] > 0 && level > app['logLevel']['all']) {
    return;
  }

  if (app['logMode'] === 'native') {
    if (app['logLevel'][category] >= level) {
      console.log(msg);
    }
    return;
  }

  this.log.currentTime = (new Date()).getTime();
  var dt = 0;
  if (this.log.lastTime !== undefined) {
    dt = this.log.currentTime - this.log.lastTime;
  }
  this.log.lastTime = this.log.currentTime;

  if (app['logMode'] === 'custom-fast') {
    if (app['logLevel'][category] >= level) {
      console.log(pad(dt) + " " + msg);
    }
  } else {

    if (msg && line !== "") {    
      // https://stackoverflow.com/a/37081135
      var e = new Error();
      var stack = e.stack.toString().split(/\r\n|\n/);
      var line = stack[2]
                  .replace(/.*\//,"")
                  .replace(/:(.*):.*/,":$1");
      line = " " + line;
    }
    if (typeof(msg) === "string") {
      console.log(pad(dt) + line + " [" + category + "] " + msg);
    } else {
      console.log(msg);
    }
  }
}

util.xconsole = function(msg, clear, timeout) {

  if (clear) {
    $("#xconsole").html('');
    $("#xconsole").html("<span id='xconsole-close'>&nbsp;x Close</span><span style='float: right' id='xconsole-keepopen'>+ Keep Open</span><br><pre id='xconsole-msg'>" + msg + "</pre>").show();
    $('#xconsole-close').one('click', () => {
      $('#xconsole').hide();
    });
    $('#xconsole-keepopen').one('click', () => {
      clearTimeout(util.xconsole.timeoutID);
    });
  } else {
    $("#xconsole pre").append(msg).show();
  }

  if (timeout > 0) {
    util.xconsole.timeoutID = setTimeout( () => {
      $('#xconsole-close').off();
      $('#xconsole').hide();
    }, timeout);
  }
}

util.status = function (msg, error, timeout) {
    if (error) {
      $("#status").css('color','red').html(msg);
    } else {
      $("#status").html(msg);
    }
    if (timeout > 0) {
      setTimeout( () => $('#status').html(''), timeout);
    }
}


util.fileName = function() {

  // Keep only filename. Post request include path.
  let fileName = location.pathname.split("/").slice(-1)[0];
  if (fileName.endsWith("!")) {
    fileName = fileName.slice(0,-1);
    return fileName;
  }

  if (fileName !== '') {
    if (!fileName.endsWith('.md') && /\./.test(fileName)) {
      fileName = fileName + ".md";
    }
    return fileName;
  }

  let els = $("#file [label='.'] option");
  let files = [];
  for (let i = 0; i < els.length; i++) {
    files.push($(els[i]).attr('value'))
  }

  if (app['server']['allowIndexMD']) {
    return "index.md";
  } else {
    return "README.md"
  }

  if (false) {
    let k = 1;
    while (true) {
      fileName = "untitled" + (k) + ".md";
      if (!files.includes(fileName)) {
        break;
      } else {
        k = k + 1;
      }
    }

    return fileName;
  }
}

util.wordwrap = function(str, width, brk, cut) {
  // https://j11y.io/snippets/wordwrap-for-javascript/

  brk = brk || 'n';
  width = width || 75;
  cut = cut || false;

  if (!str) { return str; }

  var regex = '.{1,' + width + '}(\s|$)' + (cut ? '|.{' +width+ '}|.+$' : '|\S+?(\s|$)');

  return str.match( RegExp(regex, 'g') ).join( brk );
}

$.fn.isInViewport = function() {
  var elementTop = $(this).offset().top - $("#display").offset().top;
  var elementBottom = elementTop + $(this).outerHeight();

  var viewportTop = $("#display").scrollTop();
  var viewportBottom = viewportTop + $("#display").innerHeight();

  displayHeight = (viewportBottom-viewportTop);
  //console.log("elementTop: " + elementTop);
  //console.log("elementBottom: " + elementBottom);
  //console.log("displayHeight: " + displayHeight);
  return elementTop > 0 
          && elementBottom > 0
          && elementTop < displayHeight 
          && elementBottom < displayHeight;
}

util.localSave = function(data) {

  var timeStamp = (new Date()).toISOString();

  let saveFileName;
  if (!util.localSave.parent) {
    util.localSave.parent = window.location.pathname.slice(0,-4) + "." + timeStamp + ".md";
    saveFileName = util.localSave.parent;
  } else {
    saveFileName = util.localSave.parent + "/" + timeStamp + ".json";
    data = JSON.stringify(data);
  }

  util.log("localStorage save: " + saveFileName, 'server', 1);
  try {
    localStorage.setItem(saveFileName, data);
  } catch (err) {
    // TODO: Test if error is associated with localStorage limit.
    // Problem: Errors vary by browser:
    // https://www.raymondcamden.com/2015/04/14/blowing-up-localstorage-or-what-happens-when-you-exceed-quota
    var arr = Object.keys(localStorage);
    for (idx in arr) {
      console.log(arr[idx])
      if (!arr[idx].startsWith(util.localSave.parent)) {
        console.log("localStorage full. Removing from local storage: " + arr[idx], 'main', 1);
        localStorage.removeItem(arr[idx]);
      }
    }
    try {
      localStorage.setItem(saveFileName, data);
    } catch (err) {
      console.log(err);
    }
  }
}

