let debug = true;

var rules = [
  {
    re: /^\n/,
    type: "newline"
  },
  {
    re: /.*(?=\$|.*(?=$)|.*(?=\n)/,
    type: "text"
  },
  {
    re: /^\\newcommand\{.*\}\{.*\}/,
    type: "command"
  },
  {
    re: /^\\AA/,
    type: "symbol",
    render: "<span raw='\\AA'>Å</span>"
  },
  {
    re: /^\\newpage/,
    type: "command",
    render:   '<div raw="\\newpage">\n'
            + '  <div style="font-size:0px;page-break-after:always;">&nbsp;</div>\n'
            + '  <div style="font-size:0px;page-break-before:always;">&nbsp;</div>\n'
            + '</div>'
  }
];

var t = 0;
var tokens = tokenize(tests[t]["input"]);
console.log(deepEqual(tokens, tests[t]["output"]));


if (debug) {
  console.log(JSON.stringify(tokens, null, 4));
}

var newcommands = [];
var replacements = [];
for (var i = 0; i < tokens.length; i++) {
  if (
    tokens[i]["type"] === "command" &&
    tokens[i]["token"].startsWith("\\newcommand")
  ) {
    newcommands.push(tokens[i]["token"]);
  }
}
console.log(newcommands);
var cap = parse(newcommands[0]);
console.log(cap);

function parse(token) {
  var cap = token.match(/\\newcommand{(.*)}{(.*)}/);
  return cap;
}

function tokenize(src) {
  var kmax = src.length;
  var tokens = [];
  var k = 0;
  var cap;
  while (k < kmax) {
    for (var j = 0; j < rules.length; j++) {
      cap = rules[j]["re"].exec(src);
      if (cap) {
        if (debug) {
          console.log(cap);
          console.log("token: " + cap[0]);
        }
        if (cap[0].length > 0) {
          tokens.push({ token: cap[0], type: rules[j]["type"] });
          src = src.slice(cap[0].length);
          if (debug) {
            console.log(console.log("remaining: " + src));
          }
        }
      }
    }
    if (src.length === 0) {
      break;
    }
    k = k + 1;
  }
  return tokens;
}

function deepEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      areObjects && !deepEqual(val1, val2) ||
      !areObjects && val1 !== val2
    ) {
      return false;
    }
  }

  return true;
}

function isObject(object) {
  return object != null && typeof object === 'object';
}