let app = {};

app['logMode'] = 'custom'; // 'native', custom-fast', 'custom', 'disabled'
app['logLevel_'] = 
  {
    'all': 1,
    'general': 0,
    'save': 0,
    'equation': 0,
    'timing': 0,
    'hash': 0,
    'renderCache': 0, 
    'displayClick': 0,
    'editorMouse': 0,
    'lineNumbers': 0,
    'finalHTML': 0,
    'updateElement': 0,
    'TOC': 0,
    'markdownTOC': 0,
    'htmlRender': 0,
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

app['beautify']['css'] = {
  indent_size: 2
};
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

app['showLineNumbers'] = {'preview': true, 'final': false};

// Fastest
app['mathRenderer'] = 'katex';

// mathjax-svg is ~3x slower than katex
// mathjax-chtml is ?x slower than katex
//app['mathRenderer'] = 'mathjax-svg'; // or mathjax-chtml

// If renderMathAfter = true, Markdown is converted to HTML
// and then equations in HTML are found and rendered async. 
// Rendering the equation during parsing gives different results
// from  rendering equation after. This occurs because KaTeX and
// MathJax choose symbol sizes in equations based on surrounding
// text.
app['renderMathAfter'] = false;

// Each of these can be cdn-link, local-link, or embed.
// TODO: all options not fully implemented.
app['katexCSS'] = 'cdn-link';     // Only cdn-link implemented
app['documentCSS'] = 'embed';  // embed or external
app['highlightCSS'] = 'cdn-link'; // Not implemented
app['documentBackground'] = 'cdn-link';

// app['documentFavicon'] = "📖", // See https://emojipedia.org/
// app['documentFavicon'] = 'favicon.ico'
// app['documentFavicon'] = 'https://www.google.com/favicon.ico', or 
// app['documentFavicon'] = 'data:image/x-icon;base64,...'
app['documentFavicon'] = "📖";

app['documentBackgroundImage'] = "https://rweigel.github.io/biedit/img/paper.png";

// Allow edits of HTML. (Expect to be less replicable.)
app['htmlEditable'] = false;

// Each edit of HTML triggers an update of Markdown document.
// (Not implemented. Is true by default.)
app['htmlEditUpdatesEditor'] = false;
