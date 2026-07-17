function tocMarkdownTest(t) {

    var editor = ace.edit("editor");

    var testjson = 
        [
           {
              edit: 
                function () {
                  if ($('#markdownTOC').is(':checked')) {
                    $('#markdownTOC').click();
                  }
                  $('#markdownTOC').click();
                  editor.setValue("");
                  editor.session.doc.insertFullLines(0,["#","##","##"]);
                },
              description: "Insert/Remove Markdown TOC should give same #display headers.",
              domTest:
                function () {

                  function check(h) {
                    let pass = '1' == $(h[0]).find('.hnumber').text()
                    pass = pass && '1.1' == $(h[1]).find('.hnumber').text()
                    pass = pass && '1.2' == $(h[2]).find('.hnumber').text()
                    return pass;                            
                  }
                  let pass = true;

                  let h = $('#display :header');
                  pass = check(h);
                  htext1 = $(h[0]).find('.htext').text();
                  htext2 = $(h[1]).find('.htext').text();
                  htext3 = $(h[2]).find('.htext').text();
                  h = $('#display :header');
                  pass = pass && check(h);
                  $('#markdownTOC').click();
                  h = $('#display :header');
                  pass = pass && check(h);
                  //console.log("htext1 = '" + htext1 + "'")
                  //console.log("htext1 = '" + $(h[0]).find('.htext').text() + "'");
                  pass = pass && htext1 == $(h[0]).find('.htext').text();
                  pass = pass && htext2 == $(h[1]).find('.htext').text();
                  pass = pass && htext3 == $(h[2]).find('.htext').text();
                  return pass;
                }
            },
            {
              edit: 
                function () {
                    if ($('#markdownTOC').is(':checked')) {
                      $('#markdownTOC').click();
                    }
                    editor.setValue("");
                    editor.session.doc.insertFullLines(0,["# A","# 3 B"]);
                },
              description: "Insert/Remove Markdown when section headings in editor have numbers.",
              domTest: 
                function () {
                  let h;
                  let pass = true;
                  $('#markdownTOC').click();
                  h = $('#display :header');
                  pass = pass && 'A' == $(h[0]).find('.htext').text()
                  pass = pass && '3 B' == $(h[1]).find('.htext').text()

                  content = [mdTOCStart(true), '[1 A](#1-a)<br/>', '[2 3 B](#2-3-b)', mdTOCEnd(true), '# 1 A', '# 2 3 B', ''];
                  pass = pass && editor.getValue() === content.join("\n");
                  return pass;
                }
            },
            {
              edit: 
                function () {
                    if ($('#markdownTOC').is(':checked')) {
                      $('#markdownTOC').click();
                    }
                    editor.setValue("");
                    editor.session.doc.insertFullLines(0,["# A"]);
                    setTimeout(() => $('#markdownTOC').click(),0);
                },
              description: "Added numbers in editor should be removed.",
              domTest: 
                function () {
                  let pass = true;
                  setTimeout(() => $('#markdownTOC').click(),0);
                  let h = $('#display :header');
                  pass = pass && "# A\n" == editor.getValue();
                  pass = pass && '1' === $(h[0]).find('.hnumber').text();
                  pass = pass && 'A' === $(h[0]).find('.htext').text();
                  return pass;
                }
            }
        ]

    test(testjson,t);

}