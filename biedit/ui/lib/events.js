function events() {

  $('#markdownTOCUpdate').click(function() {
    markdownTOC();
  });

  if (app['showLineNumbers']['preview']) {
    $('#linenumbers-checkbox').attr('checked',true);
  }
  $('#linenumbers-checkbox').on('click', function () {
    if ($('#linenumbers-checkbox').is(':checked')) {
      $('.block-info').show();
    } else {
      $('.block-info').hide();
    }
  });

  $('#markdownTOC').change(function() {
    if (this.checked) {
      $('#markdownTOCLabel').attr('title', $('#markdownTOCLabel').attr('title-checked'));
      app['TOC']['markdown']['show'] = true;
      markdownTOC();
      $("#markdownTOCUpdate").show();
    } else {
      $('#markdownTOCLabel').attr('title', $('#markdownTOCLabel').attr('title-unchecked'));
      app['TOC']['markdown']['show'] = false;
      $("#markdownTOCUpdate").hide();
       // Remove TOC and associated numbers found in headings.
      markdownTOC(true);
    }
  })

  // https://stackoverflow.com/a/35020537
  // https://keycode.info/
  // http://robertwhurst.github.io/KeyboardJS/
  // Does not work for shift key with Synergy
  //window.onkeyup = function(e) { app.isPressed[e.key] = false; }
  //window.onkeydown = function(e) { app.isPressed[e.key] = true; }
  /*
  $(document).click(function(e) {
      console.log("click")
      if (e.shiftKey) {
        alert("shift+click");
      } 
  });
  */

  // Short-cut commands.

  // https://stackoverflow.com/a/1828679/18433855
  let isPressed = {};
  window.onkeyup = function(e) { isPressed[e.keyCode] = false; }
  window.onkeydown = function(e) {
    //console.log(e.keyCode);
    isPressed[e.keyCode] = true;
  }

  document.addEventListener("keydown", function(e) {

    //console.log('keydown')
    var isMac = window.navigator.platform.match("Mac");
    var ctrl = isMac ? e.metaKey : e.ctrlKey;

    // CTRL-ENTER (CMD-ENTER on Mac) => Re-render display by
    // processing all content.
    if (ctrl && e.keyCode == 13) {
      e.preventDefault();
      //processAll(true);
      let editor = ace.edit("editor");
      editor._emit('change');
      return;
    }

    // CTRL-M (CMD-M on Mac) => Update or create Markdown TOC.
    if (ctrl && e.keyCode == 77) {
      e.preventDefault();
      if ($('#markdownTOC').is(':checked') == false) {
        $('#markdownTOC').click();
      } else {
        $('#markdownTOCUpdate').click();        
      }
      return;
    }

    // CTRL-S (CMD-S on Mac) => Save to server
    if (ctrl && e.keyCode == 83) {
      e.preventDefault();
      var editor = ace.edit("editor");

      var editorContent = editor.getValue();

      util.localSave(editorContent);

      if (app['server']['noHTML']) {
        serverSave(editorContent);
      } else {
        serverSave(editorContent, $('#html-rendered').html());
      }
      return;
    }

    // CTRL-SHIFT-C => git commit
    if (ctrl && e.shiftKey && e.keyCode === 67) {
      e.preventDefault();
      commit();
      return;
    }

    // CTRL-SHIFT-P => git push
    if (ctrl && e.shiftKey && e.keyCode === 80) {
        e.preventDefault();
        push();
        return;
    }
  }, false);

  $(document).on('scroll', function (e) {
    //return;
    // When anchor linked clicked, browser attempts to scroll
    // body to location that is in a div. This causes the
    // content in the body to shift upwards and the header is
    // then hidden. This prevents the scroll of the body.
    // TODO: Better way to handle this?
    // See also
    // https://stackoverflow.com/questions/2469529/how-to-disable-scrolling-the-document-body
    // TODO: Try this:
    // https://getpublii.com/blog/one-line-css-solution-to-prevent-anchor-links-from-scrolling-behind-a-sticky-header.html
    util.log("Preventing body scroll.",'events',2);
    // e.preventDefault() does not do anything.
    //$(document).scrollTop(0);
    $('#wrapper').scrollTop(0);
  });

  $(window).resize(function() {
    util.log("Window resize event. Resizing editor.",'events',1);
    // https://stackoverflow.com/a/24469262
    // In order for editor to fill content space vertically, need
    // wrapper height to be at least the height of content space.
    // So choose this height to be window height.
    let view = hash.get('view');
    let lastzoom = zoom[view];
    let h = window.innerHeight;
    util.log(`Setting #left-content height to ${h}`,'events',1);
    $("#left-content").outerHeight(h);

    let editor;
    if (!view || view === "pdf-preview") {
      editor = ace.edit("editor");
      // Trigger reflowing of editor content
      util.log(` Triggering editor.resize()`,'events',1);
      editor.resize();
    } else {
      if (lastzoom) {
        h = $("#left-content").outerHeight();
        util.log(` Last zoom level for view='${view}' is ${lastzoom}%`,"events", 1);
        //let h = $("#left-content").outerHeight();
        h = h/(lastzoom/100.);
        util.log(` Setting #${view} height to ${h}`,"events",1);
        $("#" + view).outerHeight(h);
        //console.log($("#" + view).outerHeight());
        editor = ace.edit(view);
        // Trigger reflowing of editor content
        util.log(` Triggering editor.resize()`,"zoom",1);
        editor.resize();
      } else {
        util.log(` No last zoom level for view='${view}'`,"events", 1);
      }
    }

  }).trigger("resize");

  // Zoom slider for display
  $('#zoom-right-input').on('change', function () {
    util.log("Zoom slider changed.",'events',1);
    zoom(hash.get('view'), this.value);
   });

  $('#view-options').on('change', function (evt) {

    function hideExcept(keep) {
      $('#right-content').children().each( (idx, el) => {
        if ($(el).attr('id') !== keep) {
          $(el).hide();
        }
      })
      $('#' + keep).show();
    }

    util.log("#view-options changed to " + evt.target.value,'events',1);

    hideExcept(evt.target.value);

    $('#pdf-status').empty();
    $('#timing').empty();
    $('#zoom-right-input').show();
    if (evt.target.value === 'html-rendered') {
      $("#show-line-numbers-label").show();
    } else {
      $("#show-line-numbers-label").hide();
    }

    if (evt.target.value === 'html-rendered') {

      hash.update("view", "");

    } else if (evt.target.value === 'html-rendered-standalone') {

      window.open(util.fileName().split(".md")[0] + ".html");
      let el = '#view-options > option[value="html-rendered"]';
      $(el).prop('selected', true).trigger('change');

    } else if (evt.target.value === 'html-tagged-body-raw') {

      htmlViewer($('#html-rendered').html(), evt.target.value);
      hash.update("view", evt.target.value);

    } else if (['html-tagged','html-tagged-body','html','html-body'].includes(evt.target.value)) {

      finalHTML($('#html-rendered').html(), evt.target.value,
        (html) => {
          htmlViewer(html, evt.target.value)
        });
      hash.update("view", evt.target.value);

    } else if (evt.target.value === 'latex') {

      latex(true, function (data) {
        latexViewer(data,"latex");
        serverSave(false, false, data);
      });
      hash.update("view", "latex");

    } else if (evt.target.value === 'latex-body') {

      latex(false, function (data) {
        latexViewer(data,"latex-body");
      });
      hash.update("view", "latex-body");

    } else if (evt.target.value === 'pdf-preview') {

      hideExcept('pdf-preview');
      function setIframe(html) {
        // https://stackoverflow.com/a/46485340
        let iframe = `<iframe
                        src="javascript:void(0);"
                        id="pdf-preview-iframe"
                        width="100%"
                        height="100%"
                      >
                      </iframe>`;
        iframe = $(iframe);
        util.log('Setting #pdf-preview content','events',1);
        $("#pdf-preview").show().append(iframe);
        document.querySelector('iframe').srcdoc = html;
        util.log('Set #pdf-preview content','events',1);
      }
      let htmlstr = $('#html-rendered').html();
      finalHTML(htmlstr, 'pdf-preview', (html) => setIframe(html));
      hash.update("view", "pdf-preview");

    } else if (evt.target.value === 'pdf') {

      // https://stackoverflow.com/a/64490933
      // Add timestamp to force re-generation.
      let fileBase = util.fileName().split(".md")[0];
      let filePath = location.pathname.split("/").slice(0,-1).join("/");

      let fileName = fileBase + ".pdf";
      if (hash.get('solutions') === 'true') {
        fileName = fileBase + "-solutions.pdf";
      }

      let args = (new Date()).getTime() + "&fitW#page=1";
      args = "infile=" + filePath + "/" + fileBase + ".html" + "&" + args;
      let pdfFile  = filePath + "/" + fileName + "?" + args;

      let object = `<object
                      id="pdf-object"
                      data="${pdfFile}"
                      type="application/pdf"
                      width="100%"
                      height="100%"
                      onload="window.pdfloaded();"
                    </object>`

      $('#zoom-right-input').hide();
      $('#pdf').empty();

      $('#pdf-status')
        .html('Creating and Loading PDF <span id="dots"></span>');
      var ndots = 0;
      var si = setInterval(() => {
        ndots = ndots + 1;
        if ((ndots) > 10) $('#dots').empty();
        $('#dots').append('.');
      }, 500)

      window.pdfloaded = function () {
        $('#pdf-status').empty();
        var ptime = (new Date() - window.pdfloaded.startTime) + " ms";
        util.toc(window.pdfloaded.startTime, 'to create and load PDF');
        $("#timing").text(ptime);
        clearInterval(si);
      }
      window.pdfloaded.startTime = new Date();

      serverSave(ace.edit("editor").getValue(), $('#html-rendered').html(), false, function () {
        $('#pdf').empty().css('display','flex').show().append(object);
        hash.update("view", "pdf");
      });
    }

    if (!evt.target.value.startsWith('pdf-preview')) {
      // TODO: Seems that this should be in callback for each view for which
      // it applies.
      zoom(evt.target.value);
    }
  });

  // When new file selected, navigate to new page
  let filelast = $('#file').val();
  $('#file').on('change', function (evt) {
    util.log("#file changed to " + evt.target.value,'events',1);
    let location = window.location.origin + "/" + evt.target.value + "!";

    if (isPressed[16]) { // Shift
      // On Chrome, shift key must be pressed _before_ drop-down list is clicked.
      // https://stackoverflow.com/questions/19183715/keydown-event-in-drop-down-list
      window.location.href = location;
    } else {
      window.open(location);
    }
    $('#file').val(filelast);
    filelast = evt.target.value;
  });

  // Resize horizontally based on movement of center #drag element.
  $('#drag').on('mousedown', function(e) {

    // https://www.gyrocode.com/articles/how-to-detect-mousemove-event-over-iframe-element/
    $('#pdf-object').css('pointer-events', 'none');

    // See also
    // https://htmldom.dev/create-resizable-split-views/
    var $dragable = $(this);
    var startWidth = $dragable.css('margin-left');
    var pX = e.pageX;
    // Show cursor as col-resize when cursor anywhere in body
    // (fast movement will move cursor off element; this 
    // ensures cursor does not change while moving)
    $("body").css("cursor", "col-resize"); 
    $(document).on('mouseup', function(e){
        var editor = ace.edit("editor");
        $(document).off('mouseup').off('mousemove');
        $("body").css("cursor", "default");
        $('#pdf-object').css('pointer-events', 'auto');
        editor.resize();
    });

    $(document).on('mousemove', function(me) {
        me = me || window.event;
        me.preventDefault(); // Prevents highlight of text in display.
        var off = $('#left').offset();
        var w = $("#left").outerWidth() - $("#left").innerWidth();
        var mx = me.pageX - off.left - w - $('#drag').width();
        //console.log(me);
        $('#left').css({"width": mx});
        $('#hleft').css({"width": mx});
    });
  });

  $("#toc").on('click', function (e) {
    var e = window.e || e;
    util.log('Element in #toc clicked.','displayClick',1);
    var raw = $(e.target).closest("a[raw]").attr("raw");
    var lo = $(e.target).closest('[lo]').attr('lo');
    if (raw) {
      util.log("Clicked #toc element has raw = " + raw,'displayClick',1);
      util.log("Clicking element in #display with raw = '" + raw + "' and lo = " + lo,
          'displayClick',1);
      $('#display a[lo="' + lo + '"]').click();
    } else {
      util.log("Not clicking corresponding #display header because closest element not found with raw = " + raw,'displayClick',1);
    }
  });

  $('#display').on('click', '.inline-html', function (e) {
    return;
    let line = $(event.target).parents().find('[lo]').attr('lo');
    util.log("inline-html element clicked. Scrolling to it on line " + line + " in editor",'displayClick',1);
    let editor = ace.edit("editor");
    editor.scrollToLine(line-3);
    editor.moveCursorTo(parseInt(line)-1, 0);
    editor.clearSelection();
    editor.focus();
  });

  $('#display').on('click','img', function (e) {
    // Force reload of image on click.
    util.log("Image clicked. Forcing reload",'displayClick',1);
    let src = $(event.target).attr('src') + "?" + Date.now();
    $(event.target).attr('src',src);
  })

  $("#display").on('click', function (e) {

    let s = window.getSelection();

    var range = s.rangeCount ? s.getRangeAt(0) : 0;
    if (range.endOffset - range.startOffset > 1) {
      util.log("Range of text selected. To prevent loss of focus,"
             + " will not move cursor in editor.", "displayClick", 1);
      return;
    }

    util.log('Element in #display clicked.','displayClick',1);

    var e = window.e || e;

    var line = $(e.target).closest('[lo]').attr('lo');
    if (!line) {
      util.log("Could not find line number in editor associated"
             + " with clicked element in display.",'displayClick',1);
      return;
    }

    var raw = $(e.target)
                .closest(".section")
                .find('a[raw]')
                .attr("raw");
    var lo = $(e.target)
                .closest(".section")
                .find('h1,h2,h3,h4,h5,h6')
                .attr("lo");
    if (raw) {
      util.log("Highlighting element with attribute raw = " + raw
             + " in #display and #toc.",'displayClick', 1);
      highlightTOC(raw,lo);
    } else {
      util.log("Click not in a section. Will not highlight a heading in display and TOC.",'displayClick',1);
    }

    let ihref = $(e.target).attr('href'); 
    if (ihref && ihref.startsWith('#')) { // Internal href
      util.log("Click on internal anchor node. Not moving cursor to its location.",'displayClick',1);
      util.log("Removing class active from any element in #display.",'displayClick',1);
      $('#display .active').removeClass('active');
      return;
    }

    util.log("Finding associated row and column of #display click in editor",
        'displayClick',1);

    var col;
    //if ($(e.target).is("a.hanchor")) {
    if ($(e.target).closest("a.hanchor").length > 0) {
      // Scrolling to location inside text does not seem to be
      // possible b/c startOffset and endOffset returned are
      // both zero.
        // s = window.getSelection();
        // var range = s.rangeCount ? s.getRangeAt(0) : 0;
        // console.log(range.startOffset)
        // console.log(range.endOffset)
      util.log("Clicked element is a.hanchor with closest element with lo = " + line,'displayClick',1);
      line = parseInt(line)-1;
      col = 0;
    } else {
      col = 0;
      line = parseInt(line)-1;
      if (true) {
        // TODO: This changes scroll position.
        util.log("Finding " + mdTOCStart(),'displayClick',1);
        var editor = ace.edit("editor");
        var a = editor.find(mdTOCStart());
        util.log("Finding " + mdTOCEnd(),'displayClick',1);
        var b = editor.find(mdTOCEnd());
        markdownTOC.updating = false;
        if (a && b && line < b.start.row && line > a.start.row) {
          util.log("Clicked element in markdown TOC",'displayClick',1);
          //console.log("----")
          var href = $(e.target).attr('href')
          //console.log(href)
          $('#display').find('a[href=' + href + '].hanchor').click();
          return;
          //console.log($($(e.target).attr('href')))
        }
      }
      if (window.getSelection && (sel = window.getSelection()).modify) {
        // Webkit, Gecko
        util.log("Clicked element is not a.hanchor. Finding associated row and column of click in editor",'displayClick',1);
        rc = findRowColumn();
        if (rc !== undefined) {
          util.log("Computed column = " + rc[1] + " and relative row = "
              + rc[0],'displayClick',1);
          line = line + rc[0];
          col = rc[1];
        }
      }
    }
    if (line === undefined) {
      return;
    }
    // Better way?
    // https://stackoverflow.com/questions/32154097/get-visible-document-range-in-ace-editor
    var firstVisibleLine = parseInt($('.ace_gutter-cell').first().text());
    var lastVisibleLine = -2 + parseInt($('.ace_gutter-cell').last().text());
    //console.log("firstVisibleLine: " + firstVisibleLine)
    //console.log("lastVisibleLine: " + lastVisibleLine)

    var editor = ace.edit("editor");

    util.log(`First/last visible line ${firstVisibleLine}/${lastVisibleLine}`,'displayClick',1);

    // find() modifies scroll position.
    editor.scrollToLine(line-1);

    util.log(`Moving cursor to line ${line+1}, column ${col}`,'displayClick',1);
    editor.moveCursorTo(line, col);
    editor.clearSelection();
    editor.focus();
    $("#editor").trigger('click');

    function findRowColumn() {

      // See also https://jsfiddle.net/cpg4a9st/11/
      let s = window.getSelection();

      //var range = s.rangeCount ? s.getRangeAt(0) : 0;

      if (s.anchorNode.id == "editor") {
        // When the clicked element is an anchor or img tag,
        // the anchorNode ends up being the editor. 
        // Not sure why this is, but result is that
        // we can't find column clicked in anchor nodes.
        // TODO: I think that in this case we need to attach an onclick
        // trigger that results in a call of editor.moveCursorTo(lo,1).
        util.log("Clicked node cannot be used for scroll. Aborting",
            'displayClick',1);
        return undefined;
      }

      function getText( obj ) {
          return obj.textContent ? obj.textContent : obj.innerText;
      }

      let node = s.anchorNode;

      util.log("Clicked node text:\n" + getText(node),'displayClick',1);
      util.log("Clicked node",'displayClick',1);
      util.log($(node),'displayClick',1);

      let col = 0;
      let row = 0; // Row relative to lo of element
      var top = $(node).closest('[len]');
      if (top.length == 1) {
        // Equation was clicked. It is not possible to find position
        // of character clicked. Set position to end.
        util.log("Clicked node has len attr or ancestor with len attr.",'displayClick',2);
        col = parseInt(top.attr('len'));
        util.log("Equation length = " + col,'displayClick',1);
        // Walk upwards until outer-most element is found.
        util.log("Walking upwards to outer-most element of equation.",'displayClick',1)
        while (!$(node).attr('len')) {
          node = node.parentNode;
        }
      } else {
        // Find position within clicked element.
        let range = s.rangeCount ? s.getRangeAt(0) : 0;
        col = range.startOffset;
        util.log("Click position within text node: " + col, 'displayClick',1);
        // If newline inside and before col, 
        //let row = findRow(node, col);
        //util.log("Returning row = " + row + "; col = " + col,'displayClick',1)
        util.log("Walking upwards to outer-most element of non-equation.",'displayClick',1)
        while (1) {
          if ($(node.parentNode).is('[lo]')) break;
          node = node.parentNode;
          col = col + getMarkupLength(node, true);
        }
        util.log("Click position within node: " + col,'displayClick',1)
      }

      util.log("Outer-most element",'displayClick',1);
      util.log($(node),'displayClick',1);
      if (node.previousSibling) {
        util.log("Finding lengths of its previous siblings",'displayClick',1);
      } else {
        util.log("No previous siblings",'displayClick',1);        
      }
      while (node.previousSibling) {
        util.log("Working on previous sibling: ",'displayClick',1);
        util.log(node.previousSibling,'displayClick',1);
        let len = fullLength(node.previousSibling);
        util.log("Full length = " + len,'displayClick',1)
        col = col + len; 
        node = node.previousSibling;    
      }

      let first = true;
      while (!$(node).parent().is('.section')) {
        if ($(node).is("li")) {
          let markerlength = parseInt($(node).attr("markerlength"));
          let markerpadlength = parseInt($(node).attr("padlength"));
          util.log("Enclosing li has marker length = " + markerlength,'displayClick',1)
          util.log("Enclosing li has padding length = " + markerpadlength,'displayClick',1)
          col = col + markerlength + markerpadlength;
        }
        if ($(node).is("p")) {
          let padlength = parseInt($(node).attr("padlength"));
          util.log("Enclosing p has padding length = " + padlength,'displayClick',1)
          col = col + padlength;
        }
        node = node.parentNode;
      }

      return [0, col]

      function fullLength(node, len) {

        if (!len) {
          len = 0;
        }

        if ($(node).is('[len]')) {
          util.log("Node is equation.",'displayClick',1);
          return parseInt($(node).attr('len'))       
        }

        if (node.nodeName === "#text") {
          len = len + $(node).text().length;
          util.log("Node is text of len " + len,'displayClick',1);
        } else {
          len = len + getMarkupLength(node);
        }

        //if ($(node).children().length > 0) {
        if (node.childNodes.length > 0) {
          // TODO: This assumes no element will have more than one child.
          // So second span in the following will not be counted.
          //  <span>
          //    <span>1</span><span>2</span>
          //  </span>
          util.log("# of children: " + node.childNodes.length,'displayClick',1);
          return fullLength(node.childNodes[0], len);
        } else {
          // Reached the inner-most element.
          util.log("No children.",'displayClick',1);
          return len;
        }
      }

      function getMarkupLength(node, open) {

        fullLengths = {'SUB': 11, 'SUP': 11, 'SPAN': 13, 'STRONG': 4, 'EM': 2, 'CODE': 2, 'DEL': 2};
        openLengths = {'SUB': 5, 'SUP': 5, 'SPAN': 6, 'STRONG': 2, 'EM': 1, 'CODE': 1, 'DEL': 1};

        if ($(node).attr('markerlength')) {
          if (open) {
            let len = parseInt($(node).attr('markerlength'));
            util.log(`LaTeX node half length = ${len}`,'displayClick',1);
            return len;
          } else {
            let len = parseInt($(node).attr('markerlength')) + 1;
            util.log(`LaTeX node full length = ${len}`,'displayClick',1);
            return len;
          }
        }

        let name = node.nodeName;
        if (!fullLengths[name]) {
          util.log(`No markup lengths for node of type ${name}`,'displayClick',1);
          return 0;
        }
        if (open) {
          len = openLengths[name]
          util.log(`Node ${name} half length = ${len}`,'displayClick',1);
          return len;
        } else {
          len = fullLengths[name]
          util.log(`Node ${name} full length = ${len}`,'displayClick',1);
          return len;          
        }
      }

      function findRow(node, col) {
        util.log("Finding row for:\n" + $(node).text(),'displayClick',1);
        let rr = 0; // relative row
        var arr = $(node).text().split(/\n/);
        if (arr.length > 1) {
          util.log("Newline in string.",'displayClick',1);
          var cnt = 0;
          var cnt_last = 0;
          for (var i = 0; i < arr.length; i++) {
            cnt_last = cnt;
            cnt = cnt + arr[i].length;
            util.log("cnt = " + cnt,'displayClick',1);
            if (cnt + 1 >= col) {
              rr = i;
              break;
            }
          }
          util.log(arr,'displayClick',1);
          util.log("col      = " + col,'displayClick',1);
          util.log("i        = " + i,'displayClick',1);
          util.log("rr       = " + rr,'displayClick',1);
          util.log("cnt      = " + cnt,'displayClick',1);
          util.log("cnt_last = " + cnt_last,'displayClick',1);
          if (rr > 0) {
            col = col - i;
          }
          col = col - cnt_last;
        }
        return [rr,col];
      }
    }
  });

  if (app['htmlEditable']) {
    // https://stackoverflow.com/a/18144022
    $('#display').on('input', '.section', (e) => {
        util.log("Section changed in display.",'displayInput',1);
        sectionName = $(e.srcElement.innerHTML).find('a').attr('raw');
        a = editor.find(sectionName);
        b = editor.find('#');
        r = new Range();
        r.start = a.start;
        r.start.column = 0;

        r.end = b.end;
        r.end.column = 0;

        rep = turndownService.turndown(e.srcElement.innerHTML);
        util.log('Starting replacement','displayInput',1);
        editor.session.replace(r, rep + "\n\n");
        util.log('Finished replacement','displayInput',1);
        a = editor.find(sectionName);
        event.target.focus();
    });
  }
}