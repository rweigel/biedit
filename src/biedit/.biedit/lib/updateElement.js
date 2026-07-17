function lineString(start, stop) {
  let lines = start + "-" + stop;
  if (start == stop) {
    lines = "" + start;
  }
  return lines;
}

function updateElement(e, editor) {

  updateElement.result = {
                          "reparseDocument": false,
                          "editedLines": lineString(e.start.row + 1, e.end.row + 1),
                          "parsedLines": null,
                          "startSection": null,
                          "stopSection": null,
                          "startParse": null,
                          "stopParse": null,
                          "insertAfter": null,
                          "changedElements": []
                        };

  let sameLine = e.start.row == e.end.row;
  if (sameLine) {
    util.log("Edit was made to a single line (" + (e.start.row + 1) + ").",
             'updateElement',1);
  }

  util.log(`start/end line: ${e.start.row+1}/${e.end.row+1}`,'updateElement',1)
  util.log(`start/end column: ${e.start.column}/${e.end.column}`,'updateElement',1)
  util.log(`Getting lines ${e.start.row+1}-${e.end.row+1}`,'updateElement',1)

  if (e.start.row == 0 
      && e.lines[0] === mdTOCStart(true)
      && e.lines.slice(-2,-1)[0] === mdTOCEnd(true)
      && e.lines[e.lines.length - 1] == '' 
      && e.action === 'insert') {

    util.log("Automatic TOC inserted.",'updateElement',1);
    let parsedText = editor.session
                      .getLines(e.start.row, e.end.row-1).join("\n");

    util.log("Text:\n" + parsedText,'updateElement',1);                  
    var opts = {'startLineNumber': 1, 'debug': app['logLevel']['marked']};
    var html = marked(parsedText, opts);
    var htmlDOM = $.parseHTML(html);
    $(htmlDOM).find('[lo]').addClass('added');
    util.log("Inserting before first existing section.",'updateElement',1);
    var section = $('#display > .section').slice(0,1);
    $(section).prepend(htmlDOM);
    updateLineNumbers(1, e.end.row - e.start.row);
    //setTimeout(()=> updateLineNumbers(1, e.end.row - e.start.row),0);
    return updateElement.result;
  }


  let parsedText = editor.session
                    .getLines(e.start.row, e.end.row).join("\n");
   
  let re = /\s+\|/m;
  if (re.test(parsedText)) {
    //util.log("Edit was made to line of table. Reparse entire document.",'updateElement',1);
    //return false;
  }

  if (false && app['TOC']['markdown']['show']) {
    // Could allow edits of section titles to be made by
    // edits TOC.
    var a = editor.find(mdTOCStart());
    var b = editor.find(mdTOCEnd());
    editor.gotoLine(e.start.row+1, e.start.column+1);
     if (sameLine && e.start.row > a.start.row && e.end.row < b.start.row) {
      util.log("Markdown TOC was edited.");
    }
  }

  let editedLine = e.start.row + 1;

  let elo = e.start.row + 1;
  let elf = e.end.row + 1;

  let Nlines = editor.session.getLength();
  let changedElement = $('#display [lo="' + editedLine + '"]').first();
  let found = changedElement.length > 0 ? true : false;

  //console.log($('#display [lo="' + editedLine + '"]').first())
  if (found && changedElement.is(":header") && !sameLine) {
    if (e.start.column == 0) {
      util.log("Multi-line edit removed header. Reparse entire document.",'updateElement',1);
      updateElement.result.reparseDocument = true;
      return updateElement.result;
    }
  }

  if (sameLine && found && changedElement.is(":header")) {
    let hline = editor.session.getLine(e.start.row);
    if (nhash = hline.match(/^#{1,6}\s/)) {
      nhash = nhash[0].length;
      if (e.start.column + 1 > nhash) {
        util.log("Single line edit to header text.",'updateElement',1);
        updateHeaderElement(changedElement, hline);
        return updateElement.result;
      } else {
        util.log("Header Markdown character changed. Reparse all.",'updateElement',1);
        updateElement.result.reparseDocument = true;
        return updateElement.result;
      }
    } else {
      found = false;
      util.log("Header line changed to no longer be header. Reparse all.",'updateElement',1);
      if (app['TOC']['markdown']['show']) {
        //util.log("Calling markdownTOC().",'updateElement',1)
        //setTimeout(() => markdownTOC(), 0);
      }
      updateElement.result.reparseDocument = true;
      return updateElement.result;
    }
  }

  let hs = updateElement.hs;
  let startHeader;
  if (!updateElement.hs) {
    startHeader = util.tic();
    hs = $('h1,h2,h3,h4,h5,h6'); // Faster than $(':header');
    util.toc(startHeader,'to extract header elements');
  }

  startHeader = util.tic();
  let start, stop;
  let startSection, stopSection;
  let dl = e.action === "insert" ? elf - elo : elo - elf;
  util.log("elo = " + elo + "; elf = " + elf + "; dl = " + dl,'updateElement', 2);

  start = parseInt($(hs[0]).attr('lo'));
  if (start > 1) {
    util.log("Section #0 start line = 1",'updateElement',2);
  }
  for (var i = 0; i < hs.length; i++) {
    start = parseInt($(hs[i]).attr('lo'));
    util.log("Section #" + (i+1) + " start line = " + parseInt($(hs[i]).attr('lo')),
      'updateElement',2);
  }

  if (start > 1) {
    if (elo < start) {
      util.log("Edit started in 0th section",'updateElement',2);
      startSection = 0;
      slo = 1;
      stop = parseInt($(hs[0]).attr('lo'));
      var delta = dl < 0 ? 0 : dl;
      if (elf < stop + delta) {
        util.log("Edit started and ended in 0th section",'updateElement',2);
        stopSection = 0;
        if (hs.length > 0) {
          slf = stop - 1;
        } else {
          slf = Nlines;
        } 
      }

    }
    if (dl < 0 && elo == 1 && elf == start) {
      util.log("Edit removed 0th section",'updateElement',2);
      startSection = 0;
    }
  }
  if (dl > 0 && elo == 1 && start == 1) {
    util.log("Edit created 0th section",'updateElement',2);
    startSection = 0;
    slo = elo;
  }

  if (stopSection != 0) {
    if (startSection != 0) {
      startSection = 0;
    }
    stopSection = hs.length;
    var slo = 1; // Initial section line
    var slf = editor.session.getLength() - dl + 1; // Final section line
    for (var i = 0; i < hs.length; i++) {
      start = parseInt($(hs[i]).attr('lo'));
      if (i < hs.length - 1) {
        stop = parseInt($(hs[i+1]).attr('lo'));
      } else {
        stop = slf - 1;
      }
      util.log("Section #" + (i+1) + " start/stop line = " 
          + parseInt($(hs[i]).attr('lo')) + "/" + stop,
          'updateElement',2);
      if (elo >= start) {
        // +1 b/c always section with no header at start of document.
        util.log('Found start','updateElement',2)
        startSection = i + 1;
        slo = start;
      }
      delta < 0 ? 0 : delta;
      if (elf < stop + delta) {
        // +1 b/c always section with no header at start of document.
        util.log('Found stop','updateElement',2)
        stopSection = i + 1;
        slf = stop - 1;
        break;
      }
    }
  }
  updateElement.hs = hs;

  util.toc(startHeader,'to find header boundaries');

  util.log("Section # start/end of edit: " + startSection + "/" + stopSection,
      'updateElement', 1);
  util.log("Affected section(s) lines start/end: " + slo + "/" + slf,'updateElement', 1);

  var sameSection = startSection == stopSection;

  if (!sameSection) { 
    // TODO: Find sections of edit and update those sections.
    if (e.action === 'remove' && e.lines.join('') === '') {
        util.log("Edit affects multiple sections but involved only removal of newlines. Reparse all.",'updateElement', 1);
        //updateLineNumbers(stopParse, e.lines.length-1);
        updateElement.result.reparseDocument = true;
        return updateElement.result;
    } else {
      util.log("Edit affects multiple sections. Reparsing entire document.",'updateElement', 1);      
    }
    updateElement.result.reparseDocument = true;
    return updateElement.result;
  }

  util.log("Section # of edit: " + startSection,'updateElement', 1);

  startTime = util.tic();
  util.log("Looking for top-level element associated with edited line ("
      + editedLine + ")",'updateElement',1);
  var lo_els = $('#display > .section')
                  .slice(startSection, stopSection+1)
                  .find('> .block > [lo]');
  util.log("Found "
        + lo_els.length
        + " top-level elements in section "
        + startSection,
        'updateElement',1);

  function needPrev(lo_els, i, elo, startInside) {

    var lf = parseInt($(lo_els[i]).attr('lf'));
    if (i < 0 || $(lo_els[i]).is(':header')) {
      if (i < 0) {
        util.log('  No previous element.','updateElement',2);
      } else {
        util.log('  Previous element is header.','updateElement',2);
      }
      return false;
    }

    if (startInside && $(lo_els[i]).is('p') && elo > lf && i < lo_els.length - 1 && $(lo_els[i+1]).is('ol,ul')) {
      util.log('  Previous is p and current is list.','updateElement',2);
      // Handles appending to "b". No parse of "a" needed
      // a
      // * b
      return false;
    }

    if ($(lo_els[i]).is('p') && elo > lf + 1) {
      util.log('  Previous is p and elo > lf + 1.','updateElement',2); 
      return false;
    }
    if (elo > lf + 2) {
      // Could be more graular here. For example, if ul or ol and edit
      // does not change indent of existin p, can use elo > lf + 1.
      util.log('  elo > lf + 2.','updateElement',2);
      return false;
    }
    return true;
  }

  function needNext(lo_els, i, elf) {

    var lo = parseInt($(lo_els[i]).attr('lo'));
    if (i > lo_els.length - 1 || $(lo_els[i]).is(':header')) {
      if (i > lo_els.length - 1) {
        util.log('  No next element.','updateElement',2);
      } else {
        util.log('  Next element is header.','updateElement',2);
      }
      return false;
    }
    if ($(lo_els[i]).is('ul,ol') && elf < lo + dl - 1) {
      util.log('  Next is ul or ol and elf < lo_next + dl - 1.','updateElement',2);
      return false;
    }

    // If next element is paragraph and it is indented, need to include
    // in parse if edited element is indented. 
    var lo_prev = $(lo_els[i-1]).attr('lo')
    var p_indent_prev = false;
    if (lo_prev) {
      var line = editor.session.getLines(lo_prev-1, lo_prev-1)[0];
      if (line)
        p_indent_prev = line.startsWith(" ");
    }


    var p_indent = $(lo_els[i]).text().startsWith(" ");
    var d = p_indent || p_indent_prev ? 1 : 0;

    if (dl > 0 && $(lo_els[i]).is('p') && elf < lo + dl - 1 - d) {
      util.log('  Next is p and elf < lo_next + dl - 1.','updateElement',2);
      return false;
    }
    if (dl == 0 && $(lo_els[i]).is('p') && elf < lo - 1 - d) {
      util.log('  Next is p and elf < lo_next - 1.','updateElement',2);
      return false;
    }
    if (dl < 0 && $(lo_els[i]).is('p') && elf < lo - 1 - d) {
      util.log('  Next is p and elf < lo_next - 1.','updateElement',2);
      return false;
    }
    return true;
  }

  var insertAfter = -1;
  var changedElements = [];
  var startParse = slo;
  var stopParse = elf;
  var lo, lf;

  lines = parsedText.split("\n");
  for (var i=0; i < lines.length; i++) {
    if (lines[i].startsWith('```')) {
      util.log("Edit added ^```. Reparsing entire document.",'updateElement',1);
      updateElement.result.reparseDocument = true;
      return updateElement.result;
    }
  }

  var fence = parsedText.trimEnd().endsWith('```');
  if (fence) {
    util.log("Edit added ```\s+$. Reparsing entire document.",'updateElement',1);
    updateElement.result.reparseDocument = true;
    return updateElement.result;
  }

  for (var i = 0; i < lo_els.length; i++) {

      lf_last = 0;
      if (i > 0) {
        lf_last = parseInt($(lo_els[i-1]).attr('lf'));
      }

      lo_next = Infinity;
      if (i < lo_els.length - 1) {
        lo_next = parseInt($(lo_els[i+1]).attr('lo'));
      }

      lo = parseInt($(lo_els[i]).attr('lo'));
      lf = parseInt($(lo_els[i]).attr('lf'));

      util.log("#" + i 
                + ": lo = " + lo 
                + "; lf = " + lf 
                + "; dl = " + dl
                + "; elo = " + elo 
                + "; elf = " + elf
                + "; lf_last = " + lf_last 
                + "; lo_next = " + lo_next
                ,'updateElement',1);

      if (i == 0 && elo < lo) {
        if (elf < lo + dl) {
          var next = needNext(lo_els, 0, elf);
          util.log('  Start/stop before #' + (i) + '; Need next: ' + next,'updateElement',2); 
          if (next) {
            stopParse = dl + parseInt($(lo_els[0]).attr('lf'));
            changedElements.push(0);
          } else {
            stopParse = dl + elf;
            break;
          }
          insertAfter = -1;
        } else {
          changedElements.push(0);
        }
      }

      if (elo >= lo && elf <= lf + Math.abs(dl)) {
        var previous = needPrev(lo_els, i-1, elo, true);
        util.log('  Start inside #' + (i) + '; Need previous: ' + previous,'updateElement',2); 
        changedElements.push(i);
        if (previous) {
          startParse = parseInt($(lo_els[i-1]).attr('lo'));
          changedElements.push(i-1);
        } else {
          startParse = lo;
        }
        insertAfter = i;
      }

      if (elo > lf && elo < lo_next) {
        var previous = needPrev(lo_els, i, elo)
        util.log('  Start after #' + (i) + '; Need previous: ' + previous,'updateElement',2);
        if (previous) {
          startParse = parseInt($(lo_els[i]).attr('lo'));
          changedElements.push(i);
        } else {
          startParse = elo;
        }
        insertAfter = i;
      }

      if ( (dl > 0  && elf >= lo + dl && elf <= lf + dl)
        || (dl <= 0 && elf >= lo      && elf <= lf ) ) {
        var next = needNext(lo_els, i+1, elf);
        util.log('  End inside #' + (i) + '; Need next: ' + next,'updateElement',2);
        changedElements.push(i);
        if (next) {
          stopParse = dl + parseInt($(lo_els[i+1]).attr('lf'));
          changedElements.push(i+1);
        } else {
          stopParse = dl + lf;
          if (dl < 0 && stopParse < dl + elf) {
            stopParse = dl + elf;
          }
          break;
        }
      }

      if ( (dl >= 0 && elf - dl > lf && elf - dl < lo_next)
        || (dl < 0  && elf > lf      && elf < lo_next)) {
        var next = needNext(lo_els, i+1, elf);
        var prev = needPrev(lo_els, i, elf);
        util.log('  End after #' + (i) + '; Need next: ' + next + '; Need prev: ' + prev,'updateElement',2);
        if (next) {
          stopParse = dl + parseInt($(lo_els[i+1]).attr('lf'));
          changedElements.push(i+1);
        } else {
          if (dl < 0) {
            stopParse = dl + elf;
          } else {
            stopParse = elf;
          }
        }
        if ( (dl + lf <= 0 || prev) && startParse < lf + 1) {
          changedElements.push(i);
        }
        insertAfter = i;
      }
  }

  if (changedElements.length > 0) {
    insertAfter = null;
  }
  if (stopParse < startParse) {
    stopParse = startParse;
  }
  if (stopParse > Nlines) {
    stopParse = Nlines;
  }

  // Remove duplicates
  changedElements.sort();
  var changedElements = changedElements.filter(
                          function (item, index, value) {
                            return index == value.indexOf(item);
                          });
  changedElements.sort((a, b) => a - b);

  // Fill in between first and last elements
  var affectedElements = [];
  for (var k = changedElements[0]; k < changedElements.slice(-1)[0] + 1; k++) {
    affectedElements.push(k);
  }

  updateElement.result.parsedLines = lineString(startParse,stopParse);
  updateElement.result.startParse = startParse;
  updateElement.result.stopParse = stopParse;
  updateElement.result.startSection = startSection;
  updateElement.result.stopSection = startSection;
  updateElement.result.insertAfter = insertAfter;
  updateElement.result.changedElements = changedElements;
  updateElement.result.affectedElements = affectedElements;

  util.log("startParse = " + startParse 
         + "; stopParse = " + stopParse
         + "; changedElements = [" + changedElements.join(",") + "]"
         + "; affectedElements = [" + affectedElements.join(",") + "]"
         + "; insertAfter = " + insertAfter 
         ,'updateElement', 1);

  util.toc(startTime,'to find elements to modify');

  startTime = util.tic();

  parsedText = editor.session
                     .getLines(startParse-1, stopParse-1).join("\n");

  util.log("Lines to be parsed have text:",'updateElement',3);
  util.log(parsedText,'updateElement',3);

  var opts = {'startLineNumber': startParse,
              'debug': app['logLevel']['marked']};

  parsedText = preprocessMD(parsedText);                 
  var html = marked(parsedText, opts);
  if (!sameSection) { 
    console.log(html);
  }
  if (/div class='section'/.test(html)) {
    if (e.lines.join('') === '') {
      util.log('Edited Markdown has section div but only involved only addition of newlines.','updateElement',1);
      updateLineNumbers(stopParse+1, e.lines.length-1);
      return updateElement.result;
    } else {
      util.log('Parsed Markdown has section div. Reparsing entire document.','updateElement',1);      
    }
    updateElement.result.reparseDocument = true;
    return updateElement.result;
  }

  html = $("<div>" + html + "</div>").html();
  //var htmlDOM = $.parseHTML("<div>" + html + "</div>");
  var htmlDOM = $.parseHTML(html);
  //console.log($(htmlDOM).html());

  // 'added' class used by updateLineNumbers()
  $(htmlDOM).find('[lo]').addClass('added');

  // 'active' class used by edit.js/editorChangeSelection()
  // This is not needed, but adding it here prevents flashing
  // when typing. If the element is added without this class,
  // it has no background color until it is added in
  // edit.js/editorChangeSelection()
  $(htmlDOM).find('[lo=' + elo + ']').last().addClass('active');

  //console.log($(htmlDOM).html());
  if (changedElements.length == 0) {
    util.log("No changed elements.",'updateElement', 1);
    if (insertAfter >= 0) {
      util.log("Inserting after element " + insertAfter,'updateElement',1);
      $(lo_els[insertAfter]).parent().after(htmlDOM);
      updateLineNumbers(stopParse, dl);
      return updateElement.result
    } else {
      util.log("Prepending to section.",'updateElement',1);
      var section = $('#display > .section')
                      .slice(startSection, startSection+1);
      $(section).prepend(htmlDOM);
    }
  } else {
    util.log("Replacing element " + changedElements[0],'updateElement',1);
    // Only need to replace first changed element with new 
    // elements. The other changed elements will be removed
    // in the loop over affectedElements.
    $(lo_els[changedElements[0]]).parent().replaceWith(htmlDOM);
  }

  if (affectedElements.length > 0) {
    for (var i = 1; i < affectedElements.length; i++) {
      util.log("Removing element " + affectedElements[i],'updateElement',1);
      //console.log($(lo_els[affectedElements[i]]))
      $(lo_els[affectedElements[i]]).parent().remove();
    }
  }
  util.toc(startTime, 
          'to get lines, render, and replace element(s) associated '
        + 'with lines ' + startParse + "-" + stopParse);

  updateLineNumbers(stopParse, dl);

  return updateElement.result
}
