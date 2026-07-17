//let app = {};

// 'native', custom-fast', 'custom', 'disabled'
app['logMode'] = 'custom'; 
app['logLevel'] = 
  {
    'all': 0,
    'none': 0,
    'main': 0,
    'events': 0,
    'zoom': 0,
    'server': 0,
    'timing': 0,
    'hash': 0,
    'slug': 0,
    'displayClick': 0,
    'editorChange': 0,
    'editorChangeSelection': 0,
    'updateElement': 0,
    'updateLineNumbers': 0,
    'updateHeaderElement': 0,
    'checkInternalLinks': 0,

    'htmlViewer': 0,
    'latexViewer': 0,

    'processAll': 0,
    'finalHTML': 0,
    'TOC': 0,
    'markdownTOC': 0,

    'renderEquation': 0,
    'renderHeading': 0,
    'renderCache': 0,
    'renderCode': 0,
    'renderList': 0,
    'renderListItem': 0,
    'renderHTML': 0,
    'renderParagraph': 0,
    'renderLatex': 0,

    'mdPreprocess': 0,
    'codeRender': 0,
    'marked': 0
  };

// https://marked.js.org/using_advanced#options
app['marked'] = {
    renderer: new marked.Renderer(),
    highlight: function(code, language) {
      const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
      return hljs.highlight(validLanguage, code).value;
    },
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: true,
    xhtml: false
  };

// See https://beautifier.io/ for all options.
app['beautify'] = {};
app['beautify']['html'] = {
  indent_size: 2,
  preserve_newlines: false,
  space_in_empty_paren: true
};

//app['beautify']['css'] = {indent_size: 2};
app['beautify']['css'] = false;

app['TOC'] = {};

  app['TOC']['markdown'] = {};

    // Prepend TOC in Markdown to editor.
    app['TOC']['markdown']['show'] = false;

    app['TOC']['markdown']['style'] = 'numbered-custom-1'; 
    // Valid options: numbered-native, bullets-native, or numbered-custom-1

    // bullets-native = use native Markdown bullets

    // numbered-native = use native Markdown numbering, e.g., inserted
    // Markdown has the form
    // 1. A heading 1 title
    //    1. A heading 2 title
    //    2. A heading 2 title

    // numbered-custom-1 use <br> and &nbsp; in Markdown to create a TOC
    // of the form
    // 1
    //    1.1
    //    1.2
    // Headings titles are modified to include these numbers. This option is
    // useful for making different Markdown renderers enumerate lists in the
    // same way. For example, GitHub renders the Markdown
    // 1.
    //    1.
    //    2.
    // in HTML as
    // 1.
    //    i.
    //    ii.


  app['TOC']['position'] = 'left'; // not implemented: top, left, right
  app['TOC']['showLevels'] = 1; // 1-6 (0 = no TOC)

  app['TOC']['widthFraction'] = 0.20; // Not implemented.

  app['TOC']['allowResize'] = false; // Not implemented.

  app['TOC']['allowHide'] = false; // Not implemented.

  // Show TOC only if # of top-level sections >= minTopLevel
  // Use -1 to always show TOC.
  app['TOC']['minTopLevel'] = 3; // Not implemented.

  app['TOC']['openLevels'] = -1; // Not implemented.

  // Show link copy button
  app['TOC']['showLinkCopy'] = false; // Not implemented.

  // Update hash on scroll
  app['TOC']['liveUpdateHash'] = false; // Not implemented.

app['codeLineNumbers'] = {'show': true, 'minLines': 5};
app['showLineNumbers'] = {'preview': false, 'final': false};

// Fastest
app['mathRenderer'] = 'katex';

// mathjax-svg is ~3x slower than katex
// mathjax-chtml is ?x slower than katex
//app['mathRenderer'] = 'mathjax-svg';
//app['mathRenderer'] = 'mathjax-chtml';

// If renderMathAfter = true, Markdown is converted to HTML
// and then equations in HTML are found and rendered async. 
// Rendering the equation during parsing gives different results
// from  rendering equation after. This occurs because KaTeX and
// MathJax choose symbol sizes in equations based on surrounding
// text.
app['renderMathAfter'] = false;

// Each of these can be cdn-link, local-link, or embed.
// TODO: all options not fully implemented.
app['katexCSS'] = 'cdn-link';  // Only cdn-link implemented
app['documentCSS'] = 'embed';  // embed or external
app['highlightCSS'] = 'cdn-link'; // Not implemented
app['documentBackground'] = 'cdn-link';

// app['documentFavicon'] = "📖", // See https://emojipedia.org/
// app['documentFavicon'] = 'favicon.ico'
// app['documentFavicon'] = 'https://www.google.com/favicon.ico', or 
// app['documentFavicon'] = 'data:image/x-icon;base64,...'
app['documentFavicon'] = "📖";

app['documentBackgroundImage'] = "https://rweigel.github.io/biedit/biedit/ui/img/paper.png";

// Allow edits of HTML. (Expect to be less replicable.)
app['htmlEditable'] = false;

// Each edit of HTML triggers an update of Markdown document.
// (Not implemented. Is true by default.)
app['htmlEditUpdatesEditor'] = false;

var options = {};

options['macros'] = {
    math: {
            "\\mbox": "\\text",
            "\\ds": "\\displaystyle",
            "\\ihat": "\\hat{\\boldsymbol{\\imath}}",
            "\\jhat": "\\hat{\\boldsymbol{\\jmath}}",
            "\\khat": "\\hat{\\boldsymbol{k}}",
            "\\xhat": "\\hat{\\mathbf{x}}",
            "\\yhat": "\\hat{\\mathbf{y}}",
            "\\zhat": "\\hat{\\mathbf{z}}",
            "\\rhat": "\\hat{\\mathbf{r}}",
            "\\bfvec": "\\vec{\\mathbf{#1}}",
            "\\bfcdot": "\\boldsymbol{\\cdot}"
        }
}
// https://katex.org/docs/options.html
if (app['mathRenderer'].startsWith('katex')) {
  options['katex'] = {
      macros: options['macros']['math'],
      delimiters: [
          {left: "$$", right: "$$", display: true},
          {left: "\\[", right: "\\]", display: true},
          {left: "$", right: "$", display: false},
          {left: "\$", right: "\$", display: false}
      ]
  };
}

if (app['mathRenderer'].startsWith('mathjax')) {
  let macros = {}
  for (k in options['macros']['math']) {
    macros[k.slice(1)] = options['macros']['math'][k];
  }

  MathJax = {
    options: {
      renderActions: {
        addMenu: []
      }
    },
    loader: {load: ['[tex]/boldsymbol']},
    tex: {
      autoload: {boldsymbol: ['boldsymbol']},
      inlineMath: [['$', '$']],
      macros: {"ihat": "\\hat{\\boldsymbol{\\imath}}"}
    },
    svg: {
      fontCache: 'global'
    }
  };
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/'
             + 'tex-' + app['mathRenderer'].split("-")[1] + ".js";
  script.async = false;
  script.defer = false;
  document.body.appendChild(script);
}

// https://ace.c9.io/build/kitchen-sink.html
options['ace'] = {};
options['ace']['options'] = {
    wrap: true, 
    indentedSoftWrap: false, 
    behavioursEnabled: true,
    enableSnippets: true,
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: false,
    showInvisibles: true,
    keyboardHandler: "ace/keyboard/emacs",
    theme: "ace/theme/terminal",
    cursorStyle: "slim",
    showGutter: true
};

// https://stackoverflow.com/
// questions/26089258/ace-editor-manually-adding-snippets
options['ace']['snippets'] = 
  [
    {
      content: "frac{${1:1}}{${2:}}",
      name: "\\frac{}{}",
      tabTrigger: "\frac"
    },
    {
      content: "$$${1:}$$",
      name: "$$",
      tabTrigger: "$$"
    },
    {
      content: "mathbf{${1:}}",
      name: "\\mathbf{}",
      tabTrigger: "\mathbf"
    }
  ];

// https://cloud9-sdk.readme.io/docs/customizing-code-completers
options['ace']['customCompleters'] = [];

// Turndown
if (typeof(TurndownService) !== 'undefined') {
  var node;
  var heading = {
    filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],

    replacement: function (content, node, options) {

      content = $(node).find('a').attr('raw');
      var hLevel = Number(node.nodeName.charAt(1))

      if (options.headingStyle === 'setext' && hLevel < 3) {
        var underline = repeat((hLevel === 1 ? '=' : '-'), content.length)
        return (
          '\n\n' + content + '\n' + underline + '\n\n'
        )
      } else {
        return '\n\n' + content + '\n\n'
      }
    }
  }
  var turndownService = new TurndownService({ headingStyle: 'atx' })
  turndownService.addRule('heading', heading);
}
