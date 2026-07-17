function updateElement(e, editor) {

  let sameLine = e.start.row == e.end.row;
  if (sameLine) {
    util.log("Edit was made to a single line (" + (e.start.row + 1) + ").",
        'updateElement',1);
  }

  var parsedText = editor.session
                      .getLines(e.start.row, e.end.row).join("\n");

  let re = /\s+\|/m;
  if (re.test(parsedText)) {
    util.log("Edit was made to line of table. Reparse entire document.",'updateElement',1);
    //return false;
  }

  let editedLine = e.start.row + 1;

  let elo = e.start.row + 1;
  let elf = e.end.row + 1;

  let Nlines = editor.session.getLength();

  let changedElement = $('#display [lo="' + editedLine + '"]').first();

  let found = changedElement.length > 0 ? true : false;
  if (sameLine && found && changedElement.is(":header")) {
    let hline = editor.session.getLine(e.start.row);
    if (nhash = hline.match(/^#{1,6}\s/)) {
      nhash = nhash[0].length;
      if (e.start.column + 1 > nhash ) {
        util.log("Text of header changed.",'updateElement',1);
        var opts = {'debug': app['logLevel_']['marked']};
        util.log("Line with header from editor: " + hline,'updateElement',1);
        util.log("Calling marked with text:" + hline.slice(nhash))
        var toParse = hline.slice(nhash);
        var raw = toParse;
        if (toParse.startsWith("#")) {
          // bug-006-hash-in-heading.md
          toParse = "\\" + toParse;
        }
        var newTitle = marked(toParse, opts);

        util.log("raw: " + raw,'updateElement',1);
        var slugger = new marked.Slugger();
        var newSlug = slugger.slug(raw);
        util.log("New slug: " + newSlug,'updateElement',1);

        newTitle = $(newTitle).find('p').html() || "";
        util.log("New header html:\n" + newTitle,'updateElement',1);

        var number = changedElement.find('a').attr('number');
        changedElement
              .find('a')
              .attr('raw', hline)
              .html(number + " " + newTitle)
              .attr('href', '#' + newSlug)

        var tocElement = $('#toc a[number="' + number + '"]')
                            .html(newTitle)
                            .attr('raw', hline)
                            .attr('href', '#' + newSlug);

        if (app['TOC']['markdown']['show']) {
          util.log("Updating markdown TOC in editor",'updateElement',1)
          markdownTOC();
        }
        return true;
      } else {
        util.log("Header Markdown character changed.",'general',1);
        return false;
      }
    } else {
      found = false;
      util.log("Header line changed to no longer be header.",'updateElement',1);
      return false;
    }
  }

  if (updateElement.hs) {
    var hs = updateElement.hs;
  } else {
    startHeader = util.tic();
    var hs = $('h1,h2,h3,h4,h5,h6'); // Faster than $(':header');
    util.toc(startHeader,'ms to extract header elements');
  }

  startHeader = util.tic();
  var start, stop;
  var startSection, stopSection;
  var dl = e.action === "insert" ? elf - elo : elo - elf;
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
      var stop = parseInt($(hs[0]).attr('lo'));
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
      stopSection = 0;
    }
  }
  if (dl > 0 && elo == 1 && start == 1) {
    util.log("Edit created 0th section",'updateElement',2);
    startSection = 0;
    stopSection = 0;
    slo = elo;
  }

  if (stopSection != 0) {
    if (startSection != 0) {
      var startSection = 0;
    }
    var stopSection = hs.length;
    var slo = 1; // Initial section line
    var slf = editor.session.getLength() - dl + 1; // Final section line
    var start, stop;
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

  util.toc(startHeader,'ms to find header boundaries');

  util.log("Section # start/end of edit: " + startSection + "/" + stopSection,
      'updateElement', 1);
  util.log("Affected sections lines start/end: " + slo + "/" + slf,'updateElement', 1);

  var sameSection = startSection == stopSection;

  if (!sameSection) { 
    util.log("Edit affects multiple sections.",'updateElement', 1);
    return false;
    // TODO: Find sections of edit and update those sections.
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
      p_indent_prev = editor.session.getLines(lo_prev-1, lo_prev-1)[0].startsWith(" ");
    }
    var p_indent = $(lo_els[i]).text().startsWith(" ");
    var d = p_indent && p_indent_prev ? 1 : 0;

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
    util.log("#" + i + ": lo = " + lo + "; lf = " + lf + "; dl = " + dl
      + "; elo = " + elo + "; elf = " + elf
      + "; lf_last = " + lf_last + "; lo_next = " + lo_next
      ,'updateElement',1);

    if (i == 0 && elo < lo) {
      if (elf < lo + dl) {
        var next = needNext(lo_els, 0, elf);
        util.log('  Start/stop before ' + (i) + '; Need next: ' + next,
            'updateElement',2); 
        if (next) {
          stopParse = dl + parseInt($(lo_els[0]).attr('lf'));
          changedElements.push(0);
        } else {
          stopParse = dl + elf;
        }
        insertAfter = -1;
      } else {
        changedElements.push(0);
      }
    }

    if (elo >= lo && elf <= lf + Math.abs(dl)) {
      var previous = needPrev(lo_els, i-1, elo, true);
      util.log('  Start inside ' + (i) + '; Need previous: ' 
          + previous,'updateElement',2); 
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
      util.log('  Start after ' + (i) + '; Need previous: ' 
          + previous,'updateElement',2);
      if (previous) {
        startParse = parseInt($(lo_els[i]).attr('lo'));
        changedElements.push(i);
      } else {
        startParse = elo;
      }
      insertAfter = i;
    }
    if ( (dl > 0 && elf >= lo + dl && elf <= lf + dl)
      || (dl <= 0 && elf >= lo && elf <= lf ) ) {
      var next = needNext(lo_els, i+1, elf);
      util.log('  End inside ' + (i) + '; Need next: ' + next,'updateElement',2);
      changedElements.push(i);
      if (next) {
        stopParse = dl + parseInt($(lo_els[i+1]).attr('lf'));
        changedElements.push(i+1);
      } else {
        stopParse = dl + lf;
        if (dl < 0 && stopParse < dl + elf) {
          stopParse = dl + elf;
        }
      }
    }
    if ( (dl >= 0 && elf - dl > lf && elf - dl < lo_next)
      || (dl < 0 && elf > lf && elf < lo_next)) {
      var next = needNext(lo_els, i+1, elf);
      var prev = needPrev(lo_els, i, elf);
      util.log('  End after ' + (i) 
          + '; Need next: ' + next
          + '; Need prev: ' + prev
          ,'updateElement',2);
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
        //console.log("adding current")
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

  util.log(  "startParse = " + startParse 
      + "; stopParse = " + stopParse
      + "; changedElements = [" + changedElements.join(",") + "]"
      + "; affectedElements = [" + affectedElements.join(",") + "]"
      + "; insertAfter = " + insertAfter 
      ,'updateElement', 1);

  util.toc(startTime,'ms to find elements to modify');
  startTime = util.tic();

  var result = {
                  "startSection": startSection,
                  "stopSection": stopSection,
                  "insertAfter": insertAfter,
                  "startParse": startParse,
                  "stopParse": stopParse,
                  "changedElements": changedElements
                };

  updateElement.result = result;

  var parsedText = editor.session
                      .getLines(startParse-1, stopParse-1).join("\n");

  util.log("Lines to be parsed have text:",'updateElement',3);
  util.log(parsedText,'updateElement',3);

  var opts = {'startLineNumber': startParse,
              'debug': app['logLevel_']['marked']};

  parsedText = preprocessMD(parsedText);                 
  var html = marked(parsedText, opts);
  if (!sameSection) { 
    console.log(html);
  }
  if (/div class='section'/.test(html)) {
    util.log('Edit added section.','updateElement',1);
    //console.log(html)
    return false;
  }

  html = $("<div>" + html + "</div>").html();
  //var htmlDOM = $.parseHTML("<div>" + html + "</div>");
  var htmlDOM = $.parseHTML(html);
  //console.log($(htmlDOM).html());
  $(htmlDOM).find('[lo]').addClass('added');
  //console.log($(htmlDOM).html());
  if (changedElements.length == 0) {
    util.log("No changed elements.",'updateElement', 1);
    if (insertAfter >= 0) {
      util.log("Inserting after element " + insertAfter,'updateElement',1);
      $(lo_els[insertAfter]).parent().after(htmlDOM);
      updateLineNumbers(stopParse, dl);
      return true;
    } else {
      util.log("Prepending to section.",'updateElement',1);
      var section = $('#display > .section')
                      .slice(startSection, startSection+1);
      $(section).prepend(htmlDOM);
    }
  } else {
    util.log("Replacing element " + changedElements[0],'updateElement',1);
    //console.log($(lo_els[changedElements[0]]).parent().html())
    $(lo_els[changedElements[0]]).parent().replaceWith(htmlDOM);
  }

  if (affectedElements.length > 0) {
    for (var i = 1; i < affectedElements.length; i++) {
      util.log("Removing element " + affectedElements[i],'updateElement',1);
      $(lo_els[affectedElements[i]]).parent().remove();
    }
  }
  util.toc(startTime, 
          'ms to get lines, render, and replace element(s) associated '
        + 'with lines ' + startParse + "-" + stopParse);

  startTime = util.tic();

  util.log("Updating line numbers with stopParse = " 
      + stopParse + "; dl = " + dl,'updateElement',1);
  updateLineNumbers(stopParse, dl);

  return true;
}
