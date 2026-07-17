function updateElementTest(t) {

    var testjson = 
        [
           {
              _edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a"]);
                      },
            _description: "Insert paragraph and newline at start of document.",
            startSection: 0,
            stopSection: 0,
            startParse: 1,
            stopParse: 2,
            changedElements: [],
            insertAfter: -1
          },
          {
            _edit: function () {
                        editor.setValue("");
                        editor.session.insert({row: 0, column: 0}, "b");
                    },
            _description: "Insert character on first row and first column of document.",
            startSection: 0,
            stopSection: 0,
            startParse: 1,
            stopParse: 1,
            changedElements: [],
            insertAfter: -1
          },
          {
            _edit: function () {
                      editor.setValue("");
                      editor.session.doc.insertFullLines(0,["a",""]);
                      editor.session.doc.insertFullLines(2,["b"]);
                    },
            _description: "Add paragraph two lines after first paragraph. Added paragraph at end of document, existing paragraph starts on first line.",
            startSection: 0,
            stopSection: 0,
            startParse: 3,
            stopParse: 4,
            changedElements: [],
            insertAfter: 0
          },
          {
            _edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["b"]);
                        editor.session.doc.insertFullLines(0,["a",""]);
                    },
            _description: "Insert line and newline before start of existing paragraph.",
            startSection: 0,
            stopSection: 0,
            startParse: 1,
            stopParse: 3,
            changedElements: [0],
            insertAfter: null
          },
          {
            _edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["","","b"]);
                        editor.session.insert({row: 0, column: 0}, "1");
                    },
            _description: "Insert paragraph starting on first line and two lines before existing paragraph.", 
            startSection: 0,
            stopSection: 0,
            startParse: 1,
            stopParse: 1,
            changedElements: [],
            insertAfter: -1
          },
          {
            _edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","",""]);
                        editor.session.insert({row: 2, column: 0}, "b");
                    },
            _description: "Start paragraph two lines after existing paragraph.",
            startSection: 0,
            stopSection: 0,
            startParse: 3,
            stopParse: 3,
            changedElements: [],
            insertAfter: 0
          },
          {
            _edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","",""]);
                        editor.session.insert({row: 2, column: 0}, "b");
                        editor.session.insert({row: 2, column: 1}, "c");
                    },
            _description: "Add to existing paragraph on new line.",
            startSection: 0,
            stopSection: 0,
            startParse: 3,
            stopParse: 3,
            changedElements: [1],
            insertAfter: null
          },
          {
            _edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","","c"]);
                        editor.session.insert({row: 1, column: 0}, "b");
                    },
            _description: "Add character at start of line between existing paragraphs.",
            startSection: 0,
            stopSection: 0,
            startParse: 1,
            stopParse: 3,
            changedElements: [0,1],
            insertAfter: null
          },
          {
            _edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a",""]);
                        editor.session.insert({row: 1, column: 0}, "* b");
                    },
            _description: "Add ul after existing paragraph.",
            _comment: "Re-parse of existing paragraph is not needed, but don't know this until new content is parsed.",
            startSection: 0,
            stopSection: 0,
            startParse: 1,
            stopParse: 2,
            changedElements: [0],
            insertAfter: null
          },
          {
            _edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","",""]);
                        editor.session.insert({row: 2, column: 0}, "* b");
                    },
            _description: "Start ul two lines after end of paragraph.",
            startSection: 0,
            stopSection: 0,
            startParse: 3,
            stopParse: 3,
            changedElements: [],
            insertAfter: 0
          },
          {
            _edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","","* b"]);
                        editor.session.insert({row: 2, column: 3}, "c");
                    },
            _description: "Add to ul when paragraph element before it.",
            startSection: 0,
            stopSection: 0,
            startParse: 3,
            stopParse: 3,
            changedElements: [1],
            insertAfter: null
          },
          {
            _edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","","* b"]);
                        editor.session.insert({row: 1, column: 0}, "c");
                    },
            _description: "Add to paragraph when ul element starts on next line.",
            startSection: 0,
            stopSection: 0,
            startParse: 1,
            stopParse: 3,
            changedElements: [0,1],
            insertAfter: null
          },
          {
            _edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["* a","","    b","",""]);
                        editor.session.insert({row: 4, column: 0}, "c");
                    },
            _description: "Add to paragraph when ul ends two lines before.",
            startSection: 0,
            stopSection: 0,
            startParse: 1,
            stopParse: 5,
            changedElements: [0],
            insertAfter: null
          },
          {
            _edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["* a","","    b","","",""]);
                        editor.session.insert({row: 5, column: 0}, "c");
                    },
            _description: "Add to paragraph when ul ends two lines before.",
            startSection: 0,
            stopSection: 0,
            startParse: 6,
            stopParse: 6,
            changedElements: [],
            insertAfter: 0
          },{
            _edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a",""]);
                        editor.session.insert({row: 1, column: 0}, "* b");
                        editor.session.insert({row: 1, column: 3}, "c");
                    },
            _description: "Modify ul that starts after a paragraph.",
            startSection: 0,
            stopSection: 0,
            startParse: 2,
            stopParse: 2,
            changedElements: [1],
            insertAfter: null
          },
          {
            _edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","b"]);
                        editor.session.doc.insertFullLines(3,["c","d"]);
                        editor.session.doc.removeFullLines(2,2)
                    },
            _description: "Remove line between paragraph",
            startSection: 0,
            stopSection: 0,
            startParse: 1,
            stopParse: 4,
            changedElements: [0,1],
            insertAfter: null
          },
          {
            _edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","b"]);
                        editor.session.doc.insertFullLines(2,["c","d"]);
                        editor.session.doc.insertFullLines(2,[""]);
                    },
            _description: "Add newline inside paragraph",
            startSection: 0,
            stopSection: 0,
            startParse: 1,
            stopParse: 5,
            changedElements: [0],
            insertAfter: null
          },
          {
            _edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","b"]);
                        editor.session.doc.insertFullLines(2,["c","d"]);
                        editor.session.doc.insertFullLines(2,["",""]);
                    },
            _description: "Add two newlines inside paragraph",
            startSection: 0,
            stopSection: 0,
            startParse: 1,
            stopParse: 6,
            changedElements: [0],
            insertAfter: null
          },
          {
            _edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","b","","c","d"]);
                        editor.session.doc.removeFullLines(5,5)
                    },
            _description: "Remove line at end of document.",
            startSection: 0,
            stopSection: 0,
            startParse: 4,
            stopParse: 5,
            changedElements: [1],
            insertAfter: null
          },
          {
            _edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","b"]);
                        editor.session.doc.insertFullLines(2,["c","d"]);
                        editor.session.doc.insertFullLines(2,["",""]);
                        editor.session.doc.removeFullLines(2,3)
                    },
            _description: "Remove two newlines inside paragraph",
            startSection: 0,
            stopSection: 0,
            startParse: 1,
            stopParse: 4,
            changedElements: [0,1],
            insertAfter: null
          },
          {
            _edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","b","","","","","","c","d"]);
                        editor.session.doc.removeFullLines(4,4)
                    },
            _description: "Remove empty line between paragraphs not affected by edit.",
            startSection: 0,
            stopSection: 0,
            startParse: 5,
            stopParse: 5,
            changedElements: [],
            insertAfter: 0
          },
          {
            _edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","","b"]);
                        editor.setValue("");
                    },
            _description: "Delete two elements starting after element.",
            startSection: 0,
            stopSection: 0,
            startParse: 1,
            stopParse: 1,
            changedElements: [0,1],
            insertAfter: null
          },
          {
            _edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","b","c", "", "d","e","f"]);
                        editor.session.doc.removeFullLines(2,6);
                    },
            _description: "Delete affects two element and starts after last element.",
            startSection: 0,
            stopSection: 0,
            startParse: 1,
            stopParse: 3,
            changedElements: [0,1],
            insertAfter: null
          },
          {
            _edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","b","c", "", "d","e","f"]);
                        editor.session.doc.removeFullLines(2,7);
                    },
            _description: "Delete affects two elements and starts after last element.",
            startSection: 0,
            stopSection: 0,
            startParse: 1,
            stopParse: 2,
            changedElements: [0,1],
            insertAfter: null
          },
          {
            _edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["","","a","","", "b", ""]);
                        editor.session.doc.removeFullLines(1,4);
                    },
            _description: "Delete starts before first element.",
            startSection: 0,
            stopSection: 0,
            startParse: 1,
            stopParse: 2,
            changedElements: [0,1],
            insertAfter: null
          },
          {
            _edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["* a","* b","# A","a"]);
                    },
            _description: "Section without space before list",
            _domCheck: function () {
              return $('#display').find('li').length == 2;
            },
            startSection: 0,
            stopSection: 0,
            startParse: 1,
            stopParse: 5,
            changedElements: [],
            insertAfter: -1
          },
          {
            _edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["* a","","* b","","* c"]);
                    },
            _description: "List with blank lines between elements",
            _domCheck: function () {
              var els = $('#display p[lo]');
              var check1 =  $(els[0]).attr('lo') === "1" &&
                            $(els[0]).attr('lf') === "2" &&
                            $(els[1]).attr('lo') === "3" &&
                            $(els[1]).attr('lf') === "4" &&
                            $(els[2]).attr('lo') === "5" &&
                            $(els[2]).attr('lf') === "6";
              var el = $('#display ul[lo]');
              var check2 = $(el[0]).attr('lo') === "1" && $(el[0]).attr('lf') === "5";
              return check1 && check2;
            },
            startSection: 0,
            stopSection: 0,
            startParse: 1,
            stopParse: 6,
            changedElements: [],
            insertAfter: -1
        },
        {
            _edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["1. a","","b","","  c"]);
                        editor.session.insert({row: 2, column: 0}, "  ");
                    },
            _description: "Indented paragraph becomes part of list along with next indented paragraph.",
            startSection: 0,
            stopSection: 0,
            startParse: 1,
            stopParse: 5,
            changedElements: [0,1,2],
            insertAfter: null
        }
    ];

    function equal(a, b) {
      if (a.length !== b.length) return false;
      for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    }

    var Nt = testjson.length;
    var singleTest = false;
    if (typeof(t) !== "undefined") {
      singleTest = true;
      testjson = [testjson[t]];
    }

    var pass;
    var status = [];
    for (var i = 0; i < testjson.length; i++) {
      if (!singleTest) {t = i};
      console.log("%cRunning test # " + (t+1) 
                  + "/" + Nt + " - "
                  + testjson[i]._description
                  ,'background: black; color: yellow');
      pass = test(testjson[i]);
      status.push(pass);
    }


    for (var i = 0; i < status.length; i++) {
      if (!singleTest) {t = i};
      if (status[i]) {
        console.log("%cTest # " + (t+1) + "/" + Nt + " passed.",
                    'background: black; color: yellow');
      } else {
        console.log("%cTest # " + (t+1) + "/" + Nt + " failed ("
                    + testjson[i]._description + ")",
                    'background: black; color: red');        
      }
    }

    function test(expected) {
      var pass = true;
      expected._edit(); // Execute edits
      var result = updateElement.result;

      if ("_domCheck" in expected) {
        result.domCheck = expected._domCheck();
        expected.domCheck = true;
      }
      for (var key of Object.keys(expected)) {
        if (key.startsWith("_")) continue;
        if (key === "changedElements") {
          if (!equal(result[key], expected[key])) {
            pass = false;
            console.log("%c Problem with changedElements:",
                        'background: red; color: white');
            //console.log(JSON.stringify(result, null, 4))
            console.log("Expected " + key 
                        + " = [" + expected[key].join(",") + "]");
            console.log("Found    " + key + " = ["
                        + result[key].join(",") + "]");
          }
        } else {
          if (expected[key] != result[key]) {
            pass = false;
            console.log("%c Problem with " + key + ":",
                        'background: red; color: white');
            //console.log(JSON.stringify(result, null, 4))
            console.log("Expected " + key + " = " + expected[key]);
            console.log("Found    " + key + " = " + result[key]);
          }
        }
      }
      return pass;
    }
}
