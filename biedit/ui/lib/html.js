function mdTOCStart(decoded) {
  if (decoded) {
    return "\x3C!-- TOC -->";
  }
  return "<!-- TOC -->";
}

function mdTOCEnd(decoded) {
  if (decoded) {
    return "\x3C!-- \\TOC -->";
  }
  return "<!-- \\TOC -->";
}

function lineDiv(token) {

  if (!app['showLineNumbers']['preview']) return "";
  if (token.loose && token.type == "list_item") {
    // List element with paragraph inside, so paragraph
    // will have line number(s) and top-level list item 
    // does not need to have line number(s) shown.
    return "";
  }
  var lineEnd = token.lineEnd;
  var ld = "";
  if (token.lineStart != lineEnd) {
    ld = `<div class='line-number'>${token.lineStart}-${lineEnd}</div>`;
  } else {
    ld = `<div class='line-number'>${token.lineStart}</div>`;
  }
  return ld;
}

function infoDiv(token, labelName) {
  let lo = token.lineStart;
  let lf = token.lineEnd;
  let lineLabel = lo;
  if (lo !== lf) {
    lineLabel += "-" + lf;
  }

  if (labelName) {
    let label;
    let labelNameShort = labelName[0];
    label = "s" + counter('heading');
    if (labelName !== 'heading') {
        if (labelName === "listitem") {
          labelNameShort = "i";
          label = label + "l" + counter('list') + "i" + counter('listitem');
        } else {
        label += labelNameShort + counter(labelName);
      }
    }
  }

  let style = "";
  if (app['showLineNumbers']['preview'] == false) {
    if ($('#show-line-numbers').attr('checked') !== 'checked') {
      style = "display: none;";
    }
  }

  // title="Double click to insert ref in editor."
  // <span class="auto-label">${label}</span>

  return `<div class="block-info" style="${style}"><span class="line-numbers">${lineLabel}</span></div>`.trimLeft();
}

function sectionDiv() {
  if (app['htmlEditable']) {
    return "<div contenteditable='true' class='section'>";
  } else {
    return "<div class='section'>";
  }
}

function headingData() {
  // Function to store heading numbers. Used by parser to build TOC.
  headingData.heading_numbers = [0, 0, 0, 0, 0, 0];
  headingData.nopen = 1;
  headingData.toc = "";
}

function finalHTML(html, format, cb) {

  let rmEditorTags = false;
  let pagedjs = false;
  let bodyOnly = false;
  if (format === 'pdf-preview') {
    pagedjs = true;
  }

  if (format.endsWith('-body')) {
    bodyOnly = true;
  }

  if (format === 'html' || format === 'html-body') {
    rmEditorTags = true;
  }

  if (rmEditorTags) {
    util.log('Creating HTML for save.', 'finalHTML', 1);
  } else {
    util.log('Creating HTML for editor.', 'finalHTML', 1);
  }

  startTime = util.tic();

  if (rmEditorTags) {
    html = removeTags(html);
  }

  if (bodyOnly) {
    cb(html_beautify(html, app['beautify']['html']));
    return;
  }

  // Title
  var title = util.fileName().split(".")[0];
  if ($('.title').length > 0) {
    title = $('.title')[0].innerHTML;
  }
  var titleNode = `<title>${title}</title>`;

  // Favicon
  var faviconNode = '';
  if (app['documentFavicon'] !== '') {
    let href = util.favicon_href(app['documentFavicon']);
    faviconNode = $("link#favicon")
                      .clone()
                      .attr("href", href)
                      .prop('outerHTML');
  }

  var linkNodes = '';
  // Determine if highlightjs css is needed.
  if ($('[class^="hljs"], [class*=" hljs"]').length > 0) {
    // https://stackoverflow.com/questions/4161869/
    // jquery-how-to-select-all-the-class-elements-start-with-text
    linkNodes = $("#hljs-css")[0].outerHTML;
  }

  // https://www.sitepoint.com/jquery-document-ready-plain-javascript/
  var scriptNodes = 
        `\n<script>
          ${tocClickListen.toString()}
          if (
              document.readyState === "complete" ||
              (document.readyState !== "loading" && 
                !document.documentElement.doScroll)
          ) {
            tocClickListen();
          } else {
            document.addEventListener("DOMContentLoaded", tocClickListen);
          }
        <\/script>\n`

  //scriptNodes = scriptNodes + '<script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"><\/script>';

  let styleNodes;
  let css = "";

  var sheet = $('link#doc')[0].sheet;
  styleNodes = "<style>\n";
  // https://stackoverflow.com/a/1679588

  let rules = sheet.cssRules;
  let rules_arr = [];

  var tocRule = '#toc ' + "> ol".repeat(app['TOC']['showLevels'])  + ' ol';
  rules_arr.push(tocRule + " {display: none}");
  rules_arr.push('body {background-image: url("'
                  + app['documentBackgroundImage']
                  + '")}');
  for (var i = 0; i < rules.length; i++) {
    rules_arr.push(rules[i].cssText)
  }

  css = rules_arr.join("\n");
  if (app['beautify']['css'] != false) {
    css = css_beautify(css, app['beautify']['css']);
  }
  if (app['documentCSS'] === 'embed') {
    styleNodes = "<style>" + css + "</style>\n";
    css = "";
  } else {
      let styleFile = util.fileName().replace(/\.md$/,"");
      styleNodes = `<link rel="stylesheet" href="${styleFile}.css"/>`;
  }

  if ($('[class^="katex"], [class*=" katex"]').length > 0) {
    let katexHref = $('#katex-css').attr('href');
    linkNodes = `<link rel="stylesheet" href="${katexHref}"/>` + linkNodes;
  }

  //let pagedjs = false;
  if (pagedjs) {
    (async () => {
      let data = await Promise.all(
                    [
                      fetch("/ui/css/paged-interface-0.2.0-Nup.css")
                        .then(res => res.text()),
                      fetch("/ui/deps/paged.polyfill-0.2.0.js")
                        .then(res => res.text())
                    ]);
      styleNodes = styleNodes + "\n<style>" + data[0] + "</style>\n";
      scriptNodes = scriptNodes + "\n<script>" + data[1] + "</script>\n";
      styleNodes = styleNodes + "\n<style>.body {margin: 0}</style>\n";
      scriptNodes = scriptNodes + `\n<script>
        class MyHandler extends Paged.Handler {
          constructor(chunker, polisher, caller) {
            super(chunker, polisher, caller);
          }

          afterRendered(pages) {
            parent.zoom();
            parent.fitPreview();
          }
        }
        Paged.registerHandlers(MyHandler);
      </script>\n`;
      html = render(html);
      cb(html, css);
    })();
  } else {
    html = render(html);
    cb(html, css);
  }

  function render(html) {
    var html = `<!doctype html>
                <html>
                  <head>
                    <meta charset="utf-8">
                    ${titleNode}
                    ${faviconNode}
                    ${linkNodes}
                    ${styleNodes}
                    ${scriptNodes}
                  </head>
                  <body class="body">
                    ${html}
                  </body>
                </html>`;

    util.log(' Beautifying HTML.', 'finalHTML', 1);
    html = html_beautify(html, app['beautify']['html']);
    util.log(' Beautified HTML.', 'finalHTML', 1);

    util.log('Created HTML.', 'finalHTML', 1);
    util.toc(startTime,'ms to create HTML.');

    return html;
  }

  function removeTags(html) {

    util.log(' Removing editor tags.', 'finalHTML', 1);
    util.log(' Creating copy of html string to put in DOM.', 'finalHTML', 1);
    var html = "<div id='display-copy' style='display:none'>" + html + "</div>";
    util.log(' Created copy of html string to put in DOM.', 'finalHTML', 1);

    util.log(' Parsing html string with DOMParser', 'finalHTML',1)
    var parser = new DOMParser();
    util.log(' Parsed html string with DOMParser', 'finalHTML',1)
    util.log(' Converting DOMParser object to jQuery', 'finalHTML',1)
    var dom = $(parser.parseFromString(html, 'text/html'));
    util.log(' Converted DOMParser object to jQuery', 'finalHTML',1)

    //dom.find(".md-toc").remove();
    dom.find('.block-info').remove();

    dom.find('[class="active"]').removeClass("active");
    dom.find('[class="highlighted"]').removeClass('highlighted');
    dom.find('[class*="katex-warning"]').removeClass('katex-warning')
    dom.find('[class*="katex-error"]').removeClass('katex-error')

    dom.find('[padlength]').removeAttr('padlength');
    dom.find('[markerlength').removeAttr('markerlength');
    dom.find('[type]').removeAttr('type');
    dom.find('[number]').removeAttr('number');
    dom.find('[lo]').removeAttr('lo');
    dom.find('[lf]').removeAttr('lf');
    dom.find('[active]').removeAttr('active');
    dom.find('[class=""]').removeAttr('class');
    dom.find('[raw]').removeAttr('raw');
    dom.find('[len]').removeAttr('len');

    bfc = dom.find('.block :first-child');
    bfc
      .find("a")
      .not(".hanchor")
      .each( (idx, el) => {
        let href = $(el).attr('href');
        if (href && !href.startsWith("http") && href.endsWith(".md!")) {
          $(el).attr('href', href.slice(0, -3) + "html");
        }
      })

    html = $(dom[0]).find('#display-copy').html();
    util.log(' Parsed html string with DOMParser','finalHTML',1);
    return html;
  }

}
