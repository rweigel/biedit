# To Do

1. setup.py
2. How to pull ace submodule

## Misc

1. Test using ids with `lo` to speed up `edit.js:editorChangeSelection()`.
2. DOM tests or at least set of steps.

## Equation and figure refs

*   Store last (sub)section #. On new (sub)section, re-set par, eqn, tbl, img.
*   Store par, eqn, tbl, img #
*   label = lastSection + "-" + number

On new section
1. update all labels.
2. update all refs.
3. update all inserts.

`\ref{eqn:1.1-1}` -> equation\~1.1 (1) eqn.\~1.1 (1), etc. Autodetect if "Eqn" already prefixes and if period or .) preceeds?

`\ins{par:1.1-1}` -> Inserts copy + label. Need to correct line numbers.

## Autocomplete

https://avcs.pro/autosuggest

## Collaborative editor

https://github.com/josephg/ShareJS

## Options

https://json-editor.github.io/json-editor/basic.html

## Drop-downs

https://github.com/anasterism/asterism-select#asterism-custom-select

## PDF TOC

* https://github.com/RussellLuo/pdfbookmarker
* https://stackoverflow.com/questions/12571905/finding-on-which-page-a-search-string-is-located-in-a-pdf-document-using-python
* https://github.com/MrRio/jsPDF/blob/master/src/modules/outline.js
* [Add TOC in PDF file](https://github.com/MrRio/jsPDF/blob/master/src/modules/outline.js)
* https://stackoverflow.com/questions/12571905/finding-on-which-page-a-search-string-is-located-in-a-pdf-document-using-python

## Markdown syntax

Custom Markdown syntax (look at how JOSS does it)

*   `#!` or `\title{}`
*   `#!!` Subtitle
*   `#!!!` Date (if empty, date is inserted)
*   `#!1` Author 1 | Affiliation 1-1, Affiliation 1-2,... | Email 1
*   `#!2` Author 2 | Affiliation 2-1, Affiliation 2-2,... | Email 1

* Heading IDs and Definition Lists -- see [Marked Issue](https://github.com/markedjs/marked/issues/1562#issuecomment-551269829) and https://www.markdownguide.org/extended-syntax/

Have option to alert user when file on disk changed when viewing web page.

## CORS

Use this code for a CORS/GitHub proxy (convert to Python). Then use Javascript in https://github.com/krispo/git-proxy

Better: https://requests-oauthlib.readthedocs.io/en/latest/examples/real_world_example.html

## CSS

Start paragraph with large letter: https://jsfiddle.net/fv5zc8n7/1/

## UI
1.  Noise background: https://jsfiddle.net/NuRwW/1/
1.  https://github.com/mar10/fancytree

## Editors

* https://betterprogramming.pub/my-favorite-cloud-ides-e6afaa94d96b
* VisualStudio SSH - run Visual Studio locall and connect via SSH. Requires ~500 MB and 2 CPU. Tended to hang ec2.
* Cloud9 - Failed to install on existing EC2. 
* https://www.totaljs.com/code/ and https://www.totaljs.com/superadmin/ - Did not have success installing. Code seems to be in a state where they help others get it installed and configured.
* Code-Server https://coder.com/docs/code-server/latest/guide Was not able to get running.

## Options

* Have button in editor to create custom global css and js. Save as `index.css` and `index.js`. Add direct links to them after the default css and js. Editor will need to check if these files exist.
* Have button in editor to create custom page-specific css and js. Save as `io.css` and `io.js`. Add direct links to them after the default css and js and after global css and js. Editor will need to check if these files exist.

1. `POST` should be `username=`, `password=`, `data=`, `push=true|false`.
1. If push conflict, create branch.
1. Save every `N` seconds if edits made. Send diffs.
1. If offline, warn. Check periodically for connection.
1. Allow `!#` URL notation like [MDWiki](https://github.com/Dynalon/mdwiki). If no server, work in browse mode.
1. If the request for is for `./`, show a recursive directory tree with `view` and `edit` links.
1.  What other SEO meta?
1.  If reading `dir1/dir2/file`, and `dir1/dir2/index.css` exists, use it. If not, use `dir1/index.css` if it exists, etc. `server.py` should insert a link to appropriate file below default CSS in `index.html`. Similar for `index.js`.

# Notes

## Git

*   https://github.com/creationix/js-github/blob/master/examples/readme-caps.js

## Resize elements

1.  https://jsfiddle.net/aguiguy/y2x7fdnu/
1.  https://split.js.org/#get-started 

## PDF

* Page number hack: https://gist.github.com/seripap/81241195e182b62adc3c87c27258f85
* https://www.pagedjs.org/
* https://medium.com/@Idan_Co/the-ultimate-print-html-template-with-header-footer-568f415f6d2a
* https://plnkr.co/edit/lWk6Yd?preview
* https://github.com/danfickle/openhtmltopdf
*   https://pypi.org/project/pdfkit/0.4.1/
*   https://docraptor.com/blog/how-to-get-the-perfect-document-with-docraptor/
*   https://www.paperplane.app/blog/modern-html-to-pdf-conversion-2019/
*   https://pspdfkit.com/blog/2019/html-to-pdf-in-javascript/
*   https://blog.risingstack.com/pdf-from-html-node-js-puppeteer/
*   https://github.com/danfickle/openhtmltopdf
*   http://blog.michaelperrin.fr/2019/11/04/printing-the-web-part-2-html-and-css-for-printing-books/
*   https://stackoverflow.com/questions/43768941/how-to-print-with-page-numbers-in-media-print/43768942#43768942
*   http://rtalbert.org/how-i-wrote-my-book/
*   https://github.com/peerj/paper-now
*   https://yhatt.github.io/marp/
*   https://medium.com/@w3bh4ck/generating-pdf-from-the-client-side-with-jspdf-5ea34391bfa2
*   https://miyakogi.github.io/pyppeteer/reference.html?highlight=pdf#pyppeteer.page.Page.pdf

## TOC
*   Nice layout: https://craftinginterpreters.com/parsing-expressions.html
*   jQuery fancy TOC: https://www.jqueryscript.net/menu/Sidebar-Table-Of-Contents-Generator-with-jQuery-and-Bootstrap-Bootstrap-Toc.html

## UI

1.  Mutliple resizable parts
    * https://split.js.org/#get-started
    * https://jsfiddle.net/aguiguy/y2x7fdnu/
*   https://alloyui.com/examples/
*   https://github.com/executablebooks/jupyter-book
*   https://gist.github.com/seripap/81241195e182b62adc3c87c27258f85f
*   https://plnkr.co/edit/lWk6Yd?preview
*   https://github.com/algolia/docsearch
*   http://www.codingeverything.com/2014/02/BootstrapDocsSideBar.html
*   https://markdownmonster.west-wind.com/
*   https://thomaspark.co/2015/01/pubcss-formatting-academic-publications-in-html-css/

## Python

* https://blog.magrathealabs.com/filesystem-events-monitoring-with-python-9f5329b651c3

## Ace

* https://ace.c9.io/tool/mode_creator.html
* http://jsbin.com/ojijeb/445/edit?html,output
* https://github.com/ajaxorg/ace/wiki/Creating-or-Extending-an-Edit-Mode
* http://dylemma.io/articles/ace-editor-trick/
* https://stackoverflow.com/questions/33232632/how-can-i-remove-the-first-doctype-tooltip-of-the-ace-editor-in-my-html-editor

## Equation Editors

* https://www.jqueryscript.net/text/Simple-WYSIWYG-Math-Editor-With-jQuery-Mathquill-matheditor-js.html
* http://math.chapman.edu/~jipsen/matheditor/
* https://revealjs.com/math/
* https://papeeria.com/landing
* https://github.com/cdr/code-server
* https://cocalc.com/
* https://sixthform.info/katex/examples/demo.js

## LaTeX/Javascript

* https://upmath.me/ and https://github.com/parpalak/upmath.me/blob/master/public_html/src/js/parser.js
* https://github.com/no-context/moo
* https://minilatex.com/
* https://github.com/kisonecat/tikzjax
* https://khan.github.io/KaTeX/function-support.html#macros
* https://latex.js.org/
* https://github.com/digitalheir/bibliography-js
* https://www.npmjs.com/package/latex-parser

## Misc

* [Intersection observer](https://codepen.io/tutsplus/pen/yppgrm)
