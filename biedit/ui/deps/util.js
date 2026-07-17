util = {} 

util.tic = function() {
  if (app['logLevel_']['timing'] > 0 ) {
    return startTime = new Date();
  }
}

util.toc = function(startTime, msg) {
  if (app['logLevel_']['timing'] > 0 ) {
    var endTime = new Date();
    var dt = endTime - startTime;
    log(dt + " " + msg,'timing',1);
  }
}

util.log = function(msg, category, level) {

  function pad(n) {
    if (n < 10) {return "0".repeat(4) + n};
    if (n < 100) {return "0".repeat(3) +n};
    if (n < 1000) {return "0".repeat(2) + n};
    if (n < 10000) {return "0".repeat(1) + n};
    return "" + n;
  }

  if (app['logMode'] === 'disabled') {
    return;
  }

  if (app['logLevel_']['all'] == false && app['logLevel_'][category] < level) {
    return;
  }

  if (app['logMode'] === 'native') {
    if (app['logLevel_'][category] >= level) {
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
    if (app['logLevel_'][category] >= level) {
      console.log(pad(dt) + " " + msg);
    }
  } else {
    // https://stackoverflow.com/a/37081135
    var e = new Error();
    var stack = e.stack.toString().split(/\r\n|\n/);
    var line = stack[2]
                .replace(/.*\//,"")
                .replace(/:(.*):.*/,":$1")
      if (typeof(msg) === "string") {
        console.log(pad(dt) + " " + line + " [" + category + "] " + msg);
      } else {
        console.log(msg);
      }
  }
}

util.xconsole = function(msg, clear, timeout) {
  alert("here")
  if (clear) {
    $("#xconsole").html('');
    //$("#xconsole").html("<span id='xconsole-close'>&nbsp;xxx</span><br><pre id='xconsole-msg'>" + msg + "</pre>").show();
    $('#xconsole-close').one('click', () => {$('#xconsole').hide();});
  } else {
    $("#xconsole pre").append(msg).show();
  }

  if (timeout > 0) {
    setTimeout( () => {
      //$('#xconsole-close').off();
      //$('#xconsole').hide();
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

util.getHash = function(key) {
  var hash = window.location.hash;
  if (hash.includes(key + '=')) {
    var re = new RegExp("(#|&).*" + key + "=(.+?)(&.*|$)");
    return hash.replace(re, "$2");
  } else {
    return "";
  }
}

util.updateHash = function(key, val) {
  var hashString = window.location.hash;
  re = new RegExp(key + "=");
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
  window.location.hash = hashString;
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

  if (allowIndexMD) {
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

