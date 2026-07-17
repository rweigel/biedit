function latexViewer(latex, id) {

  if (!latexViewer[id]) {
    util.log(`Creating latexViewer with id = ${id}`,'latexViewer',1)
    latexViewer[id] = ace.edit(id);
    latexViewer[id].getSession().setMode('ace/mode/html');
  } else {
    util.log(`Updating latexViewer with id = ${id}`,'latexViewer',1)    
  }

  latexViewer[id] = ace.edit(id);
  latexViewer[id].getSession().setMode('ace/mode/latex');
  latexViewer[id].session.setUseWrapMode(true);
  latexViewer[id].renderer.once('afterRender', function() {
    let interval = setInterval( () => {
      let begin = latexViewer[id].find({'needle': '\\begin{document}'});
      if (begin) {
        clearInterval(interval);
        let row = begin.start.row;
        util.log(`Found active element on line ${row}`,'latexViewer',1)
        setTimeout(() => {latexViewer[id].gotoLine(row+1, 0, true);},0);          
      } 
    }, 1)
  })
  latexViewer[id].setValue(latex);
  latexViewer[id].clearSelection();
  latexViewer[id].setReadOnly(true);
  //latexViewer.resize();
  //$("#"+id).show();
  //$(window).trigger('resize');
}

function htmlViewer(html, id) {

  if (!htmlViewer[id]) {
    util.log(`Creating htmlViewer with id = ${id}`,'htmlViewer',1)
    htmlViewer[id] = ace.edit(id);
    htmlViewer[id].getSession().setMode('ace/mode/html');
  } else {
    util.log(`Updating htmlViewer with id = ${id}`,'htmlViewer',1)    
  }

  htmlViewer[id].renderer.once('afterRender', function() {
    clearInterval(htmlViewer.interval);
    util.log("afterRender event.",'htmlViewer', 1);
    util.log("Looking for <head>",'htmlViewer', 1);
    let doc = html.split("\n");
    for (var i = 0; i < doc.length; i++) {
      if (doc[i].trim() == "<head>") {
        util.log(`Found <head> on line ${i+1}.`, 'htmlViewer', 1);
        // Does not always work when page is loaded with html in right view.
        // It seems that afterRender is triggered before elements in DOM
        // are inserted.
        if ($('.ace_fold-widget').length > 0) {
          util.log("Fold widget found. Toggling fold state on <head> element.", 'htmlViewer', 1);
          htmlViewer[id].session.$toggleFoldWidget(i, {})
          break;
        } else {
          util.log("Fold widget not found.", 'htmlViewer', 1);
          // TODO: Add mutation observer to detect when DOM elements inserted.
          // For now, this works.
          let n = 0;
          util.log("Setting interval.", 'htmlViewer', 1);
          htmlViewer.interval = setInterval( () => {
            n = n+1;
            util.log(n + " Waiting for fold widget to be inserted into DOM", 'htmlViewer', 1);
            if (n == 5) {
              util.log(`Clearing interval after ${n} tries.`,'htmlViewer',1);
              clearInterval(htmlViewer.interval);
              return;
            }
            if ($('.ace_fold-widget').length > 0) {
              util.log("Fold widget inserted. Toggling fold state on <head> element.", 'htmlViewer', 1);
              htmlViewer[id].session.$toggleFoldWidget(i, {});
              clearInterval(htmlViewer.interval);
            }
          }, 10)
          break;
        }
      }
    }
  })

  //$("#" + id).show();
  htmlViewer[id].setValue(html);
  htmlViewer[id].clearSelection();
  htmlViewer[id].setReadOnly(true);
  //$(window).trigger('resize');
  //$("#" + id).css('height',$('#editor').css('height'));

  // TODO: Need a regex to replace class="active" in case
  // a new class is added.
  util.log("Looking for active element in HTML",'htmlViewer',1)
  var active = htmlViewer[id].find({'needle': 'class="active"'});
  if (active) {
    row = active.start.row;
    util.log(`Found active element on line ${row}`,'htmlViewer',1)
    htmlViewer[id].gotoLine(row+1, 0, true);
    setTimeout(() => {htmlViewer[id].gotoLine(row+1, 0, true);},0);
    //setTimeout(() => {htmlViewer[id].gotoLine(parseInt(row), 0, true);},0);
  } else {
    util.log("No active element in DOM to scroll to in html viewer.",
        'htmlViewer',1)
  }
}