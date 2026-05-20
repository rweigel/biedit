highlight.html uses code described at

https://peoplesoftmods.com/tips-and-tricks/peoplecode-syntax-highlighting-in-ace-editor

and available from

https://jsfiddle.net/coltonfischer/fr5h63ha/

and

https://github.com/coltonfischer/PeopleCode-Ace-Editor

mode-people_code_modified.js is an attempt to import markdownhighlight rules (so they can be modified).

The objective was to allow code blocks that matched `javascript-*` to be still highlighted as javascript.

I have concluded that in order to do this, one needs to modify the Markdown code in the source code for ace (in dir `ace/lib/ace/mode`) and then build.

