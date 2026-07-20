function configEditor(editor) {

  editor.setOptions(options['ace']['options']);

  if (util.fileName().endsWith(".css")) {
    editor.session.setMode('ace/mode/css');
  }

  // TODO: This should also be set when a file being edited changes.
  if (util.fileName().endsWith(".md")) {
    // Combine LaTeX and Markdown syntax highlighters.
    // Based on https://jsbin.com/kexusunizi/. See also
    // https://ace.c9.io/tool/mode_creator.html and
    // https://cloud9-sdk.readme.io/docs/highlighting-rules
    editor.session.setMode('ace/mode/latex', function() {
      var rulesL = editor.session.$mode.$highlightRules.getRules();

      // Exclude comment pattern in LaTeX (%)
      if (false) {
        for (var rule in rulesL) {
            rulesL[rule] = rulesL[rule].filter( function (val, idx, arr) {
              return val.token !== "comment";
            });
        }
      }
      //console.log(rulesL)

      editor.session.setMode('ace/mode/markdown', function() {
        var rules = editor.session.$mode.$highlightRules.getRules();

        for (var stateName in rules) {
            if (Object.prototype.hasOwnProperty.call(rulesL, stateName) 
             && Object.prototype.hasOwnProperty.call(rules, stateName)) {
                // console.log("Common: " + stateName)
                rules[stateName].unshift(...rulesL[stateName]);
             }
        }
        for (var stateName in rulesL) {
            if (Object.prototype.hasOwnProperty.call(rulesL, stateName) 
             && !Object.prototype.hasOwnProperty.call(rules, stateName)) {
                //console.log("In LaTeX only: " + stateName)
                rules[stateName] = rulesL[stateName];
             }
        }
        // force recreation of tokenizer
        editor.session.$mode.$tokenizer = null;
        editor.session.bgTokenizer.setTokenizer(editor.session.$mode.getTokenizer());
        // force re-highlight whole document
        editor.session.bgTokenizer.start(0);
      })
    })
  }
  var langTools = ace.require("ace/ext/language_tools");
  langTools.addCompleter(
    {
      getCompletions: 
        function(editor, session, pos, prefix, callback) {
            callback(null, options['ace']['customCompleters'])}
    });

  // Does not work in emacs mode.
  // https://github.com/ajaxorg/ace/issues/4428
  // editor.commands.bindKey('CTRL-u','gotopageup')

  var snippetManager = ace.require("ace/snippets").snippetManager;
  var snippets = snippetManager
                    .parseSnippetFile('ace/snippets/markdown');
  options['ace']['snippets'].forEach( (val) => {snippets.push(val)} );
  snippetManager.register(snippets, "markdown");
}

function initEditor(editor, text) {

  configEditor(editor);

  editor.renderer.once('afterRender', function() {

    util.log('afterRender event triggered.','main',1);
    util.log('Triggering resize event.','main',1);
    $(window).trigger('resize');
    hash.initialize();
    util.log("Triggering editor change event.",'main', 1);
    editor._emit('change');
    //util.log("Triggering editor changeSelection event.",'main', 1);
    //editor._emit('changeSelection');

    // Double click on span.label in #display inserts label in editor.
    // This event needs to be set here and not in events() b/c
    // editor is not ready when events() is called. 
    $('span.label').on('dblclick', function () {
      let label = $(this).text();      
      let els = label.match(/[a-z]/g);
      console.log(els)
      let nums = label.split(/[a-z]/g);
      nums.shift();
      let section = nums[1];
      let map = {
                  's': 'Section',
                  'p': 'paragraph',
                  'e': 'equation',
                  'c': 'code block',
                  'q': 'quote',
                  'l': 'list',
                  'i': 'item'
                }
      if (els.length == 1) {
        let text = "[" + map[els[0]] + " " + nums[0] + "](#" + $(this).text() + ")";
      } else {
        let text = "[" + map[els[0]] + " " + nums[0] + ", " + map[els[1]] + " " + nums[1] + "](#" + $(this).text() + ")";
      }
      editor.session.insert(editor.getCursorPosition(), text);
    });

    util.favicon('default');
    util.localSave(editor.getValue());

  });

  util.log("Placing fetched content in editor.", 'main', 1);
  editor.setValue(text);
  util.log("Placed fetched content editor.", 'main', 1);
  
  editor.clearSelection();
  editor.focus();
  editor.on('change', editorChange);
  ace.edit("editor").on('changeSelection', () => {
      // Keydown or click
      util.log('changeSelection event','editorChangeSelection',1);
      setTimeout(() => editorChangeSelection(),0);
  })
}

function editorChangeSelection() {

  var editor = ace.edit("editor");

  var row = editor.getCursorPosition().row;
  var col = editor.getCursorPosition().column;

  //if (editorChangeSelection.rowlast == row && col != 1) {
  //  util.log("No row change and col != 1. Not updating highlighting.",'editorChangeSelection',1);
  //  return;
  //}
  editorChangeSelection.rowlast = row;

  // Put yellow box around active line in editor
  var visibleElements = $('.ace_gutter-cell');
  if (visibleElements.length == 0) {
    util.log("No .ace_gutter-cell elements in DOM.",'editorChangeSelection',1);
  }
  for (var i = 0; i < visibleElements.length; i++) {
    if (visibleElements[i].innerText == row + "") {
      activeElement = visibleElements[i];
      break;
    }
  }

  // This won't cause yellow to show on first load.
  // It seems that the style gets updated several times
  // by the editor and each time it over-writes the style
  // string. Putting the following code in the callback of
  //   $("body").on('DOMSubtreeModified', ".ace_text-layer", () => {})
  // causes the highlighting to happen many times as Ace editor
  // updates positioning of lines.
  util.log("Highlighting active line in editor.",'editorChangeSelection', 1);
  $('.ace_line_group').removeClass('active');
  $('.ace_line_group').eq(i+1).addClass('active');
  //$('.ace_line_group').css('border', '');
  //$('.ace_line_group').eq(i+1).css('border','1px solid yellow');

  var row = editor.getCursorPosition().row || 0;
  var col = editor.getCursorPosition().column || 0;

  // This hash update is removed if click was on an anchor in #display.
  // This gets executed before the default browser action of setting
  // the hash when an anchor tag is clicked. setTimeout is used
  // to put the update at the end of the event loop.
  util.log("Updating hash with l = " + (row+1) + "; c = " + (col+1),
           'editorChangeSelection',1);
  setTimeout(
    function () {
      // TODO: Update hash with one call.
      hash.update("l", row + 1);
      hash.update("c", col + 1);
    },0);

  var hrow = row;
  while (hrow >= 0) {
    line = editor.session.getLine(hrow);
    if (/^#/.test(line)) {
      util.log("Click or change in section '"
          + line 
          + "' in editor. Highlighting it in TOC.",'editorChangeSelection', 1);
      highlightTOC(line,"" + (hrow+1));
      break;
    }
    hrow = hrow - 1;
  }

  if (hrow == -1) {
    // No sections or above first section.
    $('.highlighted').removeClass('highlighted');
  }

  var line = editor.session.getLine(row);
  util.log("Current line = " + (row+1),'editorChangeSelection',1);
  var active = $("#display [lo=" + (row+1) + "]").last();
  var active2 = $("#display [lf=" + (row+1) + "]").last();
  if (active.length) {
    util.log("Found element in DOM with lo = " + (row+1),
        'editorChangeSelection',1);
  } else if (active2.length) {
    active = active2;
    util.log("Found element in DOM with lf = " + (row+1),
        'editorChangeSelection',1);
  } else {
    util.log("No element in DOM with lo or lf = " + (row+1),
        'editorChangeSelection',1);
    var i = 1;
    var row_near;
    var nrows = editor.session.getLength();
    while (true) {
      if ( (row - i <= 0) && (row + i) >= nrows) {
        util.log("No element found in DOM lo near " + (row+1),
            'editorChangeSelection',1);
        break;
      }
      if (row - i >= 0) {
        var active = $("#display [lo=" + (row-i+1) + "]").last();

        if (active.length) {
          row_near = row - i;
          break;
        }
      }
      if (row + i <= nrows) {
        var active = $("#display [lo=" + (row+i+1) + "]").first();
        if (active.length) {
          row_near = row + i + 1;
          break;
        }
      }
      i = i + 1;
    }

    if (row_near) {
      util.log("Found near-by element with lo = " + (row_near),
          'editorChangeSelection',1);
    }

  }

  if (active.length && !active.isInViewport()) {
    var prev = active.prev(); // previous sibling
    if (prev.length) {
      util.log("Scrolling #display element before active element into view."
          ,'editorChangeSelection',1);
      prev[0].scrollIntoView();
    } else {
      util.log("Scrolling #display element into view.",'editorChangeSelection',1);
      active[0].scrollIntoView();
    }
  }

  if (editorChangeSelection.lastactive) {
    if (active.attr('lo') !== editorChangeSelection.lastactive.attr('lo')) {
      util.log("Removing class 'active' from last active element in #display.",
               'editorChangeSelection',1);
      editorChangeSelection.lastactive.removeClass('active');
      $('.active').removeClass('active');
    }
  }

  util.log("Adding class 'active' to element with lo = " + active.attr('lo'),
           'editorChangeSelection',1);
  active.addClass('active');
  editorChangeSelection.lastactive = active;
}

function editorChange(change, editor) {

  util.log("editorChange event:",'editorChange',1);
  util.log(change,'editorChange',1);

  util.favicon('unsavedChanges');

  if ('action' in change) {
    util.localSave(change);
  }

  let startTime = new Date();
  util.log('Processing editorChange event.','editorChange',1);
  let lines = processEditorEvent(change, editor);
  util.log('Processed editorChange event.','editorChange',1);
  let ptime = (new Date() - startTime) + " ms";
  util.toc(startTime, 'total time to process editor event');
  let editType = " (full)";
  if (lines) {
    editType = " (incr " + lines + ")";
  }
  $("#timing").text(ptime + editType);

  let view = hash.get('view');
  if (view && view !== "web") {
    util.log('Triggering change event (async) on view drop-down.',
             'editorChange',1);
    setTimeout(() => $("#view-options").val(view).trigger('change'), 0);
  }
}

function processEditorEvent(change, editor) {

  if (change.start) {
    let result = updateElement(change, editor);
    //setTimeout(function () {checkInternalLinks()},0);
    checkInternalLinks();
    if (result.reparseDocument == false) {
      util.log("Edit only required incremental update. Not processing all editor content.",'editorChange',1);
      return result.parsedLines || result.editedLines;
    }
  } else {
    util.log("Event was not triggered by an edit. Will process all editor content.",'editorChange',1);
  }

  util.log("Getting editor content.",'editorChange',1);
  var editorContent = editor.getValue();
  util.log("Got editor content.",'editorChange',1);

  processAll();

  // Replace filename.md with filename.md! so when clicked, opens
  // in editor.
  // TODO: This needs to be done in renderers so links created with
  // incremental updates are modified.
  $('#display a').not(".hanchor").each( (idx, el) => {
      let href = $(el).attr('href');
      if (href && !href.startsWith("http") && href.endsWith(".md")) {
        $(el)
          .attr('href', href + "!")
          .attr('target',"_blank")
      }
  })

  if (app['renderMathAfter']) {
    renderMath();
  }

  return false;
}

function processAll() {

  // Initialize/re-set heading number information.
  headingData();

  util.log("Parsing all editor content.",'processAll',1);

  var editor = ace.edit("editor");
  let editorValue = editor.getValue();

  let html = parseMD(editorValue, true);

  util.log("Parsed editor content:\n" + html_beautify(html),'processAll',1);

  html = sectionDiv() + "\n" + html;
  html = html + "\n</div>"

  util.log("HTML after closing/trimming divs:",'processAll',2);
  util.log("\n" + html,'processAll',2);

  let startTime = util.tic();
  $('#display').html(html);
  util.toc(startTime, "to insert HTML into #display");

  setTimeout(function () {addTOC()},0);
  setTimeout(function () {checkInternalLinks()},0);
  setTimeout(function () {ifsolutions()},0);

  // https://stackoverflow.com/questions/5296268/fastest-way-to-check-a-string-contain-another-substring-in-javascript
  let toctag = editorValue.indexOf(mdTOCStart(true)) !== -1;
  if (toctag) {
    if ($('#markdownTOC').is(':checked') === false) {
      //util.log('Found <!--- TOC ---> and #markdownTOC checkbox not checked.','processAll',1);
      //util.log('Clicking mdTOCStart() checkbox.','processAll',1);
      $('#markdownTOC').click();
    }
  }
}

function preprocessMD(text) {

  let startTime0 = util.tic();

  function reinfo(re) {
    let restr = "/" + re.source + "/" + re.flags;
    util.log("Looking for match to " + restr, 'mdPreprocess',1);
    return restr;
  }

  let re, restr, startTime;

  //https://www.buildableweb.com/how-to-add-page-breaks-to-html-in-articles
  // https://github.com/Mogztter/asciidoctor-web-pdf/commit/2b2381b69b766b1a114d10317d31ab0af0ee39a3
  // class="page-break" is used by pagedjs
  let re_newpage = /\\newpage/gms;
  let newpage = '<div class="page-break"></div>'
  //text = text.replace(re_newpage, newpage);

  if (true) {
    //startTime = util.tic();

    re = /<details.*?>(.*?)<\/details>/gms;
    restr = reinfo(re);
    found = false;
    text = text.replace(re, (match) => {
      util.log("Found match to " + restr + ":\n" + match, 'mdPreprocess',1);
      var textnew = match.replace(/\n/gm,"\\htmlnewline\n");
      util.log("Returning:\n" + textnew, 'mdPreprocess',1);
      return textnew
    });
    if (!found) {
      util.log("No match to " + restr, 'mdPreprocess',1);
    }
    //util.toc(startTime, "for <details> modification(s).");
  }

  if (true) {
    //startTime = util.tic();

    let solutions = hash.get('solutions');
    let styleTrue = solutions === '' ? ' style="display: none;"' : ' style="display: block;"';
    let styleFalse = solutions === '' ? ' style="display: block;"' : ' style="display: none;"';

    re = /\\ifsolutions\s*(\n*)(.*?)[\\else]*\s*(.*?)\\fi/gms;
    restr = reinfo(re);
    found = false;
    text = text.replace(re, (match, $1, $2, $3) => {
      found = true;
      util.log("Found match to " + restr + ":\n" + match, 'mdPreprocess',1);
      let el = "span";
      if ($2.match("\n") || $3.match("\n")) {
        el = "div";
      }
      match = match.replace("\\ifsolutions", `<${el} class="solutionstrue"${styleTrue}>`);
      match = match.replace("\\else", `</${el}><${el} class="solutionsfalse"${styleFalse}>`);
      match = match.replace("\\fi", `</${el}>`);
      util.log("Returning:\n" + match, 'mdPreprocess',1);
      return match;
    });
    if (!found) {
      util.log("No match to " + restr, 'mdPreprocess',1);
    }

    re = /\\ifsolutions\s*(\n*)(.*?)\\fi/gms;
    restr = reinfo(re);
    found = false;
    text = text.replace(re, (match, $1, $2) => {
      util.log("Found match to " + restr + ":\n" + match, 'mdPreprocess',1);
      if ($1 == null) $1 = ""
      if ($2 == null) $2 = ""
      match = match.replace("\\ifsolutions", `<div class="solutionstrue"${styleTrue}>`);
      match = match.replace("\\fi", '</div>');
      util.log("Returning:\n" + match,'mdPreprocess',1);
      return match;
    });
    if (!found) {
      util.log("No match to " + restr, 'mdPreprocess',1);
    }
    //util.toc(startTime, "for \\ifsolutions modifications(s).");
  }

  if (false) {
    re = /\$(.*?)\$/gms;
    restr = reinfo(re);
    found = false;
    text = text.replace(re, (match) => {
      found = true;
      util.log("Found match to " + restr + ":\n" + match, 'mdPreprocess',1);
      let textnew = "`" + match + "`";
      util.log("Returning:\n" + textnew,'mdPreprocess',1)
      return textnew;
    });
    if (!found) {
      util.log("No match to " + restr, 'mdPreprocess',1);
    }
  }

  if (true) {

    // First pattern needed so next pattern does not capture, e.g.,
    // <div/> abc <div></div>
    re = /<div(.*?)\/+\s*>/g;
    restr = reinfo(re)
    found = false;
    text = text.replace(re, (match, $1) => {
      found = true;
      util.log("Found match to " + restr + ":\n" + match, 'mdPreprocess',1);
      let textnew = `<div${$1}></div>`;
      util.log("Returning:\n" + textnew,'mdPreprocess',1);
      return textnew;
    });
    if (!found) {
      util.log("No match to " + restr, 'mdPreprocess',1);
    }

    re = /<div.*?>(.*?)<\/{1}div>/gms;
    restr = reinfo(re);
    found = false;
    text = text.replace(re, (match) => {
      found = true;
      util.log("Found match to " + restr + ":\n" + match, 'mdPreprocess',1);
      let textnew = match.replace(/\n/gm,"\\htmlnewline\n");
      util.log("Returning:\n" + textnew,'mdPreprocess',1)
      return textnew;
    });
    if (!found) {
      util.log("No match to " + restr, 'mdPreprocess',1);
    }

    ////util.toc(startTime, "to replace \\n with \\htmlnewline in divs.");
  }

  if (true) {
    //startTime = util.tic();

    // \\ => \\\\
    // In Markdown, \\ => \ (backslash is escape)
    re = /\\\\/g;
    restr = reinfo(re);
    found = false;
    text = text.replace(re, (match) => {
      found = true;
      let textnew = "\\\\\\\\";
      util.log("Found match to " + restr + ":\n" + match, 'mdPreprocess',1);
      util.log("Returning:\n" + textnew,'mdPreprocess',1)
      return textnew;
    });
    if (!found) {
      util.log("No match to " + restr, 'mdPreprocess',1);
    }

    //util.toc(startTime, "for \\\\ modifications(s).");
  }

  if (true) {
    // Protect LaTeX backslash sequences inside $$ and $ math blocks that
    // marked would strip as escape sequences (e.g. \; \: \, \! \. \| \- \[ \]).
    // This must run AFTER the \\ -> \\\\ step above so that genuine double
    // backslashes have already been doubled and won't be re-processed here.
    // We double any remaining single \X (where X is in marked's escape set)
    // so that marked outputs \X rather than just X.
    //
    // Marked's escape set: !"#$%&'()*+,-./:;<=>?@[\]^_{|}~
    // LaTeX sequences affected: \; \: \, \! \. \- \| \[ \] etc.
    const markedEscapeRe = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]^{|}~])/g;
    const protect = (inner) => inner.replace(markedEscapeRe, '\\\\$1');

    // Block equations: $$ ... $$
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, inner) => {
      let p = protect(inner);
      // Escape +, -, * at start of lines to prevent GFM list parsing inside $$
      p = p.replace(/^([+\-*])( )/gm, '\\$1$2');
      return '$$' + p + '$$';
    });

    // Inline equations: $ ... $ (not $$)
    text = text.replace(/\$([^\$\n]+?)\$/g, (match, inner) => {
      return '$' + protect(inner) + '$';
    });

    util.log("After math backslash protection:\n" + text,'mdPreprocess',1);
  }

  util.log("After preprocessing:\n" + text,'mdPreprocess',1);
  util.toc(startTime0,'to preprocess markdown');

  return text;
}

function parseMD(markdown, wrap, startLine) {

  markdown = preprocessMD(markdown);
  updateElement.hs = undefined;

  // Parse markdown content and return html.

  // Wrap sections in divs if wrap = true.
  renderer.heading.wrap = wrap;

  let startTime = new Date();

  if (startLine) {
    var opts = {
                  'startLineNumber': parseInt(startLine) - 1,
                  'debug': app['logLevel']['marked']
                };
    var html = marked(markdown, opts);
  } else {
    var opts = {'debug': app['logLevel']['marked']};
    var html = marked(markdown, opts);
  }

  if (app['logLevel']['timing'] > 0) {
    let extra = "entire document with ";
    if (startLine !== undefined) {
      extra = "section starting on line " + startLine + " with ";
    }
    let dt = new Date() - startTime;
    util.toc(startTime,
          "for marked() to parse "
        + extra
        + (markdown.length) + " chars [" 
        + (1000*dt/markdown.length).toFixed(1) 
        + " μs/char]");
  }
  return html;
}

if (false) {

  // Generic editor wrapper
  let biedit = {};
  biedit.editor = function(name) {
    this.name = name;
    editor = {}
    editor.getValue = function() {
      return ace.edit(name).getValue();
    }
    editor.setValue = function() {
      return ace.edit(name).setValue();
    }
    editor.clearSelection = function() {
      ace.edit(name).clearSelection();
    }
    editor.focus = function() {
      ace.edit(name).focus();
    }
    editor.on = function(action, cb) {
      if (!['change','changeSelection'].includes(action)) {
        // error;
      }
      ace.edit(name).on(action, cb);
    }
    editor.trigger = function(action) {
      if (!['change','changeSelection'].includes(action)) {
        // error;
      }
      ace.edit(name)._emit(action);    
    }
    edior.getLength = function() {
      ace.edit(name).session.getLength();
    }
    edior.getLine = function(row) {
      ace.edit(name).session.getLine();
    }
    edior.getLines = function(startRow, endRow) {
      ace.edit(name).session.getLines(startRow, endRow);
    }

    editor.find = function(string) {
      ace.edit(name).find(string);
    }
    editor.replace = function(range) {
      ace.edit(name).session.replace(range);
    }
    editor.insert = function(startRowColumn, text) {
      ace.edit(name).insert(startRowColumn, text);
    }
    editor.insertFullLines = function(startRow, rows) {
      ace.edit(name).session.doc.insertFullLines(startRow, rows);
    }
    editor.remove = function(range) {
      ace.edit(name).session.remove(range);
    }
    editor.removeFullLines = function(startRow, endRow) {
      ace.edit(name).session.doc.insertFullLines(startRow, endRow);
    }

    return editor;
  }
}
