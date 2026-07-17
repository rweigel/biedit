function markdownTOC(remove) {

  if (!remove) {
    remove = false;
  }

  let startTime = util.tic();

  var level = [0,0,0,0,0,0];
  var toc = "";
  var text = "";
  var anchor = "";
  var item = "";
  var space = " ";
  var line = "";
  var pad = "";
  var number = "";
  var lines = [];
  var hnumbers = [];
  var htexts = [];
  var numbers = [];
  var titles = [];
  var style = app['TOC']['markdown']['style'];
  if (style.startsWith('numbered-custom')) {
    var space = "&nbsp;";
    var htmlnewline = "<br/>\n";
  }

  var editor = ace.edit("editor");

  util.log("Finding :header elements in #display.",'markdownTOC',1);
  var headers = $('#display :header');
  util.log(`Found ${headers.length} :header elements in #display.`,'markdownTOC',1);

  util.log("Building Markdown TOC string.","markdownTOC",1);
  for (var i = 0; i < headers.length; i++) {
    for (var l = 1; l < 7; l++) {
      if ($(headers[i]).is('h' + l)) {
        level[l-1] += 1;

        // Line number of header
        line = $(headers[i]).attr('lo');
        lines.push(line);

        // Number of header, e.g., 1.1
        number = $(headers[i]).find('a').first().attr('number');
        util.log("Found in #display with lo " + line + ": a[number] = '" + number + "'",'markdownTOC',2);
        numbers.push(number);

        hnumber = $(headers[i]).children().find('.hnumber').first().text().trim();
        util.log("Found in #display with lo " + line + ": .hnumber = '" + hnumber + "'",'markdownTOC',2);
        hnumbers.push(hnumber);

        htext = editor.session.getLine(parseInt(line)-1);
        //console.log(htext)
        //console.log(level)
        //htext = htext.slice(l+1);
        //util.log("Found in #editor: heading text = '" + htext + "'",'markdownTOC',2);

        htext= $(headers[i]).children().find('.htext').first().text().trim();
        util.log("Found in #display with lo " + line + ": .htext = '" + htext + "'",'markdownTOC',2);
        htexts.push(htext);
        title = htext;
        if (htext.startsWith(number + " ")) {
          re = new RegExp("^" + number + " ");
          title = title.replace(re,"");
        }
        titles.push(title);

        pad = "";
        if (l > 1) {
          pad = space.repeat(("" + level[l-2]).length - 1);
        }

        if (style === "bullets") {
          item = space.repeat(3*(l-1)) + pad + "*";
        } else {
          if (style === 'numbered-custom-0') {
            item = space.repeat(3*(l-1)) + pad + level[l-1] + "\\.";
          } else {
            item = space.repeat(3*(l-1));// + pad + number.replace(/\./,"\\.");
          }
        }
        if (number.length > 0 && title.length > 0 ) {
          number = number + " ";
        }

        anchor = "#" + slug(title, number);

        // Create TOC entry with link
        if (i == 0 && style.startsWith('numbered-custom')) {
          toc = toc + item + "[" + number + title + "](" + anchor + ")";
        } else {
          toc = toc + htmlnewline + item + "[" + number + title + "](" + anchor + ")";
        }

        // Set all levels after to zero
        for (j = l; j < 7; j++) {
          level[j] = 0;
        }

      }
    }
  }
  util.log("Built Markdown TOC string.","markdownTOC",1);

  var Range = require('ace/range').Range

  var cursorPos = editor.getCursorPosition();
  util.log(`Current cursor position: row = ${cursorPos.row}, col = ${cursorPos.column}`,'markdownTOC',1);

  if (toc.length == 0) {
    toc = mdTOCStart() + "\n" + mdTOCEnd() + "\n";
  } else {
    toc = mdTOCStart() + "\n" + toc + "\n" + mdTOCEnd() + "\n";
  }

  var nRows = toc.split("\n").length - 1;
  if (remove == false) {
    util.log("New number of TOC rows: " + nRows,'markdownTOC',1);
    util.log('New TOC:\n'+toc,'markdownTOC',2);
  }

  // Modify header lines in Markdown file to include numbers.
  var heading = "";
  var modified = false;
  util.log("Modifying header lines in #editor and #display",'markdownTOC',1);

  for (var i = 0; i < numbers.length; i++) {
    if (remove == true) {
      lines[i] = parseInt(lines[i]);
    } else {
      lines[i] = parseInt(lines[i]);
    }
    heading = editor.session.getLine(lines[i]-1);
    console.log(lines)
    console.log(heading)
    heading_parts = heading.split(/\s/);
    console.log(heading_parts)
    var rng = new Range(lines[i] - 1, heading_parts[0].length + 1,lines[i] - 1, heading.length + 1); 
    console.log(rng)
    if (remove == true) {
      //continue;
      //heading = editor.session.getLine(lines[i]);
      //heading_parts = heading.split(/\s+/);
      //console.log("heading = '" + heading + "'");
      //console.log(heading_parts[1] == numbers[i])
      console.log(heading_parts)
      console.log(numbers[i])
      if (heading_parts[1] === numbers[i]) {
        util.log("Modifiying header on line " + lines[i] + " in #editor from: '" + heading + "'.",'markdownTOC',2);        heading = "";
        if (heading_parts.length >= 2) { 
          heading = heading + heading_parts.slice(2).join(" ");
        }
        util.log("to '" + heading + "'",'markdownTOC',2);
        console.log(rng)
        editor.session.replace(rng, heading);
        if (parseInt(lines[i]) == cursorPos.row + 1) {
          if (cursorPos.column > heading_parts[0].length + numbers[i].length) {
            util.log("Updating cursor position column.",'markdownTOC',1);
            // -1 for space after number
            cursorPos.column = cursorPos.column - numbers[i].length - 1;
          }
        }
      } else {
        util.log("Not modifying '" + heading + "' on line " + lines[i] + " in #editor.",'markdownTOC',2);
      }
    } else {
      var editorNeedsUpdate = false;
      var displayNeedsUpdate = false;
      util.log("Heading parts: " + heading_parts,'markdownTOC',2);

      if (heading_parts.length == 1) {
        editorNeedsUpdate = true;
        util.log("Heading '" + heading + "' in #editor does not have text. Modification needed.",'markdownTOC',2);        
        heading = " " + numbers[i] + heading;
      } else if (heading_parts[1] !== numbers[i]) {
        util.log("Heading '" + heading + "' in #editor does not have correct number. Modification needed.",'markdownTOC',2);
        editorNeedsUpdate = true;
        if (parseInt(lines[i]) == cursorPos.row + 1) {
          if (cursorPos.column >= heading_parts[0].length) {
            util.log("Updating cursor position column.",'markdownTOC',1);
            // +1 for space after number
            cursorPos.column = cursorPos.column + numbers[i].length + 1;
          }
        }
        heading = numbers[i] + " " + titles[i];
      }

      if (editorNeedsUpdate) {
        modified = true;
        util.log("Modifiying header text on line " + lines[i] + " in editor from: '" + heading_parts.slice(1).join(" ") + "'.",'markdownTOC',2);
        util.log("to '" + heading + "'",'markdownTOC',2);
        editor.session.replace(rng, heading);
      } else {
        util.log("Heading '" + heading + "' in #editor does not need update",'markdownTOC',2);
      }

      if (htexts[i] !== titles[i]) {
        util.log(".htext '" + htexts[i] + "' in #display does not have correct htext. Modification needed.",'markdownTOC',2);        
        displayNeedsUpdate = true;
      }
      if (!editorNeedsUpdate && displayNeedsUpdate) {
        let el = $('#display [lo="' + lines[i] + '"]').first();
        let level = parseInt(el.prop('nodeName').replace('H',''));
        updateHeaderElement(el, heading);
      }
    }
  }
  util.log("Modified header lines in #editor and #display",'markdownTOC',1);

  if (editorNeedsUpdate) {
    util.log("One or more heading lines #editor were updated. Need to regenerate TOC in editor.",'markdownTOC',2);
    // TODO: In this case, we don't need to check #display or #editor,
    // only regeneration of the TOC string for editor is needed. Pass
    // flag to 
    markdownTOC();
    return;
  }
  // TODO: See if possible to mark section of editor as
  // read-only. Could also watch for edits of TOC lines
  // in editor and then update body of markdown document.

  function tocStartEnd() {
    var a = editor.find(mdTOCStart());
    var b = editor.find(mdTOCEnd());
    let start = null;
    if (a) {
      start = a.start.row;
    }
    let end = null;
    if (b) {
      end = b.start.row;
    }
    return {"start": start, "end": end};  
  }

  function getTOC() {
    let se = tocStartEnd();
    if (se.start && se.end) {
      return editor.session.getLines(se.start, se.end);
    }
    return null;
  }
  // TODO: Check a and !b and !a and b.
  // TODO: Catch case that user deletes or edits TOC.
  //       If delete, ask if no TOC wanted.
  //       If edit, state direct TOC edits not allowed;
  //       copy content out of TOC section and then edit.
  // TODO: Figure out how to prevent scroll when find,
  //       remove, and insert operations are executed.
  let se = tocStartEnd();
  if (se.start !== null && se.end !== null) {
    util.log("Existing Markdown TOC starts on line " + (se.start+1),'markdownTOC',1)
    var rng = new Range(se.start, 0, se.end + 1, 0);
    util.log(`Removing existing Markdown TOC in line range ${rng.start.row+1}-${rng.end.row+1}`,'markdownTOC',1);
    editor.session.remove(rng);
    if (remove) {
      delta = se.start - se.end - 1;
    } else {
      delta = nRows - (se.end - se.start) - 1;
    }
  } else {
    delta = nRows;
    util.log("Markdown TOC not found",'markdownTOC',1);
  }

  let ro = 0;
  if (se.start) {
    ro = se.start;
  }

  if (remove == false) {
    util.log("Inserting new Markdown TOC.",'markdownTOC',1);
    editor.session.insert({row: ro, column: 0}, toc);
  }

  util.log("Lines added or removed: " + delta,'markdownTOC',1);
  util.log("Moving cursor back to original position",'markdownTOC',1);
  // TODO: If cursor on header row, this should account for column shift
  // due to insertion of number.
  editor.gotoLine(cursorPos.row + delta + 1, cursorPos.column);

  var el = '[lo=' + (ro+1) + ']';
  var b = editor.find(mdTOCEnd());
  if (b) {
    util.log("Wrapping TOC elements", 'markdownTOC',1);
    let rf = b.start.row;
    $('[lo=' + (rf+1) + ']').closest('.section').wrapAll('<div class="md-toc"></div>')
  }

  util.toc(startTime,'to create or modify Markdown TOC in #display and #editor.');

  return modified;
}
