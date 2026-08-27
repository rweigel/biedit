marked.setOptions(app['marked']);

const renderer = new marked.Renderer();

var cache = {'code': {}, 'li': {}, 'p': {}, 'equation': {}};

counter.heading = "0";
counter.paragraph = 0;
counter.equation = 0;
counter.quote = 0;
counter.code = 0;
counter.list = 0;
counter.listitem = 0;
function counter(type, value) {

  if (value !== undefined) {
    for (key in counter) {
      if (key !== "heading" && key !== "list") {
        counter[key] = 0;
      }
    } 
    counter.heading = value;
  } else {
    if (type !== "heading") {
      counter[type] += 1;
    }
    return counter[type]
  }
}

var originTable = renderer.table.bind(renderer);
renderer.table = function table(header, body, token) {
  if (body) body = '<tbody>' + body + '</tbody>';
  return '<div class="block">\n'
          + `<table lo=${token.lineStart} lf=${token.lineEnd}>\n`
          + '<thead>\n'
          + header 
          + '</thead>\n' 
          + body 
          + '</table>\n' 
          + lineDiv(token) 
          + '</div>\n';
};

renderer.xtable = function table(header, body, token) {
    if (body) {
      //console.log(`<tbody lo=${token.lineStart} lf=${token.lineEnd}>${body}</tbody>`)
      return `<tbody lo=${token.lineStart} lf=${token.lineEnd}>${body}</tbody>`;
    }
    return `<table lo=${token.lineStart} lf=${token.lineEnd}>\n<thead>\n${header}</thead>\n${body}</table>\n`;
}

renderer.strong = (text) => {
  return '<strong type="md">' + text + '</strong>';
}

renderer.em = (text, token) => {
  //console.log(text)
  let marker = token.raw[0];
  return `<em type="md" marker="${marker}">${text}</em>`;
};

renderer.codespan = (text)  => {
  return '<code type="md">' + text.replace(/\$/g,"﹩＄﹩") + '</code>';
};

renderer.del = (text) => {
  return '<del type="md">' + text + '</del>';
};

let originHr = renderer.hr.bind(renderer);
renderer.hr = (token) => {
  return '<div class="block">'
      +    `<div class="hr" lo=${token.lineStart} lf=${token.lineEnd}></div>`
      +     lineDiv(token)
      +  '</div>\n';
}

function title(text, token) {
  text = text.trim().substring(1);
  return `<div class="block">
            <p class="title" lo=${token.lineStart} lf=${token.lineStop}>${text}</p>
            ${infoDiv(token)}
         </div>\n`;
}
function abstract(text, token) {
  text = text.trim().substring(1);
  return `<div class="block">
            <p class="abstract" lo=${token.lineStart} lf=${token.lineStop}>${text}</p>
            ${infoDiv(token)}
         </div>\n`;
}

let originHeading = renderer.heading.bind(renderer);
renderer.heading = (text, level, c, _slug, token) => {

  util.log("Text:\n" + text, 'renderHeading',1);

  if (text.trim().startsWith(":")) {
      if (text.trim().toLowerCase().startsWith(":title")) {
        return title(text, token);
      }
      if (text.trim().toLowerCase().startsWith(":abstract")) {
        return abstract(text, token);
      }
  }

  var heading_numbers = headingData.heading_numbers;
  heading_numbers[level - 1] = heading_numbers[level - 1] + 1;
  for (var i = level; i < heading_numbers.length; i++) {
    headingData.heading_numbers[i] = 0;
  }

  var number = "";
  for (var i = 0; i < level; i++) {
    number = number + headingData.heading_numbers[i] + ".";
  }
  number = number.slice(0,-1); // Remove trailing .

  counter('heading', number);

  let slugText = slug(text,number);

  if (headingData.toc == "") {
    this.last = 1;
    headingData.toc = "<ol>";
  }

  // Remove newlines in raw string.
  var raw = token ? token.raw.replace(/\n+/,'') : "";
  //var raw = token ? token.raw.replace(/\n/,'') : "";
  //var raw = token.raw.replace(/\n=*/,'').replace(/\n-*/,'').replace(/\n/,'');

  if (app['renderMathAfter'] === false) {
    text = renderEquation(text);
  }

  if (false) {
    text = renderLatex(text);
    console.log("<div>" + text + "</div>")
    let lanchor = $("<div>" + text + "</div>").find("[raw].lanchor").remove();
    if (lanchor.length > 0) {
      util.log("Found label in header text. Moving link outside", 'renderHeading',1);
      lanchor = $(lanchor).prop('outerHTML');
      textjq = $("<div>" + text + "</div>");
      textjq.find("[raw].lanchor").remove();
      text = textjq.html();
    } else {
      lanchor = "";
    }
  }

  var number2 = number;
  var tmp = text.split(" ");
  if (app['TOC']['markdown']['show'] && /^[0-9]/.test(tmp[0])) {
    number2 = tmp[0];
    text = tmp.slice(1).join(" ");
  }

  util.log("Setting .hnumber to '" + number2 + "'",'renderHeading',1);
  util.log("Setting .htext to '" + text + "'",'renderHeading',1);
  // Strip inner <a> tags to avoid nesting inside the hanchor <a>.
  // Nested <a> elements are invalid HTML; browsers restructure the DOM in a
  // way that empties .htext, breaking the TOC.
  let htextContent = text.replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, '$1');
  var hLink = 
    `<a name="${slugText}" number="${number}" lo=${token.lineStart} raw="${raw}" class="anchor hanchor" href="#${slugText}"><span class="hnumber">${number2}</span>&nbsp;<span class="htext">${htextContent}</span></a>`;

  if (false && app['TOC']['markdown']['show'] && app['TOC']['markdown']['style'].startsWith("numbered-custom")) {
    // Remove number
    text = text.split(" ").slice(1).join(" ");
  }

  var wrapstr = "";
  if (renderer.heading.wrap) {
    wrapstr = `\n</div>${sectionDiv()}\n`;
  }

  return `${wrapstr}
            <div class="block">
              <h${level} lo=${token.lineStart} lf=${token.lineEnd}>${hLink}</h${level}>
              ${infoDiv(token, 'heading')}
            </div>`;
}

let originBlockquote = renderer.blockquote.bind(renderer);
renderer.blockquote = (quote, token) => {
  return '<div class="block">'
      +    `<div class="blockquote" lo=${token.lineStart} lf=${token.lineEnd}>`
      +       quote
      +     '</div>'
      +     infoDiv(token,'quote')
      +  '</div>\n';
}

// See https://shuheikagawa.com/blog/2015/09/21/using-highlight-js-with-marked/
let originCode = renderer.code.bind(renderer);
renderer.code = (code, infostring, escaped, token) => {

  code = code.replace(/\\htmlnewline/g,"");

  util.log("code:\n" + code,'renderCode',2);
  util.log("infostring:\n" + infostring,'renderCode',1);
  util.log("token:\n" + token,'renderCode',2);

  if (cache['code'][code]) {
    util.log("Cache hit for " + code,'renderCache',1);
    return cache['code'][code]
  }

  let lang = (infostring || '').match(/\S*/)[0];
  let langClass = "";
  if (lang) {
    langClass = `class="${renderer.options.langPrefix}${lang}"`;
  }

  // language-option1-option2
  let langs = lang.split("-");
  lang = langs[0];
  let langopts = langs.slice(1);

  if (lang === "mdextension") {
    var codea = code.split(/\n/); // Code array
    var lineDivStr = "";
    var dl = token.codeBlockStyle === "indented"? 0 : 1;
    var lo = dl + parseInt(token.lineStart);
    code = "";
    for (var i = 0; i < codea.length; i++) {
      lo = lo+i;
      if (codea[i] == '') {
        continue;
      }
      var codeas = codea[i].split(":");
      if (codeas.length == 1) {
        continue;
      }
      var className = codeas[0].toLowerCase();
      var text = codeas[1].trimStart();
      if (text.length == 0) {
        continue;
      }
      if (className === "date" && text === "today") {
        text = (new Date).toDateString();
      }
      textp = parseMD(text, true, token.lineStart + i + 2);
      text = $(textp).find('p').addClass(className).parent()[0].outerHTML;
      code += text;
    }
    if (code !== "") {
      return code;
    }
  }

  let codeneeded = true;
  if (langopts.includes('render') && langopts.includes('include') == false) {
    codeneeded = false;
  }

  if (renderer.options.highlight && codeneeded) {
    const out = renderer.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  // Add line numbers to each line
  var codea = code.split(/\n/); // Code array
  if (codeneeded && codea.length > 1) {
    var lineDivStr = "";
    var lo = parseInt(token.lineStart);
    var dl = token.codeBlockStyle === "indented"? 0 : 1;

    code = "";
    for (var i = 0; i < codea.length; i++) {
      var lineDivStr = "";
      if (app['codeLineNumbers']['show'] 
            && codea.length >= app['codeLineNumbers']['minLines']) {
        lineDivStr = `<div class="line-number">${i+1}</div>`;
      }
      code +=   '<div class="block">'
              +   `<code lo="${lo+i+dl}">${codea[i]}</code>`
              +   lineDivStr
              + '</div>';


    }
  }
  util.log("Code: " + code, 'renderCode',1);

  if (lang === "javascript" && langopts.includes('render')) {
    try {
      // TODO: https://briangrinstead.com/blog/load-web-workers-without-a-javascript-file/
      let cmds = '"use strict"\n' + token.text;
      util.log("Evaluating:\n" + cmds, 'renderCode',1);
      let ret = Function(cmds)();
      console.log(ret)
      if (ret && typeof ret.then == 'function') {
        // Promise
        token.text = "";
        // https://stackoverflow.com/questions/27746304/how-do-i-tell-if-an-object-is-a-promise/
        ret.then( data => {
          console.log(data)
          console.log($(`[lo=${lo}]`))
          $(`[lo=${lo}]`).prepend(data);
          var svg = document.getElementsByTagName("svg")[0];
          var bbox = svg.getBBox();
          var viewBox = [bbox.x, bbox.y, bbox.width, bbox.height].join(" ");
          svg.setAttribute("viewBox", viewBox);
          svg.setAttribute("width", bbox.width);
          svg.setAttribute("height", bbox.height);
          $(svg).css("width", bbox.width);
          $(svg).css("height", bbox.height);
        })
      } else {
        token.text = ret + "";
      }
      if (ret === undefined) {
        token.text = "<pre style='font-family: monospace;color:red'>Script does not have a return value.</pre>";        
      }
    } catch(err) {      
      token.text = "<pre style='font-family: monospace;color:red'>" + err.message + "</pre>";
    }
  }

  if (langopts.includes('render') || langopts.includes('include')) {
    let style = "";
    if (langopts.includes('include')) {
      style = "display:flex;flex-direction:column";
      code = '<pre>' + code + '</pre>';
    } else {
      code = "";
    }
    html = 
         '<div class="block">'
      +  `<div class="block" style="${style}" lo="${token.lineStart}" lf="${token.lineEnd}">`
      +   '<div style="width:100%">'
      +     token.text.replace(/\\htmlnewline/g,"")
      +     code
      +   '</div>'
      +   infoDiv(token,"code")
      + '</div>'
      + '</div>'
  } else {
    html = 
         '<div class="block">'
      +   `<pre lo="${token.lineStart}" lf="${token.lineEnd}" ${langClass}>`
      +       code
      +   '</pre>'
      +   infoDiv(token,"code")
      + '</div>';
  }
  //util.log("Code:",'codeRender',1);
  //util.log(code,'codeRender',1);
  //util.log("Language: " + lang,'codeRender',1);
  return html;
}

let originList = renderer.list.bind(renderer);
renderer.list = function list(body, ordered, start, token) {

  util.log("list body:\n" + html_beautify(body),'renderList',1);

  let style = "loose";
  if (!token.loose) {
    style = "compact";
  }

  let type = ordered ? 'ol' : 'ul';
  let startatt = ordered && start !== 1 ? ' start="' + start + '"' : '';
  return '<div class="block">'
       +   `<${type}${startatt} lo=${token.lineStart} lf=${token.lineEnd} class="${style}">`
       +      body
       +    `</${type}>`
       +    infoDiv(token, "list")
       +  '</div>';
};


let originListItem = renderer.listitem.bind(renderer);
renderer.listitem = (text, task, checked, token) => {

  util.log("list item text:\n" + text,'renderListItem',1);
  util.log("list item token:",'renderListItem',1);
  util.log(token,'renderListItem',1);
  // Marked does not include leading spaces for outermost list item.
  // Recover them to allow calculation of column on click.
  // TODO: Would need to also deal with the fact that a token
  // such as "  abc" is put in dom as " abc" (space removed).
  let tmp = token.raw.split("\n")[0];
  let match = token.raw.match(/^(\s*)(.*?)\s(\s*)/);
  let markerlength = 0;
  let markerpadlength = 0;
  let padlength = 0;
  if (match) {
    text = text.trimStart();
    padlength = match[1].length
    markerlength = 1 + match[2].length
  }

  if (false && cache['li'][text]) {
    util.log("Cache hit for " + text,'renderCache',1);
    return cache['li'][text]
  }

  //if (!text.trimStart().startsWith("<div")) {
  var idx = text.indexOf("<div");
  if (idx > 0) {
    // In the following
    // 1. ABC
    // the "ABC" does not get processed as a paragraph first 
    // by Marked. So we must do it here.
    // In the case
    // 1. ABC
    //    
    //    DEF
    // both ABC and DEF are processed as paragraphs before being
    // passed here as a list item.
    util.log("Unprocessed list item text",'renderListItem',1);
    util.log("Unwrapped string before div block",'renderListItem',1);
    utext = text.slice(0,idx);
    ptext = parseMD(utext, true, token.lineStart+1);
    util.log("Processed list item text:\n" + html_beautify(ptext),'renderListItem',1);
    text = ptext + text.slice(idx);
  } else {
    util.log("No unwrapped string before div block",'renderListItem',1);
    if (!text.trimStart().startsWith("<div")) {
      text = parseMD(text, true, token.lineStart+1);
      util.log("Processed list item text:\n" + html_beautify(text),'renderListItem',1);
    }
  }

  var html = 
    `<li markerlength=${markerlength} padlength=${padlength} lo=${token.lineStart} lf=${token.lineEnd}>${text}</li>`;

  util.log("Returing:\n" + html_beautify(html),'renderListItem',1);
  return html;
}

let originHTML = renderer.html.bind(renderer);
renderer.html = function(html, token) {

  var htmlo = html;
  util.log("token:",'renderHTML',1)
  util.log(token,'renderHTML',1)
  if (!token) {
    util.log("No token. Returning html:\n" + html,'renderHTML',1)
    return html;
  }
  util.log("html:\n"+html_beautify(html),'renderHTML',1)

  let re = /\$\$*(.*?)\$*\$/g;
  html = html.replace(re, (match, $1) => {
    util.log("Replacing < and > in $ and $$ with &lt; and &gt;",'renderHTML',1);
    return match.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  })
  re = /\\begin{(aligned|equation)\*?}(.*?)\\end{(aligned|equation)/gms;
  html = html.replace(re, (match, $1) => {
    util.log("Replacing < and > in \\begin{equation} and \\begin{aligned} equations with &lt; and &gt;",'renderHTML',1);
    return match.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  })


  if (!html.trimEnd().endsWith(">")) {
    // Catch case of
    // <div>a</div>
    // more text
    // Marked passes this to html renderer but $(html) drops "more text"
    util.log("HTML does not end with >",'renderHTML',1)
    let idx = html.lastIndexOf(">");
    let endText = html.substring(idx + 1);
    let startHTML = html.substring(0, idx + 1);
    let parsed = parseMD(startHTML, true, token.lineStart);
    parsed += parseMD(endText, true, token.lineStart + 1);
    util.log("Returning\n" + html_beautify(parsed),'renderHTML',1)
    return parsed
  }

  function validateHTML(htmlString){
      let parser = new DOMParser();
      let doc = parser.parseFromString("<div>" + htmlString + "</div>", "application/xml");
      let errorNode = doc.querySelector('parsererror');
      if (errorNode) {
          console.log("Invalid:\n" + htmlString)
          return false
      }
      return true
  }

  function validateHTML2(html) {
    let doc = document.createElement('div');
    console.log(doc)
    doc.innerHTML = html;
    console.log(doc.innerHTML)
    return ( doc.innerHTML === html );    
  }

  var lo = token.lineStart;
  var lf = token.lineEnd;

  // Fails on <img src="test.svg" alt="Grid" style="width:100%">
  //   let valid = validateHTML(html);
  // Fails on <img src="test.svg" alt="Grid" style="width:100%"/>
  // b/c dom parser removes /
  //   let valid = validateHTML2(html);
  // TODO: Try https://stackoverflow.com/a/49711807 which allows
  // ignoring cases when browser only slightly alters the original html string
  valid = true;
  if (valid === false) {
    let ret = `
     <div class="block">
      <div class="block error" lo="${lo}" lf="${lf}">
        Invalid HTML on line(s) ${lo}-${lf}
      </div>
      ${infoDiv(token)}
      </div>`;
    //console.log(ret)
    return ret
  }

  try {
    var htmljq = $(html);    
  } catch {
    util.log("Problem with rendering html:",'renderHTML',1)
    util.log(htmlo,'renderHTML',1)
    return html;    
  }

  if (htmljq.length == 0) {
    util.log("Problem with rendering html:",'renderHTML',1)
    util.log(htmlo,'renderHTML',1)
    return html;
  }

  if (1) {
    summary = htmljq.find("summary");
    if (summary.length > 0) {
      var summaryText = summary.text();
      // This won't work if equation in summary b/c it is already
      // converted to HTML.
      util.log("Summary text original: " + summaryText,'renderHTML',1);
      summaryParsed = marked(summaryText);
      summaryText = $(summaryParsed).find('p').first().html();
      util.log("Summary text after parsing MD: "
                + summaryText,'renderHTML',1);
      summary.remove()
    }
  }

  if (htmljq.length == 1) {
    if (htmljq[0].nodeType == 8) {
      util.log("Special return",'renderHTML',1)
        return `
         <div class="block">
          <div class="comment" lo="${lo}" lf="${lf}">
            ${html}
          </div>
          ${infoDiv(token)}
          </div>`;
    }
    if (htmljq[0].innerHTML === "") {
        util.log("No innerHTML.",'renderHTML',1)
        return `
         <div class="block">
          <div class="inline-html" lo="${lo}" lf="${lf}">
            ${html}
          </div>
          ${infoDiv(token)}
          </div>`;
    }
  }

  util.log("Iterating over:",'renderHTML',1)
  util.log(htmljq,'renderHTML',1)
  let htmlx = "";
  let lineStart = token.lineStart;
  for (let i = 0; i < htmljq.length; i++) {
    util.log("Given inner text: \n" + htmljq[i].innerText, 'renderHTML',1);
    util.log("Given inner HTML: \n" + htmljq[i].innerHTML, 'renderHTML',1);
    util.log("Given outer HTML: \n" + htmljq[i].outerHTML, 'renderHTML',1);

    //if (htmljq[i].nodeName === "DIV" && typeof(htmljq[i].innerHTML) != undefined) {
    if (typeof(htmljq[i].innerHTML) != undefined) {
      util.log("innerHTML != undefined",'renderHTML',1);
      if (htmljq[i].innerHTML) {
        util.log("innerHTML != ''",'renderHTML',1);
        nnl = (htmljq[i].innerHTML.match(/\\htmlnewline/g) || []).length;
        var innerHTML = htmljq[i].innerHTML.replace(/\\htmlnewline/g,"");
        util.log("innerHTML after \\htmlnewline replacement:\n" + html_beautify(innerHTML), 'renderHTML',1);
        util.log("Calling parseMD with innerHTML", 'renderHTML',1);
        let md = parseMD(innerHTML, true, 1 + lineStart);
        util.log("parseMD() returned:\n" + html_beautify(md),'renderHTML',1);
        if (md.trim() === '') {
           util.log("parseMD() returned whitespace-only string.",'renderHTML',1);
           htmljq[i].innerHTML = innerHTML;
        } else {
          html = md;
          html = "";
          util.log("Iterating over above elements, removing lo and lf, and extracting inner content.",'renderHTML',1);
          $(md).each(function() {
            util.log("Working on:\n" + html_beautify(this.outerHTML),'renderHTML',1);
            let tmp = $(this).find(':first-child').removeAttr('lo').removeAttr('lf').parent().remove('.block-info').prop('outerHTML')
            if (tmp) {
              util.log("Appending:\n" + html_beautify(tmp),'renderHTML',1);
              html = html + tmp;
            } else {
              util.log("Ignoring above.",'renderHTML',1);
            }
          });

          htmljq[i].innerHTML = html;//$(md).find(':first-child').html();
          //htmljq[i].innerHTML = $(md).find(':first-child').html();
        }
        lineStart = 1+parseInt($(htmljq[i].outerHTML).find("[lf]").last().attr('lf'));
        //lineStart = nnl + 2;
        //console.log(lineStart)
        util.log("outerHTML after parseMD:\n" + html_beautify(htmljq[i].outerHTML),'renderHTML',1);
        htmlx = htmlx + htmljq[i].outerHTML;
      } else {
        util.log("no inner",'renderHTML',1);
        if (htmljq[i].outerHTML)
          htmlx = htmlx + htmljq[i].outerHTML;
      }
    }
    if (htmljq[i].nodeType == 8) { // comment
      let tmp = parseMD("<!--" + htmljq[i].data + "-->", true, 1 + token.lineStart);
      htmljq[i] = $(tmp);
      lineStart = $(htmljq[i]).find("[lf]").attr('lf');
      util.log("innerHTML after parseMD: "
                + "\n" + html_beautify(htmljq[i].html())
              , 'renderHTML',1);
      util.log(htmlx,'renderHTML',1);
      util.log(htmljq[i].html(),'renderHTML',1);
      if (htmljq[i].html())
        htmlx = htmlx + htmljq[i].html();
    }
    if (htmljq[i].nodeType == 3) { // text
      util.log("Parsing: " + htmljq[i].data,'renderHTML',1);
      if (htmljq[i].data === "\n") continue;
      let tmp = parseMD(htmljq[i].data, true, 1 + lineStart);
      htmljq[i] = $(tmp).find(':first-child').removeAttr('lo').removeAttr('lf');
      //lineStart = $(htmljq[i]).find("[lf]").attr('lf');
      util.log("outerHTML after parseMD: "
                + "\n" + html_beautify(htmljq[i].prop('outerHTML'))
              , 'renderHTML',1);
      if (htmljq[i].prop('outerHTML') !== undefined)
        htmlx = htmlx + htmljq[i].prop('outerHTML');
    }
    if (htmlx.match("undefined")) {
      console.log("!!!!!")
    }
  }

  if (summary.length > 0) {
    htmljq[0].innerHTML = "<summary>" + summaryText + "</summary>" 
                        + htmljq[0].innerHTML;
  }
  // By default, no open attribute => closed by default.
  // Here we add open attribute unless there is a closed attribute (which
  // is not standard).
  if (html.startsWith("<details closed") == false) {
    htmljq.prop("open",true);
  }

  //html = htmljq.attr('lo', token.lineStart).attr('lf', lf)

  if (false) {
    util.log(htmljq,'renderHTML',1);
    util.log(token,'renderHTML',1);
    util.log(htmlx,'renderHTML',1);
    util.log(html_beautify(htmlx),'renderHTML',1);
    util.log($(htmlx),'renderHTML',1);
  }

  let ret = `
     <div class="block">
      <div class="inline-html" lo="${lo}" lf="${lf}">
        ${htmlx}
      </div>
      ${infoDiv(token)}
      </div>`;
  util.log("Returning:\n" + html_beautify(ret),'renderHTML',1);
  return ret;
}

let originParagraph = renderer.paragraph.bind(renderer);
renderer.paragraph = (text, token) => {

  function renderBlock(text, token, padlength, blockType) {
    let html;
    if (token.lineStart) {
      // Association input text with parsed text.
      util.log("Parsing complete",'renderParagraph',1);
      cache['p'][text_o] = text;
      html =  '<div class="block">\n'
            + `  <p padlength=${padlength} lo=${token.lineStart} lf=${token.lineEnd}>${text}</p>\n`
            + `  ${infoDiv(token, blockType)}\n`
            + '</div>\n';
      util.log("Returning:\n" + html,'renderParagraph',1);
      //util.log("Returning:\n" + html_beautify(html),'renderParagraph',1);
    } else {
      // TODO: Document reason for this case.
      util.log("No token.lineStart. Calling original marked paragraph renderer with:\n" + text, 'renderParagraph',1);
      html = originParagraph(text);
      util.log("Parsed text:\n" + html, 'renderParagraph',1);
    }
    return html
  }

  util.log("text:\n" + text,'renderParagraph',1);
  util.log("token",'renderParagraph',1);
  util.log(token,'renderParagraph',1);

  // Catch case with div in paragraph:
  // a<div>b</div>c
  let textx = $("<div/>")
  let foundBlockElement = false;
  $("<div>" + text + "</div>")
    .contents()
    .filter(function() {
      if (this.nodeName === "DIV") {
        // TODO?: Generalize to any block-level element.
        foundBlockElement = true;
      }
      if (this.nodeType === 3) {
        //console.log('Modifying ' + this.data)
        let datar = "<div>" + this.data + "</div>";
        //console.log('Modified ' + datar);
        textx.append(datar)
      } else {
        textx.append(this);
      }
    })
  if (foundBlockElement == true) { 
    util.log("Found block-level element. Wrapping text with <p> and reparsing.",'renderParagraph',1);
    text = textx.html();
    return parseMD(textx.html(), false, token.lineStart+1);
  }

  // Text before additional parsing.
  let text_o = text;

  let match = token.raw.match(/^(\s*)/);
  let padlength = 0;
  if (match) {
    padlength = match[1].length;
    text = text.trimStart();
  }

  let textTrim = text.trim();
  let blockType = "paragraph";
  if (textTrim.startsWith("$$")) {
    blockType = "equation";
    util.log("text.trim() starts with $$. Setting blockType = equation.", 'renderParagraph',1);
  } else if (textTrim.endsWith("$$")) {
    util.log("text.trim() end with $$. Setting blockType = equation.", 'renderParagraph',1);
    blockType = "equation";
  } else if (textTrim.match(/^\\begin{(aligned|equation)/)) {
    util.log("text.trim() end with /\\begin{(aligned|equation)/. Setting blockType = equation.", 'renderParagraph',1);
    blockType = "equation";
  } else {
    util.log("text.trim() does not start with block-type equation. Setting blockType = paragraph", 'renderParagraph',1);
  }

  if (true) {
    if (cache['p'][text_o]) {
      util.log("Cache hit for:\n" + text,'renderCache',1);
      let html = renderBlock(cache['p'][text_o], token, padlength, blockType);
      util.log("Returning:\n" + html_beautify(html),'renderCache',1);
      return  html;
    }
  }

  if (text.startsWith("%")) {
    util.log("text starts with %. Returning text in comment div.", 'renderParagraph',1);
    return `<div class="block"><div class="comment" lo=${token.lineStart} lf=${token.lineEnd}>${text}</div></div>`;
  }

  let html = renderVspace(text,token);
  if (html) return html

  if (!app['renderMathAfter']) {
    text = renderEquation(text, token);
  }
  //console.log(text)

  // Render non-equation LaTeΧ in text nodes.
  let textr = $("<div/>")
  $("<div>" + text + "</div>")
    .contents()
    .filter(function() {
      if (this.nodeType === 3) {
        //console.log('Before render: ' + this.data)
        let datar = renderLatex(this.data);
        //console.log('After render : ' + datar);
        textr.append(datar)
      } else {
        textr.append(this);
      }
    })
  text = textr.html();
  //console.log(textr)

  html = renderBlock(text, token, padlength, blockType);

  //util.toc(startTime0,"to parse paragraph");
  cache['p'][text_o] = text;
  return html;
}

function renderEquation(text, token) {

  // Based on
  // https://gist.github.com/tajpure/47c65cf72c44cb16f3a5df0ebc045f2f

  util.log('Called with:\n' + text,'renderEquation',1);

  if (text === "$" || text === "$$") {
    return text;
  }

  //text = text.replace(/\\newline/gm,"\\\\");
  // Alternative regex at https://stackoverflow.com/a/49190473
  // See also https://sixthform.info/katex/examples/demo.js, which is used
  // by https://sixthform.info/katex/examples/demo.html

  // KaTeX supports "aligned" but not "align" 
  // https://news.ycombinator.com/item?id=24745169
  // https://tex.stackexchange.com/questions/401201/difference-between-align-and-alignedt
  const blockRegex = /\$\$[^\$]*\$\$|\\begin{(aligned|equation)\*?}(.*?)\\end{(aligned|equation)\*?}/gms // Added ms and |\\begin ...
  //const blockRegex = /\$\$[^\$]*\$\$/gm // Added m
  // Can't use \( equation \) escape format b/c in Markdown interprets "\(" as literal "(" and so "(" is returned
  // (forward slash is escape, for use in, for example, URL).
  //const inlineRegex = /\$[^\$]*\$|\\\([^\\\(]*\\\)/g
  const inlineRegex = /\$[^\$]*\$/g
  let blockExprArray = text.match(blockRegex)
  let inlineExprArray = text.match(inlineRegex)
  for (let i in blockExprArray) {
    const expr = blockExprArray[i];
    util.log("Calling render() with: " + expr,'renderEquation',1);
    const result = render(expr);
    util.log("Replacing " + expr + " in \n" + text + "\nwith HTML:\n" + result,'renderEquation',1);
    text = text.replace(expr, result)
  }
  //console.log(inlineExprArray)
  for (let i in inlineExprArray) {
    const expr = inlineExprArray[i];
    if (expr == "$$") {
      // TODO: Need to encode this in regex.
      continue;
    }
    util.log("Calling render() with: " + expr,'renderEquation',1);
    const result = render(expr);
    util.log("Replacing " + expr + " in \n" + text + "\nwith HTML\n" + result,'renderEquation',1);
    text = text.replace(expr, result);
  }

  return text.replace(/﹩＄﹩/g,"$");

  function render(expr) {

    util.log("Rendering:\n" + expr,'renderEquation',1);

    let htmlnewlines = false;
    if (/\\htmlnewline/.test(expr)) {
      htmlnewlines = true;
    }

    expr = expr
            .replace(/\\newline/gm,"\\\\")
            .replace(/\\htmlnewline/gm,"\n");

    if (cache['equation'][expr]) {
      util.log("Cache hit for " + expr,'renderCache',1);
      return cache['equation'][expr];
    }

    let expr_o = expr;

    // See bug-001-find-element-when-md-in-eqn.md for explanation of <em>
    // and </em> replacement.
    // TODO: Use https://stackoverflow.com/questions/15604140/replace-multiple-strings-with-multiple-other-strings
    expr = expr
            .replace(/&gt;/g, ">")
            .replace(/&lt;/g, "<")
            .replace(/&amp;/g,"&")
            .replace(/&quot;/g,'"')
            .replace(/<del>/g,"~")
            .replace(/<\/del>/g,"")
            .replace(/<em.*?>/g,"_")
            .replace(/<\/em>/g,"_");

    expr = undoSmartypants(expr, false);

    util.log("Expression after replacements:\n" + expr,'renderEquation',1);

    let displayStyle = true;
    let delimiter = "";

    // Both MathJax and KaTeX don't want delimiters in expression passed
    // to its renderer, so we remove here. We also change delimiters that
    // use $ because equation is put in attributed named 'raw'. Later, the
    // HTML returned by this function is used as a replacement where the $
    // has a special meaning.
    if (expr[0] === '$') {
      if (expr[1] === '$') {
        // Equations with $$ E = mc^2 $$ syntax
        expr = expr.substr(2, expr.length - 4);
        delimiter = "__";
      } else {
        // Equations with $ E = mc^2 $ syntax
        displayStyle = false;
        expr = expr.substr(1, expr.length - 2);
        delimiter = "_";
      }
    }

    util.log("Expression after removal of $$, $, \\(, and \\) delimiters:\n" + expr,'renderEquation',1);

    let html = "";

    if (app['mathRenderer'].startsWith('mathjax')) {

      // It seems the only way to catch error is to use promise.
      // MathJax.tex2svgPromise('$a$')
      //       .then((node) => console.log (node))
      //       .catch((err) => console.log (err));
      // In this case, we would need to make renderEquation to take
      // a callback argument to get the error message and process
      // result in a way that is similar to KaTeX errors.

      let renderOutput = app['mathRenderer'].split("-")[1];
      util.log("Calling MathJax.tex2" + renderOutput + "() with: " + expr,'renderEquation', 1);
      util.log("and options:",'renderEquation', 1);
      util.log(MathJax.config,'renderEquation', 1);
      if (renderOutput === 'svg') {
        html = MathJax.tex2svg(expr,
                  {em: 12, ex: 6, display: displayStyle});
      } else {
        html = MathJax.tex2chtml(expr,
                  {em: 12, ex: 6, display: displayStyle});
      }
      util.log('MathJax.' + renderOutput + '() result:\n' + html,'renderEquation', 1);

      html = $(html).html();

    } else {

      // https://katex.org/docs/options.html
      let opts = {
                    fleqn: true, // Flushed Left Equations
                    output: "html",
                    displayMode: displayStyle,
                    macros: options['katex']['macros']
                 };

      util.warn.token = token;
      util.log("Calling katex.renderToString() with: " + expr,'renderEquation', 1);
      util.log("and options: ",'renderEquation', 1);
      util.log(opts, 'renderEquation', 1);

      try {
        html = katex.renderToString(expr, opts);
        util.log('katex.renderToString() result:\n' + html,'renderEquation', 1);
      } catch (e) {
        // https://katex.org/docs/error.html
        let msg = e.message
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
        let classExp = ' class="katex-error-expression"';
        let classMsg = ' class="katex-error-message"';
        let style = "";
        if (displayStyle) {
          style = ' style="display:block"';
        }
        html = '<span class="katex-error">'
             + `<span${classExp}${style}>${expr}</span> ` 
             + `<span${classMsg}${style}>${msg}</span>`;
             + '</span>';
      }
    }

    if (html.startsWith("<span")) {
      expr = delimiter + expr + delimiter;
      let rep = `<span len="${expr.length}" raw="${expr}"`;
      html = rep + html.substr(5);
      util.log(`Replacing '${html.substr(0,5)}' with '${rep}'`,'renderEquation',1);
    }

    cache['equation'][expr_o] = html;
    if (htmlnewlines) {
      return html.replace(/\n/gm,"\\htmlnewline");        
    }
    return html;        
  }
}

function renderLatex(text) {

  // This must happen after renderEquation so that <br>
  // does not appear in equation to be rendered.
  // \\ => <br>;
  util.log("Replacing \\\\ with <br>\n",'renderLatex',1);
  util.log("Text before \\\\ replacement:\n" + text, 'renderLatex',1);
  text = text.replace(/\\\\\s*/g,"<br>"); 
  util.log("Text after \\\\ replacement:\n" + text, 'renderLatex',1);

  text = text.replace(/([^~])\~/g,"$1&nbsp;"); 

  text = text.replace(/\\label{(.*?)}/gm, function (match, $1) {
    if (!match) return match;
    markerlength = match.length;
    html = `<a name="${$1}" href="#${$1}" raw="${match}" class="anchor lanchor" markerlength="${markerlength}"></a>`;
    util.log("match:\n" + match,'renderLatex',1);
    util.log("returning:\n" + html,'renderLatex',1);
    return html;
  });

  text = text.replace(/\\ref{(.*?)}/gm, function (match, $1) {
    if (!match) return match;
    markerlength = match.length;
    html = `<a name="${$1}" href="#${$1}" raw="${match}" class="anchor lref" markerlength="${markerlength}">${$1}</a>`;
    util.log("match:\n" + match,'renderLatex',1);
    util.log("returning:\n" + html,'renderLatex',1);
    return html;
  });

  // TODO: Use a proper parser. See notes/parse-latex.js.
  // This will not handle nested elements, e.g., \textbf{\emph{a}}

  // https://stackoverflow.com/questions/8515365/are-there-other-whitespace-codes-like-nbsp-for-half-spaces-em-spaces-en-space
  function spaces1(markerlength, $1, $2) {
    if ($1 == "" && $2 == "") {
      // 2. {\bf}
      $2 = "&hairsp;";
      markerlength = markerlength - 1;
    } else if ($1 == "" && $2 == " ") {
      // 3. {\bf }
      $2 = "&hairsp;";
      //markerlength = markerlength - 1;
    } else if ($1 == " " && $2 == "") {
      // 4. { \bf}
      $2 = "&nbsp;";
    } else if ($1 == "" && $2.endsWith(" ")) {
      if ($2.endsWith("  ")) {
        // 8. {\bf x  }
        $2 = $2.slice(0,-1) + "&hairsp;"
        // !!! Length will be off by 1 and when html converted to
        // markdown, two spaces will appear after x. !!!  
      } else {
        // 7. {\bf x }
        $2 = $2.slice(0,-1) + "&nbsp;"
      }
    } else if ($1.startsWith(" ") && !$2.endsWith(" ")) {
      if ($1 == " ") {
        // 9. { \bf x}
        $2 = "&nbsp;" + $2.slice(1);
        markerlength = markerlength + 1;
      } else {
        // 13. {  \bf x}
        $2 = "&thinsp;" + $2.slice(1);
        markerlength = markerlength + 2;
      }
    } else if ($1.startsWith(" ") && $2.endsWith(" ")) {
      if ($1 == " " && $2 == " ") {
        // 5. { \bf }
        $2 = "&nbsp;" + $2.slice(1);
        markerlength = markerlength + 1;
      } else {
        let nsp = $1.match(/^(\s*)/)[0].length;
        if (nsp == 1) {
          // 10. { \bf abc }
          $2 = "&nbsp;" + $2.slice(0,-1) + "&nbsp;"
          markerlength = markerlength + 1;
        } else {
          // 11. {  \bf abc  }
          // 13. {   \bf abc   }
          $2 = "&nbsp;" + $2.slice(1,-1) + "&nbsp;"  
        }
        markerlength = markerlength + nsp;          
      }        
    }
    return {"markerlength": markerlength, "$2": $2}
  }
  // {\bf a} => <strong>a</strong>
  text = text.replace(/{(\s*)\\bf(\s*.*?\s*)}/gm, function (match, $1, $2) {
    let s = spaces1(4, $1, $2);    
    html = `<strong raw="${match}" markerlength="${s['markerlength']}">${s['$2']}</strong>`;
    util.log("match:\n" + match,'renderLatex',1);
    util.log("returning:\n" + html,'renderLatex',1);
    return html;
  });

  // {\it a} => <em>a</em>
  text = text.replace(/{(\s*)\\it(\s*.*?)}/gm, function (match, $1, $2) {
    let s = spaces1(2, $1, $2);
    html = `<strong raw="${match}" markerlength="${s['markerlength']}">${s['$2']}</strong>`;
    util.log("match:\n" + match,'renderLatex',1);
    util.log("returning:\n" + html,'renderLatex',1);
    return html;
  });

  // {\emph a} => <em>a</em>
  text = text.replace(/{(\s*)\\emph(\s*.*?)}/gm, function (match, $1, $2) {
    let s = spaces1(2, $1, $2);
    html = `<em raw="${match}" markerlength="${s['markerlength']}">${s['$2']}</em>`;
    util.log("match:\n" + match,'renderLatex',1);
    util.log("returning:\n" + html,'renderLatex',1);
    return html;
  });

  function spaces2($1) {
    if (!$1) {
      return "&hairsp;"
    }
    if ($1.startsWith(" ")) {
      $1 = $1.replace(/^(\s*)\s/, function (match, $m1) {
        if ($m1) {$m1 = "";}
        return "&nbsp;" + $m1;
      });
    };
    if ($1.endsWith(" ")) {
      $1 = $1.replace(/(\s*)\s$/, function (match, $m1) {
        if ($m1) {$m1 = "";}
        return $m1 + "&nbsp;"
      });
    }
    return $1;    
  }
  // \textbf{} <strong></strong>
  text = text.replace(/\\textbf{(\s*.*?)}/gm, function (match, $1) {
    let markerlength = 8;
    $1 = spaces2($1);
    return `<strong raw="${match}" markerlength="${markerlength}">${$1}</strong>`
  });

  // \textit{} <em></em>
  text = text.replace(/\\textit{(\s*.*?)}/gm, function (match, $1) {
    let markerlength = 8;
    $1 = spaces2($1);
    return `<em raw="${match}" markerlength="${markerlength}">${$1}</em>`
  });

  // \emph{} <em></em>
  // TODO: Handle \emph inside \em{} or \textit{}
  // https://www.overleaf.com/learn/latex/Bold%2C_italics_and_underlining
  text = text.replace(/\\emph{(\s*.*?)}/gm, function (match, $1) {
    let markerlength = 6;
    $1 = spaces2($1);
    return `<em raw="${match}" markerlength="${markerlength}">${$1}</em>`
  });

  // \underline{}
  text = text.replace(/\\underline{(\s*.*?)}/gm, function (match, $1) {
    let markerlength = 11;
    $1 = spaces2($1);
    return `<span raw="${match}" markerlength="${markerlength}" class="latex-underline">${$1}</span>`
  });

  // \texttt{}
  text = text.replace(/\\texttt{(\s*.*?)}/gm, function (match, $1) {
    let markerlength = 8;
    $1 = spaces2($1);
    return `<code raw="${match}" markerlength="${markerlength}">${$1}</code>`
  });

  return text;  
}

function renderVspace(text,token) {

  // https://tex.stackexchange.com/questions/74353/what-commands-are-there-for-horizontal-spacing/74354
  // https://www.maths.tcd.ie/~dwilkins/LaTeXPrimer/WhiteSpace.html
  // https://www.overleaf.com/learn/latex/Line_breaks_and_blank_spaces#Vertical_blank_spaces

  // \ (space)
  // \quad
  // \qquad 

  // \smallskip 3pt plus 1pt minus 1pt
  // \medskip 6pt plus 2pt minus 2pt
  // \bigskip 12pt plus 4pt minus 4pt.
  // \\
  // \\*
  // \break

  let newpage = '<div class="page-break" style="font-size:0px;page-break-after: always;">&nbsp;</div><div></div>'
  //if (false && text === '\\newpage') {
  if (text === '\\newpage') {
    //https://www.buildableweb.com/how-to-add-page-breaks-to-html-in-articles
    // https://github.com/Mogztter/asciidoctor-web-pdf/commit/2b2381b69b766b1a114d10317d31ab0af0ee39a3
    // class="page-break" is used by pagedjs
    // TODO: If \newpage found with other content in paragraph, split 
    html = `<div class="block"><div class="inline-html" lo=${token.lineStart} lf=${token.lineEnd}><div class="newpage">${newpage}</div></div></div>`;
    util.log("Found \\newpage. Returning:\n" + html,'renderParagraph',1);
    return html;
  }

  let re_vspace = new RegExp("\\\\vspace\{([0-9]+)\s*(px|pc|in|bp|cm|mm|dd|cc|sp|em)\}","g");
  let found1 = false;
  if (text.trim().startsWith("\\vspace{")) {
    util.log("text.trim() starts with \\vspace{.", 'renderLatex',1);
    let first = false;
    text = text.replace(re_vspace, (match, a, b) => {
      found1 = true;
      if (first == false) {
        util.log("Found first " + match, 'renderLatex',1);
        first = true;
        return `<div class="tex" raw="${match}" style="height:${a}${b}"/>\n`
      } else {
        util.log("Found additional " + match + ". Removing", 'renderLatex',1);
        return "";
      }
    });
    if (first) {
      util.log("Text after \\vspace replacement:\n" + text,'renderLatex',1);
    }
  } else {
    util.log("text.trim() does not start with \\vspace{.", 'renderLatex',1);
    // Ignore \\vspace if not first non-whitespace token.
    text = text.replace(re_vspace,"");
  }

  let found2 = false;
  //util.log("Text before \\\\\[([0-9]+)(px|pt|em|in|cm)\] replacement:\n" + text, 'renderParagraph',1);
  const re = /\\\\\[([0-9]+)(px|pt|em|in|cm)\]/gms;
  // https://stackoverflow.com/a/63902534
  const reobj = {flags: re.flags, source: re.source};
  const restr = JSON.stringify(reobj);
  text = text.replace(re, (match, a, b) => {
    found2 = true;
    util.log("Found match to " + restr + ":\n" + match,'renderLatex', 1);
    util.log(`Replacing match with div with height = ${a}${b}`,'renderLatex',1);
    return `<div class="tex" raw="${match}" style="height:${a}${b}"/>`
  });
  if (!found2) {
    util.log("No matches to " + restr,'renderLatex',1);
  } else {
    util.log("Text after " + restr + " replacement:\n" + text, 'renderLatex',1);    
  }

  if (found1 || found2) {
    // Need to re-parse because divs were added.
    util.log("Calling parseMD with text that includes tex divs:\n" + text, 'renderLatex',1);
    let parsed = parseMD(text, true, token.lineStart);
    html = "";
    util.log("HTML of parsed text:\n" + html_beautify(parsed), 'renderLatex', 1);
    util.log("Extracting first child of each top-level element and removing lo and lf attributes.", 'renderParagraph', 1);
    $(parsed).each(function() {
      let fc = $(this).find("> :first-child");
      if (fc.length > 0) {
        $(fc).removeAttr('lo')
        $(fc).removeAttr('lf')
        html = html + fc.prop('outerHTML');
      }
    });
    util.log("HTML after extraction and removal of lo and lf attributes:\n" + html_beautify(html), 'renderParagraph', 1);

    htmljq = $(html);
    html = ""
    util.log('Iterating over elements of above html.','renderLatex',1);
    $(htmljq).each(function() {
        util.log("Element:\n" + html_beautify(this.outerHTML),'renderLatex',1);
        let tex = $(this).find(".tex").parent();
        if (tex.length > 0) {
          util.log("Element has class = tex. Extracting it from parent.",'renderLatex',1);
          util.log("Appending innerHTML:\n" + html_beautify(tex[0].innerHTML),'renderLatex',1);
          html = html + tex[0].innerHTML;
        } else {
          util.log("Element does not have class = tex.",'renderLatex',1);
          util.log("Appending outerHTML:\n" + html_beautify($(this).prop('outerHTML')),'renderLatex',1);
          html = html + $(this).prop('outerHTML');
        }
    });
    html = `<div class="block"><div style="width:100%" lo="${token.lineStart}" lf="${token.lineEnd}">${html}</div>${infoDiv(token)}</div>`
    util.log("Returning:\n" + html_beautify(html),'renderLatex',1);
    return html;
  }
}

marked.use({renderer});