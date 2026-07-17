function updateElementTest(t) {

    let editor = ace.edit("editor");

    let testjson = 
        [
           {
              edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a"]);
                      },
              description: "Insert paragraph and newline at start of document.",
              updateElementExpected: {
                    startSection: 0,
                    stopSection: 0,
                    startParse: 1,
                    stopParse: 2,
                    affectedElements: [],
                    changedElements: [],
                    insertAfter: -1                
                }
          },
          {
            edit: function () {
                        editor.setValue("");
                        editor.session.insert({row: 0, column: 0}, "b");
                    },
            description: "Insert character on first row and first column of document.",
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 1,
                stopParse: 1,
                changedElements: [],
                insertAfter: -1
            }
          },
          {
            edit: function () {
                      editor.setValue("");
                      editor.session.doc.insertFullLines(0,["a",""]);
                      editor.session.doc.insertFullLines(2,["b"]);
                    },
            description: "Add paragraph two lines after first paragraph. Added paragraph at end of document, existing paragraph starts on first line.",
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 3,
                stopParse: 4,
                changedElements: [],
                insertAfter: 0
            }
          },
          {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["b"]);
                        editor.session.doc.insertFullLines(0,["a",""]);
                    },
            description: "Insert line and newline before start of existing paragraph.",
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 1,
                stopParse: 3,
                changedElements: [0],
                insertAfter: null
            }
          },
          {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["","","b"]);
                        editor.session.insert({row: 0, column: 0}, "1");
                    },
            description: "Insert paragraph starting on first line and two lines before existing paragraph.", 
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 1,
                stopParse: 1,
                changedElements: [],
                insertAfter: -1
            }
          },
          {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","",""]);
                        editor.session.insert({row: 2, column: 0}, "b");
                    },
            description: "Start paragraph two lines after existing paragraph.",
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 3,
                stopParse: 3,
                changedElements: [],
                insertAfter: 0
            }
          },
          {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","",""]);
                        editor.session.insert({row: 2, column: 0}, "b");
                        editor.session.insert({row: 2, column: 1}, "c");
                    },
            description: "Add to existing paragraph on new line.",
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 3,
                stopParse: 3,
                changedElements: [1],
                insertAfter: null
            }
          },
          {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","","c"]);
                        editor.session.insert({row: 1, column: 0}, "b");
                    },
            description: "Add character at start of line between existing paragraphs.",
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 1,
                stopParse: 3,
                changedElements: [0,1],
                insertAfter: null
            }
          },
          {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a",""]);
                        editor.session.insert({row: 1, column: 0}, "* b");
                    },
            description: "Add ul after existing paragraph.",
            _comment: "Re-parse of existing paragraph is not needed, but don't know this until new content is parsed.",
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 1,
                stopParse: 2,
                changedElements: [0],
                insertAfter: null
            }
          },
          {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","",""]);
                        editor.session.insert({row: 2, column: 0}, "* b");
                    },
            description: "Start ul two lines after end of paragraph.",
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 3,
                stopParse: 3,
                changedElements: [],
                insertAfter: 0
            }
          },
          {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","","* b"]);
                        editor.session.insert({row: 2, column: 3}, "c");
                    },
            description: "Add to ul when paragraph element before it.",
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 3,
                stopParse: 3,
                changedElements: [1],
                insertAfter: null
            }
          },
          {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","","* b"]);
                        editor.session.insert({row: 1, column: 0}, "c");
                    },
            description: "Add to paragraph when ul element starts on next line.",
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 1,
                stopParse: 3,
                changedElements: [0,1],
                insertAfter: null
            }
          },
          {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["* a","","    b","",""]);
                        editor.session.insert({row: 4, column: 0}, "c");
                    },
            description: "Add to paragraph when ul ends two lines before.",
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 1,
                stopParse: 5,
                changedElements: [0],
                insertAfter: null
            }
          },
          {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["* a","","    b","","",""]);
                        editor.session.insert({row: 5, column: 0}, "c");
                    },
            description: "Add to paragraph when ul ends two lines before.",
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 6,
                stopParse: 6,
                changedElements: [],
                insertAfter: 0
            }
          },{
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a",""]);
                        editor.session.insert({row: 1, column: 0}, "* b");
                        editor.session.insert({row: 1, column: 3}, "c");
                    },
            description: "Modify ul that starts after a paragraph.",
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 2,
                stopParse: 2,
                changedElements: [1],
                insertAfter: null
            }
          },
          {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","b"]);
                        editor.session.doc.insertFullLines(3,["c","d"]);
                        editor.session.doc.removeFullLines(2,2)
                    },
            description: "Remove line between paragraph",
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 1,
                stopParse: 4,
                changedElements: [0,1],
                insertAfter: null
            }
          },
          {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","b"]);
                        editor.session.doc.insertFullLines(2,["c","d"]);
                        editor.session.doc.insertFullLines(2,[""]);
                    },
            description: "Add newline inside paragraph",
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 1,
                stopParse: 5,
                changedElements: [0],
                insertAfter: null
            }
          },
          {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","b"]);
                        editor.session.doc.insertFullLines(2,["c","d"]);
                        editor.session.doc.insertFullLines(2,["",""]);
                    },
            description: "Add two newlines inside paragraph",
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 1,
                stopParse: 6,
                changedElements: [0],
                insertAfter: null
            }
          },
          {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","b","","c","d"]);
                        editor.session.doc.removeFullLines(5,5)
                    },
            description: "Remove line at end of document.",
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 4,
                stopParse: 5,
                changedElements: [1],
                insertAfter: null
            }
          },
          {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","b"]);
                        editor.session.doc.insertFullLines(2,["c","d"]);
                        editor.session.doc.insertFullLines(2,["",""]);
                        editor.session.doc.removeFullLines(2,3)
                    },
            description: "Remove two newlines inside paragraph",
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 1,
                stopParse: 4,
                changedElements: [0,1],
                insertAfter: null
            }
          },
          {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","b","","","","","","c","d"]);
                        editor.session.doc.removeFullLines(4,4)
                    },
            description: "Remove empty line between paragraphs not affected by edit.",
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 5,
                stopParse: 5,
                changedElements: [],
                insertAfter: 0
            }
          },
          {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","","b"]);
                        editor.setValue("");
                    },
            description: "Delete two elements starting after element.",
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 1,
                stopParse: 1,
                changedElements: [0,1],
                insertAfter: null
            }
          },
          {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","b","c", "", "d","e","f"]);
                        editor.session.doc.removeFullLines(2,6);
                    },
            description: "Delete affects two element and starts after last element.",
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 1,
                stopParse: 3,
                changedElements: [0,1],
                insertAfter: null
            }
          },
          {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","b","c", "", "d","e","f"]);
                        editor.session.doc.removeFullLines(2,7);
                    },
            description: "Delete affects two elements and starts after last element.",
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 1,
                stopParse: 2,
                changedElements: [0,1],
                insertAfter: null
            }
          },
          {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["","","a","","", "b", ""]);
                        editor.session.doc.removeFullLines(1,4);
                    },
            description: "Delete starts before first element.",
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 1,
                stopParse: 2,
                changedElements: [0,1],
                insertAfter: null
            }
          },
          {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["* a","* b","# A","a"]);
                    },
            description: "Section without space before list",
            domTest: function () {
                    return $('#display').find('li').length == 2;
                },
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 1,
                stopParse: 5,
                changedElements: [],
                insertAfter: -1
            }
          },
          {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["* a","","* b","","* c"]);
                    },
            description: "List with blank lines between elements",
            domTest: function () {
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
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 1,
                stopParse: 6,
                changedElements: [],
                insertAfter: -1
            }
        },
        {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["1. a","","b","","  c"]);
                        editor.session.insert({row: 2, column: 0}, "  ");
                    },
            description: "Indented paragraph becomes part of list along with next indented paragraph.",
            updateElementExpected: {
                startSection: 0,
                stopSection: 0,
                startParse: 1,
                stopParse: 5,
                changedElements: [0,1,2],
                insertAfter: null
            }
        },
        {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","```","","a","","","b","",""]);
                        editor.session.insert({row: 9, column: 0}, "");
                        editor.session.insert({row: 11, column: 0}, "```");
                    },
            description: "Adding closing fences 1.",
            updateElementExpected: {
                reparseDocument: true
            }
        },
        {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["a","","","a","","","b","","","```"]);
                        //editor.session.insert({row: 1, column: 0}, "```");
                    },
            description: "Adding closing fences 2.",
            updateElementExpected: {
                reparseDocument: true
            }
        },
        {
            edit: function () {
                        editor.setValue("");
                        editor.session.doc.insertFullLines(0,["# a","","b"]);
                        editor.session.doc.removeFullLines(0,2);
                    },
            description: "Last line of edit removes section header.",
            updateElementExpected: {
                reparseDocument: true
            }
        }
    ];

    test(testjson,t);
}